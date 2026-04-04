import { gql } from 'graphql-tag';
const memberNotificationTypeDefs = gql `
  type MemberNotification {
    id: ID!
    type: String!
    title: String!
    message: String!
    link: String
    isRead: Boolean!
    createdAt: String!
  }

  type MemberNotificationListResponse {
    notifications: [MemberNotification!]!
    unreadCount: Int!
  }

  extend type Query {
    getMemberNotifications(limit: Int): MemberNotificationListResponse!
  }

  extend type Mutation {
    markMemberNotificationRead(id: ID!): MemberNotification!
    markAllMemberNotificationsRead: Boolean!
  }
`;
export default memberNotificationTypeDefs;
//# sourceMappingURL=memberNotification.typeDefs.js.map