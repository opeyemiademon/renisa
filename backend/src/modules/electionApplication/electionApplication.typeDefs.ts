import { gql } from 'graphql-tag';

const electionApplicationTypeDefs = gql`
  type ElectionApplication {
    id: ID!
    electionId: Election!
    positionId: ElectoralPosition!
    memberId: Member!
    manifesto: String
    photoUrl: String
    paymentStatus: String!
    paymentReference: String
    paymentAmount: Float!
    paymentDate: String
    status: String!
    approvedBy: AdminUser
    approvedAt: String
    rejectionReason: String
    rejectedBy: AdminUser
    rejectedAt: String
    createdAt: String!
    updatedAt: String!
  }

  type ApplicationResponse {
    success: Boolean!
    message: String!
    data: ElectionApplication
  }

  input CreateApplicationInput {
    electionId: ID!
    positionId: ID!
    manifesto: String!
    photoBase64: String
  }

  input UpdateApplicationPaymentInput {
    paymentReference: String!
    paymentAmount: Float!
  }

  input ApproveApplicationInput {
    applicationId: ID!
  }

  input RejectApplicationInput {
    applicationId: ID!
    rejectionReason: String!
  }

  extend type Query {
    getElectionApplications(electionId: ID!): [ElectionApplication!]!
    getMyApplications: [ElectionApplication!]!
    getMyApplicationForElection(electionId: ID!): ElectionApplication
    getApplicationsByPosition(positionId: ID!): [ElectionApplication!]!
    getPendingApplications(electionId: ID): [ElectionApplication!]!
  }

  extend type Mutation {
    submitApplication(data: CreateApplicationInput!): ApplicationResponse!
    updateApplicationPayment(applicationId: ID!, data: UpdateApplicationPaymentInput!): ApplicationResponse!
    confirmApplicationPaystackPayment(applicationId: ID!, reference: String!, amount: Float!): ApplicationResponse!
    approveApplication(data: ApproveApplicationInput!): ApplicationResponse!
    rejectApplication(data: RejectApplicationInput!): ApplicationResponse!
    deleteApplication(applicationId: ID!): ApplicationResponse!
  }
`;

export default electionApplicationTypeDefs;
