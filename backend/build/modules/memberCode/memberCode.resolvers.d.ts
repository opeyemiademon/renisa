import { AuthContext } from '../../middleware/auth.js';
declare const memberCodeResolvers: {
    Query: {
        getAllMemberCodes: (_: any, { batchName, isUsed }: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            code: string;
            isUsed: boolean;
            usedBy?: import("mongoose").Types.ObjectId | null | undefined;
            usedAt?: NativeDate | null | undefined;
            generatedBy?: import("mongoose").Types.ObjectId | null | undefined;
            expiresAt?: NativeDate | null | undefined;
            batchName?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            code: string;
            isUsed: boolean;
            usedBy?: import("mongoose").Types.ObjectId | null | undefined;
            usedAt?: NativeDate | null | undefined;
            generatedBy?: import("mongoose").Types.ObjectId | null | undefined;
            expiresAt?: NativeDate | null | undefined;
            batchName?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getMemberCode: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            code: string;
            isUsed: boolean;
            usedBy?: import("mongoose").Types.ObjectId | null | undefined;
            usedAt?: NativeDate | null | undefined;
            generatedBy?: import("mongoose").Types.ObjectId | null | undefined;
            expiresAt?: NativeDate | null | undefined;
            batchName?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            code: string;
            isUsed: boolean;
            usedBy?: import("mongoose").Types.ObjectId | null | undefined;
            usedAt?: NativeDate | null | undefined;
            generatedBy?: import("mongoose").Types.ObjectId | null | undefined;
            expiresAt?: NativeDate | null | undefined;
            batchName?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        generateMemberCodes: (_: any, { count, batchName, expiresAt }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            codes: string[];
        }>;
        deleteMemberCode: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default memberCodeResolvers;
//# sourceMappingURL=memberCode.resolvers.d.ts.map