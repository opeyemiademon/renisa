import graphqlClient from './graphqlClient'
import type { Award, AwardCategory, CategoryWinner, MutationResponse } from '@/types'

const AWARD_FIELDS = `
  id  year  votingEnabled votingStartDate votingEndDate totalVotes status createdAt
  recipientName title recipientPhoto
  categoryId { id name pollActive votingStartDate votingEndDate }
  memberId { id firstName lastName profilePicture memberNumber }
`

const CATEGORY_FIELDS = `
  id name description icon isActive pollActive isPubliclyVisible votingStartDate votingEndDate createdAt
`

export const getAllAwards = async (params?: {
  year?: number
  categoryId?: string
  votingEnabled?: boolean
  status?: string
  memberName?: string
  memberId?: string
  limit?: number
}): Promise<Award[]> => {
  const query = `
    query GetAllAwards($year: Int, $categoryId: ID, $votingEnabled: Boolean, $status: String, $memberName: String, $memberId: ID, $limit: Int) {
      getAllAwards(year: $year, status: $status,  categoryId: $categoryId, votingEnabled: $votingEnabled, memberName: $memberName, memberId: $memberId, limit: $limit) {
        ${AWARD_FIELDS}
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: params })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllAwards
}

export const getAward = async (id: string): Promise<Award> => {
  const query = `
    query GetAward($id: ID!) {
      getAward(id: $id) { ${AWARD_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAward
}

export const createAward = async (data: object): Promise<Award> => {
  const mutation = `
    mutation CreateAward($data: CreateAwardInput!) {
      createAward(data: $data) { success message data { ${AWARD_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.createAward
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const updateAward = async (id: string, data: object): Promise<Award> => {
  const mutation = `
    mutation UpdateAward($id: ID!, $data: UpdateAwardInput!) {
      updateAward(id: $id, data: $data) { success message data { ${AWARD_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.updateAward
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const deleteAward = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeleteAward($id: ID!) {
      deleteAward(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteAward
}

export const enableAwardVoting = async (
  id: string,
  votingEndDate?: string
): Promise<MutationResponse> => {
  const mutation = `
    mutation EnableAwardVoting($id: ID!, $votingEndDate: String) {
      enableAwardVoting(id: $id, votingEndDate: $votingEndDate) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, votingEndDate } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.enableAwardVoting
}

// ── Award Categories ──────────────────────────────────────────────────────────

export const getAwardCategories = async (): Promise<AwardCategory[]> => {
  const query = `
    query GetAwardCategories {
      getAllAwardCategories { ${CATEGORY_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllAwardCategories
}

export const createAwardCategory = async (data: {
  name: string
  description?: string
}): Promise<AwardCategory> => {
  const mutation = `
    mutation CreateAwardCategory($data: CreateAwardCategoryInput!) {
      createAwardCategory(data: $data) { success message data { ${CATEGORY_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.createAwardCategory
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const updateAwardCategory = async (
  id: string,
  data: object
): Promise<AwardCategory> => {
  const mutation = `
    mutation UpdateAwardCategory($id: ID!, $data: UpdateAwardCategoryInput!) {
      updateAwardCategory(id: $id, data: $data) { success message data { ${CATEGORY_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.updateAwardCategory
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const deleteAwardCategory = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeleteAwardCategory($id: ID!) {
      deleteAwardCategory(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteAwardCategory
}

export const startCategoryPoll = async (
  id: string,
  votingStartDate?: string,
  votingEndDate?: string
): Promise<MutationResponse> => {
  const mutation = `
    mutation StartCategoryPoll($id: ID!, $votingStartDate: String, $votingEndDate: String) {
      startCategoryPoll(id: $id, votingStartDate: $votingStartDate, votingEndDate: $votingEndDate) {
        success message data { ${CATEGORY_FIELDS} }
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, votingStartDate, votingEndDate } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.startCategoryPoll
}

export const endCategoryPoll = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation EndCategoryPoll($id: ID!) {
      endCategoryPoll(id: $id) { success message data { ${CATEGORY_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.endCategoryPoll
}

export const toggleCategoryPublicVisibility = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation ToggleCategoryPublicVisibility($id: ID!) {
      toggleCategoryPublicVisibility(id: $id) { success message data { ${CATEGORY_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.toggleCategoryPublicVisibility
}

// ── Winners Report ────────────────────────────────────────────────────────────

export const getAwardWinnersReport = async (year?: number): Promise<CategoryWinner[]> => {
  const query = `
    query GetAwardWinnersReport($year: Int) {
      getAwardWinnersReport(year: $year) {
        categoryId
        categoryName
        pollActive
        isPubliclyVisible
        votingStartDate
        votingEndDate
        winner {
          awardId
          recipientName
          recipientPhoto
          memberNumber
          voteCount
        }
        nominees {
          awardId
          recipientName
          recipientPhoto
          memberNumber
          voteCount
        }
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: year ? { year } : {} })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAwardWinnersReport
}
