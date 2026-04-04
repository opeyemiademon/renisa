import mongoose from 'mongoose';
import { AuthContext } from '../../middleware/auth.js';
declare const voteResolvers: {
    Query: {
        getElectionResults: (_: any, { electionId }: any, context: AuthContext) => Promise<{
            candidateId: any;
            candidateName: any;
            positionId: any;
            positionTitle: string;
            voteCount: any;
        }[]>;
        hasVoted: (_: any, { electionId, positionId }: any, context: AuthContext) => Promise<boolean>;
    };
    Mutation: {
        castVote: (_: any, { electionId, positionId, candidateId }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: mongoose.Document<unknown, {}, {
                electionId: mongoose.Types.ObjectId;
                positionId: mongoose.Types.ObjectId;
                voterId: mongoose.Types.ObjectId;
                candidateId: mongoose.Types.ObjectId;
                votedAt: NativeDate;
            } & mongoose.DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                electionId: mongoose.Types.ObjectId;
                positionId: mongoose.Types.ObjectId;
                voterId: mongoose.Types.ObjectId;
                candidateId: mongoose.Types.ObjectId;
                votedAt: NativeDate;
            } & mongoose.DefaultTimestampProps & {
                _id: mongoose.Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
    };
};
export default voteResolvers;
//# sourceMappingURL=vote.resolvers.d.ts.map