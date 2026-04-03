import graphqlClient from './graphqlClient'
import { Executive, MutationResponse } from '@/types'

const EXEC_FIELDS = `
  id name position title profilePicture photo order displayOrder tenure bio isActive createdAt updatedAt
  memberId { id firstName lastName profilePicture memberNumber }
  member { id firstName lastName profilePicture memberNumber }
`

export const getAllExecutives = async (): Promise<Executive[]> => {
  const query = `
    query GetAllExecutives {
      getAllExecutives { ${EXEC_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllExecutives
}

export const createExecutive = async (data: {
  memberId?: string
  name: string
  position?: string
  title?: string
  profilePicture?: string
  photo?: string
  order?: number
  displayOrder?: number
  tenure?: string
  bio?: string
  isActive?: boolean
  [key: string]: unknown
}): Promise<Executive> => {
  const mutation = `
    mutation CreateExecutive($data: CreateExecutiveInput!) {
      createExecutive(data: $data) { success message data { ${EXEC_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.createExecutive
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const updateExecutive = async (
  id: string,
  data: Partial<Executive> & Record<string, unknown>
): Promise<Executive> => {
  const mutation = `
    mutation UpdateExecutive($id: ID!, $data: UpdateExecutiveInput!) {
      updateExecutive(id: $id, data: $data) { success message data { ${EXEC_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.updateExecutive
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const deleteExecutive = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeleteExecutive($id: ID!) {
      deleteExecutive(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteExecutive
}

export const reorderExecutives = async (
  items: Array<{ id: string; order: number }>
): Promise<MutationResponse> => {
  const mutation = `
    mutation ReorderExecutives($items: [ReorderExecutiveInput!]!) {
      reorderExecutives(items: $items) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { items } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.reorderExecutives
}
