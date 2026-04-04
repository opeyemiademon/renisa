import AwardCategory from './awardCategory.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const awardCategoryResolvers = {
  Query: {
    getAllAwardCategories: async () => {
      return await AwardCategory.find().sort({ name: 1 });
    },
    getAwardCategory: async (_: any, { id }: { id: string }) => {
      return await AwardCategory.findById(id);
    },
  },

  Mutation: {
    createAwardCategory: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireAdminAuth(context);
      const category = await AwardCategory.create({ ...data, createdBy: context.admin!.id });
      return { success: true, message: 'Award category created', data: category };
    },

    updateAwardCategory: async (_: any, { id, data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const category = await AwardCategory.findByIdAndUpdate(id, data, { new: true });
      if (!category) throw new Error('Award category not found');
      return { success: true, message: 'Award category updated', data: category };
    },

    deleteAwardCategory: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const category = await AwardCategory.findByIdAndDelete(id);
      if (!category) throw new Error('Award category not found');
      return { success: true, message: 'Award category deleted' };
    },

    startCategoryPoll: async (_: any, { id, votingStartDate, votingEndDate }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const update: any = { pollActive: true };
      if (votingStartDate) update.votingStartDate = new Date(votingStartDate);
      if (votingEndDate) update.votingEndDate = new Date(votingEndDate);
      const category = await AwardCategory.findByIdAndUpdate(id, update, { new: true });
      if (!category) throw new Error('Award category not found');
      return { success: true, message: 'Poll started for category', data: category };
    },

    endCategoryPoll: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const category = await AwardCategory.findByIdAndUpdate(
        id,
        { pollActive: false },
        { new: true }
      );
      if (!category) throw new Error('Award category not found');
      return { success: true, message: 'Poll ended for category', data: category };
    },
  },
};

export default awardCategoryResolvers;
