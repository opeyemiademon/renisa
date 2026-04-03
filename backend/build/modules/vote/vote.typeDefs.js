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

  extend type Query {
    getElectionResults(electionId: ID!): [VoteResult!]!
    hasVoted(electionId: ID!, positionId: ID!): Boolean!
  }

  extend type Mutation {
    castVote(electionId: ID!, positionId: ID!, candidateId: ID!): VoteResponse!
  }
`;
export default voteTypeDefs;
//# sourceMappingURL=vote.typeDefs.js.map