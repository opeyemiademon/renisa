import Sport from './sport.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const sportResolvers = {
  Query: {
    getSports: async (_: any, { activeOnly }: { activeOnly?: boolean }) => {
      const filter: any = {};
      if (activeOnly) filter.isActive = true;
      return await Sport.find(filter).sort({ order: 1, name: 1 });
    },
  },

  Mutation: {
    createSport: async (_: any, { name }: { name: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const existing = await Sport.findOne({ name: name.trim() });
      if (existing) throw new Error(`Sport "${name}" already exists`);
      const count = await Sport.countDocuments();
      const sport = await Sport.create({
        name: name.trim(),
        order: count,
        createdBy: context.admin!.id,
      });
      return { success: true, message: 'Sport created ', data: sport };
    },

    updateSport: async (_: any, { id, name, isActive }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const update: any = {};
      if (name !== undefined) update.name = name.trim();
      if (isActive !== undefined) update.isActive = isActive;
      const sport = await Sport.findByIdAndUpdate(id, update, { new: true });
      if (!sport) throw new Error('Sport not found');
      return { success: true, message: 'Sport updated', data: sport };
    },

    deleteSport: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const sport = await Sport.findByIdAndDelete(id);
      if (!sport) throw new Error('Sport not found');
      return { success: true, message: 'Sport deleted' };
    },

    reorderSports: async (_: any, { ids }: { ids: string[] }, context: AuthContext) => {
      requireAdminAuth(context);
      await Promise.all(ids.map((id, index) => Sport.findByIdAndUpdate(id, { order: index })));
      return { success: true, message: 'Sports reordered' };
    },
  },
};

export default sportResolvers;
