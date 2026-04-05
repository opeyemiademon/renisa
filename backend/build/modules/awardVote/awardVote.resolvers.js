import AwardVote from './awardVote.model.js';
import Award from '../award/award.model.js';
import mongoose from 'mongoose';
import { requireMemberAuth } from '../../middleware/auth.js';
const awardVoteResolvers = {
    Query: {
        getAwardVoteResults: async (_, { awardId }) => {
            const match = {};
            if (awardId)
                match.awardId = new mongoose.Types.ObjectId(awardId);
            const results = await AwardVote.aggregate([
                { $match: match },
                { $group: { _id: '$awardId', voteCount: { $sum: 1 } } },
                {
                    $lookup: {
                        from: 'awards',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'award',
                    },
                },
                { $unwind: '$award' },
                {
                    $lookup: {
                        from: 'members',
                        localField: 'award.memberId',
                        foreignField: '_id',
                        as: 'member',
                    },
                },
                { $unwind: { path: '$member', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'awardcategories',
                        localField: 'award.categoryId',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
                { $sort: { voteCount: -1 } },
            ]);
            return results.map((r) => ({
                awardId: r._id.toString(),
                recipientName: r.member ? `${r.member.firstName} ${r.member.lastName}` : 'Unknown',
                categoryName: r.category?.name || 'Unknown',
                voteCount: r.voteCount,
            }));
        },
        getAwardWinnersReport: async (_, { year }) => {
            // Aggregate votes grouped by awardId, then find top nominee per category
            const matchYear = {};
            if (year)
                matchYear['award.year'] = year;
            const voteCounts = await AwardVote.aggregate([
                { $group: { _id: '$awardId', voteCount: { $sum: 1 } } },
                {
                    $lookup: {
                        from: 'awards',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'award',
                    },
                },
                { $unwind: '$award' },
                ...(year ? [{ $match: { 'award.year': year } }] : []),
                {
                    $lookup: {
                        from: 'members',
                        localField: 'award.memberId',
                        foreignField: '_id',
                        as: 'member',
                    },
                },
                { $unwind: { path: '$member', preserveNullAndEmptyArrays: true } },
                { $sort: { voteCount: -1 } },
            ]);
            // Also get all awards (including those with 0 votes) for the year
            const awardsFilter = {};
            if (year)
                awardsFilter.year = year;
            const allAwards = await Award.find(awardsFilter)
                .populate('categoryId', 'name pollActive votingStartDate votingEndDate')
                .populate('memberId', 'firstName lastName profilePicture memberNumber');
            // Build a map: categoryId -> { category info, nominees: [{ awardId, member, voteCount }] }
            const categoryMap = new Map();
            for (const award of allAwards) {
                const cat = award.categoryId;
                if (!cat)
                    continue;
                const catId = cat._id.toString();
                if (!categoryMap.has(catId)) {
                    categoryMap.set(catId, {
                        categoryId: catId,
                        categoryName: cat.name,
                        pollActive: cat.pollActive || false,
                        votingStartDate: cat.votingStartDate ? cat.votingStartDate.toISOString() : null,
                        votingEndDate: cat.votingEndDate ? cat.votingEndDate.toISOString() : null,
                        nominees: [],
                    });
                }
                const member = award.memberId;
                const voteEntry = voteCounts.find((v) => v._id.toString() === award._id.toString());
                categoryMap.get(catId).nominees.push({
                    awardId: award._id.toString(),
                    recipientName: member ? `${member.firstName} ${member.lastName}` : 'Unknown',
                    recipientPhoto: member?.profilePicture || null,
                    memberNumber: member?.memberNumber || null,
                    voteCount: voteEntry?.voteCount || 0,
                });
            }
            // Sort nominees by voteCount desc per category and set winner
            const result = [];
            for (const catData of categoryMap.values()) {
                catData.nominees.sort((a, b) => b.voteCount - a.voteCount);
                catData.winner = catData.nominees.length > 0 ? catData.nominees[0] : null;
                result.push(catData);
            }
            return result;
        },
        hasVotedForAward: async (_, { awardId }, context) => {
            requireMemberAuth(context);
            const vote = await AwardVote.findOne({ awardId, voterId: context.member.id });
            return !!vote;
        },
        getMyAwardVotes: async (_, { year }, context) => {
            requireMemberAuth(context);
            const y = year || new Date().getFullYear();
            const votes = await AwardVote.find({ voterId: context.member.id })
                .populate({ path: 'awardId', match: { year: y } });
            return votes
                .filter((v) => v.awardId != null)
                .map((v) => v.awardId._id ? v.awardId._id.toString() : v.awardId.toString());
        },
    },
    Mutation: {
        castAwardVote: async (_, { awardId }, context) => {
            requireMemberAuth(context);
            const award = await Award.findById(awardId).populate('categoryId');
            if (!award)
                throw new Error('Award not found');
            const category = award.categoryId;
            if (!category || !category.pollActive)
                throw new Error('Voting is not currently active for this category');
            const now = new Date();
            if (category.votingStartDate && now < new Date(category.votingStartDate)) {
                throw new Error('Voting has not started yet');
            }
            if (category.votingEndDate && now > new Date(category.votingEndDate)) {
                throw new Error('Voting period has ended');
            }
            const existing = await AwardVote.findOne({ awardId, voterId: context.member.id });
            if (existing)
                throw new Error('You have already voted for this award');
            // Enforce one vote per category
            const awardsInCategory = await Award.find({ categoryId: category._id }, '_id');
            const categoryVote = await AwardVote.findOne({
                awardId: { $in: awardsInCategory.map((a) => a._id) },
                voterId: context.member.id,
            });
            if (categoryVote)
                throw new Error('You have already cast your vote for this category');
            const vote = await AwardVote.create({
                awardId,
                voterId: context.member.id,
                votedAt: new Date(),
            });
            return { success: true, message: 'Vote cast successfully', data: vote };
        },
    },
};
export default awardVoteResolvers;
//# sourceMappingURL=awardVote.resolvers.js.map