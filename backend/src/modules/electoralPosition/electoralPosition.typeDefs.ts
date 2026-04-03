import { gql } from 'graphql-tag';

const electoralPositionTypeDefs = gql`
  type ElectoralPosition {
    id: ID!
    electionId: Election!
    title: String!
    description: String
    formFee: Float!
    maxCandidates: Int
    maxVotesPerVoter: Int!
    createdAt: String!
    updatedAt: String!
  }

  type ElectoralPositionResponse {
    success: Boolean!
    message: String!
    data: ElectoralPosition
  }

  input CreateElectoralPositionInput {
    electionId: ID!
    title: String!
    description: String
    formFee: Float
    maxCandidates: Int
    maxVotesPerVoter: Int
  }

  input UpdateElectoralPositionInput {
    title: String
    description: String
    formFee: Float
    maxCandidates: Int
    maxVotesPerVoter: Int
  }

  extend type Query {
    getElectionPositions(electionId: ID!): [ElectoralPosition!]!
    getElectoralPosition(id: ID!): ElectoralPosition
  }

  extend type Mutation {
    createElectoralPosition(data: CreateElectoralPositionInput!): ElectoralPositionResponse!
    updateElectoralPosition(id: ID!, data: UpdateElectoralPositionInput!): ElectoralPositionResponse!
    deleteElectoralPosition(id: ID!): ElectoralPositionResponse!
  }
`;

export default electoralPositionTypeDefs;
