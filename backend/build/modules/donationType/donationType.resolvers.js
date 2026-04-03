import DonationType from './donationType.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const donationTypeResolvers = {
    Query: {
        getAllDonationTypes: async (_, { isActive }) => {
            const filter = {};
            if (isActive !== undefined)
                filter.isActive = isActive;
            return await DonationType.find(filter).sort({ sortOrder: 1, name: 1 });
        },
        getDonationType: async (_, { id }) => {
            return await DonationType.findById(id);
        },
    },
    Mutation: {
        createDonationType: async (_, { data }, context) => {
            requireAdminAuth(context);
            const dtype = await DonationType.create({ ...data, createdBy: context.admin.id });
            return { success: true, message: 'Donation type created', data: dtype };
        },
        updateDonationType: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            const dtype = await DonationType.findByIdAndUpdate(id, data, { new: true });
            if (!dtype)
                throw new Error('Donation type not found');
            return { success: true, message: 'Donation type updated', data: dtype };
        },
        deleteDonationType: async (_, { id }, context) => {
            requireAdminAuth(context);
            const dtype = await DonationType.findByIdAndDelete(id);
            if (!dtype)
                throw new Error('Donation type not found');
            return { success: true, message: 'Donation type deleted' };
        },
    },
};
export default donationTypeResolvers;
//# sourceMappingURL=donationType.resolvers.js.map