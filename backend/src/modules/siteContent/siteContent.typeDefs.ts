import { gql } from 'graphql-tag';

const siteContentTypeDefs = gql`
  scalar JSON

  type SiteContent {
    id: ID!
    section: String!
    title: String
    content: String
    metadata: JSON
    lastUpdatedBy: AdminUser
    createdAt: String!
    updatedAt: String!
  }

  type SiteContentResponse {
    success: Boolean!
    message: String!
    data: SiteContent
  }

  input UpdateSiteContentInput {
    title: String
    content: String
    metadata: JSON
  }

  extend type Query {
    getSiteContent(section: String!): SiteContent
    getAllSiteContent: [SiteContent!]!
  }

  extend type Mutation {
    updateSiteContent(section: String!, data: UpdateSiteContentInput!): SiteContentResponse!
  }
`;

export default siteContentTypeDefs;
