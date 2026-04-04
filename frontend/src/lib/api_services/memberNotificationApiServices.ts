import graphqlClient from './graphqlClient'

export interface MemberNotification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  link?: string
  createdAt: string
}

const FIELDS = `id type title message isRead link createdAt`

export const getMemberNotifications = async (limit = 30): Promise<{ notifications: MemberNotification[]; unreadCount: number }> => {
  const query = `
    query GetMemberNotifications($limit: Int) {
      getMemberNotifications(limit: $limit) {
        notifications { ${FIELDS} }
        unreadCount
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { limit } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getMemberNotifications
}

export const markMemberNotificationRead = async (id: string): Promise<void> => {
  const mutation = `
    mutation MarkMemberNotificationRead($id: ID!) {
      markMemberNotificationRead(id: $id) { id }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
}

export const markAllMemberNotificationsRead = async (): Promise<void> => {
  const mutation = `mutation { markAllMemberNotificationsRead }`
  const response = await graphqlClient.post('', { query: mutation })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
}
