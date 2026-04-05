import { AuthContext } from '../../middleware/auth.js';
declare const voteResolvers: {
    Query: {
        getElectionResults: (_: any, { electionId }: any, context: AuthContext) => Promise<{
            positionId: any;
            positionTitle: any;
            totalVotes: number;
            candidates: {
                candidateId: any;
                candidateName: string;
                voteCount: number;
                percentage: number;
            }[];
        }[]>;
        hasVoted: (_: any, { electionId }: any, context: AuthContext) => Promise<boolean>;
        checkMemberEligibility: (_: any, { electionId }: any, context: AuthContext) => Promise<{
            eligible: boolean;
            reasons: string[];
        }>;
    };
    Mutation: {
        castVote: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default voteResolvers;
//# sourceMappingURL=vote.resolvers.d.ts.map