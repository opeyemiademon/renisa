import { gql } from 'graphql-tag';
const idCardRequestTypeDefs = gql `
  type IDCardRequest {
    id: ID!
    memberId: Member
    member: Member
    requestType: String!
    uploadedPhoto: String
    photo: String
    amount: Float!
    paymentRef: String
    paymentStatus: String!
    paidAt: String
    adminStatus: String!
    reviewedBy: AdminUser
    reviewedAt: String
    rejectionReason: String
    generatedCardFront: String
    generatedCardBack: String
    cardUrl: String
    downloadCount: Int!
    deliveryAddress: String
    deliveryStatus: String
    trackingInfo: String
    createdAt: String!
    updatedAt: String!
  }

  type IDCardRequestResponse {
    success: Boolean!
    message: String!
    data: IDCardRequest
    authorizationUrl: String
    reference: String
  }

  input RequestIDCardInput {
    requestType: String!
    uploadedPhoto: String
    photo: String
    deliveryAddress: String
  }

  extend type Query {
    getMyIDCardRequests: [IDCardRequest!]!
    getAllIDCardRequests(adminStatus: String, paymentStatus: String): [IDCardRequest!]!
    getIDCardRequest(id: ID!): IDCardRequest
  }

  extend type Mutation {
    requestIDCard(data: RequestIDCardInput!): IDCardRequestResponse!
    initiateIDCardPayment(requestId: ID!): IDCardRequestResponse!
    verifyIDCardPayment(reference: String!): IDCardRequestResponse!
    approveIDCardRequest(id: ID!): IDCardRequestResponse!
    rejectIDCardRequest(id: ID!, reason: String!): IDCardRequestResponse!
    updateIDCardDeliveryStatus(id: ID!, deliveryStatus: String!, trackingInfo: String): IDCardRequestResponse!
    manualIDCardPayment(requestId: ID!, referenceNumber: String!, notes: String): IDCardRequestResponse!
    confirmIDCardPaystackPayment(requestId: ID!, reference: String!, amount: Float!): IDCardRequestResponse!
  }
`;
export default idCardRequestTypeDefs;
//# sourceMappingURL=idCardRequest.typeDefs.js.map