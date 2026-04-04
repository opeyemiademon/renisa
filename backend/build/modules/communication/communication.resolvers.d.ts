import { AuthContext } from '../../middleware/auth.js';
declare const communicationResolvers: {
    Query: {
        getAllCommunications: (_: any, { page, limit }: any, context: AuthContext) => Promise<{
            communications: (import("mongoose").Document<unknown, {}, {
                type: "email" | "sms" | "both";
                message: string;
                subject: string;
                status: "pending" | "failed" | "sent";
                recipients: "state" | "active" | "all" | "specific";
                specificMembers: import("mongoose").Types.ObjectId[];
                sentCount: number;
                failedCount: number;
                filterState?: string | null | undefined;
                sentBy?: import("mongoose").Types.ObjectId | null | undefined;
                sentAt?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                type: "email" | "sms" | "both";
                message: string;
                subject: string;
                status: "pending" | "failed" | "sent";
                recipients: "state" | "active" | "all" | "specific";
                specificMembers: import("mongoose").Types.ObjectId[];
                sentCount: number;
                failedCount: number;
                filterState?: string | null | undefined;
                sentBy?: import("mongoose").Types.ObjectId | null | undefined;
                sentAt?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            total: number;
            page: any;
            limit: any;
        }>;
        getCommunication: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            type: "email" | "sms" | "both";
            message: string;
            subject: string;
            status: "pending" | "failed" | "sent";
            recipients: "state" | "active" | "all" | "specific";
            specificMembers: import("mongoose").Types.ObjectId[];
            sentCount: number;
            failedCount: number;
            filterState?: string | null | undefined;
            sentBy?: import("mongoose").Types.ObjectId | null | undefined;
            sentAt?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            type: "email" | "sms" | "both";
            message: string;
            subject: string;
            status: "pending" | "failed" | "sent";
            recipients: "state" | "active" | "all" | "specific";
            specificMembers: import("mongoose").Types.ObjectId[];
            sentCount: number;
            failedCount: number;
            filterState?: string | null | undefined;
            sentBy?: import("mongoose").Types.ObjectId | null | undefined;
            sentAt?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        sendCommunication: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                type: "email" | "sms" | "both";
                message: string;
                subject: string;
                status: "pending" | "failed" | "sent";
                recipients: "state" | "active" | "all" | "specific";
                specificMembers: import("mongoose").Types.ObjectId[];
                sentCount: number;
                failedCount: number;
                filterState?: string | null | undefined;
                sentBy?: import("mongoose").Types.ObjectId | null | undefined;
                sentAt?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                type: "email" | "sms" | "both";
                message: string;
                subject: string;
                status: "pending" | "failed" | "sent";
                recipients: "state" | "active" | "all" | "specific";
                specificMembers: import("mongoose").Types.ObjectId[];
                sentCount: number;
                failedCount: number;
                filterState?: string | null | undefined;
                sentBy?: import("mongoose").Types.ObjectId | null | undefined;
                sentAt?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        }>;
    };
};
export default communicationResolvers;
//# sourceMappingURL=communication.resolvers.d.ts.map