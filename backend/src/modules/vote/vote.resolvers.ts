import Vote from './vote.model.js';
import Election from '../election/election.model.js';
import Candidate from '../candidate/candidate.model.js';
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

      const positionMap = new Map<string, string>();
      for (const pos of election.positions as any[]) {
        positionMap.set(pos._id.toString(), pos.title);
      }

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
          $group: {
            _id: { candidateId: '$candidateId', positionId: '$positionId' },
            candidateName: { $first: { $concat: ['$member.firstName', ' ', '$member.lastName'] } },
            voteCount: { $sum: 1 },
          },
        },
        { $sort: { '_id.positionId': 1, voteCount: -1 } },
      ]);

      return results.map((r: any) => ({
        candidateId: r._id.candidateId.toString(),
        candidateName: r.candidateName || 'Unknown',
        positionId: r._id.positionId.toString(),
        positionTitle: positionMap.get(r._id.positionId.toString()) || 'Unknown Position',
        voteCount: r.voteCount,
      }));
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
        const candidate = await Candidate.findOne({ _id: candidateId, electionId, positionId });
        if (!candidate) throw new Error(`Candidate not found for position ${positionId}`);

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
