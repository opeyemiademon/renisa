import mongoose from 'mongoose';
const { Schema } = mongoose;

const memberCodeSchema = new Schema({
  code: { type: String, required: true, unique: true },
  isUsed: { type: Boolean, default: false },
  usedBy: { type: Schema.Types.ObjectId, ref: 'Member' },
  usedAt: { type: Date },
  generatedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  expiresAt: { type: Date },
  batchName: { type: String, trim: true },
}, { timestamps: true });

const MemberCode = mongoose.model('MemberCode', memberCodeSchema);
export default MemberCode;
