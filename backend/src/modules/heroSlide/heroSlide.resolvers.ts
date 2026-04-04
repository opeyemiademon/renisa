import HeroSlide from './heroSlide.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';
import { processBase64Upload, ALLOWED_IMAGE_TYPES } from '../../utils/fileUpload.js';
import { STATIC_BASE_URL } from '../../utils/constants.js';

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
      const { photoBase64, ...rest } = data;
      
      let imageUrl = rest.imageUrl;
      if (photoBase64) {
        try {
          const fileName = await processBase64Upload(
            photoBase64,
            'hero-slides',
            ALLOWED_IMAGE_TYPES,
            'slide'
          );
          imageUrl = `${STATIC_BASE_URL}/uploads/hero-slides/${fileName}`;
        } catch (uploadError: any) {
          console.error('Photo upload error:', uploadError.message);
        }
      }
      
      const count = await HeroSlide.countDocuments();
      const slide = await HeroSlide.create({
        ...rest,
        imageUrl,
        order: data.order ?? count,
        createdBy: context.admin!.id,
      });
      return { success: true, message: 'Hero slide created', data: slide };
    },

    updateHeroSlide: async (_: any, { id, data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const { photoBase64, ...rest } = data;
      
      let updateData = rest;
      if (photoBase64) {
        try {
          const fileName = await processBase64Upload(
            photoBase64,
            'hero-slides',
            ALLOWED_IMAGE_TYPES,
            'slide'
          );
          updateData.imageUrl = `${STATIC_BASE_URL}/uploads/hero-slides/${fileName}`;
        } catch (uploadError: any) {
          console.error('Photo upload error:', uploadError.message);
        }
      }
      
      const slide = await HeroSlide.findByIdAndUpdate(id, updateData, { new: true });
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
