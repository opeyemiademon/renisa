import mongoose from 'mongoose';
declare const Communication: mongoose.Model<{
    type: "email" | "sms" | "both";
    message: string;
    subject: string;
    status: "pending" | "failed" | "sent";
    recipients: "state" | "active" | "all" | "specific";
    specificMembers: mongoose.Types.ObjectId[];
    sentCount: number;
    failedCount: number;
    filterState?: string | null | undefined;
    sentBy?: mongoose.Types.ObjectId | null | undefined;
    sentAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    type: "email" | "sms" | "both";
    message: string;
    subject: string;
    status: "pending" | "failed" | "sent";
    recipients: "state" | "active" | "all" | "specific";
    specificMembers: mongoose.Types.ObjectId[];
    sentCount: number;
    failedCount: number;
    filterState?: string | null | undefined;
    sentBy?: mongoose.Types.ObjectId | null | undefined;
    sentAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    type: "email" | "sms" | "both";
    message: string;
    subject: string;
    status: "pending" | "failed" | "sent";
    recipients: "state" | "active" | "all" | "specific";
    specificMembers: mongoose.Types.ObjectId[];
    sentCount: number;
    failedCount: number;
    filterState?: string | null | undefined;
    sentBy?: mongoose.Types.ObjectId | null | undefined;
    sentAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    type: "email" | "sms" | "both";
    message: string;
    subject: string;
    status: "pending" | "failed" | "sent";
    recipients: "state" | "active" | "all" | "specific";
    specificMembers: mongoose.Types.ObjectId[];
    sentCount: number;
    failedCount: number;
    filterState?: string | null | undefined;
    sentBy?: mongoose.Types.ObjectId | null | undefined;
    sentAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    type: "email" | "sms" | "both";
    message: string;
    subject: string;
    status: "pending" | "failed" | "sent";
    recipients: "state" | "active" | "all" | "specific";
    specificMembers: mongoose.Types.ObjectId[];
    sentCount: number;
    failedCount: number;
    filterState?: string | null | undefined;
    sentBy?: mongoose.Types.ObjectId | null | undefined;
    sentAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    type: "email" | "sms" | "both";
    message: string;
    subject: string;
    status: "pending" | "failed" | "sent";
    recipients: "state" | "active" | "all" | "specific";
    specificMembers: mongoose.Types.ObjectId[];
    sentCount: number;
    failedCount: number;
    filterState?: string | null | undefined;
    sentBy?: mongoose.Types.ObjectId | null | undefined;
    sentAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Communication;
//# sourceMappingURL=communication.model.d.ts.map