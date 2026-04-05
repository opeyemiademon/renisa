import { AuthContext } from '../../middleware/auth.js';
declare const electionApplicationResolvers: {
    Query: {
        getElectionApplications: (_: any, { electionId }: any, context: AuthContext) => Promise<any>;
        getMyApplications: (_: any, __: any, context: AuthContext) => Promise<any>;
        getMyApplicationForElection: (_: any, { electionId }: any, context: AuthContext) => Promise<any>;
        getApplicationsByPosition: (_: any, { positionId }: any, context: AuthContext) => Promise<any>;
        getPendingApplications: (_: any, { electionId }: any, context: AuthContext) => Promise<any>;
    };
    Mutation: {
        submitApplication: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        updateApplicationPayment: (_: any, { applicationId, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        confirmApplicationPaystackPayment: (_: any, { applicationId, reference, amount }: {
            applicationId: string;
            reference: string;
            amount: number;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        approveApplication: (_: any, { data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        rejectApplication: (_: any, { data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        deleteApplication: (_: any, { applicationId }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default electionApplicationResolvers;
//# sourceMappingURL=electionApplication.resolvers.d.ts.map