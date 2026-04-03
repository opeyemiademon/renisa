import mongoose from 'mongoose';
const { Schema } = mongoose;

const candidateSchema = new Schema({
  electionId: { type: Schema.Types.ObjectId, ref: 'Election', required: true },
  positionId: { type: Schema.Types.ObjectId, ref: 'ElectoralPosition', required: true },
  memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  manifesto: { type: String },
  formPaymentRef: { type: String },
  formPaymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  profilePicture: { type: String },
}, { timestamps: true });

candidateSchema.index({ electionId: 1, positionId: 1, memberId: 1 }, { unique: true });

const Candidate = mongoose.model('Candidate', candidateSchema);
export default Candidate;
