import mongoose, { Schema } from 'mongoose';
const messageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ createdAt: -1 });
export default mongoose.model('Message', messageSchema);
//# sourceMappingURL=chat.model.js.map