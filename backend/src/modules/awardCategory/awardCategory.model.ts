import mongoose from 'mongoose';
const { Schema } = mongoose;

const awardCategorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  icon: { type: String },
  isActive: { type: Boolean, default: true },
  pollActive: { type: Boolean, default: false },
  votingStartDate: { type: Date },
  votingEndDate: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

const AwardCategory = mongoose.model('AwardCategory', awardCategorySchema);
export default AwardCategory;
