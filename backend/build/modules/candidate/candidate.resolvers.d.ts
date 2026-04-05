import { AuthContext } from '../../middleware/auth.js';
declare const candidateResolvers: {
    Candidate: {
        member: (parent: any) => any;
        position: (parent: any) => any;
        status: (parent: any) => "approved" | "rejected" | "paid" | "manual_pending" | "submitted" | "unpaid";
    };
    Query: {
        getCandidates: (_: any, { electionId, positionId }: any) => Promise<any>;
        getCandidate: (_: any, { id }: {
            id: string;
        }) => Promise<any>;
        getBallotCandidates: (_: any, { electionId }: any, context: AuthContext) => Promise<any>;
    };
    Mutation: {
        applyForPosition: (_: any, { electionId, positionId }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
            candidateId: string;
        }>;
        confirmCandidateFormPayment: (_: any, { candidateId, reference }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        manualCandidateFormPayment: (_: any, { candidateId, referenceNumber, notes }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        submitCandidacy: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        approveCandidate: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        rejectCandidate: (_: any, { id, reason }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
    };
};
export default candidateResolvers;
//# sourceMappingURL=candidate.resolvers.d.ts.map