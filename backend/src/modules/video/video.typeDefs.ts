import { gql } from 'graphql-tag';

const videoTypeDefs = gql`
  type Video {
    id: ID!
    title: String!
    slug: String!
    description: String
    videoUrl: String!
    thumbnailUrl: String
    category: String
    status: String!
    isFeatured: Boolean!
    views: Int!
    createdBy: AdminUser
    publishedAt: String
    createdAt: String!
    updatedAt: String!
  }

  type VideoResponse {
    success: Boolean!
    message: String!
    data: Video
  }

  input CreateVideoInput {
    title: String!
    slug: String
    description: String
    videoUrl: String!
    thumbnailUrl: String
    category: String
    status: String
    isFeatured: Boolean
  }

  input UpdateVideoInput {
    title: String
    slug: String
    description: String
    videoUrl: String
    thumbnailUrl: String
    category: String
    status: String
    isFeatured: Boolean
  }

  extend type Query {
    getAllVideos(status: String, category: String): [Video!]!
    getVideo(id: ID!): Video
    getVideoBySlug(slug: String!): Video
    getFeaturedVideos: [Video!]!
    getVideoCategories: [String!]!
  }

  extend type Mutation {
    createVideo(data: CreateVideoInput!): VideoResponse!
    updateVideo(id: ID!, data: UpdateVideoInput!): VideoResponse!
    deleteVideo(id: ID!): VideoResponse!
    publishVideo(id: ID!): VideoResponse!
    archiveVideo(id: ID!): VideoResponse!
  }
`;

export default videoTypeDefs;
