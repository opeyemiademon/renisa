import mongoose from 'mongoose';
declare const IDCardRequest: mongoose.Model<{
    amount: number;
    memberId: mongoose.Types.ObjectId;
    requestType: "online" | "physical";
    paymentStatus: "pending" | "failed" | "paid";
    adminStatus: "approved" | "rejected" | "pending";
    downloadCount: number;
    paidAt?: NativeDate | null | undefined;
    uploadedPhoto?: string | null | undefined;
    paymentRef?: string | null | undefined;
    reviewedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedAt?: NativeDate | null | undefined;
    rejectionReason?: string | null | undefined;
    generatedCardFront?: string | null | undefined;
    generatedCardBack?: string | null | undefined;
    deliveryAddress?: string | null | undefined;
    deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
    trackingInfo?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    amount: number;
    memberId: mongoose.Types.ObjectId;
    requestType: "online" | "physical";
    paymentStatus: "pending" | "failed" | "paid";
    adminStatus: "approved" | "rejected" | "pending";
    downloadCount: number;
    paidAt?: NativeDate | null | undefined;
    uploadedPhoto?: string | null | undefined;
    paymentRef?: string | null | undefined;
    reviewedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedAt?: NativeDate | null | undefined;
    rejectionReason?: string | null | undefined;
    generatedCardFront?: string | null | undefined;
    generatedCardBack?: string | null | undefined;
    deliveryAddress?: string | null | undefined;
    deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
    trackingInfo?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    amount: number;
    memberId: mongoose.Types.ObjectId;
    requestType: "online" | "physical";
    paymentStatus: "pending" | "failed" | "paid";
    adminStatus: "approved" | "rejected" | "pending";
    downloadCount: number;
    paidAt?: NativeDate | null | undefined;
    uploadedPhoto?: string | null | undefined;
    paymentRef?: string | null | undefined;
    reviewedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedAt?: NativeDate | null | undefined;
    rejectionReason?: string | null | undefined;
    generatedCardFront?: string | null | undefined;
    generatedCardBack?: string | null | undefined;
    deliveryAddress?: string | null | undefined;
    deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
    trackingInfo?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    amount: number;
    memberId: mongoose.Types.ObjectId;
    requestType: "online" | "physical";
    paymentStatus: "pending" | "failed" | "paid";
    adminStatus: "approved" | "rejected" | "pending";
    downloadCount: number;
    paidAt?: NativeDate | null | undefined;
    uploadedPhoto?: string | null | undefined;
    paymentRef?: string | null | undefined;
    reviewedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedAt?: NativeDate | null | undefined;
    rejectionReason?: string | null | undefined;
    generatedCardFront?: string | null | undefined;
    generatedCardBack?: string | null | undefined;
    deliveryAddress?: string | null | undefined;
    deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
    trackingInfo?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    amount: number;
    memberId: mongoose.Types.ObjectId;
    requestType: "online" | "physical";
    paymentStatus: "pending" | "failed" | "paid";
    adminStatus: "approved" | "rejected" | "pending";
    downloadCount: number;
    paidAt?: NativeDate | null | undefined;
    uploadedPhoto?: string | null | undefined;
    paymentRef?: string | null | undefined;
    reviewedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedAt?: NativeDate | null | undefined;
    rejectionReason?: string | null | undefined;
    generatedCardFront?: string | null | undefined;
    generatedCardBack?: string | null | undefined;
    deliveryAddress?: string | null | undefined;
    deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
    trackingInfo?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    amount: number;
    memberId: mongoose.Types.ObjectId;
    requestType: "online" | "physical";
    paymentStatus: "pending" | "failed" | "paid";
    adminStatus: "approved" | "rejected" | "pending";
    downloadCount: number;
    paidAt?: NativeDate | null | undefined;
    uploadedPhoto?: string | null | undefined;
    paymentRef?: string | null | undefined;
    reviewedBy?: mongoose.Types.ObjectId | null | undefined;
    reviewedAt?: NativeDate | null | undefined;
    rejectionReason?: string | null | undefined;
    generatedCardFront?: string | null | undefined;
    generatedCardBack?: string | null | undefined;
    deliveryAddress?: string | null | undefined;
    deliveryStatus?: "pending" | "processing" | "dispatched" | "delivered" | null | undefined;
    trackingInfo?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default IDCardRequest;
//# sourceMappingURL=idCardRequest.model.d.ts.map