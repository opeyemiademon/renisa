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