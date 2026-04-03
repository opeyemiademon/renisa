import { AuthContext } from '../../middleware/auth.js';
declare const leadershipResolvers: {
    Leadership: {
        name: (parent: any) => any;
        profilePicture: (parent: any) => any;
        photo: (parent: any) => any;
        title: (parent: any) => any;
        group: (parent: any) => any;
        member: (parent: any) => any;
    };
    Query: {
        getAllLeadership: (_: any, { groupId, groupSlug, isCurrent, state }: any) => Promise<any>;
        getLeadership: (_: any, { id }: {
            id: string;
        }) => Promise<any>;
    };
    Mutation: {
        createLeadership: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        updateLeadership: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        deleteLeadership: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
        reorderLeadership: (_: any, { items }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
        markLeadershipInactive: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
    };
};
export default leadershipResolvers;
//# sourceMappingURL=leadership.resolvers.d.ts.map