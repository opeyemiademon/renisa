import mongoose from 'mongoose';
const { Schema } = mongoose;
const donationInvoiceSchema = new Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    donationId: { type: Schema.Types.ObjectId, ref: 'Donation', required: true },
    donorName: { type: String, required: true },
    donorEmail: { type: String },
    donationTypeName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    dueDate: { type: Date },
    status: { type: String, enum: ['unpaid', 'paid', 'expired'], default: 'unpaid' },
    pdfUrl: { type: String },
}, { timestamps: true });
const DonationInvoice = mongoose.model('DonationInvoice', donationInvoiceSchema);
export default DonationInvoice;
//# sourceMappingURL=donationInvoice.model.js.map