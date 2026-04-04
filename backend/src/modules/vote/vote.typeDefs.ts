import { gql } from 'graphql-tag';

const voteTypeDefs = gql`
  type Vote {
    id: ID!
    electionId: Election!
    positionId: ElectoralPosition!
    voterId: Member!
    candidateId: Candidate!
    votedAt: String!
    createdAt: String!
  }

  type VoteResult {
    candidateId: String!
    candidateName: String!
    positionId: String!
    positionTitle: String!
    voteCount: Int!
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
    getElectionResults(electionId: ID!): [VoteResult!]!
    hasVoted(electionId: ID!): Boolean!
    checkMemberEligibility(electionId: ID!): EligibilityResult!
  }

  extend type Mutation {
    castVote(data: CastVoteInput!): VoteResponse!
  }
`;

export default voteTypeDefs;
