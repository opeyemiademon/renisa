import graphqlClient from './graphqlClient'
import { Candidate, MutationResponse } from '@/types'

const CANDIDATE_FIELDS = `
  id memberId electionId positionId manifesto profilePicture isApproved formFeePaid formFeeReference createdAt updatedAt
  member { id firstName lastName memberNumber profilePicture }
  position { id title formFee }
`

export const purchaseCandidateForm = async (data: {
  electionId: string
  positionId: string
}): Promise<{ authorizationUrl: string; reference: string }> => {
  const mutation = `
    mutation PurchaseCandidateForm($data: PurchaseCandidateFormInput!) {
      purchaseCandidateForm(data: $data) {
        authorizationUrl
        reference
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.purchaseCandidateForm
}

export const approveCandidate = async (candidateId: string): Promise<MutationResponse> => {
  const mutation = `
    mutation ApproveCandidate($candidateId: ID!) {
      approveCandidate(candidateId: $candidateId) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { candidateId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.approveCandidate
}

export const submitCandidacy = async (data: {
  electionId: string
  positionId: string
  manifesto: string
  profilePicture?: string
}): Promise<Candidate> => {
  const mutation = `
    mutation SubmitCandidacy($data: SubmitCandidacyInput!) {
      submitCandidacy(data: $data) { ${CANDIDATE_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.submitCandidacy
}

export const getCandidatesForElection = async (electionId: string): Promise<Candidate[]> => {
  const query = `
    query GetCandidatesForElection($electionId: ID!) {
      getCandidatesForElection(electionId: $electionId) { ${CANDIDATE_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { electionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getCandidatesForElection
}
