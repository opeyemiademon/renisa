import { gql } from 'graphql-tag';
const idCardSettingsTypeDefs = gql `
  type IDCardSettings {
    id: ID!
    onlineFee: Float!
    physicalFee: Float!
    currency: String!
    isEnabled: Boolean!
    requiresApproval: Boolean!
    validityYears: Int!
    updatedBy: AdminUser
    updatedAt: String!
  }

  type IDCardSettingsResponse {
    success: Boolean!
    message: String!
    data: IDCardSettings
  }

  input UpdateIDCardSettingsInput {
    onlineFee: Float
    physicalFee: Float
    currency: String
    isEnabled: Boolean
    requiresApproval: Boolean
    validityYears: Int
  }

  extend type Query {
    getIDCardSettings: IDCardSettings
  }

  extend type Mutation {
    updateIDCardSettings(data: UpdateIDCardSettingsInput!): IDCardSettingsResponse!
  }
`;
export default idCardSettingsTypeDefs;
//# sourceMappingURL=idCardSettings.typeDefs.js.map