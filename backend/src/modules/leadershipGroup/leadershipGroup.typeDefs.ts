import { gql } from 'graphql-tag';

const leadershipGroupTypeDefs = gql`
  type LeadershipGroup {
    id: ID!
    name: String!
    slug: String!
    description: String
    isActive: Boolean!
    order: Int!
    createdAt: String!
    updatedAt: String!
  }

  type LeadershipGroupResponse {
    success: Boolean!
    message: String!
    data: LeadershipGroup
  }

  input UpdateLeadershipGroupInput {
    name: String
    description: String
    isActive: Boolean
    order: Int
  }

  extend type Query {
    getAllLeadershipGroups: [LeadershipGroup!]!
    getLeadershipGroup(id: ID!): LeadershipGroup
    getLeadershipGroupBySlug(slug: String!): LeadershipGroup
  }

  extend type Mutation {
    updateLeadershipGroup(id: ID!, data: UpdateLeadershipGroupInput!): LeadershipGroupResponse!
  }
`;

export default leadershipGroupTypeDefs;
