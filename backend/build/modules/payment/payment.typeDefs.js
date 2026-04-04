import { gql } from 'graphql-tag';
const paymentTypeDefs = gql `
  type Payment {
    id: ID!
    transactionRef: String!
    reference: String
    member: Member
    paymentType: PaymentType
    amount: Float!
    year: Int!
    paymentMethod: String!
    method: String
    status: String!
    paystackRef: String
    paidAt: String
    notes: String
    processedBy: AdminUser
    createdAt: String!
    updatedAt: String!
  }

  type InitiatePaymentResponse {
    success: Boolean!
    message: String!
    authorizationUrl: String
    transactionRef: String
    reference: String
    paymentId: String
  }

  type PaymentResponse {
    success: Boolean!
    message: String!
    data: Payment
  }

  input InitiatePaymentInput {
    paymentTypeId: ID!
    amount: Float
    year: Int
  }

  input RecordPaystackPaymentInput {
    reference: String!
    paymentTypeId: ID!
    amount: Float!
    year: Int
  }

  input SubmitManualPaymentInput {
    paymentTypeId: ID!
    year: Int
    referenceNumber: String!
    notes: String
  }

  input AdminRecordPaymentInput {
    memberId: ID!
    paymentTypeId: ID!
    amount: Float!
    year: Int
    paymentMethod: String
    notes: String
    reference: String
  }

  extend type Query {
    getAllPayments(memberId: ID, status: String, year: Int, paymentTypeId: ID, dateFrom: String, dateTo: String, reference: String): [Payment!]!
    getMemberPayments(memberId: ID!): [Payment!]!
    getPayment(id: ID!): Payment
  }

  extend type Mutation {
    initiatePayment(data: InitiatePaymentInput!): InitiatePaymentResponse!
    verifyPayment(reference: String!): PaymentResponse!
    adminRecordPayment(data: AdminRecordPaymentInput!): PaymentResponse!
    deletePayment(id: ID!): PaymentResponse!
    submitManualPayment(data: SubmitManualPaymentInput!): PaymentResponse!
    recordPaystackPayment(data: RecordPaystackPaymentInput!): PaymentResponse!
  }
`;
export default paymentTypeDefs;
//# sourceMappingURL=payment.typeDefs.js.map