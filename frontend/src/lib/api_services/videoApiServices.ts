import graphqlClient from './graphqlClient'
import { Video, MutationResponse } from '@/types'

const VIDEO_FIELDS = `
  id slug title description videoUrl thumbnailUrl
  category status isFeatured views publishedAt createdAt updatedAt
`

export const getAllVideos = async (params?: { status?: string; category?: string }): Promise<Video[]> => {
  const query = `
    query GetAllVideos($status: String, $category: String) {
      getAllVideos(status: $status, category: $category) { ${VIDEO_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: params || {} })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllVideos
}

export const getVideo = async (id: string): Promise<Video> => {
  const query = `
    query GetVideo($id: ID!) {
      getVideo(id: $id) { ${VIDEO_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getVideo
}

export const getVideoBySlug = async (slug: string): Promise<Video | null> => {
  const query = `
    query GetVideoBySlug($slug: String!) {
      getVideoBySlug(slug: $slug) { ${VIDEO_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { slug } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getVideoBySlug
}

export const getFeaturedVideos = async (): Promise<Video[]> => {
  const query = `
    query GetFeaturedVideos {
      getFeaturedVideos { ${VIDEO_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getFeaturedVideos
}

export const getVideoCategories = async (): Promise<string[]> => {
  const query = `
    query GetVideoCategories {
      getVideoCategories
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getVideoCategories
}

export const createVideo = async (data: object): Promise<Video> => {
  const mutation = `
    mutation CreateVideo($data: CreateVideoInput!) {
      createVideo(data: $data) { success message data { ${VIDEO_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.createVideo
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const updateVideo = async (id: string, data: object): Promise<Video> => {
  const mutation = `
    mutation UpdateVideo($id: ID!, $data: UpdateVideoInput!) {
      updateVideo(id: $id, data: $data) { success message data { ${VIDEO_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.updateVideo
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const publishVideo = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation PublishVideo($id: ID!) {
      publishVideo(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.publishVideo
}

export const archiveVideo = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation ArchiveVideo($id: ID!) {
      archiveVideo(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.archiveVideo
}

export const deleteVideo = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeleteVideo($id: ID!) {
      deleteVideo(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteVideo
}
