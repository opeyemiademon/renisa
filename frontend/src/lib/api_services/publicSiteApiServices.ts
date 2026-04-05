import graphqlClient from './graphqlClient'

export interface PublicSiteStats {
  activeMembers: number
  alumniMembers: number
  publishedEvents: number
  galleryPhotos: number
  awardedHonors: number
}

export const getPublicSiteStats = async (): Promise<PublicSiteStats> => {
  const query = `
    query GetPublicSiteStats {
      getPublicSiteStats {
        activeMembers
        alumniMembers
        publishedEvents
        galleryPhotos
        awardedHonors
      }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getPublicSiteStats
}
