import Election from './election.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const electionResolvers = {
  Query: {
    getAllElections: async (_: any, __: any, context: AuthContext) => {
      if (!context.isAuthenticated) throw new Error('Authentication required');
      return await Election.find().sort({ createdAt: -1 });
    },
    getElection: async (_: any, { id }: { id: string }) => {
      return await Election.findById(id);
    },
  },

  Mutation: {
    createElection: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireAdminAuth(context);
      const election = await Election.create({ ...data, createdBy: context.admin!.id });
      return { success: true, message: 'Election created', data: election };
    },

    updateElection: async (_: any, { id, data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const election = await Election.findByIdAndUpdate(id, data, { new: true });
      if (!election) throw new Error('Election not found');
      return { success: true, message: 'Election updated', data: election };
    },

    updateElectionStatus: async (_: any, { id, status }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const validStatuses = ['setup', 'nomination', 'voting', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) throw new Error('Invalid election status');
      const election = await Election.findByIdAndUpdate(id, { status }, { new: true });
      if (!election) throw new Error('Election not found');
      return { success: true, message: `Election status updated to ${status}`, data: election };
    },

    deleteElection: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const election = await Election.findByIdAndDelete(id);
      if (!election) throw new Error('Election not found');
      return { success: true, message: 'Election deleted' };
    },
  },
};

export default electionResolvers;
