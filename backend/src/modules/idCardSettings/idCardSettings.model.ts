import mongoose from 'mongoose';
const { Schema } = mongoose;

const idCardSettingsSchema = new Schema({
  onlineFee: { type: Number, default: 0 },
  physicalFee: { type: Number, default: 0 },
  currency: { type: String, default: 'NGN' },
  isEnabled: { type: Boolean, default: true },
  requiresApproval: { type: Boolean, default: true },
  validityYears: { type: Number, default: 1 },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

const IDCardSettings = mongoose.model('IDCardSettings', idCardSettingsSchema);
export default IDCardSettings;
