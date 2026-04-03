import graphqlClient from './graphqlClient'
import { PaymentType, MutationResponse } from '@/types'

export const getPaymentTypes = async (activeOnly = false): Promise<PaymentType[]> => {
  const query = `
    query GetPaymentTypes{
      getAllPaymentTypes {
        id name description amount isActive createdAt
      }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllPaymentTypes
}

export const createPaymentType = async (data: {
  name: string
  description: string
  amount: number
}): Promise<PaymentType> => {
  const mutation = `
    mutation CreatePaymentType($data: CreatePaymentTypeInput!) {
      createPaymentType(data: $data) {
        success message
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.createPaymentType
}

export const updatePaymentType = async (
  id: string,
  data: Partial<PaymentType>
): Promise<PaymentType> => {
  const mutation = `
    mutation UpdatePaymentType($id: ID!, $data: UpdatePaymentTypeInput!) {
      updatePaymentType(id: $id, data: $data) {
      success message
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.updatePaymentType
}

export const deletePaymentType = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeletePaymentType($id: ID!) {
      deletePaymentType(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deletePaymentType
}
