import graphqlClient from './graphqlClient'
import { IDCardSettings, IDCardRequest, MutationResponse } from '@/types'

const REQUEST_FIELDS = `
  id requestType photo uploadedPhoto paymentStatus paymentRef
  adminStatus rejectionReason deliveryStatus cardUrl generatedCardFront
  amount paidAt createdAt updatedAt
  member { id firstName lastName memberNumber sport state }
`

export const getIDCardSettings = async (): Promise<IDCardSettings> => {
  const query = `
    query GetIDCardSettings {
      getIDCardSettings {
        id onlineFee physicalFee requiresApproval isEnabled validityYears headerText footerText updatedAt
      }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getIDCardSettings
}

export const updateIDCardSettings = async (data: Partial<IDCardSettings>): Promise<IDCardSettings> => {
  const mutation = `
    mutation UpdateIDCardSettings($data: UpdateIDCardSettingsInput!) {
      updateIDCardSettings(data: $data) {
        success message
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.updateIDCardSettings
}

export const requestIDCard = async (data: {
  requestType: 'online' | 'physical'
  photo?: string
  uploadedPhoto?: string
  deliveryAddress?: string
}): Promise<IDCardRequest> => {
  const mutation = `
    mutation RequestIDCard($data: RequestIDCardInput!) {
      requestIDCard(data: $data) { success message data { ${REQUEST_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.requestIDCard
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const initiateIDCardPayment = async (
  requestId: string
): Promise<{ authorizationUrl: string; reference: string }> => {
  const mutation = `
    mutation InitiateIDCardPayment($requestId: ID!) {
      initiateIDCardPayment(requestId: $requestId) {
        success
        authorizationUrl
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { requestId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.initiateIDCardPayment
  return { authorizationUrl: result.authorizationUrl, reference: requestId }
}

export const verifyIDCardPayment = async (reference: string): Promise<IDCardRequest> => {
  const mutation = `
    mutation VerifyIDCardPayment($reference: String!) {
      verifyIDCardPayment(reference: $reference) {
        success
        message
        data { ${REQUEST_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { reference } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.verifyIDCardPayment
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const approveIDCardRequest = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation ApproveIDCardRequest($id: ID!) {
      approveIDCardRequest(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.approveIDCardRequest
}

export const rejectIDCardRequest = async (
  id: string,
  reason: string
): Promise<MutationResponse> => {
  const mutation = `
    mutation RejectIDCardRequest($id: ID!, $reason: String!) {
      rejectIDCardRequest(id: $id, reason: $reason) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, reason } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.rejectIDCardRequest
}

export const updateIDCardDeliveryStatus = async (
  id: string,
  deliveryStatus: string
): Promise<MutationResponse> => {
  const mutation = `
    mutation UpdateIDCardDeliveryStatus($id: ID!, $deliveryStatus: String!) {
      updateIDCardDeliveryStatus(id: $id, deliveryStatus: $deliveryStatus) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, deliveryStatus } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.updateIDCardDeliveryStatus
}

export const getMyIDCardRequests = async (): Promise<IDCardRequest[]> => {
  const query = `
    query GetMyIDCardRequests {
      getMyIDCardRequests { ${REQUEST_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getMyIDCardRequests
}

export const getAllIDCardRequests = async (params?: {
  adminStatus?: string
  paymentStatus?: string
  status?: string
}): Promise<IDCardRequest[]> => {
  const query = `
    query GetAllIDCardRequests($adminStatus: String, $paymentStatus: String) {
      getAllIDCardRequests(adminStatus: $adminStatus, paymentStatus: $paymentStatus) {
        ${REQUEST_FIELDS}
      }
    }
  `
  const variables = {
    adminStatus: params?.adminStatus || params?.status,
    paymentStatus: params?.paymentStatus,
  }
  const response = await graphqlClient.post('', { query, variables })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllIDCardRequests
}
