import mongoose from 'mongoose';
const { Schema } = mongoose;

const voteSchema = new Schema({
  electionId: { type: Schema.Types.ObjectId, ref: 'Election', required: true },
  positionId: { type: Schema.Types.ObjectId, ref: 'ElectoralPosition', required: true },
  voterId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  votedAt: { type: Date, default: Date.now },
}, { timestamps: true });

voteSchema.index({ electionId: 1, positionId: 1, voterId: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);
export default Vote;
