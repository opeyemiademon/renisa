import mongoose from 'mongoose';
const { Schema } = mongoose;
const sportSchema = new Schema({
    name: { type: String, required: true, trim: true, unique: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });
const Sport = mongoose.model('Sport', sportSchema);
export default Sport;
//# sourceMappingURL=sport.model.js.map