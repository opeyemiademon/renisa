import graphqlClient from './graphqlClient'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'superadmin' | 'admin' | 'content_manager'
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface MutationResponse {
  success: boolean
  message: string
  data?: AdminUser
}

const USER_FIELDS = `
  id
  name
  email
  role
  isActive
  lastLogin
  createdAt
  updatedAt
`

export const getAllUsers = async (): Promise<AdminUser[]> => {
  const query = `
    query GetAllUsers {
      getAllUsers {
        ${USER_FIELDS}
      }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllUsers
}

export const getUser = async (id: string): Promise<AdminUser> => {
  const query = `
    query GetUser($id: ID!) {
      getUser(id: $id) {
        ${USER_FIELDS}
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getUser
}

export const createAdminUser = async (data: {
  name: string
  email: string
  password: string
  role: string
}): Promise<MutationResponse> => {
  const mutation = `
    mutation CreateAdminUser($data: CreateAdminUserInput!) {
      createAdminUser(data: $data) {
        success
        message
        data {
          ${USER_FIELDS}
        }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.createAdminUser
}

export const updateAdminUser = async (id: string, data: {
  name?: string
  email?: string
  password?: string
  role?: string
  isActive?: boolean
}): Promise<MutationResponse> => {
  const mutation = `
    mutation UpdateAdminUser($id: ID!, $data: UpdateAdminUserInput!) {
      updateAdminUser(id: $id, data: $data) {
        success
        message
        data {
          ${USER_FIELDS}
        }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.updateAdminUser
}

export const deleteAdminUser = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeleteAdminUser($id: ID!) {
      deleteAdminUser(id: $id) {
        success
        message
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteAdminUser
}
