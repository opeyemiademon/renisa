import Vote from './vote.model.js';
import Election from '../election/election.model.js';
import Candidate from '../candidate/candidate.model.js';
import ElectoralPosition from '../electoralPosition/electoralPosition.model.js';
import Payment from '../payment/payment.model.js';
import Member from '../member/member.model.js';
import mongoose from 'mongoose';
import { requireMemberAuth } from '../../middleware/auth.js';
const voteResolvers = {
    Query: {
        getElectionResults: async (_, { electionId }, context) => {
            if (!context.isAuthenticated)
                throw new Error('Authentication required');
            const election = await Election.findById(electionId);
            if (!election)
                throw new Error('Election not found');
            const oId = new mongoose.Types.ObjectId(electionId);
            const positions = await ElectoralPosition.find({ electionId: oId }).sort({ createdAt: 1 }).lean();
            const voteRows = await Vote.aggregate([
                { $match: { electionId: oId } },
                {
                    $group: {
                        _id: { candidateId: '$candidateId', positionId: '$positionId' },
                        voteCount: { $sum: 1 },
                    },
                },
            ]);
            const countKey = (positionId, candidateId) => `${positionId}|${candidateId}`;
            const voteCountMap = new Map();
            for (const row of voteRows) {
                voteCountMap.set(countKey(row._id.positionId.toString(), row._id.candidateId.toString()), row.voteCount);
            }
            const approvedCandidates = await Candidate.find({ electionId: oId, isApproved: true })
                .populate('memberId', 'firstName lastName')
                .lean();
            const candidatesByPosition = new Map();
            for (const c of approvedCandidates) {
                const pid = c.positionId.toString();
                if (!candidatesByPosition.has(pid))
                    candidatesByPosition.set(pid, []);
                candidatesByPosition.get(pid).push(c);
            }
            return positions.map((pos) => {
                const pid = pos._id.toString();
                const cands = candidatesByPosition.get(pid) || [];
                const tallies = cands.map((c) => {
                    const member = c.memberId;
                    const name = member
                        ? `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown'
                        : 'Unknown';
                    const cid = c._id.toString();
                    const voteCount = voteCountMap.get(countKey(pid, cid)) || 0;
                    return { candidateId: cid, candidateName: name, voteCount };
                });
                tallies.sort((a, b) => b.voteCount - a.voteCount);
                const totalVotes = tallies.reduce((s, t) => s + t.voteCount, 0);
                const candidates = tallies.map((t) => ({
                    candidateId: t.candidateId,
                    candidateName: t.candidateName,
                    voteCount: t.voteCount,
                    percentage: totalVotes > 0 ? Math.round((t.voteCount / totalVotes) * 1000) / 10 : 0,
                }));
                return {
                    positionId: pid,
                    positionTitle: pos.title || 'Position',
                    totalVotes,
                    candidates,
                };
            });
        },
        hasVoted: async (_, { electionId }, context) => {
            requireMemberAuth(context);
            const existing = await Vote.findOne({ electionId, voterId: context.member.id });
            return !!existing;
        },
        checkMemberEligibility: async (_, { electionId }, context) => {
            requireMemberAuth(context);
            const memberId = context.member.id;
            const election = await Election.findById(electionId);
            if (!election)
                throw new Error('Election not found');
            const member = await Member.findById(memberId);
            if (!member)
                throw new Error('Member not found');
            const reasons = [];
            if (election.status !== 'active') {
                reasons.push('This election is not currently active');
            }
            const now = new Date();
            if (election.votingStartDate && now < new Date(election.votingStartDate)) {
                reasons.push('Voting has not started yet');
            }
            if (election.votingEndDate && now > new Date(election.votingEndDate)) {
                reasons.push('Voting period has ended');
            }
            if (election.eligibilityMinYears && election.eligibilityMinYears > 0) {
                const memberYear = member.membershipYear || new Date().getFullYear();
                const yearsAsMember = new Date().getFullYear() - memberYear;
                if (yearsAsMember < election.eligibilityMinYears) {
                    reasons.push(`You must have been a member for at least ${election.eligibilityMinYears} year(s) to vote`);
                }
            }
            if (election.requiresDuesPayment) {
                const currentYear = new Date().getFullYear();
                const paid = await Payment.findOne({
                    memberId,
                    year: currentYear,
                    $or: [{ status: 'successful' }, { status: 'completed' }],
                });
                if (!paid) {
                    reasons.push(`You must have paid your dues for ${currentYear} to vote`);
                }
            }
            return { eligible: reasons.length === 0, reasons };
        },
    },
    Mutation: {
        castVote: async (_, { data }, context) => {
            requireMemberAuth(context);
            const memberId = context.member.id;
            const { electionId, votes } = data;
            const election = await Election.findById(electionId);
            if (!election)
                throw new Error('Election not found');
            if (election.status !== 'active')
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
            if (election.eligibilityMinYears && election.eligibilityMinYears > 0) {
                const memberYear = member.membershipYear || new Date().getFullYear();
                const yearsAsMember = new Date().getFullYear() - memberYear;
                if (yearsAsMember < election.eligibilityMinYears) {
                    throw new Error(`You must have been a member for at least ${election.eligibilityMinYears} year(s) to vote`);
                }
            }
            if (election.requiresDuesPayment) {
                const currentYear = new Date().getFullYear();
                const paid = await Payment.findOne({
                    memberId,
                    year: currentYear,
                    $or: [{ status: 'successful' }, { status: 'completed' }],
                });
                if (!paid)
                    throw new Error(`You must have paid dues for ${currentYear} to be eligible to vote`);
            }
            const alreadyVoted = await Vote.findOne({ electionId, voterId: memberId });
            if (alreadyVoted)
                throw new Error('You have already voted in this election');
            for (const { positionId, candidateId } of votes) {
                const candidate = await Candidate.findOne({
                    _id: candidateId,
                    electionId,
                    positionId,
                    isApproved: true,
                });
                if (!candidate)
                    throw new Error(`Candidate not found or not on the ballot for this position`);
                await Vote.create({
                    electionId,
                    positionId,
                    voterId: memberId,
                    candidateId,
                    votedAt: new Date(),
                });
            }
            return { success: true, message: 'Your vote has been cast successfully' };
        },
    },
};
export default voteResolvers;
//# sourceMappingURL=vote.resolvers.js.map