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
    eventDate: String
    venue: String
    eventType: String!
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
    images: [String]
    eventDate: String
    venue: String
    eventType: String
    status: String
    isFeatured: Boolean
  }

  input UpdateEventInput {
    title: String
    content: String
    excerpt: String
    coverImage: String
    images: [String]
    eventDate: String
    venue: String
    eventType: String
    status: String
    isFeatured: Boolean
  }

  extend type Query {
    getAllEvents(eventType: String, status: String): [Event!]!
    getEvent(id: ID!): Event
    getEventBySlug(slug: String!): Event
    getFeaturedEvents(limit: Int): [Event!]!
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
