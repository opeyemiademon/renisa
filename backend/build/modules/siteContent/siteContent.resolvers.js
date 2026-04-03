import SiteContent from './siteContent.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const siteContentResolvers = {
    Query: {
        getSiteContent: async (_, { section }) => {
            return await SiteContent.findOne({ section });
        },
        getAllSiteContent: async (_, __, context) => {
            requireAdminAuth(context);
            return await SiteContent.find().sort({ section: 1 });
        },
    },
    Mutation: {
        updateSiteContent: async (_, { section, data }, context) => {
            requireAdminAuth(context);
            const content = await SiteContent.findOneAndUpdate({ section }, { ...data, section, lastUpdatedBy: context.admin.id }, { new: true, upsert: true });
            return { success: true, message: 'Site content updated', data: content };
        },
    },
};
export default siteContentResolvers;
//# sourceMappingURL=siteContent.resolvers.js.map