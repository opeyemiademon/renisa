import { gql } from 'graphql-tag';
const awardVoteTypeDefs = gql `
  type AwardVote {
    id: ID!
    awardId: Award!
    voterId: Member!
    votedAt: String!
    createdAt: String!
  }

  type AwardVoteResult {
    awardId: String!
    awardTitle: String!
    voteCount: Int!
  }

  type AwardVoteResponse {
    success: Boolean!
    message: String!
    data: AwardVote
  }

  extend type Query {
    getAwardVoteResults(awardId: ID): [AwardVoteResult!]!
    hasVotedForAward(awardId: ID!): Boolean!
  }

  extend type Mutation {
    castAwardVote(awardId: ID!): AwardVoteResponse!
  }
`;
export default awardVoteTypeDefs;
//# sourceMappingURL=awardVote.typeDefs.js.map