import mongoose from 'mongoose';
declare const DonationInvoice: mongoose.Model<{
    status: "paid" | "unpaid" | "expired";
    amount: number;
    currency: string;
    donorName: string;
    invoiceNumber: string;
    donationId: mongoose.Types.ObjectId;
    donationTypeName: string;
    dueDate?: NativeDate | null | undefined;
    donorEmail?: string | null | undefined;
    pdfUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    status: "paid" | "unpaid" | "expired";
    amount: number;
    currency: string;
    donorName: string;
    invoiceNumber: string;
    donationId: mongoose.Types.ObjectId;
    donationTypeName: string;
    dueDate?: NativeDate | null | undefined;
    donorEmail?: string | null | undefined;
    pdfUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    status: "paid" | "unpaid" | "expired";
    amount: number;
    currency: string;
    donorName: string;
    invoiceNumber: string;
    donationId: mongoose.Types.ObjectId;
    donationTypeName: string;
    dueDate?: NativeDate | null | undefined;
    donorEmail?: string | null | undefined;
    pdfUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "paid" | "unpaid" | "expired";
    amount: number;
    currency: string;
    donorName: string;
    invoiceNumber: string;
    donationId: mongoose.Types.ObjectId;
    donationTypeName: string;
    dueDate?: NativeDate | null | undefined;
    donorEmail?: string | null | undefined;
    pdfUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    status: "paid" | "unpaid" | "expired";
    amount: number;
    currency: string;
    donorName: string;
    invoiceNumber: string;
    donationId: mongoose.Types.ObjectId;
    donationTypeName: string;
    dueDate?: NativeDate | null | undefined;
    donorEmail?: string | null | undefined;
    pdfUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    status: "paid" | "unpaid" | "expired";
    amount: number;
    currency: string;
    donorName: string;
    invoiceNumber: string;
    donationId: mongoose.Types.ObjectId;
    donationTypeName: string;
    dueDate?: NativeDate | null | undefined;
    donorEmail?: string | null | undefined;
    pdfUrl?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default DonationInvoice;
//# sourceMappingURL=donationInvoice.model.d.ts.map