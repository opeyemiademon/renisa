import ElectoralPosition from './electoralPosition.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const electoralPositionResolvers = {
  Query: {
    getElectionPositions: async (_: any, { electionId }: any) => {
      return await ElectoralPosition.find({ electionId }).populate('electionId').sort({ createdAt: 1 });
    },
    getElectoralPosition: async (_: any, { id }: { id: string }) => {
      return await ElectoralPosition.findById(id).populate('electionId');
    },
  },

  Mutation: {
    createElectoralPosition: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireAdminAuth(context);
      const position = await ElectoralPosition.create(data);
      return { success: true, message: 'Position created', data: position };
    },

    updateElectoralPosition: async (_: any, { id, data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const position = await ElectoralPosition.findByIdAndUpdate(id, data, { new: true });
      if (!position) throw new Error('Position not found');
      return { success: true, message: 'Position updated', data: position };
    },

    deleteElectoralPosition: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const position = await ElectoralPosition.findByIdAndDelete(id);
      if (!position) throw new Error('Position not found');
      return { success: true, message: 'Position deleted' };
    },
  },
};

export default electoralPositionResolvers;
