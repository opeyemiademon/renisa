import mongoose from 'mongoose';
const { Schema } = mongoose;
const memberNotificationSchema = new Schema({
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
memberNotificationSchema.index({ memberId: 1, createdAt: -1 });
const MemberNotification = mongoose.model('MemberNotification', memberNotificationSchema);
export default MemberNotification;
//# sourceMappingURL=memberNotification.model.js.map