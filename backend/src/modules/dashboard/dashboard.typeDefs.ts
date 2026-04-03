import { gql } from 'graphql-tag';

const dashboardTypeDefs = gql`
  type MonthCount {
    month: String!
    count: Int!
  }

  type NameTotal {
    name: String!
    total: Float!
  }

  type DashboardStats {
    totalMembers: Int!
    activeMembers: Int!
    newMembersThisMonth: Int!
    totalPaymentsThisYear: Float!
    activeElections: Int!
    upcomingEvents: Int!
    totalDonations: Float!
    pendingIDCards: Int!
    memberGrowth: [MonthCount!]!
    paymentTypeDistribution: [NameTotal!]!
    recentMembers: [JSON]
    recentPayments: [JSON]
  }

  extend type Query {
    getDashboardStats: DashboardStats!
  }
`;

export default dashboardTypeDefs;
