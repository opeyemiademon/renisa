import { gql } from 'graphql-tag';
const userTypeDefs = gql `
  type AdminUser {
    id: ID!
    name: String!
    email: String!
    role: String!
    isActive: Boolean!
    lastLogin: String
    createdAt: String!
    updatedAt: String!
  }

  type AdminAuthPayload {
    token: String!
    user: AdminUser!
  }

  type AdminUserResponse {
    success: Boolean!
    message: String!
    data: AdminUser
  }

  input CreateAdminUserInput {
    name: String!
    email: String!
    password: String!
    role: String!
  }

  input AdminLoginInput {
    email: String!
    password: String!
  }

  input UpdateAdminUserInput {
    name: String
    email: String
    role: String
    isActive: Boolean
    password: String
  }

  type Query {
    getAllUsers: [AdminUser!]!
    getUser(id: ID!): AdminUser
    meAdmin: AdminUser
  }

  type Mutation {
    createAdminUser(data: CreateAdminUserInput!): AdminUserResponse!
    loginAdmin(data: AdminLoginInput!): AdminAuthPayload!
    updateAdminUser(id: ID!, data: UpdateAdminUserInput!): AdminUserResponse!
    deleteAdminUser(id: ID!): AdminUserResponse!
  }
`;
export default userTypeDefs;
//# sourceMappingURL=user.typeDefs.js.map