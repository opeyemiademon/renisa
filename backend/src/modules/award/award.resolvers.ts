import Award from './award.model.js';
import AwardVote from '../awardVote/awardVote.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const populate = (q: any) =>
  q
    .populate('categoryId', 'name icon')
    .populate('memberId', 'firstName lastName profilePicture memberNumber');

const awardResolvers = {
  Award: {
    totalVotes: async (parent: any) => {
      try {
        return await AwardVote.countDocuments({ awardId: parent._id });
      } catch {
        return 0;
      }
    },
  },

  Query: {
    getAllAwards: async (_: any, { year, status, categoryId, votingEnabled }: any) => {
      const filter: any = {};
      if (year) filter.year = year;
      if (status) filter.status = status;
      if (categoryId) filter.categoryId = categoryId;
      if (votingEnabled !== undefined) filter.votingEnabled = votingEnabled;
      return Award.find(filter).sort({ year: -1, createdAt: -1 }).populate('categoryId', 'name description').populate('memberId', 'firstName lastName profilePicture memberNumber');
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
