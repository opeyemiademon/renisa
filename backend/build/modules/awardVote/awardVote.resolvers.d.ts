import mongoose from 'mongoose';
import { AuthContext } from '../../middleware/auth.js';
declare const awardVoteResolvers: {
    Query: {
        getAwardVoteResults: (_: any, { awardId }: any) => Promise<{
            awardId: any;
            recipientName: string;
            categoryName: any;
            voteCount: any;
        }[]>;
        getAwardWinnersReport: (_: any, { year }: {
            year?: number;
        }) => Promise<any[]>;
        hasVotedForAward: (_: any, { awardId }: any, context: AuthContext) => Promise<boolean>;
        getMyAwardVotes: (_: any, { year }: {
            year?: number;
        }, context: AuthContext) => Promise<any[]>;
    };
    Mutation: {
        castAwardVote: (_: any, { awardId }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: mongoose.Document<unknown, {}, {
                voterId: mongoose.Types.ObjectId;
                votedAt: NativeDate;
                awardId: mongoose.Types.ObjectId;
            } & mongoose.DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                voterId: mongoose.Types.ObjectId;
                votedAt: NativeDate;
                awardId: mongoose.Types.ObjectId;
            } & mongoose.DefaultTimestampProps & {
                _id: mongoose.Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
    };
};
export default awardVoteResolvers;
//# sourceMappingURL=awardVote.resolvers.d.ts.map