import { gql } from 'graphql-tag';

const paymentTypeTypeDefs = gql`
  type PaymentType {
    id: ID!
    name: String!
    description: String
    amount: Float!
    currency: String!
    isRecurring: Boolean!
    frequency: String!
    isActive: Boolean!
    dueDate: String
    createdBy: AdminUser
    createdAt: String!
    updatedAt: String!
  }

  type PaymentTypeResponse {
    success: Boolean!
    message: String!
    data: PaymentType
  }

  input CreatePaymentTypeInput {
    name: String!
    description: String
    amount: Float!
    currency: String
    isRecurring: Boolean
    frequency: String
    isActive: Boolean
    dueDate: String
  }

  input UpdatePaymentTypeInput {
    name: String
    description: String
    amount: Float
    currency: String
    isRecurring: Boolean
    frequency: String
    isActive: Boolean
    dueDate: String
  }

  extend type Query {
    getAllPaymentTypes: [PaymentType!]!
    getPaymentType(id: ID!): PaymentType
  }

  extend type Mutation {
    createPaymentType(data: CreatePaymentTypeInput!): PaymentTypeResponse!
    updatePaymentType(id: ID!, data: UpdatePaymentTypeInput!): PaymentTypeResponse!
    deletePaymentType(id: ID!): PaymentTypeResponse!
  }
`;

export default paymentTypeTypeDefs;
