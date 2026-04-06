import graphqlClient from './graphqlClient'
import { Donation, DonationType, MutationResponse } from '@/types'

const DONATION_FIELDS = `
  id donorName donorEmail donorPhone amount currency donationMode
  items physicalItems description notes adminNotes
  quantity estimatedValue preferredDropoffDate
  isMonetary isAcknowledged status acknowledgedAt paymentStatus paymentMethod createdAt updatedAt
  paystackRef manualTransferReference
  donationType { id name donationMode }
  member { id firstName lastName memberNumber }
  invoice { id invoiceNumber amount currency status pdfUrl createdAt }
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
  const payload = {
    donationTypeId: data.donationTypeId,
    donorName: data.donorName,
    donorEmail: data.donorEmail,
    donorPhone: data.donorPhone,
    notes: data.description,
    physicalItems: (data.items || '').trim() || 'To be confirmed with donor',
  }
  const mutation = `
    mutation SubmitPhysicalDonation($data: SubmitPhysicalDonationInput!) {
      submitPhysicalDonation(data: $data) {
        success
        message
        data { ${DONATION_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data: payload } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const r = response.data.data.submitPhysicalDonation
  if (!r.success) throw new Error(r.message)
  return r.data
}

export const initiateMonetaryDonation = async (data: {
  donationTypeId: string
  donorName: string
  donorEmail: string
  donorPhone?: string
  amount: number
  description?: string
}): Promise<{
  authorizationUrl?: string
  invoiceNumber?: string
  success: boolean
  message: string
  donationId?: string
  paystackRef?: string
}> => {
  const payload = {
    donationTypeId: data.donationTypeId,
    donorName: data.donorName,
    donorEmail: data.donorEmail,
    donorPhone: data.donorPhone,
    amount: data.amount,
    notes: data.description,
  }
  const mutation = `
    mutation InitiateMonetaryDonation($data: InitiateMonetaryDonationInput!) {
      initiateMonetaryDonation(data: $data) {
        success
        message
        authorizationUrl
        invoiceNumber
        data { id paystackRef }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data: payload } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const r = response.data.data.initiateMonetaryDonation
  return {
    success: r.success,
    message: r.message,
    authorizationUrl: r.authorizationUrl || undefined,
    invoiceNumber: r.invoiceNumber || undefined,
    donationId: r.data?.id,
    paystackRef: r.data?.paystackRef || undefined,
  }
}

export const submitManualMonetaryDonation = async (data: {
  donationTypeId: string
  donorName: string
  donorEmail: string
  donorPhone?: string
  amount: number
  description?: string
  manualTransferReference: string
}): Promise<Donation> => {
  const payload = {
    donationTypeId: data.donationTypeId,
    donorName: data.donorName,
    donorEmail: data.donorEmail,
    donorPhone: data.donorPhone,
    amount: data.amount,
    notes: data.description,
    manualTransferReference: data.manualTransferReference.trim(),
  }
  const mutation = `
    mutation SubmitManualMonetaryDonation($data: SubmitManualMonetaryDonationInput!) {
      submitManualMonetaryDonation(data: $data) {
        success
        message
        data { ${DONATION_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data: payload } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const r = response.data.data.submitManualMonetaryDonation
  if (!r.success) throw new Error(r.message)
  return r.data
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
