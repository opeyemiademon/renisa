import { gql } from 'graphql-tag';

const communicationTypeDefs = gql`
  type Communication {
    id: ID!
    subject: String!
    message: String!
    type: String!
    recipients: String!
    filterState: String
    specificMembers: [Member]
    status: String!
    sentCount: Int!
    failedCount: Int!
    sentBy: AdminUser
    sentAt: String
    createdAt: String!
    updatedAt: String!
  }

  type CommunicationResponse {
    success: Boolean!
    message: String!
    data: Communication
  }

  input SendCommunicationInput {
    subject: String!
    message: String!
    recipients: String!
    filterState: String
    specificMembers: [ID]
  }

  type CommunicationListResponse {
    communications: [Communication!]!
    total: Int!
    page: Int!
    limit: Int!
  }

  extend type Query {
    getAllCommunications(page: Int, limit: Int): CommunicationListResponse!
    getCommunication(id: ID!): Communication
  }

  extend type Mutation {
    sendCommunication(data: SendCommunicationInput!): CommunicationResponse!
  }
`;

export default communicationTypeDefs;
