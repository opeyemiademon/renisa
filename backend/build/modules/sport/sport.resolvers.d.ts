import { AuthContext } from '../../middleware/auth.js';
declare const sportResolvers: {
    Query: {
        getSports: (_: any, { activeOnly }: {
            activeOnly?: boolean;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            isActive: boolean;
            order: number;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            isActive: boolean;
            order: number;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
    };
    Mutation: {
        createSport: (_: any, { name }: {
            name: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                isActive: boolean;
                order: number;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                isActive: boolean;
                order: number;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updateSport: (_: any, { id, name, isActive }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                isActive: boolean;
                order: number;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                isActive: boolean;
                order: number;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        deleteSport: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
        reorderSports: (_: any, { ids }: {
            ids: string[];
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default sportResolvers;
//# sourceMappingURL=sport.resolvers.d.ts.map