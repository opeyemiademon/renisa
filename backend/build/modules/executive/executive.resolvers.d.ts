import { AuthContext } from '../../middleware/auth.js';
declare const executiveResolvers: {
    Executive: {
        photo: (parent: any) => any;
        title: (parent: any) => any;
        displayOrder: (parent: any) => any;
        member: (parent: any) => any;
    };
    Query: {
        getAllExecutives: (_: any, { isActive }: any) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            isActive: boolean;
            order: number;
            position: string;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            memberId?: import("mongoose").Types.ObjectId | null | undefined;
            tenure?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            isActive: boolean;
            order: number;
            position: string;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            memberId?: import("mongoose").Types.ObjectId | null | undefined;
            tenure?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getExecutive: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            isActive: boolean;
            order: number;
            position: string;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            memberId?: import("mongoose").Types.ObjectId | null | undefined;
            tenure?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            isActive: boolean;
            order: number;
            position: string;
            profilePicture?: string | null | undefined;
            bio?: string | null | undefined;
            memberId?: import("mongoose").Types.ObjectId | null | undefined;
            tenure?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        createExecutive: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                name: string;
                isActive: boolean;
                order: number;
                position: string;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                tenure?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                isActive: boolean;
                order: number;
                position: string;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                tenure?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        }>;
        updateExecutive: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                isActive: boolean;
                order: number;
                position: string;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                tenure?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                isActive: boolean;
                order: number;
                position: string;
                profilePicture?: string | null | undefined;
                bio?: string | null | undefined;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                tenure?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        deleteExecutive: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
        reorderExecutives: (_: any, { items }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default executiveResolvers;
//# sourceMappingURL=executive.resolvers.d.ts.map