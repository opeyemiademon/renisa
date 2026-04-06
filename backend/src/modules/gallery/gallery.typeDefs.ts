import { gql } from 'graphql-tag';

const galleryTypeDefs = gql`
  type GalleryItem {
    id: ID!
    title: String
    description: String
    caption: String
    imageUrl: String!
    thumbnailUrl: String
    albumName: String
    album: String
    eventDate: String
    year: Int!
    isFeatured: Boolean!
    uploadedBy: AdminUser
    createdAt: String!
    updatedAt: String!
  }

  type GalleryResponse {
    success: Boolean!
    message: String!
    data: GalleryItem
  }

  input CreateGalleryInput {
    title: String
    description: String
    imageUrl: String!
    thumbnailUrl: String
    albumName: String
    eventDate: String
    year: Int
    isFeatured: Boolean
  }

  input AddGalleryItemInput {
    imageUrl: String!
    caption: String
    album: String
    year: Int
  }

  input UpdateGalleryInput {
    title: String
    description: String
    caption: String
    imageUrl: String
    thumbnailUrl: String
    albumName: String
    album: String
    eventDate: String
    year: Int
    isFeatured: Boolean
  }

  extend type Query {
    getAllGallery(albumName: String, year: Int): [GalleryItem!]!
    getGallery(albumName: String, year: Int): [GalleryItem!]!
    getGalleryItem(id: ID!): GalleryItem
    getGalleryAlbums: [String!]!
    getGalleryYears: [Int!]!
    getFeaturedGallery(limit: Int): [GalleryItem!]!
  }

  extend type Mutation {
    createGalleryItem(data: CreateGalleryInput!): GalleryResponse!
    addGalleryItem(data: AddGalleryItemInput!): GalleryResponse!
    updateGalleryItem(id: ID!, data: UpdateGalleryInput!): GalleryResponse!
    deleteGalleryItem(id: ID!): GalleryResponse!
  }
`;

export default galleryTypeDefs;
