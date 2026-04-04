import { gql } from 'graphql-tag';

const donationTypeTypeDefs = gql`
  type DonationType {
    id: ID!
    name: String!
    description: String
    donationMode: String!
    icon: String
    isActive: Boolean!
    sortOrder: Int!
    createdBy: AdminUser
    createdAt: String!
    updatedAt: String!
  }

  type DonationTypeResponse {
    success: Boolean!
    message: String!
    data: DonationType
  }

  input CreateDonationTypeInput {
    name: String!
    description: String
    donationMode: String
    icon: String
    isActive: Boolean
    sortOrder: Int
  }

  input UpdateDonationTypeInput {
    name: String
    description: String
    donationMode: String
    icon: String
    isActive: Boolean
    sortOrder: Int
  }

  extend type Query {
    getAllDonationTypes: [DonationType!]!
    getDonationType(id: ID!): DonationType
  }

  extend type Mutation {
    createDonationType(data: CreateDonationTypeInput!): DonationTypeResponse!
    updateDonationType(id: ID!, data: UpdateDonationTypeInput!): DonationTypeResponse!
    deleteDonationType(id: ID!): DonationTypeResponse!
  }
`;

export default donationTypeTypeDefs;
