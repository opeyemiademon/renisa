import { gql } from 'graphql-tag';
const awardCategoryTypeDefs = gql `
  type AwardCategory {
    id: ID!
    name: String!
    description: String
    icon: String
    isActive: Boolean!
    createdBy: AdminUser
    createdAt: String!
    updatedAt: String!
  }

  type AwardCategoryResponse {
    success: Boolean!
    message: String!
    data: AwardCategory
  }

  input CreateAwardCategoryInput {
    name: String!
    description: String
    icon: String
    isActive: Boolean
  }

  input UpdateAwardCategoryInput {
    name: String
    description: String
    icon: String
    isActive: Boolean
  }

  extend type Query {
    getAllAwardCategories: [AwardCategory!]!
    getAwardCategory(id: ID!): AwardCategory
  }

  extend type Mutation {
    createAwardCategory(data: CreateAwardCategoryInput!): AwardCategoryResponse!
    updateAwardCategory(id: ID!, data: UpdateAwardCategoryInput!): AwardCategoryResponse!
    deleteAwardCategory(id: ID!): AwardCategoryResponse!
  }
`;
export default awardCategoryTypeDefs;
//# sourceMappingURL=awardCategory.typeDefs.js.map