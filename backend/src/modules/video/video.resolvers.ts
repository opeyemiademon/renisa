import Video from './video.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const slugify = (title: string): string =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const generateUniqueSlug = async (title: string): Promise<string> => {
  let slug = slugify(title);
  let counter = 0;
  while (true) {
    const existing = await Video.findOne({ slug: counter === 0 ? slug : `${slug}-${counter}` });
    if (!existing) break;
    counter++;
  }
  return counter === 0 ? slug : `${slug}-${counter}`;
};

const videoResolvers = {
  Query: {
    getAllVideos: async (_: any, { status, category }: any) => {
      const filter: any = {};
      if (status) filter.status = status;
      if (category) filter.category = category;
      return await Video.find(filter).sort({ createdAt: -1 });
    },

    getVideo: async (_: any, { id }: { id: string }) => {
      return await Video.findById(id);
    },

    getVideoBySlug: async (_: any, { slug }: { slug: string }) => {
      const doc = await Video.findOneAndUpdate(
        { slug, status: 'published' },
        { $inc: { views: 1 } },
        { new: true }
      );
      return doc;
    },

    getFeaturedVideos: async () => {
      return await Video.find({ isFeatured: true, status: 'published' }).sort({ publishedAt: -1 });
    },

    getVideoCategories: async () => {
      const categories = await Video.distinct('category', { category: { $ne: null} });
      return categories.sort();
    },
  },

  Mutation: {
    createVideo: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireAdminAuth(context);
      const slug = data.slug?.trim() || await generateUniqueSlug(data.title);
      const video = await Video.create({
        ...data,
        slug,
        status: data.status || 'draft',
        createdBy: context.admin!.id,
      });
      return { success: true, message: 'Video created', data: video };
    },

    updateVideo: async (_: any, { id, data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const video = await Video.findByIdAndUpdate(id, data, { new: true });
      if (!video) throw new Error('Video not found');
      return { success: true, message: 'Video updated', data: video };
    },

    deleteVideo: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const video = await Video.findByIdAndDelete(id);
      if (!video) throw new Error('Video not found');
      return { success: true, message: 'Video successfully deleted' };
    },

    publishVideo: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const video = await Video.findByIdAndUpdate(
        id,
        { status: 'published', publishedAt: new Date() },
        { new: true }
      );
      if (!video) throw new Error('Video not found');
      return { success: true, message: 'Video published', data: video };
    },

    archiveVideo: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const video = await Video.findByIdAndUpdate(id, { status: 'archived' }, { new: true });
      if (!video) throw new Error('Video not found');
      return { success: true, message: 'Video archived', data: video };
    },
  },
};

export default videoResolvers;
