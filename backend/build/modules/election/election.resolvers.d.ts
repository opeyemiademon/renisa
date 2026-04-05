import { AuthContext } from '../../middleware/auth.js';
declare const electionResolvers: {
    Query: {
        getAllElections: (_: any, __: any, context: AuthContext) => Promise<any>;
        getElection: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<any>;
    };
    Mutation: {
        createElection: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        updateElection: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        updateElectionStatus: (_: any, { id, status }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        addElectoralPosition: (_: any, { electionId, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        deleteElection: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default electionResolvers;
//# sourceMappingURL=election.resolvers.d.ts.map