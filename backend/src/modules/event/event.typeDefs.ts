import { gql } from 'graphql-tag';

const eventTypeDefs = gql`
  type Event {
    id: ID!
    title: String!
    slug: String!
    content: String
    excerpt: String
    coverImage: String
    images: [String]
    eventType: String!
    eventDate: String
    venue: String
    status: String!
    isFeatured: Boolean!
    views: Int!
    createdBy: AdminUser
    publishedAt: String
    createdAt: String!
    updatedAt: String!
  }

  type EventResponse {
    success: Boolean!
    message: String!
    data: Event
  }

  input CreateEventInput {
    title: String!
    content: String
    excerpt: String
    coverImage: String
    slug: String
    photoBase64: String
    images: [String]
    status: String
    isFeatured: Boolean
    eventType: String
    eventDate: String
    venue: String
  }

  input UpdateEventInput {
    title: String
    content: String
     slug: String
    excerpt: String
    coverImage: String
    photoBase64: String
    images: [String]
    status: String
    isFeatured: Boolean
    eventType: String
    eventDate: String
    venue: String
  }

  extend type Query {
    getAllEvents: [Event!]!
    getEvent(id: ID!): Event
    getEventBySlug(slug: String!): Event
    getFeaturedEvents: [Event!]!
  }

  extend type Mutation {
    createEvent(data: CreateEventInput!): EventResponse!
    updateEvent(id: ID!, data: UpdateEventInput!): EventResponse!
    deleteEvent(id: ID!): EventResponse!
    publishEvent(id: ID!): EventResponse!
    archiveEvent(id: ID!): EventResponse!
  }
`;

export default eventTypeDefs;
