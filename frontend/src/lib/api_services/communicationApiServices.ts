import graphqlClient from './graphqlClient'
import { Communication, MutationResponse } from '@/types'

export const sendCommunication = async (data: {
  type: 'email' | 'sms' | 'both'
  recipients: 'all' | 'active' | string[]
  subject?: string
  message: string
  filters?: Record<string, string | undefined>
}): Promise<MutationResponse> => {
  const mutation = `
    mutation SendCommunication($data: SendCommunicationInput!) {
      sendCommunication(data: $data) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.sendCommunication
}

export const getCommunicationHistory = async (params?: {
  page?: number
  limit?: number
}): Promise<{ data: Communication[]; total: number; page: number; limit: number; totalPages: number }> => {
  const query = `
    query GetCommunicationHistory($page: Int, $limit: Int) {
      getCommunicationHistory(page: $page, limit: $limit) {
        data {
          id type subject message recipients sentBy sentCount createdAt
        }
        total page limit totalPages
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: params })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getCommunicationHistory
}
