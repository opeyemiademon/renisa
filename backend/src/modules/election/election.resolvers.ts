import Election from './election.model.js';
import ElectoralPosition from '../electoralPosition/electoralPosition.model.js';
import { requireAdminAuth, AuthContext } from '../../middleware/auth.js';

const populate = (q: any) =>
  q.populate('positions');

const electionResolvers = {
  Query: {
    getAllElections: async (_: any, __: any, context: AuthContext) => {
      if (!context.isAuthenticated) throw new Error('Authentication required');
      const filter = context.admin ? {} : { status: { $ne: 'draft' as const } };
      return await populate(Election.find(filter).sort({ createdAt: -1 }));
    },
    getElection: async (_: any, { id }: { id: string }, context: AuthContext) => {
      const doc = await populate(Election.findById(id));
      if (!doc) return null;
      if (!context.admin && (doc as any).status === 'draft') return null;
      return doc;
    },
  },

  Mutation: {
    createElection: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireAdminAuth(context);
      const { title, description, year, eligibilityMinYears, requiresDuesPayment, positions } = data;

      const election = await Election.create({
        title,
        description,
        year: year || new Date().getFullYear(),
        eligibilityMinYears: eligibilityMinYears ?? 1,
        requiresDuesPayment: requiresDuesPayment ?? true,
        createdBy: context.admin!.id,
      });

      // Create ElectoralPosition docs for each supplied position
      const positionDocs = [];
      for (const p of (positions || []).filter((p: any) => p.title?.trim())) {
        const pos = await ElectoralPosition.create({
          electionId: election._id,
          title: p.title,
          description: p.description,
          maxCandidates: p.maxCandidates ?? 5,
          formFee: p.formFee ?? 0,
        });
        positionDocs.push(pos._id);
      }

      if (positionDocs.length) {
        election.positions.push(...positionDocs as any[]);
        await election.save();
      }

      const populated = await populate(Election.findById(election._id));
      return { success: true, message: 'Election created', data: populated };
    },

    updateElection: async (_: any, { id, data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const update: any = {};
      if (data.title !== undefined) update.title = data.title;
      if (data.description !== undefined) update.description = data.description;
      if (data.year !== undefined) update.year = data.year;
      if (data.startDate !== undefined) update.startDate = data.startDate ? new Date(data.startDate) : null;
      if (data.endDate !== undefined) update.endDate = data.endDate ? new Date(data.endDate) : null;
      if (data.votingStartDate !== undefined) update.votingStartDate = data.votingStartDate ? new Date(data.votingStartDate) : null;
      if (data.votingEndDate !== undefined) update.votingEndDate = data.votingEndDate ? new Date(data.votingEndDate) : null;
      if (data.eligibilityMinYears !== undefined) update.eligibilityMinYears = data.eligibilityMinYears;
      if (data.requiresDuesPayment !== undefined) update.requiresDuesPayment = data.requiresDuesPayment;

      const election = await populate(Election.findByIdAndUpdate(id, update, { new: true }));
      if (!election) throw new Error('Election not found');
      return { success: true, message: 'Election updated', data: election };
    },

    updateElectionStatus: async (_: any, { id, status }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const validStatuses = ['draft', 'active', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) throw new Error('Invalid election status');
      const election = await populate(Election.findByIdAndUpdate(id, { status }, { new: true }));
      if (!election) throw new Error('Election not found');
      return { success: true, message: `Election status updated to ${status}`, data: election };
    },

    addElectoralPosition: async (_: any, { electionId, data }: any, context: AuthContext) => {
      requireAdminAuth(context);
      const election = await Election.findById(electionId);
      if (!election) throw new Error('Election not found');

      const pos = await ElectoralPosition.create({
        electionId,
        title: data.title,
        description: data.description,
        maxCandidates: data.maxCandidates ?? 5,
        formFee: data.formFee ?? 0,
      });

      election.positions.push(pos._id as any);
      await election.save();

      const populated = await populate(Election.findById(electionId));
      return { success: true, message: 'Position added', data: populated };
    },

    deleteElection: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAdminAuth(context);
      const election = await Election.findByIdAndDelete(id);
      if (!election) throw new Error('Election not found');
      // Clean up associated positions
      await ElectoralPosition.deleteMany({ electionId: id });
      return { success: true, message: 'Election deleted' };
    },
  },
};

export default electionResolvers;
