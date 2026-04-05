import graphqlClient from './graphqlClient'

export const castVote = async (data: { electionId: string; votes: Array<{ positionId: string; candidateId: string }> }) => {
  const mutation = `
    mutation CastVote($data: CastVoteInput!) {
      castVote(data: $data) {
        success
        message
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.castVote
  if (!result.success) throw new Error(result.message)
  return result
}

export const hasVoted = async (electionId: string): Promise<boolean> => {
  const query = `
    query HasVoted($electionId: ID!) {
      hasVoted(electionId: $electionId)
    }
  `
  const response = await graphqlClient.post('', { query, variables: { electionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.hasVoted
}

export const checkMemberEligibility = async (electionId: string) => {
  const query = `
    query CheckMemberEligibility($electionId: ID!) {
      checkMemberEligibility(electionId: $electionId) {
        eligible
        reasons
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { electionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.checkMemberEligibility
}

export const getElectionResults = async (electionId: string) => {
  const query = `
    query GetElectionResults($electionId: ID!) {
      getElectionResults(electionId: $electionId) {
        positionId
        positionTitle
        totalVotes
        candidates {
          candidateId
          candidateName
          voteCount
          percentage
        }
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { electionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getElectionResults
}
