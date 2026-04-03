import mongoose from 'mongoose';
const { Schema } = mongoose;
const idCardRequestSchema = new Schema({
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    requestType: { type: String, enum: ['online', 'physical'], required: true },
    uploadedPhoto: { type: String },
    amount: { type: Number, required: true },
    paymentRef: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paidAt: { type: Date },
    adminStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    reviewedAt: { type: Date },
    rejectionReason: { type: String },
    generatedCardFront: { type: String },
    generatedCardBack: { type: String },
    downloadCount: { type: Number, default: 0 },
    deliveryAddress: { type: String },
    deliveryStatus: { type: String, enum: ['pending', 'processing', 'dispatched', 'delivered'] },
    trackingInfo: { type: String },
}, { timestamps: true });
const IDCardRequest = mongoose.model('IDCardRequest', idCardRequestSchema);
export default IDCardRequest;
//# sourceMappingURL=idCardRequest.model.js.map