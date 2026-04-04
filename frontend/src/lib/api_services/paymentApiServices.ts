import graphqlClient from './graphqlClient'
import { Payment } from '@/types'

const PAYMENT_FIELDS = `
  id transactionRef reference amount year paymentMethod method status notes paystackRef paidAt createdAt 
  member { id firstName lastName memberNumber email }
  paymentType { id name amount }
`

export const getAllPayments = async (params?: {
  memberId?: string
  status?: string
  year?: number
  paymentTypeId?: string
  dateFrom?: string
  dateTo?: string
  reference?: string
}): Promise<Payment[]> => {
  const query = `
    query GetAllPayments($memberId: ID, $status: String, $year: Int, $paymentTypeId: ID, $dateFrom: String, $dateTo: String, $reference: String) {
      getAllPayments(memberId: $memberId, status: $status, year: $year, paymentTypeId: $paymentTypeId, dateFrom: $dateFrom, dateTo: $dateTo, reference: $reference) {
        ${PAYMENT_FIELDS}
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: params })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllPayments
}

export const getMemberPayments = async (memberId: string): Promise<Payment[]> => {
  const query = `
    query GetMemberPayments($memberId: ID!) {
      getMemberPayments(memberId: $memberId) { ${PAYMENT_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { memberId } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getMemberPayments
}

export const initiatePayment = async (data: {
  paymentTypeId: string
  amount?: number
  year?: number
}): Promise<{ authorizationUrl: string; reference: string; paymentId: string }> => {
  const mutation = `
    mutation InitiatePayment($data: InitiatePaymentInput!) {
      initiatePayment(data: $data) {
        success
        message
        authorizationUrl
        reference
        paymentId
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.initiatePayment
}

export const verifyPayment = async (reference: string): Promise<Payment> => {
  const mutation = `
    mutation VerifyPayment($reference: String!) {
      verifyPayment(reference: $reference) {
        success
        message
        data { ${PAYMENT_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { reference } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.verifyPayment
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const recordPaystackPayment = async (data: {
  reference: string
  paymentTypeId: string
  amount: number
  year?: number
}): Promise<Payment> => {
  const mutation = `
    mutation RecordPaystackPayment($data: RecordPaystackPaymentInput!) {
      recordPaystackPayment(data: $data) {
        success
        message
        data { ${PAYMENT_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.recordPaystackPayment
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const submitManualPayment = async (data: {
  paymentTypeId: string
  year?: number
  referenceNumber: string
  notes?: string
}): Promise<Payment> => {
  const mutation = `
    mutation SubmitManualPayment($data: SubmitManualPaymentInput!) {
      submitManualPayment(data: $data) {
        success
        message
      
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.submitManualPayment
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const deletePayment = async (id: string): Promise<{ success: boolean; message: string }> => {
  const mutation = `
    mutation DeletePayment($id: ID!) {
      deletePayment(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deletePayment
}

export const adminRecordPayment = async (data: {
  memberId: string
  paymentTypeId: string
  amount: number
  year: number
  paymentMethod?: string
  notes?: string
  reference?: string
}): Promise<Payment> => {
  const mutation = `
    mutation AdminRecordPayment($data: AdminRecordPaymentInput!) {
      adminRecordPayment(data: $data) {
        success
        message
        data { ${PAYMENT_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.adminRecordPayment
  if (!result.success) throw new Error(result.message)
  return result.data
}
