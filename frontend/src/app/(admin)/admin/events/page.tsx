'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Send, Calendar } from 'lucide-react'
import Link from 'next/link'
import { getAllEvents, publishEvent, deleteEvent } from '@/lib/api_services/eventApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Select } from '@/components/shared/Select'
import { SearchBar } from '@/components/shared/SearchBar'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { buildImageUrl, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function EventsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [publishId, setPublishId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['events-admin'],
    queryFn: () => getAllEvents(),
  })

  const publishMutation = useMutation({
    mutationFn: (id: string) => publishEvent(id),
    onSuccess: () => {
      toast.success('Event published')
      queryClient.invalidateQueries({ queryKey: ['events-admin'] })
      setPublishId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      toast.success('Event deleted')
      queryClient.invalidateQueries({ queryKey: ['events-admin'] })
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const allEvents = (data || []) as any[]

  const filteredData = useMemo(() => {
    let rows = allEvents
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter((e: any) => e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q))
    }
    if (typeFilter) rows = rows.filter((e: any) => e.type === typeFilter || e.eventType === typeFilter)
    if (statusFilter) rows = rows.filter((e: any) => e.status === statusFilter)
    return rows
  }, [allEvents, search, typeFilter, statusFilter])

  const visibleRows = filteredData.slice(0, visibleCount)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Events</h2>
          <p className="text-gray-500 text-sm mt-0.5">{allEvents.length} events</p>
        </div>
        <Link href="/admin/events/create">
          <Button iconLeft={<Plus className="w-4 h-4" />}>Create Event</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); setVisibleCount(20) }}
          placeholder="Search events..."
          className="flex-1 min-w-48"
        />
        <Select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setVisibleCount(20) }}
          options={[
            { value: '', label: 'All Types' },
            { value: 'conference', label: 'Conference' },
            { value: 'tournament', label: 'Tournament' },
            { value: 'meeting', label: 'Meeting' },
            { value: 'award', label: 'Award Ceremony' },
            { value: 'other', label: 'Other' },
          ]}
        />
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setVisibleCount(20) }}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Event</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Location</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : visibleRows.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">No records found</td></tr>
              ) : (
                visibleRows.map((row: any) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {row.coverImage ? (
                            <img src={buildImageUrl(row.coverImage)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{row.title}</p>
                          <p className="text-xs text-gray-400 capitalize">{row.type || row.eventType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{row.startDate || row.eventDate ? formatDate(row.startDate || row.eventDate) : '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{row.location || row.venue || '—'}</td>
                    <td className="px-4 py-3"><Badge variant={row.status}>{row.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {row.status === 'draft' && (
                          <button
                            onClick={() => setPublishId(row.id)}
                            className="p-1.5 text-[#1a6b3a] hover:bg-[#1a6b3a]/5 rounded-lg"
                            title="Publish"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <Link href={`/admin/events/create?edit=${row.id}`}>
                          <button className="p-1.5 text-gray-400 hover:text-[#1a6b3a] hover:bg-[#1a6b3a]/5 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteId(row.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {visibleCount < filteredData.length && (
          <div className="px-4 py-4 border-t border-gray-100 text-center">
            <button
              onClick={() => setVisibleCount((v) => v + 20)}
              className="text-sm text-[#1a6b3a] hover:underline font-medium"
            >
              Load More ({filteredData.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!publishId}
        onClose={() => setPublishId(null)}
        onConfirm={() => publishId && publishMutation.mutate(publishId)}
        title="Publish Event"
        message="Are you sure you want to publish this event? It will be visible to the public."
        loading={publishMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
