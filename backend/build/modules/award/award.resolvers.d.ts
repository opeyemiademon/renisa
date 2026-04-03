import { AuthContext } from '../../middleware/auth.js';
declare const awardResolvers: {
    Award: {
        totalVotes: (parent: any) => Promise<number>;
    };
    Query: {
        getAllAwards: (_: any, { year, status, categoryId, votingEnabled }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            year: number;
            status: "voting" | "nominated" | "awarded";
            memberId: import("mongoose").Types.ObjectId;
            categoryId: import("mongoose").Types.ObjectId;
            votingEnabled: boolean;
            votingStartDate?: NativeDate | null | undefined;
            votingEndDate?: NativeDate | null | undefined;
            image?: string | null | undefined;
            nominatedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            year: number;
            status: "voting" | "nominated" | "awarded";
            memberId: import("mongoose").Types.ObjectId;
            categoryId: import("mongoose").Types.ObjectId;
            votingEnabled: boolean;
            votingStartDate?: NativeDate | null | undefined;
            votingEndDate?: NativeDate | null | undefined;
            image?: string | null | undefined;
            nominatedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
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