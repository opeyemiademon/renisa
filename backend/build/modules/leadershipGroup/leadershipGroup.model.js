import mongoose from 'mongoose';
const { Schema } = mongoose;
const leadershipGroupSchema = new Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, enum: ['bot', 'nec', 'state-executives', 'directorate'] },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });
const LeadershipGroup = mongoose.model('LeadershipGroup', leadershipGroupSchema);
export default LeadershipGroup;
//# sourceMappingURL=leadershipGroup.model.js.map