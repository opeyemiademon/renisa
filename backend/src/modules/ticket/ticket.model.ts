import mongoose, { Document, Schema } from 'mongoose';

export interface ITicketReply {
  _id: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  authorType: 'member' | 'admin';
  authorName: string;
  message: string;
  attachments: string[];
  createdAt: Date;
}

export interface ITicket extends Document {
  memberId: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  attachments: string[];
  replies: ITicketReply[];
  closedAt?: Date;
  closedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TicketReplySchema = new Schema<ITicketReply>(
  {
    authorId: { type: Schema.Types.ObjectId, required: true },
    authorType: { type: String, enum: ['member', 'admin'], required: true },
    authorName: { type: String, required: true },
    message: { type: String, required: true },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

const TicketSchema = new Schema<ITicket>(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    attachments: [{ type: String }],
    replies: [TicketReplySchema],
    closedAt: { type: Date },
    closedBy: { type: String },
  },
  { timestamps: true }
);

TicketSchema.index({ memberId: 1, status: 1 });
TicketSchema.index({ createdAt: -1 });

const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);
export default Ticket;
