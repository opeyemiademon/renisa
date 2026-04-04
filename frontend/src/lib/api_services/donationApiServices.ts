import graphqlClient from './graphqlClient'
import { Donation, DonationType, MutationResponse } from '@/types'

const DONATION_FIELDS = `
  id donorName donorEmail donorPhone amount items description donationMode
  isMonetary isAcknowledged status acknowledgedAt paymentStatus createdAt updatedAt
  donationType { id name donationMode }
  member { id firstName lastName memberNumber }
  invoice { id invoiceNumber amount status createdAt }
`

export const getDonationTypes = async (activeOnly = true): Promise<DonationType[]> => {
  const query = `
    query GetDonationTypes {
      getAllDonationTypes {
        id name description donationMode icon isActive createdAt 
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { activeOnly } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllDonationTypes
}

export const createDonationType = async (data: object): Promise<DonationType> => {
  const mutation = `
    mutation CreateDonationType($data: CreateDonationTypeInput!) {
      createDonationType(data: $data) {
        success message
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.createDonationType
}

export const updateDonationType = async (id: string, data: object): Promise<DonationType> => {
  const mutation = `
    mutation UpdateDonationType($id: ID!, $data: UpdateDonationTypeInput!) {
      updateDonationType(id: $id, data: $data) {
       success message
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.updateDonationType
}

export const deleteDonationType = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeleteDonationType($id: ID!) {
      deleteDonationType(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteDonationType
}

export const submitPhysicalDonation = async (data: {
  donationTypeId: string
  donorName: string
  donorEmail?: string
  donorPhone?: string
  description?: string
  items?: string
}): Promise<Donation> => {
  const mutation = `
    mutation SubmitPhysicalDonation($data: SubmitPhysicalDonationInput!) {
      submitPhysicalDonation(data: $data) { ${DONATION_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.submitPhysicalDonation
}

export const initiateMonetaryDonation = async (data: {
  donationTypeId: string
  donorName: string
  donorEmail: string
  donorPhone?: string
  amount: number
  description?: string
}): Promise<{ authorizationUrl: string; reference: string; donationId: string }> => {
  const mutation = `
    mutation InitiateMonetaryDonation($data: InitiateMonetaryDonationInput!) {
      initiateMonetaryDonation(data: $data) {
        authorizationUrl
        reference
        donationId
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.initiateMonetaryDonation
}

export const verifyDonationPayment = async (reference: string): Promise<Donation> => {
  const mutation = `
    mutation VerifyDonationPayment($reference: String!) {
      verifyDonationPayment(reference: $reference) {
        success
        message
        data { ${DONATION_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { reference } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.verifyDonationPayment
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const getAllDonations = async (params?: {
  isMonetary?: boolean
  status?: string
  type?: string
  search?: string
}): Promise<Donation[]> => {
  const query = `
    query GetAllDonations($status: String, $donationMode: String) {
      getAllDonations(status: $status, donationMode: $donationMode) {
        ${DONATION_FIELDS}
      }
    }
  `
  const variables = {
    status: params?.status,
    donationMode: params?.type,
  }
  const response = await graphqlClient.post('', { query, variables })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllDonations
}

export const acknowledgeDonation = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation AcknowledgeDonation($id: ID!) {
      acknowledgeDonation(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.acknowledgeDonation
}
