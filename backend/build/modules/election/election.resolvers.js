import Election from './election.model.js';
import ElectoralPosition from '../electoralPosition/electoralPosition.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const populate = (q) => q.populate('positions');
const electionResolvers = {
    Query: {
        getAllElections: async (_, __, context) => {
            if (!context.isAuthenticated)
                throw new Error('Authentication required');
            return await populate(Election.find().sort({ createdAt: -1 }));
        },
        getElection: async (_, { id }) => {
            return await populate(Election.findById(id));
        },
    },
    Mutation: {
        createElection: async (_, { data }, context) => {
            requireAdminAuth(context);
            const { title, description, year, startDate, endDate, votingStartDate, votingEndDate, eligibilityMinYears, requiresDuesPayment, positions, } = data;
            const election = await Election.create({
                title,
                description,
                year: year || new Date().getFullYear(),
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                votingStartDate: votingStartDate ? new Date(votingStartDate) : undefined,
                votingEndDate: votingEndDate ? new Date(votingEndDate) : undefined,
                eligibilityMinYears: eligibilityMinYears ?? 1,
                requiresDuesPayment: requiresDuesPayment ?? true,
                createdBy: context.admin.id,
            });
            // Create ElectoralPosition docs for each supplied position
            const positionDocs = [];
            for (const p of (positions || []).filter((p) => p.title?.trim())) {
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
                election.positions.push(...positionDocs);
                await election.save();
            }
            const populated = await populate(Election.findById(election._id));
            return { success: true, message: 'Election created', data: populated };
        },
        updateElection: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            const update = {};
            if (data.title !== undefined)
                update.title = data.title;
            if (data.description !== undefined)
                update.description = data.description;
            if (data.year !== undefined)
                update.year = data.year;
            if (data.startDate !== undefined)
                update.startDate = data.startDate ? new Date(data.startDate) : null;
            if (data.endDate !== undefined)
                update.endDate = data.endDate ? new Date(data.endDate) : null;
            if (data.votingStartDate !== undefined)
                update.votingStartDate = data.votingStartDate ? new Date(data.votingStartDate) : null;
            if (data.votingEndDate !== undefined)
                update.votingEndDate = data.votingEndDate ? new Date(data.votingEndDate) : null;
            if (data.eligibilityMinYears !== undefined)
                update.eligibilityMinYears = data.eligibilityMinYears;
            if (data.requiresDuesPayment !== undefined)
                update.requiresDuesPayment = data.requiresDuesPayment;
            const election = await populate(Election.findByIdAndUpdate(id, update, { new: true }));
            if (!election)
                throw new Error('Election not found');
            return { success: true, message: 'Election updated', data: election };
        },
        updateElectionStatus: async (_, { id, status }, context) => {
            requireAdminAuth(context);
            const validStatuses = ['draft', 'active', 'completed', 'cancelled'];
            if (!validStatuses.includes(status))
                throw new Error('Invalid election status');
            const election = await populate(Election.findByIdAndUpdate(id, { status }, { new: true }));
            if (!election)
                throw new Error('Election not found');
            return { success: true, message: `Election status updated to ${status}`, data: election };
        },
        addElectoralPosition: async (_, { electionId, data }, context) => {
            requireAdminAuth(context);
            const election = await Election.findById(electionId);
            if (!election)
                throw new Error('Election not found');
            const pos = await ElectoralPosition.create({
                electionId,
                title: data.title,
                description: data.description,
                maxCandidates: data.maxCandidates ?? 5,
                formFee: data.formFee ?? 0,
            });
            election.positions.push(pos._id);
            await election.save();
            const populated = await populate(Election.findById(electionId));
            return { success: true, message: 'Position added', data: populated };
        },
        deleteElection: async (_, { id }, context) => {
            requireAdminAuth(context);
            const election = await Election.findByIdAndDelete(id);
            if (!election)
                throw new Error('Election not found');
            // Clean up associated positions
            await ElectoralPosition.deleteMany({ electionId: id });
            return { success: true, message: 'Election deleted' };
        },
    },
};
export default electionResolvers;
//# sourceMappingURL=election.resolvers.js.map