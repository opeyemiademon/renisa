import mongoose from 'mongoose';
const { Schema } = mongoose;

const electionApplicationSchema = new Schema({
  electionId: { type: Schema.Types.ObjectId, ref: 'Election', required: true },
  positionId: { type: Schema.Types.ObjectId, ref: 'ElectoralPosition', required: true },
  memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  manifesto: { type: String, trim: true },
  photoUrl: { type: String },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  paymentReference: { type: String },
  paymentAmount: { type: Number, default: 0 },
  paymentDate: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  rejectedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  rejectedAt: { type: Date },
}, { timestamps: true });

// Compound index to prevent duplicate applications
electionApplicationSchema.index({ electionId: 1, memberId: 1 }, { unique: true });

const ElectionApplication = mongoose.model('ElectionApplication', electionApplicationSchema);
export default ElectionApplication;
