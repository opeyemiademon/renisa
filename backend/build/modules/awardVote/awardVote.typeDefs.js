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
    recipientName: String!
    categoryName: String!
    voteCount: Int!
  }

  type CategoryWinner {
    categoryId: String!
    categoryName: String!
    winner: AwardWinnerInfo
    nominees: [AwardWinnerInfo!]!
    pollActive: Boolean!
    votingStartDate: String
    votingEndDate: String
  }

  type AwardWinnerInfo {
    awardId: String!
    recipientName: String!
    recipientPhoto: String
    memberNumber: String
    voteCount: Int!
  }

  type AwardVoteResponse {
    success: Boolean!
    message: String!
    data: AwardVote
  }

  extend type Query {
    getAwardVoteResults(awardId: ID): [AwardVoteResult!]!
    getAwardWinnersReport(year: Int): [CategoryWinner!]!
    hasVotedForAward(awardId: ID!): Boolean!
  }

  extend type Mutation {
    castAwardVote(awardId: ID!): AwardVoteResponse!
  }
`;
export default awardVoteTypeDefs;
//# sourceMappingURL=awardVote.typeDefs.js.map