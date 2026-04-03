import mongoose from 'mongoose';
const { Schema } = mongoose;
const communicationSchema = new Schema({
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['email', 'sms', 'both'], default: 'email' },
    recipients: { type: String, enum: ['all', 'active', 'specific'], default: 'all' },
    specificMembers: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    sentBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    sentAt: { type: Date },
}, { timestamps: true });
const Communication = mongoose.model('Communication', communicationSchema);
export default Communication;
//# sourceMappingURL=communication.model.js.map