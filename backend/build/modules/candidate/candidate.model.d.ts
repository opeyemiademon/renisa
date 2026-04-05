import mongoose from 'mongoose';
declare const Candidate: mongoose.Model<{
    memberId: mongoose.Types.ObjectId;
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    formPaymentStatus: "pending" | "paid" | "manual_pending";
    isApproved: boolean;
    isRejected: boolean;
    manifestoSubmitted: boolean;
    profilePicture?: string | null | undefined;
    manifesto?: string | null | undefined;
    formPaymentRef?: string | null | undefined;
    rejectionReason?: string | null | undefined;
    approvedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    memberId: mongoose.Types.ObjectId;
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    formPaymentStatus: "pending" | "paid" | "manual_pending";
    isApproved: boolean;
    isRejected: boolean;
    manifestoSubmitted: boolean;
    profilePicture?: string | null | undefined;
    manifesto?: string | null | undefined;
    formPaymentRef?: string | null | undefined;
    rejectionReason?: string | null | undefined;
    approvedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    memberId: mongoose.Types.ObjectId;
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    formPaymentStatus: "pending" | "paid" | "manual_pending";
    isApproved: boolean;
    isRejected: boolean;
    manifestoSubmitted: boolean;
    profilePicture?: string | null | undefined;
    manifesto?: string | null | undefined;
    formPaymentRef?: string | null | undefined;
    rejectionReason?: string | null | undefined;
    approvedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    memberId: mongoose.Types.ObjectId;
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    formPaymentStatus: "pending" | "paid" | "manual_pending";
    isApproved: boolean;
    isRejected: boolean;
    manifestoSubmitted: boolean;
    profilePicture?: string | null | undefined;
    manifesto?: string | null | undefined;
    formPaymentRef?: string | null | undefined;
    rejectionReason?: string | null | undefined;
    approvedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    memberId: mongoose.Types.ObjectId;
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    formPaymentStatus: "pending" | "paid" | "manual_pending";
    isApproved: boolean;
    isRejected: boolean;
    manifestoSubmitted: boolean;
    profilePicture?: string | null | undefined;
    manifesto?: string | null | undefined;
    formPaymentRef?: string | null | undefined;
    rejectionReason?: string | null | undefined;
    approvedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    memberId: mongoose.Types.ObjectId;
    electionId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    formPaymentStatus: "pending" | "paid" | "manual_pending";
    isApproved: boolean;
    isRejected: boolean;
    manifestoSubmitted: boolean;
    profilePicture?: string | null | undefined;
    manifesto?: string | null | undefined;
    formPaymentRef?: string | null | undefined;
    rejectionReason?: string | null | undefined;
    approvedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedAt?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Candidate;
//# sourceMappingURL=candidate.model.d.ts.map