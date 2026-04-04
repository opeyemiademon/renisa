import mongoose from 'mongoose';
const { Schema } = mongoose;
const notificationSchema = new Schema({
    type: { type: String, enum: ['new_member', 'new_payment', 'id_card_request'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    refId: { type: Schema.Types.ObjectId },
    refModel: { type: String },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
//# sourceMappingURL=notification.model.js.map