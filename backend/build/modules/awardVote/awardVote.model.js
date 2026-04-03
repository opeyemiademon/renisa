import mongoose from 'mongoose';
const { Schema } = mongoose;
const awardVoteSchema = new Schema({
    awardId: { type: Schema.Types.ObjectId, ref: 'Award', required: true },
    voterId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    votedAt: { type: Date, default: Date.now },
}, { timestamps: true });
awardVoteSchema.index({ awardId: 1, voterId: 1 }, { unique: true });
const AwardVote = mongoose.model('AwardVote', awardVoteSchema);
export default AwardVote;
//# sourceMappingURL=awardVote.model.js.map