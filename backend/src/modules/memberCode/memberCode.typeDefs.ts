import { gql } from 'graphql-tag';

const memberCodeTypeDefs = gql`
  type MemberCode {
    id: ID!
    code: String!
    isUsed: Boolean!
    usedBy: Member
    usedAt: String
    generatedBy: AdminUser
    expiresAt: String
    batchName: String
    createdAt: String!
    updatedAt: String!
  }

  type MemberCodeResponse {
    success: Boolean!
    message: String!
    codes: [String!]
  }

  type MemberCodeDeleteResponse {
    success: Boolean!
    message: String!
  }

  type CheckMemberCodeResponse {
    valid: Boolean!
    message: String!
  }

  extend type Query {
    getAllMemberCodes: [MemberCode!]!
    getMemberCode(id: ID!): MemberCode
    checkMemberCode(code: String!): CheckMemberCodeResponse!
  }

  extend type Mutation {
    generateMemberCodes(count: Int!, batchName: String, expiresAt: String): MemberCodeResponse!
    deleteMemberCode(id: ID!): MemberCodeDeleteResponse!
  }
`;

export default memberCodeTypeDefs;
