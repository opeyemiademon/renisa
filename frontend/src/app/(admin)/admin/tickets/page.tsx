'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Ticket, AlertCircle, Clock, CheckCircle, ChevronRight, Search, Loader2, Filter } from 'lucide-react'
import Link from 'next/link'
import { getAllTickets } from '@/lib/api_services/ticketApiServices'
import { buildImageUrl, getInitials, cn } from '@/lib/utils'

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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function AdminTicketsPage() {
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [search, setSearch] = useState('')

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['allTickets', filterStatus, filterPriority],
    queryFn: () => getAllTickets({ status: filterStatus || undefined, priority: filterPriority || undefined }),
  })

  const filtered = tickets.filter((t: any) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const name = `${t.member?.firstName} ${t.member?.lastName}`.toLowerCase()
    return t.subject.toLowerCase().includes(q) || name.includes(q) || t.member?.memberNumber?.toLowerCase().includes(q)
  })

  const counts = {
    all: tickets.length,
    open: tickets.filter((t: any) => t.status === 'open').length,
    in_progress: tickets.filter((t: any) => t.status === 'in_progress').length,
    closed: tickets.filter((t: any) => t.status === 'closed').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage member support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: counts.all, color: 'text-gray-900', bg: 'bg-gray-50' },
          { label: 'Open', value: counts.open, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'In Progress', value: counts.in_progress, color: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'Closed', value: counts.closed, color: 'text-gray-500', bg: 'bg-gray-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-gray-200`}>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary w-64"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Ticket className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No tickets found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Member</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Subject</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Priority</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Replies</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Last Updated</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((ticket: any) => {
                  const status = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open
                  const StatusIcon = status.icon
                  const priority = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.medium
                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-primary shrink-0 flex items-center justify-center">
                            {ticket.member?.profilePicture ? (
                              <img src={buildImageUrl(ticket.member.profilePicture)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white text-xs font-bold">
                                {getInitials(`${ticket.member?.firstName} ${ticket.member?.lastName}`)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {ticket.member?.firstName} {ticket.member?.lastName}
                            </p>
                            <p className="text-xs text-gray-400">{ticket.member?.memberNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="text-sm text-gray-900 truncate font-medium">{ticket.subject}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{ticket.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', priority.color)}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit', status.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{ticket.replies.length}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">{timeAgo(ticket.updatedAt)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/tickets/${ticket.id}`}>
                          <ChevronRight className="w-4 h-4 text-gray-400 hover:text-primary transition-colors" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
