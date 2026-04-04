import PaymentType from './paymentType.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const paymentTypeResolvers = {
    Query: {
        getAllPaymentTypes: async (_, { isActive }, context) => {
            if (!context.isAuthenticated)
                throw new Error('Authentication required');
            return await PaymentType.find().sort({ createdAt: -1 });
        },
        getPaymentType: async (_, { id }, context) => {
            requireAdminAuth(context);
            return await PaymentType.findById(id);
        },
    },
    Mutation: {
        createPaymentType: async (_, { data }, context) => {
            requireAdminAuth(context);
            const paymentType = await PaymentType.create({ ...data, createdBy: context.admin.id });
            return { success: true, message: 'Payment type created', data: paymentType };
        },
        updatePaymentType: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            const paymentType = await PaymentType.findByIdAndUpdate(id, data, { new: true });
            if (!paymentType)
                throw new Error('Payment type not found');
            return { success: true, message: 'Payment type updated', data: paymentType };
        },
        deletePaymentType: async (_, { id }, context) => {
            requireAdminAuth(context);
            const paymentType = await PaymentType.findByIdAndDelete(id);
            if (!paymentType)
                throw new Error('Payment type not found');
            return { success: true, message: 'Payment type deleted' };
        },
    },
};
export default paymentTypeResolvers;
//# sourceMappingURL=paymentType.resolvers.js.map