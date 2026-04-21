import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import Member from './member.model.js';
import MemberCode from '../memberCode/memberCode.model.js';
import Event from '../event/event.model.js';
import Gallery from '../gallery/gallery.model.js';
import Award from '../award/award.model.js';
import { TOKEN_SECRET, TOKEN_EXPIRY, STATIC_BASE_URL, MEMBER_PORTAL_URL } from '../../utils/constants.js';
import { requireMemberAuth, requireAdminAuth, AuthContext } from '../../middleware/auth.js';
import { sendEmail, welcomeTemplate, passwordResetTemplate } from '../../utils/emailService.js';
import { processBase64Upload, ALLOWED_IMAGE_TYPES } from '../../utils/fileUpload.js';
import { createNotification } from '../../utils/createNotification.js';
import { createMemberNotification } from '../../utils/createMemberNotification.js';

const generateMemberNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await Member.countDocuments();
  const seq = String(count + 1).padStart(4, '0');
  return `RENISA-${year}-${seq}`;
};

const memberResolvers = {
  Member: {
    status: (parent: any) => parent.membershipStatus,
  },

  Query: {
    getAllMembers: async (_: any, { search, status, memberNumber, memberCode, email, gender, state, dateFrom, dateTo, name }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const filter: any = {};
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { memberNumber: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }
      if (name) {
        const nameParts = name.trim().split(/\s+/);
        if (nameParts.length >= 2) {
          filter.$and = [
            { $or: [{ firstName: { $regex: nameParts[0], $options: 'i' } }, { lastName: { $regex: nameParts[0], $options: 'i' } }] },
            { $or: [{ firstName: { $regex: nameParts[1], $options: 'i' } }, { lastName: { $regex: nameParts[1], $options: 'i' } }] },
          ];
        } else {
          filter.$or = [
            { firstName: { $regex: name, $options: 'i' } },
            { lastName: { $regex: name, $options: 'i' } },
            { middleName: { $regex: name, $options: 'i' } },
          ];
        }
      }
      if (status) filter.membershipStatus = status;
      if (memberNumber) filter.memberNumber = { $regex: memberNumber, $options: 'i' };
      if (memberCode) filter.memberCode = { $regex: memberCode, $options: 'i' };
      if (email) filter.email = { $regex: email, $options: 'i' };
      if (gender) filter.gender = gender;
      if (state) filter.state = state;
      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
        if (dateTo) {
          const end = new Date(dateTo);
          end.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = end;
        }
      }
      return await Member.find(filter).sort({ createdAt: -1 }).select('-password');
    },

    getMember: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      return await Member.findById(id).select('-password');
    },

    getMemberByNumber: async (_: any, { memberNumber }: { memberNumber: string }, context: AuthContext) => {
      requireAdminAuth(context);
      return await Member.findOne({ memberNumber }).select('-password');
    },

    checkMemberCode: async (_: any, { code }: { code: string }) => {
      const memberCode = await MemberCode.findOne({ code });
      if (!memberCode) return false;
      if (memberCode.isUsed) return false;
      if (memberCode.expiresAt && new Date() > memberCode.expiresAt) return false;
      return {valid:true};
    },

    getAlumni: async (_: any, __: any) => {
      const filter = { isAlumni: true };
      return await Member.find(filter).sort({ alumniYear: -1 }).select('-password');
    },

    getNewMembers: async (_: any, { limit = 10 }: any) => {
      return await Member.find().sort({ createdAt: -1 }).limit(limit).select('-password');
    },

    getPublicMembers: async (_: any, __: any) => {
      return await Member.find({ membershipStatus: { $ne: 'inactive' } })
        .sort({ createdAt: -1 })
        .select('-password');
    },

    getPublicSiteStats: async () => {
      const [activeMembers, alumniMembers, publishedEvents, galleryPhotos, awardedHonors] =
        await Promise.all([
          Member.countDocuments({ membershipStatus: 'active' }),
          Member.countDocuments({ isAlumni: true }),
          Event.countDocuments({ status: 'published' }),
          Gallery.countDocuments({}),
          Award.countDocuments({ status: 'awarded' }),
        ]);
      return {
        activeMembers,
        alumniMembers,
        publishedEvents,
        galleryPhotos,
        awardedHonors,
      };
    },

    getPublicMemberProfile: async (_: any, { id }: { id: string }) => {
      const m = await Member.findById(id)
        .select(
          'firstName lastName middleName memberNumber sport state stateOfOrigin city profilePicture isAlumni bio gender createdAt membershipStatus',
        )
        .lean();
      if (!m || (m as any).membershipStatus === 'suspended') return null;
      const doc = m as any;
      return {
        id: doc._id.toString(),
        firstName: doc.firstName,
        lastName: doc.lastName,
        middleName: doc.middleName || null,
        memberNumber: doc.memberNumber || null,
        sport: doc.sport || null,
        state: doc.state || null,
        stateOfOrigin: doc.stateOfOrigin || null,
        city: doc.city || null,
        profilePicture: doc.profilePicture || null,
        isAlumni: !!doc.isAlumni,
        bio: doc.bio || null,
        gender: doc.gender || null,
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
      };
    },

    me: async (_: any, __: any, context: AuthContext) => {
      requireMemberAuth(context);
      return await Member.findById(context.member!.id).select('-password');
    },

 
  },

  Mutation: {
       loginMember: async (_: any, { data }: { data: any }) => {
      const { email, password } = data;
      const member = await Member.findOne({ email });
      if (!member) throw new Error('Invalid email or password');
      if (member.membershipStatus === 'suspended') throw new Error('Your account has been suspended');
      const valid = await bcrypt.compare(password, member.password);
      if (!valid) throw new Error('Invalid email or password');
      await Member.findByIdAndUpdate(member._id, { lastLogin: new Date() });
      const signOptions: SignOptions = { expiresIn: TOKEN_EXPIRY };
      const token = jwt.sign(
        { id: member._id, email: member.email, role: member.role, type: 'member' },
        TOKEN_SECRET,
        signOptions
      );
      return { token, member };
    },
    registerMember: async (_: any, { data }: { data: any }) => {
      const { memberCode: code, email, password, photoBase64, ...rest } = data;

      const codeDoc = await MemberCode.findOne({ code });
      if (!codeDoc) throw new Error('Invalid member code');
      if (codeDoc.isUsed) throw new Error('Member code has already been used');
      if (codeDoc.expiresAt && new Date() > codeDoc.expiresAt) throw new Error('Member code has expired');

      const existing = await Member.findOne({ email });
      if (existing) throw new Error('An account with this email already exists');

      const hashedPassword = await bcrypt.hash(password, 10);
      const memberNumber = await generateMemberNumber();

      let profilePicture = rest.profilePicture;
      if (photoBase64) {
        try {
          const fileName = await processBase64Upload(
            photoBase64,
            'members',
            ALLOWED_IMAGE_TYPES,
            'member'
          );
          profilePicture = `${STATIC_BASE_URL}/uploads/members/${fileName}`;
        } catch (uploadError: any) {
          console.error('Photo upload error:', uploadError.message);
        }
      }

      const member = await Member.create({
        ...rest,
        email,
        password: hashedPassword,
        memberNumber,
        memberCode: code,
        membershipYear: new Date().getFullYear(),
        profilePicture,
      });

      await MemberCode.findByIdAndUpdate(codeDoc._id, {
        isUsed: true,
        usedBy: member._id,
        usedAt: new Date(),
      });

      sendEmail(email, 'Welcome to RENISA', welcomeTemplate(`${rest.firstName} ${rest.lastName}`, memberNumber)).catch(console.error);

      const signOptions: SignOptions = { expiresIn: TOKEN_EXPIRY };
      const token = jwt.sign(
        { id: member._id, email: member.email, role: member.role, type: 'member' },
        TOKEN_SECRET,
        signOptions
      );
      return { token, member };
    },

    requestMemberPasswordReset: async (_: any, { email }: { email: string }) => {
      const generic = {
        success: true,
        message: 'If an account exists for that email, you will receive reset instructions shortly.',
      };
      const normalized = email.trim().toLowerCase();
      if (!normalized) return generic;

      const member = await Member.findOne({ email: normalized }).select(
        '+passwordResetTokenHash +passwordResetExpires firstName lastName email membershipStatus',
      );
      if (!member || ['suspended', 'deceased'].includes(member.membershipStatus)) {
        return generic;
      }

      const rawToken = crypto.randomBytes(32).toString('hex');
      const hash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000);
      await Member.findByIdAndUpdate(member._id, {
        passwordResetTokenHash: hash,
        passwordResetExpires: expires,
      });

      const base = MEMBER_PORTAL_URL.replace(/\/$/, '');
      const resetUrl = `${base}/reset-password?token=${encodeURIComponent(rawToken)}`;
      const displayName = `${member.firstName} ${member.lastName}`.trim() || 'Member';
      const sent = await sendEmail(
        member.email,
        'Reset your RENISA password',
        passwordResetTemplate(displayName, resetUrl),
      );
      if (!sent) console.error('Password reset email failed for', member.email);
      return generic;
    },

    resetMemberPassword: async (_: any, { data }: { data: { token: string; newPassword: string } }) => {
      const { token, newPassword } = data;
      if (!token || typeof newPassword !== 'string' || newPassword.length < 8) {
        return {
          success: false,
          message: 'Invalid or expired reset link, or password is too short (minimum 8 characters).',
        };
      }
      const hash = crypto.createHash('sha256').update(token).digest('hex');
      const member = await Member.findOne({
        passwordResetTokenHash: hash,
        passwordResetExpires: { $gt: new Date() },
      }).select('+passwordResetTokenHash +passwordResetExpires +password membershipStatus');

      if (!member) {
        return {
          success: false,
          message: 'This reset link is invalid or has expired. Please request a new one.',
        };
      }
      if (member.membershipStatus === 'suspended' || member.membershipStatus === 'deceased') {
        return { success: false, message: 'This account cannot reset its password.' };
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await Member.findByIdAndUpdate(member._id, {
        password: hashed,
        passwordResetTokenHash: null,
        passwordResetExpires: null,
      });
      return { success: true, message: 'Your password has been reset. You can sign in now.' };
    },

    adminRegisterMember: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireAdminAuth(context);
      const { email, password, memberCode, photoBase64, ...rest } = data;
      const existing = await Member.findOne({ email });
      if (existing) throw new Error('An account with this email already exists');


      const codeDoc = await MemberCode.findOne({ code:memberCode });
      if (!codeDoc) throw new Error('Invalid member code');
      if (codeDoc.isUsed) throw new Error('Member code has already been used');
      if (codeDoc.expiresAt && new Date() > codeDoc.expiresAt) throw new Error('Member code has expired');


      const hashedPassword = await bcrypt.hash(password, 10);
      const memberNumber = await generateMemberNumber();


        let profilePicture = rest.profilePicture;
      if (photoBase64) {
        try {
          const fileName = await processBase64Upload(
            photoBase64,
            'members',
            ALLOWED_IMAGE_TYPES,
            'member'
          );
          profilePicture = `${STATIC_BASE_URL}/uploads/members/${fileName}`;
        } catch (uploadError: any) {
          console.error('Photo upload error:', uploadError.message);
        }
      }

      const member = await Member.create({
        ...rest,
        email,
        password: hashedPassword,
        memberNumber,
          profilePicture,
        membershipYear: rest.membershipYear || new Date().getFullYear(),
        createdBy:context.admin!.id,
      });


        await MemberCode.findByIdAndUpdate(codeDoc._id, {
        isUsed: true,
        usedBy: member._id,
        usedAt: new Date(),
      });

      sendEmail(email, 'Welcome to RENISA', welcomeTemplate(`${rest.firstName} ${rest.lastName}`, memberNumber)).catch(console.error);
      createNotification('new_member', 'New Member Registered', `${rest.firstName} ${rest.lastName} (${memberNumber}) has joined as a new member.`, member._id.toString(), 'Member');
      createMemberNotification(member._id.toString(), 'welcome', 'Welcome to RENISA!', `Your membership has been approved. Your member number is ${memberNumber}.`, '/member/dashboard');

      return { success: true, message: 'Member registered successfully', data: member };
    },

    updateMember: async (_: any, { id, data }: { id: string; data: any }, context: AuthContext) => {
      if (!context.isAuthenticated) throw new Error('Authentication required');
      const { photoBase64, ...rest } = data;
      const updateData: any = { ...rest };
      if (photoBase64) {
        try {
          const fileName = await processBase64Upload(photoBase64, 'members', ALLOWED_IMAGE_TYPES, 'member');
          updateData.profilePicture = `${STATIC_BASE_URL}/uploads/members/${fileName}`;
        } catch (uploadError: any) {
          console.error('Photo upload error:', uploadError.message);
        }
      }
      const member = await Member.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
      if (!member) throw new Error('Member not found');
      return { success: true, message: 'Member updated successfully', data: member };
    },

    updateMemberStatus: async (_: any, { id, status }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const member = await Member.findByIdAndUpdate(id, { membershipStatus: status }, { new: true }).select('-password');
      if (!member) throw new Error('Member not found');
      return { success: true, message: 'Member status updated', data: member };
    },

    deleteMember: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const member = await Member.findByIdAndDelete(id);
      if (!member) throw new Error('Member not found');
      return { success: true, message: 'Member deleted successfully' };
    },

    markMemberAsAlumni: async (_: any, { id, alumniYear }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const year = alumniYear || new Date().getFullYear();
      const member = await Member.findByIdAndUpdate(id, { isAlumni: true, alumniYear: year }, { new: true }).select('-password');
      if (!member) throw new Error('Member not found');
      return { success: true, message: 'Member marked as alumni', data: member };
    },

    changePassword: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireMemberAuth(context);
      const { currentPassword, newPassword } = data;
      const member = await Member.findById(context.member!.id);
      if (!member) throw new Error('Member not found');
      const valid = await bcrypt.compare(currentPassword, member.password);
      if (!valid) throw new Error('Current password is incorrect');
      const hashed = await bcrypt.hash(newPassword, 10);
      await Member.findByIdAndUpdate(context.member!.id, {
        password: hashed,
        passwordResetTokenHash: null,
        passwordResetExpires: null,
      });
      return { success: true, message: 'Password changed successfully' };
    },

    loginAsMember: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const member = await Member.findById(id).select('-password');
      if (!member) throw new Error('Member not found');
      const signOptions: SignOptions = { expiresIn: TOKEN_EXPIRY };
      const token = jwt.sign(
        { id: member._id, email: member.email, role: member.role, type: 'member' },
        TOKEN_SECRET,
        signOptions
      );
      return { token, member };
    },
  },
};

export default memberResolvers;
