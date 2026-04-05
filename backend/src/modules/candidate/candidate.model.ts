import mongoose from 'mongoose';
const { Schema } = mongoose;

const candidateSchema = new Schema({
  electionId: { type: Schema.Types.ObjectId, ref: 'Election', required: true },
  positionId: { type: Schema.Types.ObjectId, ref: 'ElectoralPosition', required: true },
  memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  manifesto: { type: String },
  formPaymentRef: { type: String },
  formPaymentStatus: { type: String, enum: ['pending', 'paid', 'manual_pending'], default: 'pending' },
  isApproved: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  rejectionReason: { type: String },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  reviewedAt: { type: Date },
  profilePicture: { type: String },
  manifestoSubmitted: { type: Boolean, default: false },
}, { timestamps: true });

candidateSchema.index({ electionId: 1, positionId: 1, memberId: 1 }, { unique: true });

const Candidate = mongoose.model('Candidate', candidateSchema);
export default Candidate;
