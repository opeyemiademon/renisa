import { gql } from 'graphql-tag';
const electionTypeDefs = gql `
  type EligibilityCriteria {
    minimumMembershipYears: Int
    paymentYears: [Int]
    mustBeActive: Boolean
  }

  type Election {
    id: ID!
    title: String!
    description: String
    nominationStartDate: String
    nominationEndDate: String
    votingStartDate: String
    votingEndDate: String
    status: String!
    eligibilityCriteria: EligibilityCriteria
    createdBy: AdminUser
    createdAt: String!
    updatedAt: String!
  }

  type ElectionResponse {
    success: Boolean!
    message: String!
    data: Election
  }

  input EligibilityCriteriaInput {
    minimumMembershipYears: Int
    paymentYears: [Int]
    mustBeActive: Boolean
  }

  input CreateElectionInput {
    title: String!
    description: String
    nominationStartDate: String
    nominationEndDate: String
    votingStartDate: String
    votingEndDate: String
    eligibilityCriteria: EligibilityCriteriaInput
  }

  input UpdateElectionInput {
    title: String
    description: String
    nominationStartDate: String
    nominationEndDate: String
    votingStartDate: String
    votingEndDate: String
    eligibilityCriteria: EligibilityCriteriaInput
  }

  extend type Query {
    getAllElections: [Election!]!
    getElection(id: ID!): Election
  }

  extend type Mutation {
    createElection(data: CreateElectionInput!): ElectionResponse!
    updateElection(id: ID!, data: UpdateElectionInput!): ElectionResponse!
    updateElectionStatus(id: ID!, status: String!): ElectionResponse!
    deleteElection(id: ID!): ElectionResponse!
  }
`;
export default electionTypeDefs;
//# sourceMappingURL=election.typeDefs.js.map