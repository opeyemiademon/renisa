import graphqlClient from './graphqlClient'
import { Communication, MutationResponse } from '@/types'

export const sendCommunication = async (data: {
  recipients: 'all' | 'active' | 'state' | 'specific'
  subject: string
  message: string
  filterState?: string
  specificMembers?: string[]
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
}): Promise<{ communications: Communication[]; total: number; page: number; limit: number }> => {
  const query = `
    query GetAllCommunications($page: Int, $limit: Int) {
      getAllCommunications(page: $page, limit: $limit) {
        communications {
          id subject message type recipients filterState sentCount failedCount status sentAt createdAt
        }
        total page limit
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: params })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllCommunications
}
