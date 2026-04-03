import { AuthContext } from '../../middleware/auth.js';
declare const userResolvers: {
    Query: {
        getAllUsers: (_: any, __: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            email: string;
            password: string;
            role: "superadmin" | "admin" | "content_manager";
            isActive: boolean;
            lastLogin?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            email: string;
            password: string;
            role: "superadmin" | "admin" | "content_manager";
            isActive: boolean;
            lastLogin?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getUser: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            email: string;
            password: string;
            role: "superadmin" | "admin" | "content_manager";
            isActive: boolean;
            lastLogin?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            email: string;
            password: string;
            role: "superadmin" | "admin" | "content_manager";
            isActive: boolean;
            lastLogin?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
        meAdmin: (_: any, __: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            email: string;
            password: string;
            role: "superadmin" | "admin" | "content_manager";
            isActive: boolean;
            lastLogin?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            email: string;
            password: string;
            role: "superadmin" | "admin" | "content_manager";
            isActive: boolean;
            lastLogin?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        createAdminUser: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                email: string;
                password: string;
                role: "superadmin" | "admin" | "content_manager";
                isActive: boolean;
                lastLogin?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                email: string;
                password: string;
                role: "superadmin" | "admin" | "content_manager";
                isActive: boolean;
                lastLogin?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        loginAdmin: (_: any, { data }: {
            data: any;
        }) => Promise<{
            token: string;
            user: import("mongoose").Document<unknown, {}, {
                name: string;
                email: string;
                password: string;
                role: "superadmin" | "admin" | "content_manager";
                isActive: boolean;
                lastLogin?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                email: string;
                password: string;
                role: "superadmin" | "admin" | "content_manager";
                isActive: boolean;
                lastLogin?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updateAdminUser: (_: any, { id, data }: {
            id: string;
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                email: string;
                password: string;
                role: "superadmin" | "admin" | "content_manager";
                isActive: boolean;
                lastLogin?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                email: string;
                password: string;
                role: "superadmin" | "admin" | "content_manager";
                isActive: boolean;
                lastLogin?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        deleteAdminUser: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default userResolvers;
//# sourceMappingURL=user.resolvers.d.ts.map