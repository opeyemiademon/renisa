import graphqlClient from './graphqlClient'
import { MemberCode, MutationResponse } from '@/types'

export const generateMemberCodes = async (data: {
  count: number
  batchName?: string
  expiresAt?: string
}): Promise<MemberCode[]> => {
  const mutation = `
    mutation GenerateMemberCodes( $count: Int!, $batchName: String, $expiresAt: String) {
      generateMemberCodes(count: $count, batchName: $batchName, expiresAt: $expiresAt) {
        success message
      }
    }
  `

  
  const response = await graphqlClient.post('', { query: mutation, variables: { count: data.count, batchName: data.batchName, expiresAt: data.expiresAt } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.generateMemberCodes
}

export const getAllMemberCodes = async (): Promise<MemberCode[]> => {
  const query = `
    query GetAllMemberCodes {
      getAllMemberCodes {
        id code batchName isUsed expiresAt createdAt updatedAt
        usedBy { id firstName lastName memberNumber }
      }
    }
  `
  const response = await graphqlClient.post('', { query})
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllMemberCodes
}

export const deleteMemberCode = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeleteMemberCode($id: ID!) {
      deleteMemberCode(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteMemberCode
}

export const checkMemberCode = async (code: string): Promise<{ valid: boolean; message: string }> => {
  const query = `
    query CheckMemberCode($code: String!) {
      checkMemberCode(code: $code) { valid}
    }
  `
  const response = await graphqlClient.post('', { query, variables: { code } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.checkMemberCode
}
