import LeadershipGroup from './leadershipGroup.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

export const seedLeadershipGroups = async (): Promise<void> => {
  const groups = [
    { name: 'Board of Trustees', slug: 'bot', description: 'Board of Trustees of RENISA', order: 1 },
    { name: 'National Executive Council', slug: 'nec', description: 'National Executive Council of RENISA', order: 2 },
    { name: 'State Executives', slug: 'state-executives', description: 'State chapter executives', order: 3 },
    { name: 'Directorate', slug: 'directorate', description: 'RENISA Directorate', order: 4 },
  ];
  for (const group of groups) {
    await LeadershipGroup.findOneAndUpdate({ slug: group.slug }, group, { upsert: true, new: true });
  }
  console.log('Leadership groups seeded');
};

const leadershipGroupResolvers = {
  Query: {
    getAllLeadershipGroups: async () => {
      return await LeadershipGroup.find({ isActive: true }).sort({ order: 1 });
    },
    getLeadershipGroup: async (_: any, { id }: { id: string }) => {
      return await LeadershipGroup.findById(id);
    },
    getLeadershipGroupBySlug: async (_: any, { slug }: { slug: string }) => {
      return await LeadershipGroup.findOne({ slug });
    },
  },

  Mutation: {
    updateLeadershipGroup: async (_: any, { id, data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const group = await LeadershipGroup.findByIdAndUpdate(id, data, { new: true });
      if (!group) throw new Error('Leadership group not found');
      return { success: true, message: 'Group updated', data: group };
    },
  },
};

export default leadershipGroupResolvers;
