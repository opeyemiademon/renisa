import graphqlClient from './graphqlClient'
import { Member, MutationResponse } from '@/types'

const MEMBER_FIELDS = `
  id
  memberNumber
  memberCode
  firstName
  lastName
  middleName
  gender
  dateOfBirth
  phone
  alternatePhone
  email
  address
  city
  state
  stateOfOrigin
  lga
  sport
  profilePicture
  membershipStatus
  status
  isAlumni
  bio
  socialLinks { twitter linkedin facebook instagram website }
  createdAt
`

export const getAllMembers = async (params?: {
  search?: string
  status?: string
  memberNumber?: string
  memberCode?: string
  email?: string
  gender?: string
  state?: string
  dateFrom?: string
  dateTo?: string
  name?: string
}): Promise<Member[]> => {
  const query = `
    query GetAllMembers(
      $search: String, $status: String, $memberNumber: String, $memberCode: String,
      $email: String, $gender: String, $state: String, $dateFrom: String, $dateTo: String, $name: String
    ) {
      getAllMembers(
        search: $search, status: $status, memberNumber: $memberNumber, memberCode: $memberCode,
        email: $email, gender: $gender, state: $state, dateFrom: $dateFrom, dateTo: $dateTo, name: $name
      ) {
        ${MEMBER_FIELDS}
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: params })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllMembers
}

export const getMember = async (id: string): Promise<Member> => {
  const query = `
    query GetMember($id: ID!) {
      getMember(id: $id) { ${MEMBER_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getMember
}

export const registerMember = async (data: {
  memberCode: string
  firstName: string
  lastName: string
  middleName?: string
  gender: string
  dateOfBirth: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  stateOfOrigin: string
  lga: string
  sport: string
  photoBase64?: string
  password: string
}): Promise<{ token: string; member: Member }> => {
  const mutation = `
    mutation RegisterMember($data: RegisterMemberInput!) {
      registerMember(data: $data) {
        token
        member { ${MEMBER_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.registerMember
}

export const adminRegisterMember = async (data: object): Promise<Member> => {
  const mutation = `
    mutation AdminRegisterMember($data: AdminRegisterMemberInput!) {
      adminRegisterMember(data: $data) {
        success
        message
        data { ${MEMBER_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.adminRegisterMember
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const updateMember = async (id: string, data: Partial<Member>): Promise<Member> => {
  const mutation = `
    mutation UpdateMember($id: ID!, $data: UpdateMemberInput!) {
      updateMember(id: $id, data: $data) {
        success
        message
        data { ${MEMBER_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.updateMember
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const updateMemberStatus = async (
  id: string,
  status: string
): Promise<MutationResponse> => {
  const mutation = `
    mutation UpdateMemberStatus($id: ID!, $status: String!) {
      updateMemberStatus(id: $id, status: $status) {
        success
        message
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, status } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.updateMemberStatus
}

export const deleteMember = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeleteMember($id: ID!) {
      deleteMember(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteMember
}

export const markMemberAsAlumni = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation MarkMemberAsAlumni($id: ID!) {
      markMemberAsAlumni(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.markMemberAsAlumni
}

export const loginAsMember = async (id: string): Promise<{ token: string; member: Member }> => {
  const mutation = `
    mutation LoginAsMember($id: ID!) {
      loginAsMember(id: $id) {
        token
        member { ${MEMBER_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.loginAsMember
}

export const getAlumni = async () => {
  const query = `
    query GetAlumni {
      getAlumni {
        ${MEMBER_FIELDS}
      }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAlumni
}

export const getPublicMembers = async (): Promise<Member[]> => {
  const query = `
    query GetPublicMembers {
      getPublicMembers { ${MEMBER_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getPublicMembers
}

export const getNewMembers = async (limit = 10): Promise<Member[]> => {
  const query = `
    query GetNewMembers($limit: Int) {
      getNewMembers(limit: $limit) { ${MEMBER_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { limit } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getNewMembers
}

const PUBLIC_PROFILE_FIELDS = `
  id firstName lastName middleName memberNumber sport state stateOfOrigin city
  profilePicture isAlumni bio gender createdAt
`

export type PublicMemberProfile = {
  id: string
  firstName: string
  lastName: string
  middleName?: string
  memberNumber?: string
  sport?: string
  state?: string
  stateOfOrigin?: string
  city?: string
  profilePicture?: string
  isAlumni?: boolean
  bio?: string
  gender?: string
  createdAt: string
}

export const getPublicMemberProfile = async (id: string): Promise<PublicMemberProfile | null> => {
  const query = `
    query GetPublicMemberProfile($id: ID!) {
      getPublicMemberProfile(id: $id) { ${PUBLIC_PROFILE_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getPublicMemberProfile
}
