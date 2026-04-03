import mongoose from 'mongoose';
const { Schema } = mongoose;

const paymentSchema = new Schema({
  transactionRef: { type: String, required: true, unique: true },
  memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  paymentTypeId: { type: Schema.Types.ObjectId, ref: 'PaymentType', required: true },
  amount: { type: Number, required: true },
  year: { type: Number, default: () => new Date().getFullYear() },
  paymentMethod: {
    type: String,
    enum: ['paystack', 'bank_transfer', 'cash', 'admin_credit'],
    default: 'paystack',
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed', 'reversed'],
    default: 'pending',
  },
  paystackRef: { type: String },
  paystackData: { type: Schema.Types.Mixed },
  paidAt: { type: Date },
  notes: { type: String },
  processedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
