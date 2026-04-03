import graphqlClient from './graphqlClient'
import { SiteContent } from '@/types'

export const getSiteContent = async (section: string): Promise<SiteContent> => {
  const query = `
    query GetSiteContent($section: String!) {
      getSiteContent(section: $section) {
        id section title content metadata updatedAt
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { section } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getSiteContent
}

export const getAllSiteContent = async (): Promise<SiteContent[]> => {
  const query = `
    query GetAllSiteContent {
      getAllSiteContent {
        id section title content metadata updatedAt
      }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllSiteContent
}

export const updateSiteContent = async (
  section: string,
  data: { title?: string; content: string; metadata?: Record<string, string> }
): Promise<SiteContent> => {
  const mutation = `
    mutation UpdateSiteContent($section: String!, $data: UpdateSiteContentInput!) {
      updateSiteContent(section: $section, data: $data) {
        id section title content metadata updatedAt
      }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { section, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.updateSiteContent
}
