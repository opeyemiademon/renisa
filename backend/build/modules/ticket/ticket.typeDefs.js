import { gql } from 'graphql-tag';
const ticketTypeDefs = gql `
  type TicketReply {
    id: ID!
    authorId: ID!
    authorType: String!
    authorName: String!
    message: String!
    attachments: [String!]!
    createdAt: String!
  }

  type Ticket {
    id: ID!
    member: Member
    subject: String!
    description: String!
    status: String!
    priority: String!
    attachments: [String!]!
    replies: [TicketReply!]!
    closedAt: String
    closedBy: String
    createdAt: String!
    updatedAt: String!
  }

  type TicketResponse {
    success: Boolean!
    message: String!
    ticket: Ticket
  }

  input CreateTicketInput {
    subject: String!
    description: String!
    priority: String
    attachments: [String!]
  }

  input ReplyTicketInput {
    ticketId: ID!
    message: String!
    attachments: [String!]
  }

  extend type Query {
    getMyTickets(status: String): [Ticket!]!
    getTicket(id: ID!): Ticket
    getAllTickets(status: String, memberId: ID, priority: String): [Ticket!]!
  }

  extend type Mutation {
    createTicket(data: CreateTicketInput!): TicketResponse!
    replyToTicket(data: ReplyTicketInput!): TicketResponse!
    adminReplyToTicket(data: ReplyTicketInput!): TicketResponse!
    updateTicketStatus(id: ID!, status: String!): TicketResponse!
  }
`;
export default ticketTypeDefs;
//# sourceMappingURL=ticket.typeDefs.js.map