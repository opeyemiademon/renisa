import Communication from './communication.model.js';
import Member from '../member/member.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';
import { sendBulkEmail } from '../../utils/emailService.js';
import { sendBulkSMS } from '../../utils/smsService.js';

const communicationResolvers = {
  Query: {
    getAllCommunications: async (_: any, { page = 1, limit = 20 }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const skip = (page - 1) * limit;
      const [communications, total] = await Promise.all([
        Communication.find()
          .populate('sentBy', 'name email')
          .skip(skip).limit(limit).sort({ createdAt: -1 }),
        Communication.countDocuments(),
      ]);
      return { communications, total, page, limit };
    },

    getCommunication: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      return await Communication.findById(id).populate('sentBy', 'name email');
    },
  },

  Mutation: {
    sendCommunication: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireAdminAuth(context);
      const { subject, message, type, recipients, specificMembers } = data;

      const comm = await Communication.create({
        subject,
        message,
        type,
        recipients,
        specificMembers: specificMembers || [],
        status: 'pending',
        sentBy: context.admin!.id,
      });

      // Gather members
      let members: any[] = [];
      if (recipients === 'all') {
        members = await Member.find({}, 'email phone').lean();
      } else if (recipients === 'active') {
        members = await Member.find({ membershipStatus: 'active' }, 'email phone').lean();
      } else if (recipients === 'specific' && specificMembers?.length) {
        members = await Member.find({ _id: { $in: specificMembers } }, 'email phone').lean();
      }

      let sentCount = 0;
      let failedCount = 0;

      if (type === 'email' || type === 'both') {
        const emails = members.map((m: any) => m.email).filter(Boolean);
        try {
          await sendBulkEmail(emails, subject, `<div style="font-family:Arial,sans-serif;"><p>${message}</p></div>`);
          sentCount += emails.length;
        } catch {
          failedCount += emails.length;
        }
      }

      if (type === 'sms' || type === 'both') {
        const phones = members.map((m: any) => m.phone).filter(Boolean);
        try {
          await sendBulkSMS(phones, message);
          sentCount += phones.length;
        } catch {
          failedCount += phones.length;
        }
      }

      const updated = await Communication.findByIdAndUpdate(
        comm._id,
        { status: 'sent', sentCount, failedCount, sentAt: new Date() },
        { new: true }
      );

      return { success: true, message: `Communication sent to ${sentCount} recipients`, data: updated };
    },
  },
};

export default communicationResolvers;
