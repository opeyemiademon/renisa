import graphqlClient from './graphqlClient'
import { Event, MutationResponse } from '@/types'

const EVENT_FIELDS = `
  id title slug excerpt content coverImage eventDate venue eventType status isFeatured createdAt updatedAt
`

export const getAllEvents = async (params?: {
  eventType?: string
  status?: string
}): Promise<Event[]> => {
  const query = `
    query GetAllEvents($eventType: String, $status: String) {
      getAllEvents(eventType: $eventType, status: $status) {
        ${EVENT_FIELDS}
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: params })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getAllEvents
}

export const getEvent = async (slug: string): Promise<Event> => {
  const query = `
    query GetEventBySlug($slug: String!) {
      getEventBySlug(slug: $slug) { ${EVENT_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { slug } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getEventBySlug
}

export const getFeaturedEvents = async (): Promise<Event[]> => {
  const query = `
    query GetFeaturedEvents {
      getFeaturedEvents { ${EVENT_FIELDS} }
    }
  `
  const response = await graphqlClient.post('', { query })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getFeaturedEvents
}

export const createEvent = async (data: object): Promise<Event> => {
  const mutation = `
    mutation CreateEvent($data: CreateEventInput!) {
      createEvent(data: $data) { success message data { ${EVENT_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.createEvent
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const updateEvent = async (id: string, data: object): Promise<Event> => {
  const mutation = `
    mutation UpdateEvent($id: ID!, $data: UpdateEventInput!) {
      updateEvent(id: $id, data: $data) { success message data { ${EVENT_FIELDS} } }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id, data } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  const result = response.data.data.updateEvent
  if (!result.success) throw new Error(result.message)
  return result.data
}

export const publishEvent = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation PublishEvent($id: ID!) {
      publishEvent(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.publishEvent
}

export const deleteEvent = async (id: string): Promise<MutationResponse> => {
  const mutation = `
    mutation DeleteEvent($id: ID!) {
      deleteEvent(id: $id) { success message }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.deleteEvent
}
