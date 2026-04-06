import { AuthContext } from '../../middleware/auth.js';
declare const paymentResolvers: {
    Payment: {
        member: (parent: any) => any;
        paymentType: (parent: any) => any;
        reference: (parent: any) => any;
        method: (parent: any) => any;
    };
    Query: {
        getAllPayments: (_: any, { memberId, status, year, paymentTypeId, dateFrom, dateTo, reference }: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            year: number;
            status: "pending" | "successful" | "failed" | "reversed";
            memberId: import("mongoose").Types.ObjectId;
            amount: number;
            transactionRef: string;
            paymentTypeId: import("mongoose").Types.ObjectId;
            paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
            paystackRef?: string | null | undefined;
            paystackData?: any;
            paidAt?: NativeDate | null | undefined;
            notes?: string | null | undefined;
            processedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            year: number;
            status: "pending" | "successful" | "failed" | "reversed";
            memberId: import("mongoose").Types.ObjectId;
            amount: number;
            transactionRef: string;
            paymentTypeId: import("mongoose").Types.ObjectId;
            paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
            paystackRef?: string | null | undefined;
            paystackData?: any;
            paidAt?: NativeDate | null | undefined;
            notes?: string | null | undefined;
            processedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getMemberPayments: (_: any, { memberId }: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            year: number;
            status: "pending" | "successful" | "failed" | "reversed";
            memberId: import("mongoose").Types.ObjectId;
            amount: number;
            transactionRef: string;
            paymentTypeId: import("mongoose").Types.ObjectId;
            paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
            paystackRef?: string | null | undefined;
            paystackData?: any;
            paidAt?: NativeDate | null | undefined;
            notes?: string | null | undefined;
            processedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            year: number;
            status: "pending" | "successful" | "failed" | "reversed";
            memberId: import("mongoose").Types.ObjectId;
            amount: number;
            transactionRef: string;
            paymentTypeId: import("mongoose").Types.ObjectId;
            paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
            paystackRef?: string | null | undefined;
            paystackData?: any;
            paidAt?: NativeDate | null | undefined;
            notes?: string | null | undefined;
            processedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getPayment: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            year: number;
            status: "pending" | "successful" | "failed" | "reversed";
            memberId: import("mongoose").Types.ObjectId;
            amount: number;
            transactionRef: string;
            paymentTypeId: import("mongoose").Types.ObjectId;
            paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
            paystackRef?: string | null | undefined;
            paystackData?: any;
            paidAt?: NativeDate | null | undefined;
            notes?: string | null | undefined;
            processedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            year: number;
            status: "pending" | "successful" | "failed" | "reversed";
            memberId: import("mongoose").Types.ObjectId;
            amount: number;
            transactionRef: string;
            paymentTypeId: import("mongoose").Types.ObjectId;
            paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
            paystackRef?: string | null | undefined;
            paystackData?: any;
            paidAt?: NativeDate | null | undefined;
            notes?: string | null | undefined;
            processedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        initiatePayment: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            authorizationUrl: any;
            transactionRef: string;
            reference: string;
            paymentId: string;
        }>;
        verifyPayment: (_: any, { reference }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                year: number;
                status: "pending" | "successful" | "failed" | "reversed";
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                transactionRef: string;
                paymentTypeId: import("mongoose").Types.ObjectId;
                paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
                paystackRef?: string | null | undefined;
                paystackData?: any;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                processedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                year: number;
                status: "pending" | "successful" | "failed" | "reversed";
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                transactionRef: string;
                paymentTypeId: import("mongoose").Types.ObjectId;
                paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
                paystackRef?: string | null | undefined;
                paystackData?: any;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                processedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        }>;
        deletePayment: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: null;
        }>;
        recordPaystackPayment: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                year: number;
                status: "pending" | "successful" | "failed" | "reversed";
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                transactionRef: string;
                paymentTypeId: import("mongoose").Types.ObjectId;
                paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
                paystackRef?: string | null | undefined;
                paystackData?: any;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                processedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                year: number;
                status: "pending" | "successful" | "failed" | "reversed";
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                transactionRef: string;
                paymentTypeId: import("mongoose").Types.ObjectId;
                paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
                paystackRef?: string | null | undefined;
                paystackData?: any;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                processedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        }>;
        submitManualPayment: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                year: number;
                status: "pending" | "successful" | "failed" | "reversed";
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                transactionRef: string;
                paymentTypeId: import("mongoose").Types.ObjectId;
                paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
                paystackRef?: string | null | undefined;
                paystackData?: any;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                processedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                year: number;
                status: "pending" | "successful" | "failed" | "reversed";
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                transactionRef: string;
                paymentTypeId: import("mongoose").Types.ObjectId;
                paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
                paystackRef?: string | null | undefined;
                paystackData?: any;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                processedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        adminRecordPayment: (_: any, { data }: {
            data: any;
        }, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                year: number;
                status: "pending" | "successful" | "failed" | "reversed";
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                transactionRef: string;
                paymentTypeId: import("mongoose").Types.ObjectId;
                paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
                paystackRef?: string | null | undefined;
                paystackData?: any;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                processedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                year: number;
                status: "pending" | "successful" | "failed" | "reversed";
                memberId: import("mongoose").Types.ObjectId;
                amount: number;
                transactionRef: string;
                paymentTypeId: import("mongoose").Types.ObjectId;
                paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
                paystackRef?: string | null | undefined;
                paystackData?: any;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                processedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        }>;
    };
};
export default paymentResolvers;
//# sourceMappingURL=payment.resolvers.d.ts.map