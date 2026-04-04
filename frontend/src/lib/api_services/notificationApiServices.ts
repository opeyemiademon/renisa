import graphqlClient from './graphqlClient'

export interface Notification {
  id: string
  type: 'new_member' | 'new_payment' | 'id_card_request'
  title: string
  message: string
  refId?: string
  refModel?: string
  isRead: boolean
  createdAt: string
}

const FIELDS = `id type title message refId refModel isRead createdAt`

export const getNotifications = async (limit = 30, onlyUnread = false): Promise<{ notifications: Notification[]; unreadCount: number }> => {
  const query = `
    query GetNotifications($limit: Int, $onlyUnread: Boolean) {
      getNotifications(limit: $limit, onlyUnread: $onlyUnread) {
        notifications { ${FIELDS} }
        unreadCount
      }
    }
  `
  const response = await graphqlClient.post('', { query, variables: { limit, onlyUnread } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
  return response.data.data.getNotifications
}

export const markNotificationRead = async (id: string): Promise<void> => {
  const mutation = `
    mutation MarkNotificationRead($id: ID!) {
      markNotificationRead(id: $id) { id }
    }
  `
  const response = await graphqlClient.post('', { query: mutation, variables: { id } })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
}

export const markAllNotificationsRead = async (): Promise<void> => {
  const mutation = `mutation { markAllNotificationsRead }`
  const response = await graphqlClient.post('', { query: mutation })
  if (response.data.errors) throw new Error(response.data.errors[0].message)
}
