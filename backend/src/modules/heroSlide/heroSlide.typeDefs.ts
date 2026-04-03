import { gql } from 'graphql-tag';

const heroSlideTypeDefs = gql`
  type HeroSlide {
    id: ID!
    title: String!
    subtitle: String
    caption: String
    imageUrl: String!
    tag: String
    ctaText: String
    ctaLink: String
    order: Int!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CreateHeroSlideInput {
    title: String!
    subtitle: String
    caption: String
    imageUrl: String!
    tag: String
    ctaText: String
    ctaLink: String
    order: Int
    isActive: Boolean
  }

  input UpdateHeroSlideInput {
    title: String
    subtitle: String
    caption: String
    imageUrl: String
    tag: String
    ctaText: String
    ctaLink: String
    order: Int
    isActive: Boolean
  }

  type HeroSlideResponse {
    success: Boolean!
    message: String!
    data: HeroSlide
  }

  extend type Query {
    getHeroSlides(activeOnly: Boolean): [HeroSlide!]!
    getHeroSlide(id: ID!): HeroSlide
  }

  extend type Mutation {
    createHeroSlide(data: CreateHeroSlideInput!): HeroSlideResponse!
    updateHeroSlide(id: ID!, data: UpdateHeroSlideInput!): HeroSlideResponse!
    deleteHeroSlide(id: ID!): HeroSlideResponse!
    reorderHeroSlides(ids: [ID!]!): HeroSlideResponse!
  }
`;

export default heroSlideTypeDefs;
