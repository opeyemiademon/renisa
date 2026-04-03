import mongoose from 'mongoose';
const { Schema } = mongoose;

const electoralPositionSchema = new Schema({
  electionId: { type: Schema.Types.ObjectId, ref: 'Election', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  formFee: { type: Number, default: 0 },
  maxCandidates: { type: Number },
  maxVotesPerVoter: { type: Number, default: 1 },
}, { timestamps: true });

const ElectoralPosition = mongoose.model('ElectoralPosition', electoralPositionSchema);
export default ElectoralPosition;
