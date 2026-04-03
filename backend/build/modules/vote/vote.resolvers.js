import Vote from './vote.model.js';
import Election from '../election/election.model.js';
import Candidate from '../candidate/candidate.model.js';
import Payment from '../payment/payment.model.js';
import Member from '../member/member.model.js';
import mongoose from 'mongoose';
import { requireMemberAuth } from '../../middleware/auth.js';
const voteResolvers = {
    Query: {
        getElectionResults: async (_, { electionId }, context) => {
            if (!context.isAuthenticated)
                throw new Error('Authentication required');
            const results = await Vote.aggregate([
                { $match: { electionId: new mongoose.Types.ObjectId(electionId) } },
                {
                    $lookup: {
                        from: 'candidates',
                        localField: 'candidateId',
                        foreignField: '_id',
                        as: 'candidate',
                    },
                },
                { $unwind: '$candidate' },
                {
                    $lookup: {
                        from: 'members',
                        localField: 'candidate.memberId',
                        foreignField: '_id',
                        as: 'member',
                    },
                },
                { $unwind: { path: '$member', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'electoralpositions',
                        localField: 'positionId',
                        foreignField: '_id',
                        as: 'position',
                    },
                },
                { $unwind: '$position' },
                {
                    $group: {
                        _id: { candidateId: '$candidateId', positionId: '$positionId' },
                        candidateName: { $first: { $concat: ['$member.firstName', ' ', '$member.lastName'] } },
                        positionTitle: { $first: '$position.title' },
                        voteCount: { $sum: 1 },
                    },
                },
                { $sort: { '_id.positionId': 1, voteCount: -1 } },
            ]);
            return results.map((r) => ({
                candidateId: r._id.candidateId.toString(),
                candidateName: r.candidateName || 'Unknown',
                positionId: r._id.positionId.toString(),
                positionTitle: r.positionTitle,
                voteCount: r.voteCount,
            }));
        },
        hasVoted: async (_, { electionId, positionId }, context) => {
            requireMemberAuth(context);
            const existing = await Vote.findOne({ electionId, positionId, voterId: context.member.id });
            return !!existing;
        },
    },
    Mutation: {
        castVote: async (_, { electionId, positionId, candidateId }, context) => {
            requireMemberAuth(context);
            const memberId = context.member.id;
            const election = await Election.findById(electionId);
            if (!election)
                throw new Error('Election not found');
            if (election.status !== 'voting')
                throw new Error('Voting is not currently open');
            const now = new Date();
            if (election.votingStartDate && now < new Date(election.votingStartDate)) {
                throw new Error('Voting has not started yet');
            }
            if (election.votingEndDate && now > new Date(election.votingEndDate)) {
                throw new Error('Voting has ended');
            }
            const member = await Member.findById(memberId);
            if (!member)
                throw new Error('Member not found');
            const criteria = election.eligibilityCriteria;
            if (criteria) {
                if (criteria.mustBeActive && member.membershipStatus !== 'active') {
                    throw new Error('Only active members can vote');
                }
                if (criteria.minimumMembershipYears && criteria.minimumMembershipYears > 0) {
                    const memberYear = member.membershipYear || new Date().getFullYear();
                    const yearsAsMember = new Date().getFullYear() - memberYear;
                    if (yearsAsMember < criteria.minimumMembershipYears) {
                        throw new Error(`You must have been a member for at least ${criteria.minimumMembershipYears} year(s) to vote`);
                    }
                }
                if (criteria.paymentYears && criteria.paymentYears.length > 0) {
                    for (const year of criteria.paymentYears) {
                        const paid = await Payment.findOne({ memberId, year, status: 'successful' });
                        if (!paid)
                            throw new Error(`You must have paid dues for ${year} to be eligible to vote`);
                    }
                }
            }
            const existing = await Vote.findOne({ electionId, positionId, voterId: memberId });
            if (existing)
                throw new Error('You have already voted for this position');
            const candidate = await Candidate.findOne({ _id: candidateId, electionId, positionId, isApproved: true });
            if (!candidate)
                throw new Error('Candidate not found or not approved');
            const vote = await Vote.create({
                electionId,
                positionId,
                voterId: memberId,
                candidateId,
                votedAt: new Date(),
            });
            return { success: true, message: 'Vote cast successfully', data: vote };
        },
    },
};
export default voteResolvers;
//# sourceMappingURL=vote.resolvers.js.map