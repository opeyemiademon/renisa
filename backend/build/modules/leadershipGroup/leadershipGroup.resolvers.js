import LeadershipGroup from './leadershipGroup.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
import { findLeadershipGroupBySlugParam } from '../../utils/leadershipGroupSlug.js';
export const seedLeadershipGroups = async () => {
    const groups = [
        {
            name: 'Board of Trustees',
            slug: 'board-of-trustees',
            legacySlugs: ['bot'],
            description: 'Board of Trustees of RENISA',
            order: 1,
        },
        { name: 'State Executives', slug: 'state-executives', description: 'State chapter executives', order: 2 },
        { name: 'Directorate', slug: 'directorate', description: 'RENISA Directorate', order: 3 },
    ];
    for (const g of groups) {
        const legacy = g.legacySlugs || [];
        const { legacySlugs: _, ...doc } = g;
        await LeadershipGroup.findOneAndUpdate({ $or: [{ slug: doc.slug }, ...legacy.map((s) => ({ slug: s }))] }, { $set: { ...doc, isActive: true } }, { upsert: true, new: true });
    }
};
const leadershipGroupResolvers = {
    Query: {
        getAllLeadershipGroups: async () => {
            return await LeadershipGroup.find({ isActive: true }).sort({ order: 1 });
        },
        getLeadershipGroup: async (_, { id }) => {
            return await LeadershipGroup.findById(id);
        },
        getLeadershipGroupBySlug: async (_, { slug }) => {
            return await findLeadershipGroupBySlugParam(slug);
        },
    },
    Mutation: {
        updateLeadershipGroup: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            const group = await LeadershipGroup.findByIdAndUpdate(id, data, { new: true });
            if (!group)
                throw new Error('Leadership group not found');
            return { success: true, message: 'Group updated', data: group };
        },
    },
};
export default leadershipGroupResolvers;
//# sourceMappingURL=leadershipGroup.resolvers.js.map