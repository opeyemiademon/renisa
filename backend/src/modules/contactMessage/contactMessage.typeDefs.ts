import { gql } from 'graphql-tag';

const contactMessageTypeDefs = gql`
  type ContactMessage {
    id: ID!
    name: String!
    email: String!
    subject: String!
    message: String!
    read: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type ContactMessageResponse {
    success: Boolean!
    message: String!
    data: ContactMessage
  }

  input SubmitContactMessageInput {
    name: String!
    email: String!
    subject: String!
    message: String!
    captchaA: Int!
    captchaB: Int!
    captchaAnswer: Int!
  }

  extend type Query {
    getContactMessages: [ContactMessage!]!
    getContactMessage(id: ID!): ContactMessage
  }

  extend type Mutation {
    submitContactMessage(data: SubmitContactMessageInput!): ContactMessageResponse!
    markContactMessageRead(id: ID!): ContactMessageResponse!
  }
`;

export default contactMessageTypeDefs;
