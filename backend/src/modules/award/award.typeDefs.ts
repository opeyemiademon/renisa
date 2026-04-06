import { gql } from 'graphql-tag';

const awardTypeDefs = gql`
  type Award {
    id: ID!
    memberId: Member!
    member: Member
    categoryId: AwardCategory!
    category: AwardCategory
    # Derived at resolve-time from linked member and category
    recipientName: String!
    title: String!
    recipientPhoto: String
    year: Int!
    votingEnabled: Boolean!
    votingStartDate: String
    votingEndDate: String
    totalVotes: Int
    nominatedBy: AdminUser
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type AwardResponse {
    success: Boolean!
    message: String!
    data: Award
  }

  input CreateAwardInput {
    memberId: ID!
    categoryId: ID!
    year: Int
    votingEndDate: String
    status: String
  }

  input UpdateAwardInput {
    memberId: ID
    categoryId: ID
    year: Int
    votingEndDate: String
    status: String
  }

  extend type Query {
    getAllAwards(year: Int, status: String, categoryId: ID, votingEnabled: Boolean, memberName: String, limit: Int): [Award!]!
    getAward(id: ID!): Award
  }

  extend type Mutation {
    createAward(data: CreateAwardInput!): AwardResponse!
    updateAward(id: ID!, data: UpdateAwardInput!): AwardResponse!
    deleteAward(id: ID!): AwardResponse!
    enableAwardVoting(id: ID!, votingStartDate: String, votingEndDate: String): AwardResponse!
  }
`;

export default awardTypeDefs;
