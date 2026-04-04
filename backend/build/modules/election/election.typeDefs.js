import { gql } from 'graphql-tag';
const electionTypeDefs = gql `
  type Election {
    id: ID!
    title: String!
    description: String
    year: Int!
    startDate: String
    endDate: String
    votingStartDate: String
    votingEndDate: String
    status: String!
    positions: [ElectoralPosition!]!
    eligibilityMinYears: Int!
    requiresDuesPayment: Boolean!
    createdBy: AdminUser
    createdAt: String!
    updatedAt: String!
  }

  type ElectionResponse {
    success: Boolean!
    message: String!
    data: Election
  }

  input ElectoralPositionInput {
    title: String!
    description: String
    maxCandidates: Int
    formFee: Float
  }

  input CreateElectionInput {
    title: String!
    description: String
    year: Int
    startDate: String
    endDate: String
    votingStartDate: String
    votingEndDate: String
    eligibilityMinYears: Int
    requiresDuesPayment: Boolean
    positions: [ElectoralPositionInput]
  }

  input UpdateElectionInput {
    title: String
    description: String
    year: Int
    startDate: String
    endDate: String
    votingStartDate: String
    votingEndDate: String
    eligibilityMinYears: Int
    requiresDuesPayment: Boolean
  }

  extend type Query {
    getAllElections: [Election!]!
    getElection(id: ID!): Election
  }

  extend type Mutation {
    createElection(data: CreateElectionInput!): ElectionResponse!
    updateElection(id: ID!, data: UpdateElectionInput!): ElectionResponse!
    updateElectionStatus(id: ID!, status: String!): ElectionResponse!
    addElectoralPosition(electionId: ID!, data: ElectoralPositionInput!): ElectionResponse!
    deleteElection(id: ID!): ElectionResponse!
  }
`;
export default electionTypeDefs;
//# sourceMappingURL=election.typeDefs.js.map