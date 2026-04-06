import mongoose from 'mongoose';
declare const ElectionApplication: mongoose.Model<{
    status: "approved" | "rejected" | "pending";
    memberId: mongoose.Types.ObjectId;
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    paymentStatus: "pending" | "failed" | "paid";
    paymentAmount: number;
    manifesto?: string | null | undefined;
    rejectionReason?: string | null | undefined;
    approvedBy?: mongoose.Types.ObjectId | null | undefined;
    photoUrl?: string | null | undefined;
    paymentReference?: string | null | undefined;
    paymentDate?: NativeDate | null | undefined;
    approvedAt?: NativeDate | null | undefined;
    rejectedBy?: mongoose.Types.ObjectId | null | undefined;
    rejectedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    status: "approved" | "rejected" | "pending";
    memberId: mongoose.Types.ObjectId;
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    paymentStatus: "pending" | "failed" | "paid";
    paymentAmount: number;
    manifesto?: string | null | undefined;
    rejectionReason?: string | null | undefined;
    approvedBy?: mongoose.Types.ObjectId | null | undefined;
    photoUrl?: string | null | undefined;
    paymentReference?: string | null | undefined;
    paymentDate?: NativeDate | null | undefined;
    approvedAt?: NativeDate | null | undefined;
    rejectedBy?: mongoose.Types.ObjectId | null | undefined;
    rejectedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    status: "approved" | "rejected" | "pending";
    memberId: mongoose.Types.ObjectId;
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    paymentStatus: "pending" | "failed" | "paid";
    paymentAmount: number;
    manifesto?: string | null | undefined;
    rejectionReason?: string | null | undefined;
    approvedBy?: mongoose.Types.ObjectId | null | undefined;
    photoUrl?: string | null | undefined;
    paymentReference?: string | null | undefined;
    paymentDate?: NativeDate | null | undefined;
    approvedAt?: NativeDate | null | undefined;
    rejectedBy?: mongoose.Types.ObjectId | null | undefined;
    rejectedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "approved" | "rejected" | "pending";
    memberId: mongoose.Types.ObjectId;
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    paymentStatus: "pending" | "failed" | "paid";
    paymentAmount: number;
    manifesto?: string | null | undefined;
    rejectionReason?: string | null | undefined;
    approvedBy?: mongoose.Types.ObjectId | null | undefined;
    photoUrl?: string | null | undefined;
    paymentReference?: string | null | undefined;
    paymentDate?: NativeDate | null | undefined;
    approvedAt?: NativeDate | null | undefined;
    rejectedBy?: mongoose.Types.ObjectId | null | undefined;
    rejectedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    status: "approved" | "rejected" | "pending";
    memberId: mongoose.Types.ObjectId;
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    paymentStatus: "pending" | "failed" | "paid";
    paymentAmount: number;
    manifesto?: string | null | undefined;
    rejectionReason?: string | null | undefined;
    approvedBy?: mongoose.Types.ObjectId | null | undefined;
    photoUrl?: string | null | undefined;
    paymentReference?: string | null | undefined;
    paymentDate?: NativeDate | null | undefined;
    approvedAt?: NativeDate | null | undefined;
    rejectedBy?: mongoose.Types.ObjectId | null | undefined;
    rejectedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    status: "approved" | "rejected" | "pending";
    memberId: mongoose.Types.ObjectId;
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    paymentStatus: "pending" | "failed" | "paid";
    paymentAmount: number;
    manifesto?: string | null | undefined;
    rejectionReason?: string | null | undefined;
    approvedBy?: mongoose.Types.ObjectId | null | undefined;
    photoUrl?: string | null | undefined;
    paymentReference?: string | null | undefined;
    paymentDate?: NativeDate | null | undefined;
    approvedAt?: NativeDate | null | undefined;
    rejectedBy?: mongoose.Types.ObjectId | null | undefined;
    rejectedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default ElectionApplication;
//# sourceMappingURL=electionApplication.model.d.ts.map