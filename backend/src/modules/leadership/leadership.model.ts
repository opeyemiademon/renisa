import mongoose from 'mongoose';
const { Schema } = mongoose;

const leadershipSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'LeadershipGroup', required: true },
  memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  slug: { type: String, sparse: true },
  position: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
  tenure: { type: String, trim: true },
  state: { type: String },
  isActive: { type: Boolean, default: true },
  isCurrent: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

const Leadership = mongoose.model('Leadership', leadershipSchema);
export default Leadership;
