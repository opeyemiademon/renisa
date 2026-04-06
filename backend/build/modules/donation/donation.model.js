import mongoose from 'mongoose';
const { Schema } = mongoose;
const donationSchema = new Schema({
    donorName: { type: String, required: true, trim: true },
    donorEmail: { type: String, trim: true, lowercase: true },
    donorPhone: { type: String, trim: true },
    donorAddress: { type: String, trim: true },
    donorCity: { type: String, trim: true },
    donorState: { type: String, trim: true },
    memberId: { type: Schema.Types.ObjectId, ref: 'Member' },
    donationTypeId: { type: Schema.Types.ObjectId, ref: 'DonationType', required: true },
    donationMode: { type: String, enum: ['physical', 'monetary'], required: true },
    physicalItems: { type: String },
    quantity: { type: Number },
    estimatedValue: { type: Number },
    preferredDropoffDate: { type: Date },
    amount: { type: Number },
    currency: { type: String, default: 'NGN' },
    invoiceId: { type: Schema.Types.ObjectId, ref: 'DonationInvoice' },
    paymentMethod: { type: String, enum: ['paystack', 'bank_transfer'] },
    paymentStatus: { type: String, enum: ['pending', 'successful', 'failed'], default: 'pending' },
    paystackRef: { type: String },
    manualTransferReference: { type: String, trim: true },
    paidAt: { type: Date },
    notes: { type: String },
    adminNotes: { type: String },
    status: { type: String, enum: ['pending', 'received', 'acknowledged', 'completed'], default: 'pending' },
    acknowledgedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });
const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
//# sourceMappingURL=donation.model.js.map