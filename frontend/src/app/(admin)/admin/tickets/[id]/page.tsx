'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Paperclip, Send, X, Loader2, RefreshCw, XCircle, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { getTicket, adminReplyToTicket, updateTicketStatus } from '@/lib/api_services/ticketApiServices'
import { uploadFile } from '@/lib/api_services/uploadApiService'
import { buildImageUrl, getInitials, cn, formatDate } from '@/lib/utils'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  open: { label: 'Open', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-600', icon: CheckCircle },
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-green-100 text-green-700' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  high: { label: 'High', color: 'bg-red-100 text-red-700' },
}



export default function AdminTicketDetailPage() {
  const params = useParams()
   const id = params.id as string
  const router = useRouter()
  const queryClient = useQueryClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['adminTicket', id],
    queryFn: () => getTicket(id),
    enabled: !!id,
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ticket?.replies])

  const replyMutation = useMutation({
    mutationFn: adminReplyToTicket,
    onSuccess: () => {
      setMessage('')
      setAttachments([])
      queryClient.invalidateQueries({ queryKey: ['adminTicket', id] })
      queryClient.invalidateQueries({ queryKey: ['allTickets'] })
      toast.success('Reply sent')
    },
    onError: (e: any) => toast.error(e.message),
  })

  const statusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) => updateTicketStatus(id, status),
    onSuccess: (data) => {
      toast.success(data.message)
      setConfirmClose(false)
      queryClient.invalidateQueries({ queryKey: ['adminTicket', id] })
      queryClient.invalidateQueries({ queryKey: ['allTickets'] })
    },
    onError: (e: any) => toast.error(e.message),
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (attachments.length + files.length > 4) {
      toast.error('Maximum 4 attachments allowed')
      return
    }
    setUploading(true)
    try {
      for (const file of files) {
        const result = await uploadFile(file, undefined, 'tickets')
        setAttachments((prev) => [...prev, result.url])
      }
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return
    replyMutation.mutate({ ticketId: id, message: message.trim(), attachments })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Ticket not found</p>
        <Link href="/admin/tickets" className="text-primary text-sm mt-2 inline-block">Back to tickets</Link>
      </div>
    )
  }

  const status = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open
  const StatusIcon = status.icon
  const priority = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.medium
  const isClosed = ticket.status === 'closed'

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/admin/tickets" className="p-2 rounded-lg hover:bg-gray-100 transition-colors mt-0.5">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900">{ticket.subject}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Submitted {formatDate(ticket.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1', status.color)}>
            <StatusIcon className="w-3.5 h-3.5" />
            {status.label}
          </span>
          <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', priority.color)}>
            {priority.label}
          </span>

          {/* Status actions */}
          {!isClosed ? (
            <button
              onClick={() => setConfirmClose(true)}
              disabled={statusMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg text-xs font-medium transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Close Ticket
            </button>
          ) : (
            <button
              onClick={() => statusMutation.mutate({ status: 'open' })}
              disabled={statusMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-open
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main conversation */}
        <div className="lg:col-span-2 space-y-3">
          {/* Original message */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center shrink-0">
                {ticket.member?.profilePicture ? (
                  <img src={buildImageUrl(ticket.member.profilePicture)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-xs font-bold">
                    {getInitials(`${ticket.member?.firstName} ${ticket.member?.lastName}`)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {ticket.member?.firstName} {ticket.member?.lastName}
                  <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">Member</span>
                </p>
                <p className="text-xs text-gray-400">{formatDate(ticket.createdAt)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            {ticket.attachments.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {ticket.attachments.map((url: string, i: number) => (
                  <a key={i} href={buildImageUrl(url)} target="_blank" rel="noreferrer">
                    <img src={buildImageUrl(url)} alt="" className="w-full aspect-square object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Replies */}
          {ticket.replies.map((reply: any) => {
            const isAdmin = reply.authorType === 'admin'
            return (
              <div key={reply.id} className={cn('rounded-xl p-4 border', isAdmin ? 'bg-[#0d4a25]/5 border-[#0d4a25]/20' : 'bg-white border-gray-200')}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0', isAdmin ? 'bg-[#d4a017]' : 'bg-primary')}>
                    {reply.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {reply.authorName}
                      {isAdmin && <span className="ml-1.5 text-xs bg-[#d4a017]/20 text-[#d4a017] px-1.5 py-0.5 rounded font-medium">Admin</span>}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(reply.createdAt)}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                {reply.attachments.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {reply.attachments.map((url: string, i: number) => (
                      <a key={i} href={buildImageUrl(url)} target="_blank" rel="noreferrer">
                        <img src={buildImageUrl(url)} alt="" className="w-full aspect-square object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          <div ref={messagesEndRef} />

          {/* Closed notice */}
          {isClosed && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <CheckCircle className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <p className="text-sm text-gray-500 font-medium">Ticket closed</p>
              {ticket.closedBy && <p className="text-xs text-gray-400 mt-0.5">Closed by {ticket.closedBy}</p>}
            </div>
          )}

          {/* Admin reply box */}
          {!isClosed && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Admin Reply</h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your response..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />

              {attachments.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {attachments.map((url, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={buildImageUrl(url)} alt="" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                      <button
                        type="button"
                        onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  {attachments.length < 4 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                      <span className="text-xs">{uploading ? 'Uploading...' : `Attach (${attachments.length}/4)`}</span>
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
                </div>
                <button
                  onClick={handleSend}
                  disabled={replyMutation.isPending || uploading || (!message.trim() && attachments.length === 0)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {replyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Reply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Ticket Info</h3>
            <dl className="space-y-2.5">
              <div>
                <dt className="text-xs text-gray-400">Status</dt>
                <dd>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1', status.color)}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Priority</dt>
                <dd><span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', priority.color)}>{priority.label}</span></dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Replies</dt>
                <dd className="text-sm text-gray-700 font-medium">{ticket.replies.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Opened</dt>
                <dd className="text-sm text-gray-700">{formatDate(ticket.createdAt)}</dd>
              </div>
              {ticket.closedAt && (
                <div>
                  <dt className="text-xs text-gray-400">Closed</dt>
                  <dd className="text-sm text-gray-700">{formatDate(ticket.closedAt)}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Member</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center shrink-0">
                {ticket.member?.profilePicture ? (
                  <img src={buildImageUrl(ticket.member.profilePicture)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-bold">
                    {getInitials(`${ticket.member?.firstName} ${ticket.member?.lastName}`)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{ticket.member?.firstName} {ticket.member?.lastName}</p>
                <p className="text-xs text-gray-400">{ticket.member?.memberNumber}</p>
                <p className="text-xs text-gray-400 truncate">{ticket.member?.email}</p>
              </div>
            </div>
            <Link
              href={`/admin/members/${ticket.member?.id}`}
              className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <User className="w-3.5 h-3.5" />
              View member profile
            </Link>
          </div>

          {/* Quick status change */}
          {!isClosed && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Change Status</h3>
              <div className="space-y-2">
                {['open', 'in_progress'].filter((s) => s !== ticket.status).map((s) => (
                  <button
                    key={s}
                    onClick={() => statusMutation.mutate({ status: s })}
                    disabled={statusMutation.isPending}
                    className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Mark as {s === 'in_progress' ? 'In Progress' : 'Open'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm close modal */}
      {confirmClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 text-center">Close Ticket?</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              This will mark the ticket as closed and notify the member. You can re-open it later.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmClose(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => statusMutation.mutate({ status: 'closed' })}
                disabled={statusMutation.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {statusMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
