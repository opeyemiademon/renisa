import mongoose from 'mongoose';
const { Schema } = mongoose;

const paymentTypeSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'NGN' },
  isRecurring: { type: Boolean, default: false },
  frequency: { type: String, enum: ['annual', 'quarterly', 'monthly', 'one-time'], default: 'annual' },
  isActive: { type: Boolean, default: true },
  dueDate: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

const PaymentType = mongoose.model('PaymentType', paymentTypeSchema);
export default PaymentType;
