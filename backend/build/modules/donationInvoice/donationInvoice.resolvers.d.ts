import { AuthContext } from '../../middleware/auth.js';
declare const donationInvoiceResolvers: {
    Query: {
        getAllDonationInvoices: (_: any, { page, limit, status }: any, context: AuthContext) => Promise<{
            invoices: (import("mongoose").Document<unknown, {}, {
                status: "paid" | "unpaid" | "expired";
                amount: number;
                currency: string;
                donorName: string;
                invoiceNumber: string;
                donationId: import("mongoose").Types.ObjectId;
                donationTypeName: string;
                dueDate?: NativeDate | null | undefined;
                donorEmail?: string | null | undefined;
                pdfUrl?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "paid" | "unpaid" | "expired";
                amount: number;
                currency: string;
                donorName: string;
                invoiceNumber: string;
                donationId: import("mongoose").Types.ObjectId;
                donationTypeName: string;
                dueDate?: NativeDate | null | undefined;
                donorEmail?: string | null | undefined;
                pdfUrl?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            total: number;
            page: any;
            limit: any;
        }>;
        getDonationInvoice: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            status: "paid" | "unpaid" | "expired";
            amount: number;
            currency: string;
            donorName: string;
            invoiceNumber: string;
            donationId: import("mongoose").Types.ObjectId;
            donationTypeName: string;
            dueDate?: NativeDate | null | undefined;
            donorEmail?: string | null | undefined;
            pdfUrl?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            status: "paid" | "unpaid" | "expired";
            amount: number;
            currency: string;
            donorName: string;
            invoiceNumber: string;
            donationId: import("mongoose").Types.ObjectId;
            donationTypeName: string;
            dueDate?: NativeDate | null | undefined;
            donorEmail?: string | null | undefined;
            pdfUrl?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
        getDonationInvoiceByNumber: (_: any, { invoiceNumber }: {
            invoiceNumber: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, {
            status: "paid" | "unpaid" | "expired";
            amount: number;
            currency: string;
            donorName: string;
            invoiceNumber: string;
            donationId: import("mongoose").Types.ObjectId;
            donationTypeName: string;
            dueDate?: NativeDate | null | undefined;
            donorEmail?: string | null | undefined;
            pdfUrl?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps, {}, {
            timestamps: true;
        }> & {
            status: "paid" | "unpaid" | "expired";
            amount: number;
            currency: string;
            donorName: string;
            invoiceNumber: string;
            donationId: import("mongoose").Types.ObjectId;
            donationTypeName: string;
            dueDate?: NativeDate | null | undefined;
            donorEmail?: string | null | undefined;
            pdfUrl?: string | null | undefined;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        updateDonationInvoiceStatus: (_: any, { id, status }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            data: import("mongoose").Document<unknown, {}, {
                status: "paid" | "unpaid" | "expired";
                amount: number;
                currency: string;
                donorName: string;
                invoiceNumber: string;
                donationId: import("mongoose").Types.ObjectId;
                donationTypeName: string;
                dueDate?: NativeDate | null | undefined;
                donorEmail?: string | null | undefined;
                pdfUrl?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps, {}, {
                timestamps: true;
            }> & {
                status: "paid" | "unpaid" | "expired";
                amount: number;
                currency: string;
                donorName: string;
                invoiceNumber: string;
                donationId: import("mongoose").Types.ObjectId;
                donationTypeName: string;
                dueDate?: NativeDate | null | undefined;
                donorEmail?: string | null | undefined;
                pdfUrl?: string | null | undefined;
            } & import("mongoose").DefaultTimestampProps & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        }>;
    };
};
export default donationInvoiceResolvers;
//# sourceMappingURL=donationInvoice.resolvers.d.ts.map