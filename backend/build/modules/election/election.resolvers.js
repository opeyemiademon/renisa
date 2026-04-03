import Election from './election.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const electionResolvers = {
    Query: {
        getAllElections: async (_, __, context) => {
            if (!context.isAuthenticated)
                throw new Error('Authentication required');
            return await Election.find().sort({ createdAt: -1 });
        },
        getElection: async (_, { id }) => {
            return await Election.findById(id);
        },
    },
    Mutation: {
        createElection: async (_, { data }, context) => {
            requireAdminAuth(context);
            const election = await Election.create({ ...data, createdBy: context.admin.id });
            return { success: true, message: 'Election created', data: election };
        },
        updateElection: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            const election = await Election.findByIdAndUpdate(id, data, { new: true });
            if (!election)
                throw new Error('Election not found');
            return { success: true, message: 'Election updated', data: election };
        },
        updateElectionStatus: async (_, { id, status }, context) => {
            requireAdminAuth(context);
            const validStatuses = ['setup', 'nomination', 'voting', 'completed', 'cancelled'];
            if (!validStatuses.includes(status))
                throw new Error('Invalid election status');
            const election = await Election.findByIdAndUpdate(id, { status }, { new: true });
            if (!election)
                throw new Error('Election not found');
            return { success: true, message: `Election status updated to ${status}`, data: election };
        },
        deleteElection: async (_, { id }, context) => {
            requireAdminAuth(context);
            const election = await Election.findByIdAndDelete(id);
            if (!election)
                throw new Error('Election not found');
            return { success: true, message: 'Election deleted' };
        },
    },
};
export default electionResolvers;
//# sourceMappingURL=election.resolvers.js.map