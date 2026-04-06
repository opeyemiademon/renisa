import { AuthContext } from '../../middleware/auth.js';
declare const donationResolvers: {
    Donation: {
        member: (parent: any) => any;
        donationType: (parent: any) => any;
        invoice: (parent: any) => any;
        isAcknowledged: (parent: any) => boolean;
        isMonetary: (parent: any) => boolean;
        items: (parent: any) => any;
        description: (parent: any) => any;
        acknowledgedAt: (parent: any) => any;
        preferredDropoffDate: (parent: any) => string | null;
        currency: (parent: any) => any;
    };
    Query: {
        getAllDonations: (_: any, { status, donationMode }: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            status: "pending" | "completed" | "received" | "acknowledged";
            currency: string;
            paymentStatus: "pending" | "successful" | "failed";
            donationMode: "physical" | "monetary";
            donorName: string;
            donationTypeId: import("mongoose").Types.ObjectId;
            memberId?: import("mongoose").Types.ObjectId | null | undefined;
            amount?: number | null | undefined;
            paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
            paystackRef?: string | null | undefined;
            paidAt?: NativeDate | null | undefined;
            notes?: string | null | undefined;
            donorEmail?: string | null | undefined;
            donorPhone?: string | null | undefined;
            donorAddress?: string | null | undefined;
            donorCity?: string | null | undefined;
            donorState?: string | null | undefined;
            physicalItems?: string | null | undefined;
            quantity?: number | null | undefined;
            estimatedValue?: number | null | undefined;
            preferredDropoffDate?: NativeDate | null | undefined;
            invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
            manualTransferReference?: string | null | undefined;
            adminNotes?: string | null | undefined;
            acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            status: "pending" | "completed" | "received" | "acknowledged";
            currency: string;
            paymentStatus: "pending" | "successful" | "failed";
            donationMode: "physical" | "monetary";
            donorName: string;
            donationTypeId: import("mongoose").Types.ObjectId;
            memberId?: import("mongoose").Types.ObjectId | null | undefined;
            amount?: number | null | undefined;
            paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
            paystackRef?: string | null | undefined;
            paidAt?: NativeDate | null | undefined;
            notes?: string | null | undefined;
            donorEmail?: string | null | undefined;
            donorPhone?: string | null | undefined;
            donorAddress?: string | null | undefined;
            donorCity?: string | null | undefined;
            donorState?: string | null | undefined;
            physicalItems?: string | null | undefined;
            quantity?: number | null | undefined;
            estimatedValue?: number | null | undefined;
            preferredDropoffDate?: NativeDate | null | undefined;
            invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
            manualTransferReference?: string | null | undefined;
            adminNotes?: string | null | undefined;
            acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[]>;
        getDonation: (_: any, { id }: {
            id: string;
        }, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, {
            status: "pending" | "completed" | "received" | "acknowledged";
            currency: string;
            paymentStatus: "pending" | "successful" | "failed";
            donationMode: "physical" | "monetary";
            donorName: string;
            donationTypeId: import("mongoose").Types.ObjectId;
            memberId?: import("mongoose").Types.ObjectId | null | undefined;
            amount?: number | null | undefined;
            paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
            paystackRef?: string | null | undefined;
            paidAt?: NativeDate | null | undefined;
            notes?: string | null | undefined;
            donorEmail?: string | null | undefined;
            donorPhone?: string | null | undefined;
            donorAddress?: string | null | undefined;
            donorCity?: string | null | undefined;
            donorState?: string | null | undefined;
            physicalItems?: string | null | undefined;
            quantity?: number | null | undefined;
            estimatedValue?: number | null | undefined;
            preferredDropoffDate?: NativeDate | null | undefined;
            invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
            manualTransferReference?: string | null | undefined;
            adminNotes?: string | null | undefined;
            acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            status: "pending" | "completed" | "received" | "acknowledged";
            currency: string;
            paymentStatus: "pending" | "successful" | "failed";
            donationMode: "physical" | "monetary";
            donorName: string;
            donationTypeId: import("mongoose").Types.ObjectId;
            memberId?: import("mongoose").Types.ObjectId | null | undefined;
            amount?: number | null | undefined;
            paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
            paystackRef?: string | null | undefined;
            paidAt?: NativeDate | null | undefined;
            notes?: string | null | undefined;
            donorEmail?: string | null | undefined;
            donorPhone?: string | null | undefined;
            donorAddress?: string | null | undefined;
            donorCity?: string | null | undefined;
            donorState?: string | null | undefined;
            physicalItems?: string | null | undefined;
            quantity?: number | null | undefined;
            estimatedValue?: number | null | undefined;
            preferredDropoffDate?: NativeDate | null | undefined;
            invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
            manualTransferReference?: string | null | undefined;
            adminNotes?: string | null | undefined;
            acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        submitPhysicalDonation: (_: any, { data }: {
            data: any;
        }) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                status: "pending" | "completed" | "received" | "acknowledged";
                currency: string;
                paymentStatus: "pending" | "successful" | "failed";
                donationMode: "physical" | "monetary";
                donorName: string;
                donationTypeId: import("mongoose").Types.ObjectId;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                amount?: number | null | undefined;
                paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
                paystackRef?: string | null | undefined;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                donorEmail?: string | null | undefined;
                donorPhone?: string | null | undefined;
                donorAddress?: string | null | undefined;
                donorCity?: string | null | undefined;
                donorState?: string | null | undefined;
                physicalItems?: string | null | undefined;
                quantity?: number | null | undefined;
                estimatedValue?: number | null | undefined;
                preferredDropoffDate?: NativeDate | null | undefined;
                invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
                manualTransferReference?: string | null | undefined;
                adminNotes?: string | null | undefined;
                acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "pending" | "completed" | "received" | "acknowledged";
                currency: string;
                paymentStatus: "pending" | "successful" | "failed";
                donationMode: "physical" | "monetary";
                donorName: string;
                donationTypeId: import("mongoose").Types.ObjectId;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                amount?: number | null | undefined;
                paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
                paystackRef?: string | null | undefined;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                donorEmail?: string | null | undefined;
                donorPhone?: string | null | undefined;
                donorAddress?: string | null | undefined;
                donorCity?: string | null | undefined;
                donorState?: string | null | undefined;
                physicalItems?: string | null | undefined;
                quantity?: number | null | undefined;
                estimatedValue?: number | null | undefined;
                preferredDropoffDate?: NativeDate | null | undefined;
                invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
                manualTransferReference?: string | null | undefined;
                adminNotes?: string | null | undefined;
                acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
        initiateMonetaryDonation: (_: any, { data }: {
            data: any;
        }) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                status: "pending" | "completed" | "received" | "acknowledged";
                currency: string;
                paymentStatus: "pending" | "successful" | "failed";
                donationMode: "physical" | "monetary";
                donorName: string;
                donationTypeId: import("mongoose").Types.ObjectId;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                amount?: number | null | undefined;
                paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
                paystackRef?: string | null | undefined;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                donorEmail?: string | null | undefined;
                donorPhone?: string | null | undefined;
                donorAddress?: string | null | undefined;
                donorCity?: string | null | undefined;
                donorState?: string | null | undefined;
                physicalItems?: string | null | undefined;
                quantity?: number | null | undefined;
                estimatedValue?: number | null | undefined;
                preferredDropoffDate?: NativeDate | null | undefined;
                invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
                manualTransferReference?: string | null | undefined;
                adminNotes?: string | null | undefined;
                acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "pending" | "completed" | "received" | "acknowledged";
                currency: string;
                paymentStatus: "pending" | "successful" | "failed";
                donationMode: "physical" | "monetary";
                donorName: string;
                donationTypeId: import("mongoose").Types.ObjectId;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                amount?: number | null | undefined;
                paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
                paystackRef?: string | null | undefined;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                donorEmail?: string | null | undefined;
                donorPhone?: string | null | undefined;
                donorAddress?: string | null | undefined;
                donorCity?: string | null | undefined;
                donorState?: string | null | undefined;
                physicalItems?: string | null | undefined;
                quantity?: number | null | undefined;
                estimatedValue?: number | null | undefined;
                preferredDropoffDate?: NativeDate | null | undefined;
                invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
                manualTransferReference?: string | null | undefined;
                adminNotes?: string | null | undefined;
                acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
            authorizationUrl: string | undefined;
            invoiceNumber: string;
        }>;
        submitManualMonetaryDonation: (_: any, { data }: {
            data: any;
        }) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                status: "pending" | "completed" | "received" | "acknowledged";
                currency: string;
                paymentStatus: "pending" | "successful" | "failed";
                donationMode: "physical" | "monetary";
                donorName: string;
                donationTypeId: import("mongoose").Types.ObjectId;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                amount?: number | null | undefined;
                paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
                paystackRef?: string | null | undefined;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                donorEmail?: string | null | undefined;
                donorPhone?: string | null | undefined;
                donorAddress?: string | null | undefined;
                donorCity?: string | null | undefined;
                donorState?: string | null | undefined;
                physicalItems?: string | null | undefined;
                quantity?: number | null | undefined;
                estimatedValue?: number | null | undefined;
                preferredDropoffDate?: NativeDate | null | undefined;
                invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
                manualTransferReference?: string | null | undefined;
                adminNotes?: string | null | undefined;
                acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "pending" | "completed" | "received" | "acknowledged";
                currency: string;
                paymentStatus: "pending" | "successful" | "failed";
                donationMode: "physical" | "monetary";
                donorName: string;
                donationTypeId: import("mongoose").Types.ObjectId;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                amount?: number | null | undefined;
                paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
                paystackRef?: string | null | undefined;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                donorEmail?: string | null | undefined;
                donorPhone?: string | null | undefined;
                donorAddress?: string | null | undefined;
                donorCity?: string | null | undefined;
                donorState?: string | null | undefined;
                physicalItems?: string | null | undefined;
                quantity?: number | null | undefined;
                estimatedValue?: number | null | undefined;
                preferredDropoffDate?: NativeDate | null | undefined;
                invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
                manualTransferReference?: string | null | undefined;
                adminNotes?: string | null | undefined;
                acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
            authorizationUrl: string | undefined;
            invoiceNumber: string;
        }>;
        verifyDonationPayment: (_: any, { reference }: any) => Promise<{
            success: boolean;
            message: string;
            data: (import("mongoose").Document<unknown, {}, {
                status: "pending" | "completed" | "received" | "acknowledged";
                currency: string;
                paymentStatus: "pending" | "successful" | "failed";
                donationMode: "physical" | "monetary";
                donorName: string;
                donationTypeId: import("mongoose").Types.ObjectId;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                amount?: number | null | undefined;
                paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
                paystackRef?: string | null | undefined;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                donorEmail?: string | null | undefined;
                donorPhone?: string | null | undefined;
                donorAddress?: string | null | undefined;
                donorCity?: string | null | undefined;
                donorState?: string | null | undefined;
                physicalItems?: string | null | undefined;
                quantity?: number | null | undefined;
                estimatedValue?: number | null | undefined;
                preferredDropoffDate?: NativeDate | null | undefined;
                invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
                manualTransferReference?: string | null | undefined;
                adminNotes?: string | null | undefined;
                acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "pending" | "completed" | "received" | "acknowledged";
                currency: string;
                paymentStatus: "pending" | "successful" | "failed";
                donationMode: "physical" | "monetary";
                donorName: string;
                donationTypeId: import("mongoose").Types.ObjectId;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                amount?: number | null | undefined;
                paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
                paystackRef?: string | null | undefined;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                donorEmail?: string | null | undefined;
                donorPhone?: string | null | undefined;
                donorAddress?: string | null | undefined;
                donorCity?: string | null | undefined;
                donorState?: string | null | undefined;
                physicalItems?: string | null | undefined;
                quantity?: number | null | undefined;
                estimatedValue?: number | null | undefined;
                preferredDropoffDate?: NativeDate | null | undefined;
                invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
                manualTransferReference?: string | null | undefined;
                adminNotes?: string | null | undefined;
                acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        }>;
        acknowledgeDonation: (_: any, { id, adminNotes }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                status: "pending" | "completed" | "received" | "acknowledged";
                currency: string;
                paymentStatus: "pending" | "successful" | "failed";
                donationMode: "physical" | "monetary";
                donorName: string;
                donationTypeId: import("mongoose").Types.ObjectId;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                amount?: number | null | undefined;
                paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
                paystackRef?: string | null | undefined;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                donorEmail?: string | null | undefined;
                donorPhone?: string | null | undefined;
                donorAddress?: string | null | undefined;
                donorCity?: string | null | undefined;
                donorState?: string | null | undefined;
                physicalItems?: string | null | undefined;
                quantity?: number | null | undefined;
                estimatedValue?: number | null | undefined;
                preferredDropoffDate?: NativeDate | null | undefined;
                invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
                manualTransferReference?: string | null | undefined;
                adminNotes?: string | null | undefined;
                acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "pending" | "completed" | "received" | "acknowledged";
                currency: string;
                paymentStatus: "pending" | "successful" | "failed";
                donationMode: "physical" | "monetary";
                donorName: string;
                donationTypeId: import("mongoose").Types.ObjectId;
                memberId?: import("mongoose").Types.ObjectId | null | undefined;
                amount?: number | null | undefined;
                paymentMethod?: "paystack" | "bank_transfer" | null | undefined;
                paystackRef?: string | null | undefined;
                paidAt?: NativeDate | null | undefined;
                notes?: string | null | undefined;
                donorEmail?: string | null | undefined;
                donorPhone?: string | null | undefined;
                donorAddress?: string | null | undefined;
                donorCity?: string | null | undefined;
                donorState?: string | null | undefined;
                physicalItems?: string | null | undefined;
                quantity?: number | null | undefined;
                estimatedValue?: number | null | undefined;
                preferredDropoffDate?: NativeDate | null | undefined;
                invoiceId?: import("mongoose").Types.ObjectId | null | undefined;
                manualTransferReference?: string | null | undefined;
                adminNotes?: string | null | undefined;
                acknowledgedBy?: import("mongoose").Types.ObjectId | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
    };
};
export default donationResolvers;
//# sourceMappingURL=donation.resolvers.d.ts.map