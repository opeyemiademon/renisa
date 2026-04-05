import { gql } from 'graphql-tag';
const voteTypeDefs = gql `
  type Vote {
    id: ID!
    electionId: Election!
    positionId: ElectoralPosition!
    voterId: Member!
    candidateId: Candidate!
    votedAt: String!
    createdAt: String!
  }

  type CandidateVoteTally {
    candidateId: ID!
    candidateName: String!
    voteCount: Int!
    percentage: Float!
  }

  type ElectionPositionResults {
    positionId: ID!
    positionTitle: String!
    totalVotes: Int!
    candidates: [CandidateVoteTally!]!
  }

  type VoteResponse {
    success: Boolean!
    message: String!
    data: Vote
  }

  type EligibilityResult {
    eligible: Boolean!
    reasons: [String!]!
  }

  input VoteInput {
    positionId: ID!
    candidateId: ID!
  }

  input CastVoteInput {
    electionId: ID!
    votes: [VoteInput!]!
  }

  extend type Query {
    getElectionResults(electionId: ID!): [ElectionPositionResults!]!
    hasVoted(electionId: ID!): Boolean!
    checkMemberEligibility(electionId: ID!): EligibilityResult!
  }

  extend type Mutation {
    castVote(data: CastVoteInput!): VoteResponse!
  }
`;
export default voteTypeDefs;
//# sourceMappingURL=vote.typeDefs.js.map