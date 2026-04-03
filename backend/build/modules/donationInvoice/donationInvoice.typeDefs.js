import { gql } from 'graphql-tag';
const donationInvoiceTypeDefs = gql `
  type DonationInvoice {
    id: ID!
    invoiceNumber: String!
    donationId: Donation!
    donorName: String!
    donorEmail: String
    donationTypeName: String!
    amount: Float!
    currency: String!
    dueDate: String
    status: String!
    pdfUrl: String
    createdAt: String!
    updatedAt: String!
  }

  type DonationInvoiceResponse {
    success: Boolean!
    message: String!
    data: DonationInvoice
  }

  extend type Query {
    getAllDonationInvoices(page: Int, limit: Int, status: String): DonationInvoiceListResponse!
    getDonationInvoice(id: ID!): DonationInvoice
    getDonationInvoiceByNumber(invoiceNumber: String!): DonationInvoice
  }

  type DonationInvoiceListResponse {
    invoices: [DonationInvoice!]!
    total: Int!
    page: Int!
    limit: Int!
  }

  extend type Mutation {
    updateDonationInvoiceStatus(id: ID!, status: String!): DonationInvoiceResponse!
  }
`;
export default donationInvoiceTypeDefs;
//# sourceMappingURL=donationInvoice.typeDefs.js.map