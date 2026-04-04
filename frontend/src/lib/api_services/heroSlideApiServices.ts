import graphqlClient from './graphqlClient'
import { HeroSlide, MutationResponse } from '@/types'

const SLIDE_FIELDS = `
  id title subtitle caption imageUrl tag ctaText ctaLink order isActive createdAt updatedAt
`

export const getHeroSlides = async (activeOnly = false): Promise<HeroSlide[]> => {
  const query = `
    query GetHeroSlides($activeOnly: Boolean) {
      getHeroSlides(activeOnly: $activeOnly) { ${SLIDE_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { activeOnly } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getHeroSlides
}

export const createHeroSlide = async (data: {
  title: string
  subtitle?: string
  caption?: string
  imageUrl: string
  tag?: string
  ctaText?: string
  ctaLink?: string
  order?: number
  isActive?: boolean
}): Promise<HeroSlide> => {
  const mutation = `
    mutation CreateHeroSlide($data: CreateHeroSlideInput!) {
      createHeroSlide(data: $data) { success message  }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.createHeroSlide.data
}

export const updateHeroSlide = async (id: string, data: Partial<{
  title: string
  subtitle: string
  caption: string
  imageUrl: string
  tag: string
  ctaText: string
  ctaLink: string
  order: number
  isActive: boolean
}>): Promise<HeroSlide> => {
  const mutation = `
    mutation UpdateHeroSlide($id: ID!, $data: UpdateHeroSlideInput!) {
      updateHeroSlide(id: $id, data: $data) { success message data { ${SLIDE_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.updateHeroSlide.data
}

export const deleteHeroSlide = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeleteHeroSlide($id: ID!) {
      deleteHeroSlide(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteHeroSlide
}

export const reorderHeroSlides = async (ids: string[]): Promise<MutationResponse> => {
  const mutation = `
    mutation ReorderHeroSlides($ids: [ID!]!) {
      reorderHeroSlides(ids: $ids) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { ids } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.reorderHeroSlides
}
