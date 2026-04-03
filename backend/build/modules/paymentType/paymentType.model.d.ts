import mongoose from 'mongoose';
declare const PaymentType: mongoose.Model<{
    name: string;
    isActive: boolean;
    amount: number;
    currency: string;
    isRecurring: boolean;
    frequency: "annual" | "quarterly" | "monthly" | "one-time";
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    dueDate?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    isActive: boolean;
    amount: number;
    currency: string;
    isRecurring: boolean;
    frequency: "annual" | "quarterly" | "monthly" | "one-time";
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    dueDate?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    isActive: boolean;
    amount: number;
    currency: string;
    isRecurring: boolean;
    frequency: "annual" | "quarterly" | "monthly" | "one-time";
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    dueDate?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    isActive: boolean;
    amount: number;
    currency: string;
    isRecurring: boolean;
    frequency: "annual" | "quarterly" | "monthly" | "one-time";
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    dueDate?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    isActive: boolean;
    amount: number;
    currency: string;
    isRecurring: boolean;
    frequency: "annual" | "quarterly" | "monthly" | "one-time";
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    dueDate?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    isActive: boolean;
    amount: number;
    currency: string;
    isRecurring: boolean;
    frequency: "annual" | "quarterly" | "monthly" | "one-time";
    description?: string | null | undefined;
    createdBy?: mongoose.Types.ObjectId | null | undefined;
    dueDate?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default PaymentType;
//# sourceMappingURL=paymentType.model.d.ts.map