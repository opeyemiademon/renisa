import graphqlClient from './graphqlClient'
import { LeadershipGroupInfo, LeadershipMember, MutationResponse } from '@/types'

const MEMBER_FIELDS = `
  id
  slug
  groupId { id name slug }
  memberId { id firstName lastName profilePicture memberNumber sport state bio }
  name profilePicture photo title position order
  state tenure isCurrent isActive
  createdAt updatedAt
`

export const getLeadershipGroups = async (): Promise<LeadershipGroupInfo[]> => {
  const query = `
    query GetAllLeadershipGroups {
      getAllLeadershipGroups {
        id name slug description order isActive createdAt 
      }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllLeadershipGroups
}

export const getLeadershipGroup = async (slug: string): Promise<LeadershipGroupInfo> => {
  const query = `
    query GetLeadershipGroupBySlug($slug: String!) {
      getLeadershipGroupBySlug(slug: $slug) {
        id name slug description order
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { slug } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getLeadershipGroupBySlug
}

export const getLeadershipMembers = async (
  params?: { groupSlug?: string; groupId?: string; isCurrent?: boolean; state?: string }
): Promise<LeadershipMember[]> => {
  const query = `
    query GetAllLeadership($groupId: ID, $groupSlug: String, $isCurrent: Boolean, $state: String) {
      getAllLeadership(groupId: $groupId, groupSlug: $groupSlug, isCurrent: $isCurrent, state: $state) {
        ${MEMBER_FIELDS}
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: params || {} })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllLeadership
}

export const getLeadershipMember = async (id: string): Promise<LeadershipMember> => {
  const query = `
    query GetLeadership($id: ID!) {
      getLeadership(id: $id) { ${MEMBER_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getLeadership
}

export const getLeadershipBySlug = async (slug: string): Promise<LeadershipMember | null> => {
  const query = `
    query GetLeadershipBySlug($slug: String!) {
      getLeadershipBySlug(slug: $slug) { ${MEMBER_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { slug } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getLeadershipBySlug
}

export const createLeadershipMember = async (data: object): Promise<LeadershipMember> => {
  const mutation = `
    mutation CreateLeadership($data: CreateLeadershipInput!) {
      createLeadership(data: $data) { success message data { ${MEMBER_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.createLeadership
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const updateLeadershipMember = async (
  id: string,
  data: object
): Promise<LeadershipMember> => {
  const mutation = `
    mutation UpdateLeadership($id: ID!, $data: UpdateLeadershipInput!) {
      updateLeadership(id: $id, data: $data) { success message data { ${MEMBER_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.updateLeadership
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const deleteLeadershipMember = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeleteLeadership($id: ID!) {
      deleteLeadership(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteLeadership
}
