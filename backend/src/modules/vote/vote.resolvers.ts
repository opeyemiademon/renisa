import Vote from './vote.model.js';
import Election from '../election/election.model.js';
import Candidate from '../candidate/candidate.model.js';
import ElectoralPosition from '../electoralPosition/electoralPosition.model.js';
import Payment from '../payment/payment.model.js';
import Member from '../member/member.model.js';
import mongoose from 'mongoose';
import { requireMemberAuth, AuthContext } from '../../middleware/auth.js';

const voteResolvers = {
  Query: {
    getElectionResults: async (_: any, { electionId }: any, context: AuthContext) => {
      if (!context.isAuthenticated) throw new Error('Authentication required');

      const election = await Election.findById(electionId);
      if (!election) throw new Error('Election not found');

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

      const countKey = (positionId: string, candidateId: string) => `${positionId}|${candidateId}`;
      const voteCountMap = new Map<string, number>();
      for (const row of voteRows) {
        voteCountMap.set(
          countKey(row._id.positionId.toString(), row._id.candidateId.toString()),
          row.voteCount
        );
      }

      const approvedCandidates = await Candidate.find({ electionId: oId, isApproved: true })
        .populate('memberId', 'firstName lastName')
        .lean();

      const candidatesByPosition = new Map<string, any[]>();
      for (const c of approvedCandidates) {
        const pid = (c.positionId as any).toString();
        if (!candidatesByPosition.has(pid)) candidatesByPosition.set(pid, []);
        candidatesByPosition.get(pid)!.push(c);
      }

      return positions.map((pos: any) => {
        const pid = pos._id.toString();
        const cands = candidatesByPosition.get(pid) || [];
        const tallies = cands.map((c: any) => {
          const member = c.memberId as any;
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

    hasVoted: async (_: any, { electionId }: any, context: AuthContext) => {
      requireMemberAuth(context);
      const existing = await Vote.findOne({ electionId, voterId: context.member!.id });
      return !!existing;
    },

    checkMemberEligibility: async (_: any, { electionId }: any, context: AuthContext) => {
      requireMemberAuth(context);
      const memberId = context.member!.id;

      const election = await Election.findById(electionId);
      if (!election) throw new Error('Election not found');

      const member = await Member.findById(memberId);
      if (!member) throw new Error('Member not found');

      const reasons: string[] = [];

      if (election.status !== 'active') {
        reasons.push('This election is not currently active');
      }

      const now = new Date();
      if ((election as any).votingStartDate && now < new Date((election as any).votingStartDate)) {
        reasons.push('Voting has not started yet');
      }
      if ((election as any).votingEndDate && now > new Date((election as any).votingEndDate)) {
        reasons.push('Voting period has ended');
      }

      if ((election as any).eligibilityMinYears && (election as any).eligibilityMinYears > 0) {
        const memberYear = (member as any).membershipYear || new Date().getFullYear();
        const yearsAsMember = new Date().getFullYear() - memberYear;
        if (yearsAsMember < (election as any).eligibilityMinYears) {
          reasons.push(`You must have been a member for at least ${(election as any).eligibilityMinYears} year(s) to vote`);
        }
      }

      if ((election as any).requiresDuesPayment) {
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
    castVote: async (_: any, { data }: { data: any }, context: AuthContext) => {
      requireMemberAuth(context);
      const memberId = context.member!.id;
      const { electionId, votes } = data;

      const election = await Election.findById(electionId);
      if (!election) throw new Error('Election not found');
      if (election.status !== 'active') throw new Error('Voting is not currently open');

      const now = new Date();
      if ((election as any).votingStartDate && now < new Date((election as any).votingStartDate)) {
        throw new Error('Voting has not started yet');
      }
      if ((election as any).votingEndDate && now > new Date((election as any).votingEndDate)) {
        throw new Error('Voting has ended');
      }

      const member = await Member.findById(memberId);
      if (!member) throw new Error('Member not found');

      if ((election as any).eligibilityMinYears && (election as any).eligibilityMinYears > 0) {
        const memberYear = (member as any).membershipYear || new Date().getFullYear();
        const yearsAsMember = new Date().getFullYear() - memberYear;
        if (yearsAsMember < (election as any).eligibilityMinYears) {
          throw new Error(`You must have been a member for at least ${(election as any).eligibilityMinYears} year(s) to vote`);
        }
      }

      if ((election as any).requiresDuesPayment) {
        const currentYear = new Date().getFullYear();
        const paid = await Payment.findOne({
          memberId,
          year: currentYear,
          $or: [{ status: 'successful' }, { status: 'completed' }],
        });
        if (!paid) throw new Error(`You must have paid dues for ${currentYear} to be eligible to vote`);
      }

      const alreadyVoted = await Vote.findOne({ electionId, voterId: memberId });
      if (alreadyVoted) throw new Error('You have already voted in this election');

      for (const { positionId, candidateId } of votes) {
        const candidate = await Candidate.findOne({
          _id: candidateId,
          electionId,
          positionId,
          isApproved: true,
        });
        if (!candidate) throw new Error(`Candidate not found or not on the ballot for this position`);

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
