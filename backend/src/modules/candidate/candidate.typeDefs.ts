import { gql } from 'graphql-tag';

const candidateTypeDefs = gql`
  type Candidate {
    id: ID!
    electionId: Election!
    positionId: ElectoralPosition!
    memberId: Member!
    member: Member
    position: ElectoralPosition
    manifesto: String
    formPaymentRef: String
    formPaymentStatus: String!
    isApproved: Boolean!
    isRejected: Boolean!
    rejectionReason: String
    approvedBy: AdminUser
    reviewedBy: AdminUser
    reviewedAt: String
    profilePicture: String
    manifestoSubmitted: Boolean!
    status: String
    createdAt: String!
    updatedAt: String!
  }

  type CandidateResponse {
    success: Boolean!
    message: String!
    data: Candidate
    candidateId: ID
  }

  input SubmitCandidacyInput {
    electionId: ID!
    positionId: ID!
    manifesto: String!
    profilePicture: String
  }

  extend type Query {
    getCandidates(electionId: ID!, positionId: ID): [Candidate!]!
    getCandidate(id: ID!): Candidate
    getBallotCandidates(electionId: ID!): [Candidate!]!
  }

  extend type Mutation {
    applyForPosition(electionId: ID!, positionId: ID!): CandidateResponse!
    confirmCandidateFormPayment(candidateId: ID!, reference: String!): CandidateResponse!
    manualCandidateFormPayment(candidateId: ID!, referenceNumber: String!, notes: String): CandidateResponse!
    submitCandidacy(data: SubmitCandidacyInput!): CandidateResponse!
    approveCandidate(id: ID!): CandidateResponse!
    rejectCandidate(id: ID!, reason: String): CandidateResponse!
  }
`;

export default candidateTypeDefs;
