import graphqlClient from './graphqlClient'
import { Candidate, MutationResponse } from '@/types'

const CANDIDATE_FIELDS = `
  id manifesto profilePicture isApproved formPaymentRef formPaymentStatus createdAt updatedAt
  member { id firstName lastName memberNumber profilePicture }
  position { id title formFee maxCandidates }
  electionId { id title status }
`

export const getCandidatesForElection = async (electionId: string): Promise<Candidate[]> => {
  const query = `
    query GetCandidates($electionId: ID!) {
      getCandidates(electionId: $electionId) { ${CANDIDATE_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { electionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getCandidates
}

export const getCandidate = async (id: string): Promise<Candidate> => {
  const query = `
    query GetCandidate($id: ID!) {
      getCandidate(id: $id) { ${CANDIDATE_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getCandidate
}

export const purchaseCandidateForm = async (
  electionId: string,
  positionId: string
): Promise<{ authorizationUrl?: string; success: boolean; message: string }> => {
  const mutation = `
    mutation PurchaseCandidateForm($electionId: ID!, $positionId: ID!) {
      purchaseCandidateForm(electionId: $electionId, positionId: $positionId) {
        success message authorizationUrl
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { electionId, positionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.purchaseCandidateForm
}

export const verifyCandidateFormPayment = async (paystackRef: string): Promise<MutationResponse> => {
  const mutation = `
    mutation VerifyCandidateFormPayment($paystackRef: String!) {
      verifyCandidateFormPayment(paystackRef: $paystackRef) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { paystackRef } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.verifyCandidateFormPayment
}

export const submitCandidacy = async (data: {
  electionId: string
  positionId: string
  manifesto: string
  profilePicture?: string
}): Promise<MutationResponse> => {
  const mutation = `
    mutation SubmitCandidacy($data: SubmitCandidacyInput!) {
      submitCandidacy(data: $data) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.submitCandidacy
}

export const approveCandidate = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation ApproveCandidate($id: ID!) {
      approveCandidate(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.approveCandidate
}

export const rejectCandidate = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation RejectCandidate($id: ID!) {
      rejectCandidate(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.rejectCandidate
}
