'use client'

import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Ticket, Clock, CheckCircle, AlertCircle, ChevronRight, Paperclip, X, Upload, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { getMyTickets, createTicket } from '@/lib/api_services/ticketApiServices'
import { uploadFile } from '@/lib/api_services/uploadApiService'
import { buildImageUrl, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

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

function timeAgo(dateStr: string | number | Date) {
  
  
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function MemberTicketsPage() {
  const queryClient = useQueryClient()
  const [filterStatus, setFilterStatus] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  // Form state
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [attachments, setAttachments] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['myTickets', filterStatus],
    queryFn: () => getMyTickets(filterStatus || undefined),
  })

  const createMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      toast.success('Ticket submitted successfully')
      queryClient.invalidateQueries({ queryKey: ['myTickets'] })
      setShowCreate(false)
      setSubject('')
      setDescription('')
      setPriority('medium')
      setAttachments([])
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
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !description.trim()) {
      toast.error('Subject and description are required')
      return
    }
    createMutation.mutate({ subject: subject.trim(), description: description.trim(), priority, attachments })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-sm text-gray-500 mt-0.5">Submit and track your support requests</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { value: '', label: 'All' },
          { value: 'open', label: 'Open' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'closed', label: 'Closed' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilterStatus(f.value)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              filterStatus === f.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tickets list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Ticket className="w-10 h-10 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No tickets yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "New Ticket" to submit a support request</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket: any) => {
            const status = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open
            const StatusIcon = status.icon
            const priority = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.medium
            return (
              <Link key={ticket.id} href={`/member/tickets/${ticket.id}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className={cn('p-2 rounded-lg shrink-0', status.color.replace('text-', 'text-').replace('bg-', 'bg-'))}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                          {ticket.subject}
                        </p>
                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{ticket.description}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', status.color)}>
                          {status.label}
                        </span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', priority.color)}>
                          {priority.label}
                        </span>
                        {ticket.replies.length > 0 && (
                          <span className="text-xs text-gray-400">{ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}</span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">{timeAgo(ticket.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">New Support Ticket</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your issue"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments <span className="text-gray-400 font-normal">({attachments.length}/4)</span>
                </label>
                {attachments.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-2">
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
                {attachments.length < 4 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                    {uploading ? 'Uploading...' : 'Attach images'}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || uploading}
                  className="flex-1 bg-primary hover:bg-primary-light text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
