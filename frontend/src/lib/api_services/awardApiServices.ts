import graphqlClient from './graphqlClient'
import { Award, AwardCategory, MutationResponse } from '@/types'

const AWARD_FIELDS = `
  id  year  votingEnabled votingEndDate totalVotes createdAt 
  categoryId { id name }
  memberId { id firstName lastName profilePicture memberNumber }
`

export const getAllAwards = async (params?: {
  year?: number
  categoryId?: string
  votingEnabled?: boolean
  search?: string
}): Promise<Award[]> => {
  const query = `
    query GetAllAwards($year: Int, $categoryId: ID, $votingEnabled: Boolean) {
      getAllAwards(year: $year, categoryId: $categoryId, votingEnabled: $votingEnabled) {
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
      createAward(data: $data) { success message  }
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

export const getAwardCategories = async (): Promise<AwardCategory[]> => {
  const query = `
    query GetAwardCategories {
      getAllAwardCategories { id name description createdAt  }
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
      createAwardCategory(data: $data) { success message }
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
      updateAwardCategory(id: $id, data: $data) { id name description createdAt  }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.updateAwardCategory
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
