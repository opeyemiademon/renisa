import { AuthContext } from '../../middleware/auth.js';
declare const contactMessageResolvers: {
    Query: {
        getContactMessages: (_: any, __: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            email: string;
            message: string;
            subject: string;
            read: boolean;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            email: string;
            message: string;
            subject: string;
            read: boolean;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getContactMessage: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            email: string;
            message: string;
            subject: string;
            read: boolean;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            email: string;
            message: string;
            subject: string;
            read: boolean;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        submitContactMessage: (_: any, { data }: {
            data: any;
        }) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                email: string;
                message: string;
                subject: string;
                read: boolean;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                email: string;
                message: string;
                subject: string;
                read: boolean;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        markContactMessageRead: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                email: string;
                message: string;
                subject: string;
                read: boolean;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                email: string;
                message: string;
                subject: string;
                read: boolean;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
    };
};
export default contactMessageResolvers;
//# sourceMappingURL=contactMessage.resolvers.d.ts.map