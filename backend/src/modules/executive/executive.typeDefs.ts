import { gql } from 'graphql-tag';

const executiveTypeDefs = gql`
  type Executive {
    id: ID!
    memberId: Member
    member: Member
    name: String!
    position: String!
    title: String
    order: Int!
    displayOrder: Int
    tenure: String
    bio: String
    profilePicture: String
    photo: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type ExecutiveResponse {
    success: Boolean!
    message: String!
    data: Executive
  }

  input CreateExecutiveInput {
    memberId: ID
    name: String!
    position: String
    title: String
    order: Int
    displayOrder: Int
    tenure: String
    bio: String
    profilePicture: String
    photo: String
    isActive: Boolean
  }

  input UpdateExecutiveInput {
    memberId: ID
    name: String
    position: String
    title: String
    order: Int
    displayOrder: Int
    tenure: String
    bio: String
    profilePicture: String
    photo: String
    isActive: Boolean
  }

  input ReorderExecutiveInput {
    id: ID!
    order: Int!
  }

  extend type Query {
    getAllExecutives(isActive: Boolean): [Executive!]!
    getExecutive(id: ID!): Executive
  }

  extend type Mutation {
    createExecutive(data: CreateExecutiveInput!): ExecutiveResponse!
    updateExecutive(id: ID!, data: UpdateExecutiveInput!): ExecutiveResponse!
    deleteExecutive(id: ID!): ExecutiveResponse!
    reorderExecutives(items: [ReorderExecutiveInput!]!): ExecutiveResponse!
  }
`;

export default executiveTypeDefs;
