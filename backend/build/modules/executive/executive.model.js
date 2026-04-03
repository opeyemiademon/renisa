import mongoose from 'mongoose';
const { Schema } = mongoose;
const executiveSchema = new Schema({
    memberId: { type: Schema.Types.ObjectId, ref: 'Member' },
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    tenure: { type: String, trim: true },
    bio: { type: String },
    profilePicture: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const Executive = mongoose.model('Executive', executiveSchema);
export default Executive;
//# sourceMappingURL=executive.model.js.map