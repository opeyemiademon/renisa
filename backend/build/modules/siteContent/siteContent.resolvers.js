import SiteContent from './siteContent.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
import { processBase64Upload, ALLOWED_IMAGE_TYPES } from '../../utils/fileUpload.js';
import { STATIC_BASE_URL } from '../../utils/constants.js';
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
            const processed = { ...data };
            // Process any base64 image fields (e.g. backgroundImageBase64, imageBase64)
            for (const key of Object.keys(processed)) {
                if (key.endsWith('Base64') && processed[key]) {
                    try {
                        const imageField = key.replace('Base64', '');
                        const fileName = await processBase64Upload(processed[key], 'site-content', ALLOWED_IMAGE_TYPES, 'site');
                        processed[imageField] = `${STATIC_BASE_URL}/uploads/site-content/${fileName}`;
                    }
                    catch (err) {
                        console.error(`Image upload error for field ${key}:`, err.message);
                    }
                    delete processed[key];
                }
            }
            const content = await SiteContent.findOneAndUpdate({ section }, { $set: { metadata: processed, section, lastUpdatedBy: context.admin.id } }, { new: true, upsert: true });
            return { success: true, message: 'Site content updated', data: content };
        },
    },
};
export default siteContentResolvers;
//# sourceMappingURL=siteContent.resolvers.js.map