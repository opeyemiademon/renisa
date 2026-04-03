import HeroSlide from './heroSlide.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const heroSlideResolvers = {
  Query: {
    getHeroSlides: async (_: any, { activeOnly }: { activeOnly?: boolean }) => {
      const filter: any = {};
      if (activeOnly) filter.isActive = true;
      return await HeroSlide.find(filter).sort({ order: 1, createdAt: 1 });
    },

    getHeroSlide: async (_: any, { id }: { id: string }) => {
      return await HeroSlide.findById(id);
    },
  },

  Mutation: {
    createHeroSlide: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireAdminAuth(context);
      const count = await HeroSlide.countDocuments();
      const slide = await HeroSlide.create({
        ...data,
        order: data.order ?? count,
        createdBy: context.admin!.id,
      });
      return { success: true, message: 'Hero slide created', data: slide };
    },

    updateHeroSlide: async (_: any, { id, data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const slide = await HeroSlide.findByIdAndUpdate(id, data, { new: true });
      if (!slide) throw new Error('Hero slide not found');
      return { success: true, message: 'Hero slide updated', data: slide };
    },

    deleteHeroSlide: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const slide = await HeroSlide.findByIdAndDelete(id);
      if (!slide) throw new Error('Hero slide not found');
      return { success: true, message: 'Hero slide deleted' };
    },

    reorderHeroSlides: async (_: any, { ids }: { ids: string[] }, context: AuthContext) => {
      requireAdminAuth(context);
      await Promise.all(
        ids.map((id, index) => HeroSlide.findByIdAndUpdate(id, { order: index }))
      );
      return { success: true, message: 'Slides reordered' };
    },
  },
};

export default heroSlideResolvers;
