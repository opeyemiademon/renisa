import graphqlClient from './graphqlClient'
import { MutationResponse } from '@/types'

const CANDIDATE_FIELDS = `
  id manifesto profilePicture isApproved isRejected rejectionReason
  formPaymentRef formPaymentStatus manifestoSubmitted status
  createdAt updatedAt
  member { id firstName lastName memberNumber profilePicture email }
  position { id title formFee maxCandidates description }
  electionId { id title status year }
  reviewedBy { id name }
  reviewedAt
`

export const getCandidatesForElection = async (electionId: string) => {
  const query = `
    query GetCandidates($electionId: ID!) {
      getCandidates(electionId: $electionId) { ${CANDIDATE_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { electionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getCandidates
}

export const getCandidate = async (id: string) => {
  const query = `
    query GetCandidate($id: ID!) {
      getCandidate(id: $id) { ${CANDIDATE_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getCandidate
}

export const getBallotCandidates = async (electionId: string) => {
  const query = `
    query GetBallotCandidates($electionId: ID!) {
      getBallotCandidates(electionId: $electionId) { ${CANDIDATE_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { electionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getBallotCandidates
}

export const applyForPosition = async (electionId: string, positionId: string) => {
  const mutation = `
    mutation ApplyForPosition($electionId: ID!, $positionId: ID!) {
      applyForPosition(electionId: $electionId, positionId: $positionId) {
        success message candidateId
        data { ${CANDIDATE_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { electionId, positionId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.applyForPosition
}

export const confirmCandidateFormPayment = async (candidateId: string, reference: string) => {
  const mutation = `
    mutation ConfirmCandidateFormPayment($candidateId: ID!, $reference: String!) {
      confirmCandidateFormPayment(candidateId: $candidateId, reference: $reference) {
        success message
        data { ${CANDIDATE_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { candidateId, reference } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.confirmCandidateFormPayment
}

export const manualCandidateFormPayment = async (candidateId: string, referenceNumber: string, notes?: string) => {
  const mutation = `
    mutation ManualCandidateFormPayment($candidateId: ID!, $referenceNumber: String!, $notes: String) {
      manualCandidateFormPayment(candidateId: $candidateId, referenceNumber: $referenceNumber, notes: $notes) {
        success message
        data { ${CANDIDATE_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { candidateId, referenceNumber, notes } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.manualCandidateFormPayment
}

export const submitCandidacy = async (data: {
  electionId: string
  positionId: string
  manifesto: string
  profilePicture?: string
}) => {
  const mutation = `
    mutation SubmitCandidacy($data: SubmitCandidacyInput!) {
      submitCandidacy(data: $data) {
        success message
        data { ${CANDIDATE_FIELDS} }
      }
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

export const rejectCandidate = async (id: string, reason?: string): Promise<MutationResponse> => {
  const mutation = `
    mutation RejectCandidate($id: ID!, $reason: String) {
      rejectCandidate(id: $id, reason: $reason) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, reason } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.rejectCandidate
}
