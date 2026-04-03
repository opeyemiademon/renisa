import DonationInvoice from './donationInvoice.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const donationInvoiceResolvers = {
    Query: {
        getAllDonationInvoices: async (_, { page = 1, limit = 20, status }, context) => {
            requireAdminAuth(context);
            const skip = (page - 1) * limit;
            const filter = {};
            if (status)
                filter.status = status;
            const [invoices, total] = await Promise.all([
                DonationInvoice.find(filter)
                    .populate('donationId')
                    .skip(skip).limit(limit).sort({ createdAt: -1 }),
                DonationInvoice.countDocuments(filter),
            ]);
            return { invoices, total, page, limit };
        },
        getDonationInvoice: async (_, { id }) => {
            return await DonationInvoice.findById(id).populate('donationId');
        },
        getDonationInvoiceByNumber: async (_, { invoiceNumber }) => {
            return await DonationInvoice.findOne({ invoiceNumber }).populate('donationId');
        },
    },
    Mutation: {
        updateDonationInvoiceStatus: async (_, { id, status }, context) => {
            requireAdminAuth(context);
            const invoice = await DonationInvoice.findByIdAndUpdate(id, { status }, { new: true });
            if (!invoice)
                throw new Error('Invoice not found');
            return { success: true, message: 'Invoice status updated', data: invoice };
        },
    },
};
export default donationInvoiceResolvers;
//# sourceMappingURL=donationInvoice.resolvers.js.map