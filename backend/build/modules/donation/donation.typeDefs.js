import { gql } from 'graphql-tag';
const donationTypeDefs = gql `
  type Donation {
    id: ID!
    donorName: String!
    donorEmail: String
    donorPhone: String
    donorAddress: String
    donorCity: String
    donorState: String
    memberId: Member
    member: Member
    donationTypeId: DonationType
    donationType: DonationType
    donationMode: String!
    physicalItems: String
    items: String
    quantity: Int
    estimatedValue: Float
    preferredDropoffDate: String
    amount: Float
    currency: String!
    invoiceId: DonationInvoice
    invoice: DonationInvoice
    paymentMethod: String
    paymentStatus: String!
    paystackRef: String
    manualTransferReference: String
    paidAt: String
    notes: String
    description: String
    adminNotes: String
    status: String!
    isAcknowledged: Boolean
    isMonetary: Boolean
    acknowledgedBy: AdminUser
    acknowledgedAt: String
    createdAt: String!
    updatedAt: String!
  }

  type DonationResponse {
    success: Boolean!
    message: String!
    data: Donation
    authorizationUrl: String
    invoiceNumber: String
  }

  input SubmitPhysicalDonationInput {
    donorName: String!
    donorEmail: String
    donorPhone: String
    donorAddress: String
    donorCity: String
    donorState: String
    memberId: ID
    donationTypeId: ID!
    physicalItems: String!
    quantity: Int
    estimatedValue: Float
    preferredDropoffDate: String
    notes: String
  }

  input InitiateMonetaryDonationInput {
    donorName: String!
    donorEmail: String!
    donorPhone: String
    donorAddress: String
    donorCity: String
    donorState: String
    memberId: ID
    donationTypeId: ID!
    amount: Float!
    currency: String
    notes: String
  }

  input SubmitManualMonetaryDonationInput {
    donorName: String!
    donorEmail: String!
    donorPhone: String
    donorAddress: String
    donorCity: String
    donorState: String
    memberId: ID
    donationTypeId: ID!
    amount: Float!
    currency: String
    notes: String
    manualTransferReference: String!
  }

  extend type Query {
    getAllDonations(status: String, donationMode: String): [Donation!]!
    getDonation(id: ID!): Donation
  }

  extend type Mutation {
    submitPhysicalDonation(data: SubmitPhysicalDonationInput!): DonationResponse!
    initiateMonetaryDonation(data: InitiateMonetaryDonationInput!): DonationResponse!
    submitManualMonetaryDonation(data: SubmitManualMonetaryDonationInput!): DonationResponse!
    verifyDonationPayment(reference: String!): DonationResponse!
    acknowledgeDonation(id: ID!, adminNotes: String): DonationResponse!
  }
`;
export default donationTypeDefs;
//# sourceMappingURL=donation.typeDefs.js.map