import mongoose, { Schema } from 'mongoose';
const TicketReplySchema = new Schema({
    authorId: { type: Schema.Types.ObjectId, required: true },
    authorType: { type: String, enum: ['member', 'admin'], required: true },
    authorName: { type: String, required: true },
    message: { type: String, required: true },
    attachments: [{ type: String }],
}, { timestamps: true });
const TicketSchema = new Schema({
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    attachments: [{ type: String }],
    replies: [TicketReplySchema],
    closedAt: { type: Date },
    closedBy: { type: String },
}, { timestamps: true });
TicketSchema.index({ memberId: 1, status: 1 });
TicketSchema.index({ createdAt: -1 });
const Ticket = mongoose.model('Ticket', TicketSchema);
export default Ticket;
//# sourceMappingURL=ticket.model.js.map