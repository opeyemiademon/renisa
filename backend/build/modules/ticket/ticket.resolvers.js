import Ticket from './ticket.model.js';
import Member from '../member/member.model.js';
import AdminUser from '../user/user.model.js';
import { requireMemberAuth, requireAdminAuth } from '../../middleware/auth.js';
import { createMemberNotification } from '../../utils/createMemberNotification.js';
import { createNotification } from '../../utils/createNotification.js';
const ticketResolvers = {
    Ticket: {
        id: (p) => p._id?.toString(),
        member: (p) => p.memberId,
    },
    TicketReply: {
        id: (p) => p._id?.toString(),
        createdAt: (p) => p.createdAt?.toISOString?.() ?? String(p.createdAt),
    },
    Query: {
        getMyTickets: async (_, { status }, context) => {
            requireMemberAuth(context);
            const filter = { memberId: context.member.id };
            if (status)
                filter.status = status;
            return await Ticket.find(filter)
                .populate('memberId', 'firstName lastName memberNumber email profilePicture')
                .sort({ updatedAt: -1 });
        },
        getTicket: async (_, { id }, context) => {
            if (!context.isAuthenticated)
                throw new Error('Authentication required');
            const ticket = await Ticket.findById(id)
                .populate('memberId', 'firstName lastName memberNumber profilePicture email');
            if (!ticket)
                throw new Error('Ticket not found');
            if (context.member && ticket.memberId?.id.toString() !== context.member.id) {
                throw new Error('Access denied');
            }
            return ticket;
        },
        getAllTickets: async (_, { status, memberId, priority }, context) => {
            requireAdminAuth(context);
            const filter = {};
            if (status)
                filter.status = status;
            if (memberId)
                filter.memberId = memberId;
            if (priority)
                filter.priority = priority;
            return await Ticket.find(filter)
                .populate('memberId', 'firstName lastName memberNumber profilePicture email')
                .sort({ updatedAt: -1 });
        },
    },
    Mutation: {
        createTicket: async (_, { data }, context) => {
            requireMemberAuth(context);
            const { subject, description, priority = 'medium', attachments = [] } = data;
            if (attachments.length > 4)
                throw new Error('Maximum 4 attachments allowed');
            const ticket = await Ticket.create({
                memberId: context.member.id,
                subject,
                description,
                priority,
                attachments,
                status: 'open',
                replies: [],
            });
            const populated = await Ticket.findById(ticket._id)
                .populate('memberId', 'firstName lastName memberNumber profilePicture email');
            await createNotification('support_ticket', 'New Support Ticket', `A new support ticket has been submitted: ${subject}`, String(ticket._id), 'Ticket');
            return { success: true, message: 'Ticket created successfully', ticket: populated };
        },
        replyToTicket: async (_, { data }, context) => {
            requireMemberAuth(context);
            const { ticketId, message, attachments = [] } = data;
            const ticket = await Ticket.findById(ticketId);
            if (!ticket)
                throw new Error('Ticket not found');
            if (ticket.memberId.toString() !== context.member.id)
                throw new Error('Access denied');
            if (ticket.status === 'closed')
                throw new Error('Cannot reply to a closed ticket');
            const member = await Member.findById(context.member.id).select('firstName lastName').lean();
            ticket.replies.push({
                authorId: context.member.id,
                authorType: 'member',
                authorName: `${member?.firstName} ${member?.lastName}`,
                message,
                attachments,
            });
            if (ticket.status === 'in_progress')
                ticket.status = 'open';
            await ticket.save();
            const populated = await Ticket.findById(ticketId)
                .populate('memberId', 'firstName lastName memberNumber profilePicture email');
            await createNotification('support_ticket', 'New Reply on Support Ticket', `${member?.firstName} ${member?.lastName} replied to ticket: ${ticket.subject}`, ticketId, 'Ticket');
            return { success: true, message: 'Reply sent', ticket: populated };
        },
        adminReplyToTicket: async (_, { data }, context) => {
            requireAdminAuth(context);
            const { ticketId, message, attachments = [] } = data;
            const ticket = await Ticket.findById(ticketId);
            if (!ticket)
                throw new Error('Ticket not found');
            if (ticket.status === 'closed')
                throw new Error('Cannot reply to a closed ticket');
            const admin = await AdminUser.findById(context.admin.id).select('name username').lean();
            const adminName = admin?.name || admin?.username || 'Admin';
            ticket.replies.push({
                authorId: context.admin.id,
                authorType: 'admin',
                authorName: adminName,
                message,
                attachments,
            });
            ticket.status = 'in_progress';
            await ticket.save();
            const populated = await Ticket.findById(ticketId)
                .populate('memberId', 'firstName lastName memberNumber profilePicture email');
            await createMemberNotification(ticket.memberId.toString(), 'ticket', 'Support Ticket Updated', `Admin has replied to your ticket: "${ticket.subject}"`, `/member/tickets/${ticketId}`);
            return { success: true, message: 'Reply sent', ticket: populated };
        },
        updateTicketStatus: async (_, { id, status }, context) => {
            requireAdminAuth(context);
            const validStatuses = ['open', 'in_progress', 'closed'];
            if (!validStatuses.includes(status))
                throw new Error('Invalid status');
            const ticket = await Ticket.findById(id);
            if (!ticket)
                throw new Error('Ticket not found');
            const admin = await AdminUser.findById(context.admin.id).select('name username').lean();
            const adminName = admin?.name || admin?.username || 'Admin';
            const previousStatus = ticket.status;
            ticket.status = status;
            if (status === 'closed') {
                ticket.closedAt = new Date();
                ticket.closedBy = adminName;
            }
            else {
                ticket.closedAt = undefined;
                ticket.closedBy = undefined;
            }
            await ticket.save();
            const populated = await Ticket.findById(id)
                .populate('memberId', 'firstName lastName memberNumber profilePicture email');
            const statusLabel = status === 'closed' ? 'closed' : status === 'in_progress' ? 'in progress' : 're-opened';
            await createMemberNotification(ticket.memberId.toString(), 'ticket', 'Support Ticket Status Updated', `Your ticket "${ticket.subject}" has been marked as ${statusLabel}`, `/member/tickets/${id}`);
            return { success: true, message: `Ticket marked as ${status}`, ticket: populated };
        },
    },
};
export default ticketResolvers;
//# sourceMappingURL=ticket.resolvers.js.map