import DonationInvoice from './donationInvoice.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const donationInvoiceResolvers = {
  Query: {
    getAllDonationInvoices: async (_: any, { page = 1, limit = 20, status }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const skip = (page - 1) * limit;
      const filter: any = {};
      if (status) filter.status = status;
      const [invoices, total] = await Promise.all([
        DonationInvoice.find(filter)
          .populate('donationId')
          .skip(skip).limit(limit).sort({ createdAt: -1 }),
        DonationInvoice.countDocuments(filter),
      ]);
      return { invoices, total, page, limit };
    },

    getDonationInvoice: async (_: any, { id }: { id: string }) => {
      return await DonationInvoice.findById(id).populate('donationId');
    },

    getDonationInvoiceByNumber: async (_: any, { invoiceNumber }: { invoiceNumber: string }) => {
      return await DonationInvoice.findOne({ invoiceNumber }).populate('donationId');
    },
  },

  Mutation: {
    updateDonationInvoiceStatus: async (_: any, { id, status }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const invoice = await DonationInvoice.findByIdAndUpdate(id, { status }, { new: true });
      if (!invoice) throw new Error('Invoice not found');
      return { success: true, message: 'Invoice status updated', data: invoice };
    },
  },
};

export default donationInvoiceResolvers;
