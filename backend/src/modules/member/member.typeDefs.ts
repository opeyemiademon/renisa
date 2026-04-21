import { gql } from 'graphql-tag';

const memberTypeDefs = gql`
  type Member {
    id: ID!
    memberNumber: String
    memberCode: String
    firstName: String!
    lastName: String!
    middleName: String
    email: String!
    phone: String
    alternatePhone: String
    dateOfBirth: String
    gender: String
    sport: String
    stateOfOrigin: String
    lga: String
    address: String
    city: String
    state: String
    profilePicture: String
    membershipYear: Int
    isAlumni: Boolean
    alumniYear: Int
    membershipStatus: String!
    status: String
    role: String!
    isEmailVerified: Boolean!
    lastLogin: String
    bio: String
    socialLinks: MemberSocialLinks
    createdAt: String!
    updatedAt: String!
  }

  type MemberAuthPayload {
    token: String!
    member: Member
  }

  type MemberResponse {
    success: Boolean!
    message: String!
    data: Member
  }

  input RegisterMemberInput {
    memberCode: String!
    firstName: String!
    lastName: String!
    middleName: String
    email: String!
    password: String!
    phone: String
    alternatePhone: String
    dateOfBirth: String
    gender: String
    sport: String
    stateOfOrigin: String
    lga: String
    address: String
    city: String
    state: String
    photoBase64:String
  }

  input AdminRegisterMemberInput {
    firstName: String!
    lastName: String!
    middleName: String
    email: String!
    password: String!
    phone: String
    memberCode: String
    alternatePhone: String
    dateOfBirth: String
    gender: String
    sport: String
    stateOfOrigin: String
    lga: String
    address: String
    city: String
    state: String
    membershipYear: Int
    profilePicture: String
    photoBase64: String
    role: String
    membershipStatus: String
  }

  input MemberLoginInput {
    email: String!
    password: String!
  }

  type MemberSocialLinks {
    twitter: String
    linkedin: String
    facebook: String
    instagram: String
    website: String
  }

  input MemberSocialLinksInput {
    twitter: String
    linkedin: String
    facebook: String
    instagram: String
    website: String
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  input ResetMemberPasswordInput {
    token: String!
    newPassword: String!
  }

  type MemberPasswordResetResponse {
    success: Boolean!
    message: String!
  }

  input UpdateMemberInput {
    firstName: String
    lastName: String
    middleName: String
    phone: String
    alternatePhone: String
    dateOfBirth: String
    gender: String
    sport: String
    stateOfOrigin: String
    lga: String
    address: String
    city: String
    state: String
    profilePicture: String
    photoBase64: String
    bio: String
    socialLinks: MemberSocialLinksInput
  }

  type CheckMemberCodeResponse {
    valid: Boolean!
    message: String
  }

  type PublicSiteStats {
    activeMembers: Int!
    alumniMembers: Int!
    publishedEvents: Int!
    galleryPhotos: Int!
    awardedHonors: Int!
  }

  type PublicMemberProfile {
    id: ID!
    firstName: String!
    lastName: String!
    middleName: String
    memberNumber: String
    sport: String
    state: String
    stateOfOrigin: String
    city: String
    profilePicture: String
    isAlumni: Boolean
    bio: String
    gender: String
    createdAt: String!
  }

  type Query {
    getAllMembers(search: String, status: String, memberNumber: String, memberCode: String, email: String, gender: String, state: String, dateFrom: String, dateTo: String, name: String): [Member!]!
    getMember(id: ID!): Member
    getMemberByNumber(memberNumber: String!): Member
    checkMemberCode(code: String!): CheckMemberCodeResponse
    getAlumni: [Member!]!
    getNewMembers(limit: Int): [Member!]!
    getPublicMembers: [Member!]!
    getPublicSiteStats: PublicSiteStats!
    getPublicMemberProfile(id: ID!): PublicMemberProfile
    me: Member
  }

  type Mutation {
    loginMember(data: MemberLoginInput!): MemberAuthPayload!
    registerMember(data: RegisterMemberInput!): MemberAuthPayload!
    requestMemberPasswordReset(email: String!): MemberPasswordResetResponse!
    resetMemberPassword(data: ResetMemberPasswordInput!): MemberPasswordResetResponse!
    adminRegisterMember(data: AdminRegisterMemberInput!): MemberResponse!
    updateMember(id: ID!, data: UpdateMemberInput!): MemberResponse!
    updateMemberStatus(id: ID!, status: String!): MemberResponse!
    deleteMember(id: ID!): MemberResponse!
    markMemberAsAlumni(id: ID!, alumniYear: Int): MemberResponse!
    loginAsMember(id: ID!): MemberAuthPayload!
    changePassword(data: ChangePasswordInput!): MemberResponse!
  }
`;

export default memberTypeDefs;
