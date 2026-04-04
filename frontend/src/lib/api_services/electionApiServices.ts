import graphqlClient from './graphqlClient'
import { Election, VoteResult, MutationResponse } from '@/types'

const ELECTION_FIELDS = `
  id title description year startDate endDate votingStartDate votingEndDate
  status eligibilityMinYears requiresDuesPayment
  positions { id title description formFee maxCandidates }
  createdAt updatedAt
`

export const getAllElections = async (): Promise<Election[]> => {
  const query = `
    query GetAllElections {
      getAllElections { ${ELECTION_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllElections
}

export const getElection = async (id: string): Promise<Election> => {
  const query = `
    query GetElection($id: ID!) {
      getElection(id: $id) { ${ELECTION_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getElection
}

export const createElection = async (data: object): Promise<Election> => {
  const mutation = `
    mutation CreateElection($data: CreateElectionInput!) {
      createElection(data: $data) { success message data { ${ELECTION_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.createElection
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const updateElection = async (id: string, data: object): Promise<Election> => {
  const mutation = `
    mutation UpdateElection($id: ID!, $data: UpdateElectionInput!) {
      updateElection(id: $id, data: $data) { success message data { ${ELECTION_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.updateElection
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const updateElectionStatus = async (
  id: string,
  status: string
): Promise<MutationResponse> => {
  const mutation = `
    mutation UpdateElectionStatus($id: ID!, $status: String!) {
      updateElectionStatus(id: $id, status: $status) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, status } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.updateElectionStatus
}

export const addElectoralPosition = async (
  electionId: string,
  data: object
): Promise<MutationResponse> => {
  const mutation = `
    mutation AddElectoralPosition($electionId: ID!, $data: ElectoralPositionInput!) {
      addElectoralPosition(electionId: $electionId, data: $data) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { electionId, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.addElectoralPosition
}

export const getElectionResults = async (electionId: string): Promise<VoteResult[]> => {
  const query = `
    query GetElectionResults($electionId: ID!) {
      getElectionResults(electionId: $electionId) {
        positionId positionTitle totalVotes
        candidates { candidateId candidateName voteCount percentage }
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { electionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getElectionResults
}

export const checkMemberEligibility = async (
  electionId: string
): Promise<{ eligible: boolean; reasons: string[] }> => {
  const query = `
    query CheckMemberEligibility($electionId: ID!) {
      checkMemberEligibility(electionId: $electionId) { eligible reasons }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { electionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.checkMemberEligibility
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

export const castVote = async (data: {
  electionId: string
  votes: Array<{ positionId: string; candidateId: string }>
}): Promise<MutationResponse> => {
  const mutation = `
    mutation CastVote($data: CastVoteInput!) {
      castVote(data: $data) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.castVote
}

export const deleteElection = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeleteElection($id: ID!) {
      deleteElection(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteElection
}
