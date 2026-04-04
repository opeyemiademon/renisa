import graphqlClient from './graphqlClient'
import { MutationResponse } from '@/types'

export const castAwardVote = async (awardId: string): Promise<MutationResponse> => {
  const mutation = `
    mutation CastAwardVote($awardId: ID!) {
      castAwardVote(awardId: $awardId) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { awardId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.castAwardVote
}

export const getMyAwardVotes = async (year?: number): Promise<string[]> => {
  const query = `
    query GetMyAwardVotes($year: Int) {
      getMyAwardVotes(year: $year)
    }
  `
  const response = await graphqlClient.post('', { query, variables: year ? { year } : {} })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getMyAwardVotes
}

export const getAwardVoteResults = async (
  awardId: string
): Promise<{ awardId: string; totalVotes: number; hasVoted: boolean }> => {
  const query = `
    query GetAwardVoteResults($awardId: ID!) {
      getAwardVoteResults(awardId: $awardId) {
        awardId
        totalVotes
        hasVoted
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { awardId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAwardVoteResults
}
