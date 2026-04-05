import { AuthContext } from '../../middleware/auth.js';
declare const ticketResolvers: {
    Ticket: {
        id: (p: any) => any;
        member: (p: any) => any;
    };
    TicketReply: {
        id: (p: any) => any;
        createdAt: (p: any) => any;
    };
    Query: {
        getMyTickets: (_: any, { status }: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, import("./ticket.model.js").ITicket, {}, {}> & import("./ticket.model.js").ITicket & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[]>;
        getTicket: (_: any, { id }: any, context: AuthContext) => Promise<import("mongoose").Document<unknown, {}, import("./ticket.model.js").ITicket, {}, {}> & import("./ticket.model.js").ITicket & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }>;
        getAllTickets: (_: any, { status, memberId, priority }: any, context: AuthContext) => Promise<(import("mongoose").Document<unknown, {}, import("./ticket.model.js").ITicket, {}, {}> & import("./ticket.model.js").ITicket & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[]>;
    };
    Mutation: {
        createTicket: (_: any, { data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            ticket: (import("mongoose").Document<unknown, {}, import("./ticket.model.js").ITicket, {}, {}> & import("./ticket.model.js").ITicket & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            }) | null;
        }>;
        replyToTicket: (_: any, { data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            ticket: (import("mongoose").Document<unknown, {}, import("./ticket.model.js").ITicket, {}, {}> & import("./ticket.model.js").ITicket & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            }) | null;
        }>;
        adminReplyToTicket: (_: any, { data }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            ticket: (import("mongoose").Document<unknown, {}, import("./ticket.model.js").ITicket, {}, {}> & import("./ticket.model.js").ITicket & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            }) | null;
        }>;
        updateTicketStatus: (_: any, { id, status }: any, context: AuthContext) => Promise<{
            success: boolean;
            message: string;
            ticket: (import("mongoose").Document<unknown, {}, import("./ticket.model.js").ITicket, {}, {}> & import("./ticket.model.js").ITicket & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            }) | null;
        }>;
    };
};
export default ticketResolvers;
//# sourceMappingURL=ticket.resolvers.d.ts.map