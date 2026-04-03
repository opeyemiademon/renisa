import graphqlClient from './graphqlClient'
import { DashboardStats } from '@/types'

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const query = `
    query GetDashboardStats {
      getDashboardStats {
        totalMembers
        activeMembers
        newMembersThisMonth
        totalPaymentsThisYear
        activeElections
        upcomingEvents
        totalDonations
        pendingIDCards
        memberGrowth { month count }
        paymentTypeDistribution { name total }
        recentMembers {
          id memberNumber firstName lastName sport status profilePicture createdAt
        }
        recentPayments {
          id amount year method status reference createdAt
          member { id firstName lastName memberNumber }
          paymentType { id name }
        }
      }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getDashboardStats
}
