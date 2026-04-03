import AwardVote from './awardVote.model.js';
import Award from '../award/award.model.js';
import mongoose from 'mongoose';
import { requireMemberAuth, AuthContext } from '../../middleware/auth.js';

const awardVoteResolvers = {
  Query: {
    getAwardVoteResults: async (_: any, { awardId }: any) => {
      const match: any = {};
      if (awardId) match.awardId = new mongoose.Types.ObjectId(awardId);
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
        { $sort: { voteCount: -1 } },
      ]);
      return results.map((r: any) => ({
        awardId: r._id.toString(),
        awardTitle: r.award.awardTitle,
        voteCount: r.voteCount,
      }));
    },

    hasVotedForAward: async (_: any, { awardId }: any, context: AuthContext) => {
      requireMemberAuth(context);
      const vote = await AwardVote.findOne({ awardId, voterId: context.member!.id });
      return !!vote;
    },
  },

  Mutation: {
    castAwardVote: async (_: any, { awardId }: any, context: AuthContext) => {
      requireMemberAuth(context);
      const award = await Award.findById(awardId);
      if (!award) throw new Error('Award not found');
      if (!award.votingEnabled || award.status !== 'voting') throw new Error('Voting is not currently enabled for this award');

      const now = new Date();
      if (award.votingStartDate && now < new Date(award.votingStartDate)) {
        throw new Error('Voting has not started yet');
      }
      if (award.votingEndDate && now > new Date(award.votingEndDate)) {
        throw new Error('Voting has ended');
      }

      const existing = await AwardVote.findOne({ awardId, voterId: context.member!.id });
      if (existing) throw new Error('You have already voted for this award');

      const vote = await AwardVote.create({
        awardId,
        voterId: context.member!.id,
        votedAt: new Date(),
      });

      return { success: true, message: 'Vote cast successfully', data: vote };
    },
  },
};

export default awardVoteResolvers;
