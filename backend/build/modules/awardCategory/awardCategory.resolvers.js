import AwardCategory from './awardCategory.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const awardCategoryResolvers = {
    Query: {
        getAllAwardCategories: async () => {
            return await AwardCategory.find().sort({ name: 1 });
        },
        getAwardCategory: async (_, { id }) => {
            return await AwardCategory.findById(id);
        },
    },
    Mutation: {
        createAwardCategory: async (_, { data }, context) => {
            requireAdminAuth(context);
            const category = await AwardCategory.create({ ...data, createdBy: context.admin.id });
            return { success: true, message: 'Award category created', data: category };
        },
        updateAwardCategory: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            const category = await AwardCategory.findByIdAndUpdate(id, data, { new: true });
            if (!category)
                throw new Error('Award category not found');
            return { success: true, message: 'Award category updated', data: category };
        },
        deleteAwardCategory: async (_, { id }, context) => {
            requireAdminAuth(context);
            const category = await AwardCategory.findByIdAndDelete(id);
            if (!category)
                throw new Error('Award category not found');
            return { success: true, message: 'Award category deleted' };
        },
        startCategoryPoll: async (_, { id, votingStartDate, votingEndDate }, context) => {
            requireAdminAuth(context);
            const update = { pollActive: true };
            if (votingStartDate)
                update.votingStartDate = new Date(votingStartDate);
            if (votingEndDate)
                update.votingEndDate = new Date(votingEndDate);
            const category = await AwardCategory.findByIdAndUpdate(id, update, { new: true });
            if (!category)
                throw new Error('Award category not found');
            return { success: true, message: 'Poll started for category', data: category };
        },
        endCategoryPoll: async (_, { id }, context) => {
            requireAdminAuth(context);
            const category = await AwardCategory.findByIdAndUpdate(id, { pollActive: false }, { new: true });
            if (!category)
                throw new Error('Award category not found');
            return { success: true, message: 'Poll ended for category', data: category };
        },
        toggleCategoryPublicVisibility: async (_, { id }, context) => {
            requireAdminAuth(context);
            const existing = await AwardCategory.findById(id);
            if (!existing)
                throw new Error('Award category not found');
            const category = await AwardCategory.findByIdAndUpdate(id, { isPubliclyVisible: !existing.isPubliclyVisible }, { new: true });
            const action = category.isPubliclyVisible ? 'visible to public' : 'hidden from public';
            return { success: true, message: `Category ${action}`, data: category };
        },
    },
};
export default awardCategoryResolvers;
//# sourceMappingURL=awardCategory.resolvers.js.map