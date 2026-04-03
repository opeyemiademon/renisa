import { AuthContext } from '../../middleware/auth.js';
declare const paymentTypeResolvers: {
    Query: {
        getAllPaymentTypes: (_: any, { isActive }: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            isActive: boolean;
            amount: number;
            currency: string;
            isRecurring: boolean;
            frequency: "annual" | "quarterly" | "monthly" | "one-time";
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            dueDate?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            isActive: boolean;
            amount: number;
            currency: string;
            isRecurring: boolean;
            frequency: "annual" | "quarterly" | "monthly" | "one-time";
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            dueDate?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getPaymentType: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            name: string;
            isActive: boolean;
            amount: number;
            currency: string;
            isRecurring: boolean;
            frequency: "annual" | "quarterly" | "monthly" | "one-time";
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            dueDate?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            name: string;
            isActive: boolean;
            amount: number;
            currency: string;
            isRecurring: boolean;
            frequency: "annual" | "quarterly" | "monthly" | "one-time";
            description?: string | null | undefined;
            createdBy?: import("mongoose").Types.ObjectId | null | undefined;
            dueDate?: NativeDate | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        createPaymentType: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                isActive: boolean;
                amount: number;
                currency: string;
                isRecurring: boolean;
                frequency: "annual" | "quarterly" | "monthly" | "one-time";
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                dueDate?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                isActive: boolean;
                amount: number;
                currency: string;
                isRecurring: boolean;
                frequency: "annual" | "quarterly" | "monthly" | "one-time";
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                dueDate?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        updatePaymentType: (_: any, { id, data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                name: string;
                isActive: boolean;
                amount: number;
                currency: string;
                isRecurring: boolean;
                frequency: "annual" | "quarterly" | "monthly" | "one-time";
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                dueDate?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                name: string;
                isActive: boolean;
                amount: number;
                currency: string;
                isRecurring: boolean;
                frequency: "annual" | "quarterly" | "monthly" | "one-time";
                description?: string | null | undefined;
                createdBy?: import("mongoose").Types.ObjectId | null | undefined;
                dueDate?: NativeDate | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        deletePaymentType: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
export default paymentTypeResolvers;
//# sourceMappingURL=paymentType.resolvers.d.ts.map