import mongoose, { Document } from 'mongoose';
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
declare const Ticket: mongoose.Model<ITicket, {}, {}, {}, mongoose.Document<unknown, {}, ITicket, {}, {}> & ITicket & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Ticket;
//# sourceMappingURL=ticket.model.d.ts.map