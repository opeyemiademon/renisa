import IDCardSettings from './idCardSettings.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const idCardSettingsResolvers = {
    Query: {
        getIDCardSettings: async () => {
            let settings = await IDCardSettings.findOne();
            if (!settings) {
                settings = await IDCardSettings.create({});
            }
            return settings;
        },
    },
    Mutation: {
        updateIDCardSettings: async (_, { data }, context) => {
            requireAdminAuth(context);
            const settings = await IDCardSettings.findOneAndUpdate({}, { ...data, updatedBy: context.admin.id }, { new: true, upsert: true });
            return { success: true, message: 'ID card settings updated', data: settings };
        },
    },
};
export default idCardSettingsResolvers;
//# sourceMappingURL=idCardSettings.resolvers.js.map