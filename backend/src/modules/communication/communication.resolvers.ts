import Communication from './communication.model.js';
import Member from '../member/member.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';
import { sendBulkEmail, bulkEmailTemplate } from '../../utils/emailService.js';

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
      const { subject, message, recipients, filterState, specificMembers } = data;

      // Build member query
      let memberQuery: Record<string, any> = {};
      if (recipients === 'active') {
        memberQuery.membershipStatus = 'active';
      } else if (recipients === 'state') {
        if (!filterState) throw new Error('State is required when recipients is "state"');
        memberQuery.state = filterState;
      } else if (recipients === 'specific') {
        if (!specificMembers?.length) throw new Error('No specific members selected');
        memberQuery._id = { $in: specificMembers };
      }

      const members = await Member.find(memberQuery, 'email firstName lastName').lean() as any[];

      const comm = await Communication.create({
        subject,
        message,
        type: 'email',
        recipients,
        filterState: filterState || undefined,
        specificMembers: recipients === 'specific' ? specificMembers : [],
        status: 'pending',
        sentBy: context.admin!.id,
      });

      const emails = members.map((m: any) => m.email).filter(Boolean);
      let sentCount = 0;
      let failedCount = 0;

      try {
        await sendBulkEmail(emails, subject, bulkEmailTemplate(subject, message));
        sentCount = emails.length;
      } catch {
        failedCount = emails.length;
      }

      const updated = await Communication.findByIdAndUpdate(
        comm._id,
        { status: sentCount > 0 ? 'sent' : 'failed', sentCount, failedCount, sentAt: new Date() },
        { new: true }
      );

      return { success: true, message: `Email sent to ${sentCount} recipient(s)`, data: updated };
    },
  },
};

export default communicationResolvers;
