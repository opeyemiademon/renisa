import Award from './award.model.js';
import AwardVote from '../awardVote/awardVote.model.js';
import { requireAdminAuth } from '../../middleware/auth.js';
const populate = (q) => q
    .populate('categoryId', 'name icon')
    .populate('memberId', 'firstName lastName profilePicture memberNumber');
const awardResolvers = {
    Award: {
        totalVotes: async (parent) => {
            try {
                return await AwardVote.countDocuments({ awardId: parent._id });
            }
            catch {
                return 0;
            }
        },
    },
    Query: {
        getAllAwards: async (_, { year, status, categoryId, votingEnabled }) => {
            const filter = {};
            if (year)
                filter.year = year;
            if (status)
                filter.status = status;
            if (categoryId)
                filter.categoryId = categoryId;
            if (votingEnabled !== undefined)
                filter.votingEnabled = votingEnabled;
            return Award.find(filter).sort({ year: -1, createdAt: -1 }).populate('categoryId', 'name description').populate('memberId', 'firstName lastName profilePicture memberNumber');
        },
        getAward: async (_, { id }) => {
            return populate(Award.findById(id));
        },
    },
    Mutation: {
        createAward: async (_, { data }, context) => {
            requireAdminAuth(context);
            const award = await Award.create({
                memberId: data.memberId,
                categoryId: data.categoryId,
                year: data.year || new Date().getFullYear(),
                votingEndDate: data.votingEndDate ? new Date(data.votingEndDate) : undefined,
                status: data.status || 'nominated',
                nominatedBy: context.admin.id,
            });
            const populated = await populate(Award.findById(award._id));
            return { success: true, message: 'Award created', data: populated };
        },
        updateAward: async (_, { id, data }, context) => {
            requireAdminAuth(context);
            const update = {};
            if (data.memberId !== undefined)
                update.memberId = data.memberId;
            if (data.categoryId !== undefined)
                update.categoryId = data.categoryId;
            if (data.year !== undefined)
                update.year = data.year;
            if (data.votingEndDate !== undefined)
                update.votingEndDate = data.votingEndDate ? new Date(data.votingEndDate) : null;
            if (data.status !== undefined)
                update.status = data.status;
            const award = await populate(Award.findByIdAndUpdate(id, update, { new: true }));
            if (!award)
                throw new Error('Award not found');
            return { success: true, message: 'Award updated', data: award };
        },
        deleteAward: async (_, { id }, context) => {
            requireAdminAuth(context);
            const award = await Award.findByIdAndDelete(id);
            if (!award)
                throw new Error('Award not found');
            return { success: true, message: 'Award deleted' };
        },
        enableAwardVoting: async (_, { id, votingStartDate, votingEndDate }, context) => {
            requireAdminAuth(context);
            const updateData = { votingEnabled: true, status: 'voting' };
            if (votingStartDate)
                updateData.votingStartDate = new Date(votingStartDate);
            if (votingEndDate)
                updateData.votingEndDate = new Date(votingEndDate);
            const award = await populate(Award.findByIdAndUpdate(id, updateData, { new: true }));
            if (!award)
                throw new Error('Award not found');
            return { success: true, message: 'Voting enabled for award', data: award };
        },
    },
};
export default awardResolvers;
//# sourceMappingURL=award.resolvers.js.map