import mongoose from 'mongoose';
const { Schema } = mongoose;

const electionSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  nominationStartDate: { type: Date },
  nominationEndDate: { type: Date },
  votingStartDate: { type: Date },
  votingEndDate: { type: Date },
  status: {
    type: String,
    enum: ['setup', 'nomination', 'voting', 'completed', 'cancelled'],
    default: 'setup',
  },
  eligibilityCriteria: {
    minimumMembershipYears: { type: Number, default: 0 },
    paymentYears: [{ type: Number }],
    mustBeActive: { type: Boolean, default: true },
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

const Election = mongoose.model('Election', electionSchema);
export default Election;
