'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, ChevronLeft, Search, Wifi, WifiOff } from 'lucide-react'
import { useAppSelector } from '@/hooks/redux'
import { useChat, Conversation, OnlineMember } from '@/hooks/useChat'
import { buildImageUrl, getInitials } from '@/lib/utils'

function timeAgo(date: string | null): string {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

function Avatar({ src, name, online, size = 'md' }: { src?: string; name: string; online?: boolean; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
  return (
    <div className="relative shrink-0">
      <div className={`${sz} rounded-full overflow-hidden bg-primary flex items-center justify-center`}>
        {src ? (
          <img src={buildImageUrl(src)} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-bold">{getInitials(name)}</span>
        )}
      </div>
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${online ? 'bg-green-500' : 'bg-gray-300'}`} />
      )}
    </div>
  )
}

export function ChatRightbar() {
  const { member } = useAppSelector((s) => s.auth)
  const {
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
  } = useChat(member?.id)

  const [open, setOpen] = useState(false)
  const [activePeer, setActivePeer] = useState<Conversation | null>(null)
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (activePeer) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, activePeer])

  const handleSelectConvo = useCallback((convo: Conversation) => {
    setActivePeer(convo)
    openChat(convo.memberId)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [openChat])

  const handleSend = useCallback(() => {
    if (!activePeer || !input.trim()) return
    sendMessage(activePeer.memberId, input.trim())
    setInput('')
    emitTyping(activePeer.memberId, false)
  }, [activePeer, input, sendMessage, emitTyping])

  const handleInputChange = (val: string) => {
    setInput(val)
    if (!activePeer) return
    emitTyping(activePeer.memberId, val.length > 0)
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => emitTyping(activePeer.memberId, false), 2000)
  }

  const messages = activePeer ? (history[activePeer.memberId] || []) : []
  const isPeerTyping = activePeer ? typing[activePeer.memberId] : false

  const filteredConvos = conversations.filter((c) => {
    const name = `${c.member.firstName} ${c.member.lastName}`.toLowerCase()
    return name.includes(search.toLowerCase())
  })

  // Online members not already in a conversation
  const onlineNotInConvo = onlineMembers.filter(
    (m) => m.id !== member?.id && !conversations.find((c) => c.memberId === m.id)
  )

  if (!member) return null

  return (
    <>
      {/* FAB Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="relative w-14 h-14 bg-primary hover:bg-primary-light text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-[#d4a017] text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                {totalUnread > 9 ? '9+' : totalUnread}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: '520px' }}>
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              {activePeer ? (
                <button onClick={() => setActivePeer(null)} className="text-white/80 hover:text-white p-1 rounded">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : null}
              {activePeer ? (
                <div className="flex items-center gap-2">
                  <Avatar
                    src={activePeer.member.profilePicture}
                    name={`${activePeer.member.firstName} ${activePeer.member.lastName}`}
                    online={onlineMemberIds.includes(activePeer.memberId)}
                    size="sm"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm leading-none">
                      {activePeer.member.firstName} {activePeer.member.lastName}
                    </p>
                    <p className="text-white/60 text-xs mt-0.5">
                      {isPeerTyping ? 'typing...' : onlineMemberIds.includes(activePeer.memberId) ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-white font-semibold text-sm">Member Chat</p>
                    <p className="text-white/60 text-xs flex items-center gap-1">
                      {connected
                        ? <><Wifi className="w-3 h-3" />{onlineMemberIds.length - 1 > 0 ? `${onlineMemberIds.length - 1} online` : 'Connected'}</>
                        : <><WifiOff className="w-3 h-3" />Connecting...</>
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => { setOpen(false); setActivePeer(null) }} className="text-white/70 hover:text-white p-1 rounded transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Window */}
          {activePeer ? (
            <div className="flex flex-col flex-1 min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-8">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Start your conversation
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.senderId === member.id
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        {!isMine && (
                          <Avatar
                            src={activePeer.member.profilePicture}
                            name={`${activePeer.member.firstName} ${activePeer.member.lastName}`}
                            size="sm"
                          />
                        )}
                        <div className={`mx-2 max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className={`px-3 py-2 rounded-2xl text-sm ${
                            isMine
                              ? 'bg-primary text-white rounded-br-sm'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                          }`}>
                            {msg.message}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5 px-1">
                            {timeAgo(msg.createdAt)}
                            {isMine && msg.isRead && <span className="ml-1 text-blue-400">✓✓</span>}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                {isPeerTyping && (
                  <div className="flex items-center gap-2">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-2 bg-white border-t border-gray-100 shrink-0">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm outline-none text-gray-900 placeholder-gray-400"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="p-1.5 bg-primary text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-light transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Conversations List */
            <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
              {/* Search */}
              <div className="px-3 py-2 shrink-0 border-b border-gray-100">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                  <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search members..."
                    className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Online members not in convos */}
              {!search && onlineNotInConvo.length > 0 && (
                <div className="px-3 py-2 shrink-0">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Online Now</p>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {onlineNotInConvo.slice(0, 8).map((om: OnlineMember) => (
                      <button
                        key={om.id}
                        onClick={() => {
                          const tempConvo: Conversation = {
                            memberId: om.id,
                            member: { _id: om.id, firstName: om.firstName, lastName: om.lastName, profilePicture: om.profilePicture },
                            lastMessage: '',
                            lastMessageAt: null,
                            unreadCount: 0,
                            isOnline: true,
                          }
                          setActivePeer(tempConvo)
                          openChat(om.id)
                        }}
                        className="shrink-0 flex flex-col items-center gap-1"
                        title={`${om.firstName} ${om.lastName}`}
                      >
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/20 border-2 border-green-400 flex items-center justify-center">
                            {om.profilePicture ? (
                              <img src={buildImageUrl(om.profilePicture)} alt={om.firstName} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-primary text-xs font-bold">{getInitials(`${om.firstName} ${om.lastName}`)}</span>
                            )}
                          </div>
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <span className="text-[10px] text-gray-500 max-w-11 truncate">{om.firstName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConvos.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-10">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No conversations yet</p>
                    <p className="text-xs mt-1">Members online will appear above</p>
                  </div>
                ) : (
                  filteredConvos.map((convo) => {
                    const name = `${convo.member.firstName} ${convo.member.lastName}`
                    const isOnline = onlineMemberIds.includes(convo.memberId)
                    return (
                      <button
                        key={convo.memberId}
                        onClick={() => handleSelectConvo(convo)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50"
                      >
                        <Avatar src={convo.member.profilePicture} name={name} online={isOnline} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm truncate ${convo.unreadCount > 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
                              {name}
                            </p>
                            <span className="text-xs text-gray-400 shrink-0 ml-1">{timeAgo(convo.lastMessageAt)}</span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className={`text-xs truncate ${convo.unreadCount > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                              {convo.lastMessage || 'Start a conversation'}
                            </p>
                            {convo.unreadCount > 0 && (
                              <span className="shrink-0 ml-1 min-w-4.5 h-4.5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                {convo.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
