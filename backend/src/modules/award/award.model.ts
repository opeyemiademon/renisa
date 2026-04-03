import mongoose from 'mongoose';
const { Schema } = mongoose;

const awardSchema = new Schema({
  memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'AwardCategory', required: true },
  year: { type: Number, default: () => new Date().getFullYear() },
  image: { type: String },
  votingEnabled: { type: Boolean, default: false },
  votingStartDate: { type: Date },
  votingEndDate: { type: Date },
  nominatedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  status: { type: String, enum: ['nominated', 'voting', 'awarded'], default: 'nominated' },
}, { timestamps: true });

const Award = mongoose.model('Award', awardSchema);
export default Award;
