import { gql } from 'graphql-tag';

const candidateTypeDefs = gql`
  type Candidate {
    id: ID!
    electionId: Election!
    positionId: ElectoralPosition!
    memberId: Member!
    manifesto: String
    formPaymentRef: String
    formPaymentStatus: String!
    isApproved: Boolean!
    approvedBy: AdminUser
    profilePicture: String
    createdAt: String!
    updatedAt: String!
  }

  type CandidateResponse {
    success: Boolean!
    message: String!
    data: Candidate
    authorizationUrl: String
  }

  input SubmitCandidacyInput {
    electionId: ID!
    positionId: ID!
    manifesto: String
    profilePicture: String
  }

  extend type Query {
    getCandidates(electionId: ID!, positionId: ID): [Candidate!]!
    getCandidate(id: ID!): Candidate
  }

  extend type Mutation {
    purchaseCandidateForm(electionId: ID!, positionId: ID!): CandidateResponse!
    verifyCandidateFormPayment(paystackRef: String!): CandidateResponse!
    submitCandidacy(data: SubmitCandidacyInput!): CandidateResponse!
    approveCandidate(id: ID!): CandidateResponse!
    rejectCandidate(id: ID!): CandidateResponse!
  }
`;

export default candidateTypeDefs;
