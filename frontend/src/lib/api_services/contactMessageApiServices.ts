import graphqlClient from './graphqlClient'
import { ContactMessage, MutationResponse } from '@/types'

const FIELDS = `
  id name email subject message read createdAt updatedAt
`

export const submitContactMessage = async (data: {
  name: string
  email: string
  subject: string
  message: string
  captchaA: number
  captchaB: number
  captchaAnswer: number
}): Promise<void> => {
  const mutation = `
    mutation SubmitContactMessage($data: SubmitContactMessageInput!) {
      submitContactMessage(data: $data) {
        success
        message
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const r = response.data.data.submitContactMessage
  if (!r.success) throw new Error(r.message)
}

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const query = `
    query GetContactMessages {
      getContactMessages { ${FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getContactMessages
}

export const markContactMessageRead = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation MarkContactMessageRead($id: ID!) {
      markContactMessageRead(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.markContactMessageRead
}
