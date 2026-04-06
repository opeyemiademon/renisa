import mongoose from 'mongoose';
declare const Payment: mongoose.Model<{
    year: number;
    status: "pending" | "successful" | "failed" | "reversed";
    memberId: mongoose.Types.ObjectId;
    amount: number;
    transactionRef: string;
    paymentTypeId: mongoose.Types.ObjectId;
    paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
    paystackRef?: string | null | undefined;
    paystackData?: any;
    paidAt?: NativeDate | null | undefined;
    notes?: string | null | undefined;
    processedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    year: number;
    status: "pending" | "successful" | "failed" | "reversed";
    memberId: mongoose.Types.ObjectId;
    amount: number;
    transactionRef: string;
    paymentTypeId: mongoose.Types.ObjectId;
    paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
    paystackRef?: string | null | undefined;
    paystackData?: any;
    paidAt?: NativeDate | null | undefined;
    notes?: string | null | undefined;
    processedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    year: number;
    status: "pending" | "successful" | "failed" | "reversed";
    memberId: mongoose.Types.ObjectId;
    amount: number;
    transactionRef: string;
    paymentTypeId: mongoose.Types.ObjectId;
    paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
    paystackRef?: string | null | undefined;
    paystackData?: any;
    paidAt?: NativeDate | null | undefined;
    notes?: string | null | undefined;
    processedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    year: number;
    status: "pending" | "successful" | "failed" | "reversed";
    memberId: mongoose.Types.ObjectId;
    amount: number;
    transactionRef: string;
    paymentTypeId: mongoose.Types.ObjectId;
    paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
    paystackRef?: string | null | undefined;
    paystackData?: any;
    paidAt?: NativeDate | null | undefined;
    notes?: string | null | undefined;
    processedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    year: number;
    status: "pending" | "successful" | "failed" | "reversed";
    memberId: mongoose.Types.ObjectId;
    amount: number;
    transactionRef: string;
    paymentTypeId: mongoose.Types.ObjectId;
    paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
    paystackRef?: string | null | undefined;
    paystackData?: any;
    paidAt?: NativeDate | null | undefined;
    notes?: string | null | undefined;
    processedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    year: number;
    status: "pending" | "successful" | "failed" | "reversed";
    memberId: mongoose.Types.ObjectId;
    amount: number;
    transactionRef: string;
    paymentTypeId: mongoose.Types.ObjectId;
    paymentMethod: "paystack" | "bank_transfer" | "cash" | "admin_credit";
    paystackRef?: string | null | undefined;
    paystackData?: any;
    paidAt?: NativeDate | null | undefined;
    notes?: string | null | undefined;
    processedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Payment;
//# sourceMappingURL=payment.model.d.ts.map