import ElectoralPosition from './electoralPosition.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const electoralPositionResolvers = {
    Query: {
        getElectionPositions: async (_, { electionId }) => {
            return await ElectoralPosition.find({ electionId }).populate('electionId').sort({ createdAt: 1 });
        },
        getElectoralPosition: async (_, { id }) => {
            return await ElectoralPosition.findById(id).populate('electionId');
        },
    },
    Mutation: {
        createElectoralPosition: async (_, { data }, context) => {
            requireAdminAuth(context);
            const position = await ElectoralPosition.create(data);
            return { success: true, message: 'Position created', data: position };
        },
        updateElectoralPosition: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            const position = await ElectoralPosition.findByIdAndUpdate(id, data, { new: true });
            if (!position)
                throw new Error('Position not found');
            return { success: true, message: 'Position updated', data: position };
        },
        deleteElectoralPosition: async (_, { id }, context) => {
            requireAdminAuth(context);
            const position = await ElectoralPosition.findByIdAndDelete(id);
            if (!position)
                throw new Error('Position not found');
            return { success: true, message: 'Position deleted' };
        },
    },
};
export default electoralPositionResolvers;
//# sourceMappingURL=electoralPosition.resolvers.js.map