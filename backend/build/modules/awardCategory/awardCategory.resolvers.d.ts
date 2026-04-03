import { AuthContext } from '../../middleware/auth.js';
declare const awardCategoryResolvers: {
    Query: {
        getAllAwardCategories: (_: any, { isActive }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            isActive: boolean;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            icon?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            isActive: boolean;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            icon?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getAwardCategory: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            isActive: boolean;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            icon?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            isActive: boolean;
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            icon?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        createAwardCategory: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                isActive: boolean;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                icon?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                isActive: boolean;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                icon?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updateAwardCategory: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                isActive: boolean;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                icon?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                isActive: boolean;
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                icon?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        deleteAwardCategory: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default awardCategoryResolvers;
//# sourceMappingURL=awardCategory.resolvers.d.ts.map