import graphqlClient from './graphqlClient'
import { GalleryItem, MutationResponse } from '@/types'

const GALLERY_FIELDS = `
  id title description caption imageUrl albumName album eventDate year createdAt updatedAt
`

export const getGallery = async (params?: {
  albumName?: string
  album?: string
  year?: number
  search?: string
}): Promise<GalleryItem[]> => {
  const query = `
    query GetGallery($albumName: String, $year: Int) {
      getAllGallery(albumName: $albumName, year: $year) {
        ${GALLERY_FIELDS}
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: params })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllGallery
}

export const getGalleryAlbums = async (): Promise<string[]> => {
  const query = `
    query GetGalleryAlbums {
      getGalleryAlbums
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getGalleryAlbums
}

export const getGalleryYears = async (): Promise<number[]> => {
  const query = `
    query GetGalleryYears {
      getGalleryYears
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getGalleryYears
}

export const addGalleryItem = async (data: {
  imageUrl: string
  caption?: string
  album?: string
  year?: number
}): Promise<GalleryItem> => {
  const mutation = `
    mutation AddGalleryItem($data: AddGalleryItemInput!) {
      addGalleryItem(data: $data) { success message data { ${GALLERY_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.addGalleryItem
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const updateGalleryItem = async (id: string, data: object): Promise<GalleryItem> => {
  const mutation = `
    mutation UpdateGalleryItem($id: ID!, $data: UpdateGalleryItemInput!) {
      updateGalleryItem(id: $id, data: $data) { ${GALLERY_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.updateGalleryItem
}

export const deleteGalleryItem = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeleteGalleryItem($id: ID!) {
      deleteGalleryItem(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteGalleryItem
}
