import { useEffect, useRef, useState, useCallback } from 'react'
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket'
import { getToken } from '@/lib/storage'

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  message: string
  isRead: boolean
  createdAt: string
  sender?: { id: string; firstName: string; lastName: string; profilePicture?: string }
}

export interface OnlineMember {
  id: string
  firstName: string
  lastName: string
  profilePicture?: string
}

export interface Conversation {
  memberId: string
  member: { _id: string; firstName: string; lastName: string; profilePicture?: string; memberNumber?: string }
  lastMessage: string
  lastMessageAt: string | null
  unreadCount: number
  isOnline: boolean
}

export function useChat(myMemberId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [onlineMembers, setOnlineMembers] = useState<OnlineMember[]>([])
  const [history, setHistory] = useState<Record<string, ChatMessage[]>>({})
  const [typing, setTyping] = useState<Record<string, boolean>>({})
  const [connected, setConnected] = useState(false)
  const typingTimers = useRef<Record<string, NodeJS.Timeout>>({})

  useEffect(() => {
    if (!myMemberId) return
    const token = getToken()
    if (!token) return

    const s = connectSocket(token)
    setConnected(s.connected)

    s.on('connect', () => setConnected(true))
    s.on('disconnect', () => setConnected(false))

    s.on('online_members', (members: OnlineMember[]) => {
      setOnlineMembers(members)
      const ids = members.map((m) => m.id)
      setConversations((prev) =>
        prev.map((c) => ({ ...c, isOnline: ids.includes(c.memberId) }))
      )
    })

    s.on('conversations', (convos: Conversation[]) => {
      setConversations(convos.map((c) => ({
        ...c,
        isOnline: onlineMembers.some((m) => m.id === c.memberId),
      })))
    })

    s.on('chat_history', ({ withMemberId, messages }: { withMemberId: string; messages: ChatMessage[] }) => {
      setHistory((prev) => ({ ...prev, [withMemberId]: messages }))
    })

    s.on('new_message', (msg: ChatMessage) => {
      const peerId = msg.senderId
      setHistory((prev) => ({
        ...prev,
        [peerId]: [...(prev[peerId] || []), msg],
      }))
      setConversations((prev) => {
        const existing = prev.find((c) => c.memberId === peerId)
        if (existing) {
          return prev.map((c) =>
            c.memberId === peerId
              ? { ...c, lastMessage: msg.message, lastMessageAt: msg.createdAt, unreadCount: c.unreadCount + 1 }
              : c
          ).sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime())
        }
        return prev
      })
    })

    s.on('message_sent', (msg: ChatMessage) => {
      const peerId = msg.receiverId
      setHistory((prev) => {
        const existing = prev[peerId] || []
        if (existing.find((m) => m.id === msg.id)) return prev
        return { ...prev, [peerId]: [...existing, msg] }
      })
      setConversations((prev) =>
        prev.map((c) =>
          c.memberId === peerId
            ? { ...c, lastMessage: msg.message, lastMessageAt: msg.createdAt }
            : c
        ).sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime())
      )
    })

    s.on('typing', ({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
      setTyping((prev) => ({ ...prev, [senderId]: isTyping }))
      if (typingTimers.current[senderId]) clearTimeout(typingTimers.current[senderId])
      if (isTyping) {
        typingTimers.current[senderId] = setTimeout(() => {
          setTyping((prev) => ({ ...prev, [senderId]: false }))
        }, 3000)
      }
    })

    s.on('messages_read', ({ byMemberId }: { byMemberId: string }) => {
      setHistory((prev) => ({
        ...prev,
        [byMemberId]: (prev[byMemberId] || []).map((m) =>
          m.receiverId === byMemberId ? { ...m, isRead: true } : m
        ),
      }))
    })

    return () => {
      s.off('connect')
      s.off('disconnect')
      s.off('online_members')
      s.off('conversations')
      s.off('chat_history')
      s.off('new_message')
      s.off('message_sent')
      s.off('typing')
      s.off('messages_read')
    }
  }, [myMemberId])

  const openChat = useCallback((withMemberId: string) => {
    getSocket().emit('get_history', { withMemberId })
    // Clear unread
    setConversations((prev) =>
      prev.map((c) => (c.memberId === withMemberId ? { ...c, unreadCount: 0 } : c))
    )
  }, [])

  const sendMessage = useCallback((receiverId: string, message: string) => {
    if (!message.trim()) return
    getSocket().emit('send_message', { receiverId, message })
  }, [])

  const emitTyping = useCallback((receiverId: string, isTyping: boolean) => {
    getSocket().emit('typing', { receiverId, isTyping })
  }, [])

  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0)
  const onlineMemberIds = onlineMembers.map((m) => m.id)

  return {
    conversations,
    onlineMembers,
    onlineMemberIds,
    history,
    typing,
    connected,
    totalUnread,
    openChat,
    sendMessage,
    emitTyping,
    setConversations,
  }
}
