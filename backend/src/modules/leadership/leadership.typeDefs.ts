import { gql } from 'graphql-tag';

const leadershipTypeDefs = gql`
  type Leadership {
    id: ID!
    groupId: LeadershipGroup!
    group: LeadershipGroup
    memberId: Member
    member: Member
    slug: String
    # Derived at resolve-time from member or non-member fields
    name: String!
    profilePicture: String
    photo: String
    title: String
    position: String!
    order: Int!
    tenure: String
    state: String
    isActive: Boolean!
    isCurrent: Boolean!
    nonMemberName: String
    nonMemberPhoto: String
    nonMemberBio: String
    createdBy: AdminUser
    createdAt: String!
    updatedAt: String!
  }

  type LeadershipResponse {
    success: Boolean!
    message: String!
    data: Leadership
  }

  input CreateLeadershipInput {
    groupId: ID!
    memberId: ID
    position: String!
    order: Int
    tenure: String
    state: String
    isActive: Boolean
    isCurrent: Boolean
    nonMemberName: String
    nonMemberPhoto: String
    nonMemberBio: String
  }

  input UpdateLeadershipInput {
    groupId: ID
    position: String
    order: Int
    tenure: String
    state: String
    isActive: Boolean
    isCurrent: Boolean
    nonMemberName: String
    nonMemberPhoto: String
    nonMemberBio: String
  }

  input ReorderLeadershipInput {
    id: ID!
    order: Int!
  }

  extend type Query {
    getAllLeadership(groupId: ID, groupSlug: String, isCurrent: Boolean, state: String): [Leadership!]!
    getLeadership(id: ID!): Leadership
    getLeadershipBySlug(slug: String!): Leadership
  }

  extend type Mutation {
    createLeadership(data: CreateLeadershipInput!): LeadershipResponse!
    updateLeadership(id: ID!, data: UpdateLeadershipInput!): LeadershipResponse!
    deleteLeadership(id: ID!): LeadershipResponse!
    reorderLeadership(items: [ReorderLeadershipInput!]!): LeadershipResponse!
    markLeadershipInactive(id: ID!): LeadershipResponse!
  }
`;

export default leadershipTypeDefs;
