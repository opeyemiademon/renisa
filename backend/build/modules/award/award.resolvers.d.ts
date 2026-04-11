import { AuthContext } from '../../middleware/auth.js';
declare const awardResolvers: {
    Award: {
        recipientName: (parent: any) => string;
        recipientPhoto: (parent: any) => any;
        title: (parent: any) => any;
        category: (parent: any) => any;
        member: (parent: any) => any;
        totalVotes: (parent: any) => Promise<number>;
    };
    Query: {
        getAllAwards: (_: any, { year, status, categoryId, votingEnabled, memberName, memberId, limit }: any) => Promise<any>;
        getAward: (_: any, { id }: {
            id: string;
        }) => Promise<any>;
    };
    Mutation: {
        createAward: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        updateAward: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
        deleteAward: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
        enableAwardVoting: (_: any, { id, votingStartDate, votingEndDate }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: any;
        }>;
    };
};
export default awardResolvers;
//# sourceMappingURL=award.resolvers.d.ts.map