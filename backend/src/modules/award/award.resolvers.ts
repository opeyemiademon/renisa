import Award from './award.model.js';
import AwardVote from '../awardVote/awardVote.model.js';
import mongoose from 'mongoose';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const populate = (q: any) =>
  q
    .populate('categoryId', 'name icon pollActive votingStartDate votingEndDate')
    .populate('memberId', 'firstName lastName profilePicture memberNumber');

const awardResolvers = {
  Award: {
    // Derive from linked member
    recipientName: (parent: any) => {
      const m = parent.memberId;
      if (m && typeof m === 'object') return `${m.firstName} ${m.lastName}`;
      return '';
    },
    recipientPhoto: (parent: any) => {
      const m = parent.memberId;
      if (m && typeof m === 'object') return m.profilePicture || null;
      return parent.image || null;
    },
    // Derive title from category
    title: (parent: any) => {
      const c = parent.categoryId;
      if (c && typeof c === 'object') return c.name;
      return '';
    },
    category: (parent: any) => parent.categoryId,
    member: (parent: any) => parent.memberId,
    totalVotes: async (parent: any) => {
      try {
        return await AwardVote.countDocuments({ awardId: parent._id });
      } catch {
        return 0;
      }
    },
  },

  Query: {
    getAllAwards: async (_: any, { year, status, categoryId, votingEnabled, memberName, limit }: any) => {
      const filter: any = {};
      if (year) filter.year = year;
      if (status) filter.status = status;
      if (categoryId) filter.categoryId = categoryId;
      if (votingEnabled !== undefined) filter.votingEnabled = votingEnabled;

      // Filter by member name: find matching member IDs first
      if (memberName && memberName.trim()) {
        const Member = mongoose.model('Member');
        const nameRegex = new RegExp(memberName.trim(), 'i');
        const members = await Member.find({
          $or: [
            { firstName: nameRegex },
            { lastName: nameRegex },
          ], 
        }).select('_id');
        filter.memberId = { $in: members.map((m: any) => m._id) };
      }

      let q = populate(Award.find(filter)).sort({ year: -1, createdAt: -1 });
      if (typeof limit === 'number' && limit > 0) {
        q = q.limit(Math.min(limit, 200));
      }
      return q;
    },

    getAward: async (_: any, { id }: { id: string }) => {
      return populate(Award.findById(id));
    },
  },

  Mutation: {
    createAward: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireAdminAuth(context);
      const award = await Award.create({
        memberId: data.memberId,
        categoryId: data.categoryId,
        year: data.year || new Date().getFullYear(),
        votingEndDate: data.votingEndDate ? new Date(data.votingEndDate) : undefined,
        status: data.status || 'nominated',
        nominatedBy: context.admin!.id,
      });
      const populated = await populate(Award.findById(award._id));
      return { success: true, message: 'Award created', data: populated };
    },

    updateAward: async (_: any, { id, data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const update: any = {};
      if (data.memberId !== undefined) update.memberId = data.memberId;
      if (data.categoryId !== undefined) update.categoryId = data.categoryId;
      if (data.year !== undefined) update.year = data.year;
      if (data.votingEndDate !== undefined) update.votingEndDate = data.votingEndDate ? new Date(data.votingEndDate) : null;
      if (data.status !== undefined) update.status = data.status;
      const award = await populate(Award.findByIdAndUpdate(id, update, { new: true }));
      if (!award) throw new Error('Award not found');
      return { success: true, message: 'Award updated', data: award };
    },

    deleteAward: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const award = await Award.findByIdAndDelete(id);
      if (!award) throw new Error('Award not found');
      return { success: true, message: 'Award deleted' };
    },

    enableAwardVoting: async (_: any, { id, votingStartDate, votingEndDate }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const updateData: any = { votingEnabled: true, status: 'voting' };
      if (votingStartDate) updateData.votingStartDate = new Date(votingStartDate);
      if (votingEndDate) updateData.votingEndDate = new Date(votingEndDate);
      const award = await populate(Award.findByIdAndUpdate(id, updateData, { new: true }));
      if (!award) throw new Error('Award not found');
      return { success: true, message: 'Voting enabled for award', data: award };
    },
  },
};

export default awardResolvers;
