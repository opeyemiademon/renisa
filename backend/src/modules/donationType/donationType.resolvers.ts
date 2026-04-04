import DonationType from './donationType.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const donationTypeResolvers = {
  Query: {
    getAllDonationTypes: async (_: any, { isActive }: any) => {
      const filter: any = {};
      return await DonationType.find().sort({ sortOrder: 1, name: 1 });
    },
    getDonationType: async (_: any, { id }: { id: string }) => {
      return await DonationType.findById(id);
    },
  },

  Mutation: {
    createDonationType: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireAdminAuth(context);
      const dtype = await DonationType.create({ ...data, createdBy: context.admin!.id });
      return { success: true, message: 'Donation type created', data: dtype };
    },

    updateDonationType: async (_: any, { id, data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const dtype = await DonationType.findByIdAndUpdate(id, data, { new: true });
      if (!dtype) throw new Error('Donation type not found');
      return { success: true, message: 'Donation type updated', data: dtype };
    },

    deleteDonationType: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const dtype = await DonationType.findByIdAndDelete(id);
      if (!dtype) throw new Error('Donation type not found');
      return { success: true, message: 'Donation type deleted' };
    },
  },
};

export default donationTypeResolvers;
