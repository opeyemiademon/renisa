import mongoose from 'mongoose';
const { Schema } = mongoose;

const donationTypeSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  donationMode: { type: String, enum: ['physical', 'monetary', 'both'], default: 'monetary' },
  icon: { type: String },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

const DonationType = mongoose.model('DonationType', donationTypeSchema);
export default DonationType;
