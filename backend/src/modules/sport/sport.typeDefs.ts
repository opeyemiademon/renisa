import { gql } from 'graphql-tag';

const sportTypeDefs = gql`
  type Sport {
    id: ID!
    name: String!
    order: Int!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type SportResponse {
    success: Boolean!
    message: String!
    data: Sport
  }

  extend type Query {
    getSports(activeOnly: Boolean): [Sport!]!
  }

  extend type Mutation {
    createSport(name: String!): SportResponse!
    updateSport(id: ID!, name: String, isActive: Boolean): SportResponse!
    deleteSport(id: ID!): SportResponse!
    reorderSports(ids: [ID!]!): SportResponse!
  }
`;

export default sportTypeDefs;
