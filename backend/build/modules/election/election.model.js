import mongoose from 'mongoose';
const { Schema } = mongoose;
const electionSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    year: { type: Number, default: () => new Date().getFullYear() },
    startDate: { type: Date },
    endDate: { type: Date },
    votingStartDate: { type: Date },
    votingEndDate: { type: Date },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        default: 'draft',
    },
    // positions stored as refs to the standalone ElectoralPosition collection
    positions: [{ type: Schema.Types.ObjectId, ref: 'ElectoralPosition' }],
    eligibilityMinYears: { type: Number, default: 1 },
    requiresDuesPayment: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });
const Election = mongoose.model('Election', electionSchema);
export default Election;
//# sourceMappingURL=election.model.js.map