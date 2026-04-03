import SiteContent from './siteContent.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const siteContentResolvers = {
  Query: {
    getSiteContent: async (_: any, { section }: { section: string }) => {
      return await SiteContent.findOne({ section });
    },
    getAllSiteContent: async (_: any, __: any, context: AuthContext) => {
      requireAdminAuth(context);
      return await SiteContent.find().sort({ section: 1 });
    },
  },

  Mutation: {
    updateSiteContent: async (_: any, { section, data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const content = await SiteContent.findOneAndUpdate(
        { section },
        { ...data, section, lastUpdatedBy: context.admin!.id },
        { new: true, upsert: true }
      );
      return { success: true, message: 'Site content updated', data: content };
    },
  },
};

export default siteContentResolvers;
