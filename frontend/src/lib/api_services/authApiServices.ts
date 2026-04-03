import graphqlClient from './graphqlClient'
import { AuthPayload, MutationResponse } from '@/types'

export const loginMember = async (data: {
  email: string
  password: string
}): Promise<AuthPayload> => {
  const mutation = `
    mutation LoginMember($data: MemberLoginInput!) {
      loginMember(data: $data) {
        token
        portal
        member {
          id
          memberNumber
          firstName
          lastName
          middleName
          gender
          dateOfBirth
          phone
          email
          address
          city
          state
          stateOfOrigin
          lga
          sport
          profilePicture
          status
          isAlumni
          createdAt
          updatedAt
        }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.loginMember
}

export const loginAdmin = async (data: {
  email: string
  password: string
}): Promise<AuthPayload> => {
  const mutation = `
    mutation LoginAdmin($data: AdminLoginInput!) {
      loginAdmin(data: $data) {
        token
        user {
          id
          username: name
          name
          email
          role
          isActive
          createdAt
          updatedAt
        }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.loginAdmin
  return { token: result.token, adminUser: result.user, portal: 'admin' }
}

export const forgotPassword = async (email: string): Promise<MutationResponse> => {
  const mutation = `
    mutation ForgotPassword($email: String!) {
      forgotPassword(email: $email) {
        success
        message
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { email } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.forgotPassword
}

export const resetPassword = async (data: {
  token: string
  password: string
}): Promise<MutationResponse> => {
  const mutation = `
    mutation ResetPassword($data: ResetPasswordInput!) {
      resetPassword(data: $data) {
        success
        message
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.resetPassword
}

export const changePassword = async (data: {
  currentPassword: string
  newPassword: string
}): Promise<MutationResponse> => {
  const mutation = `
    mutation ChangePassword($data: ChangePasswordInput!) {
      changePassword(data: $data) {
        success
        message
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.changePassword
}
