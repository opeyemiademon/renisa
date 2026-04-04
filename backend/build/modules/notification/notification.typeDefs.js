import { gql } from 'graphql-tag';
const notificationTypeDefs = gql `
  type Notification {
    id: ID!
    type: String!
    title: String!
    message: String!
    refId: ID
    refModel: String
    isRead: Boolean!
    createdAt: String!
  }

  type NotificationListResponse {
    notifications: [Notification!]!
    unreadCount: Int!
  }

  extend type Query {
    getNotifications(limit: Int, onlyUnread: Boolean): NotificationListResponse!
  }

  extend type Mutation {
    markNotificationRead(id: ID!): Notification!
    markAllNotificationsRead: Boolean!
  }
`;
export default notificationTypeDefs;
//# sourceMappingURL=notification.typeDefs.js.map