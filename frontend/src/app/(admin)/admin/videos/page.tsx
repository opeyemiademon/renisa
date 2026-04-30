'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Send, Play, Eye } from 'lucide-react'
import Link from 'next/link'
import { getAllVideos, publishVideo, deleteVideo } from '@/lib/api_services/videoApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Select } from '@/components/shared/Select'
import { SearchBar } from '@/components/shared/SearchBar'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Video } from '@/types'

function extractYoutubeThumbnail(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
  return null
}

export default function VideosPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [publishId, setPublishId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['videos-admin'],
    queryFn: () => getAllVideos(),
  })

  const publishMutation = useMutation({
    mutationFn: (id: string) => publishVideo(id),
    onSuccess: () => {
      toast.success('Video published')
      queryClient.invalidateQueries({ queryKey: ['videos-admin'] })
      setPublishId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVideo(id),
    onSuccess: () => {
      toast.success('Video deleted')
      queryClient.invalidateQueries({ queryKey: ['videos-admin'] })
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const allVideos = (data || []) as Video[]

  const filteredData = useMemo(() => {
    let rows = allVideos
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (v) => v.title?.toLowerCase().includes(q) || v.category?.toLowerCase().includes(q),
      )
    }
    if (statusFilter) rows = rows.filter((v) => v.status === statusFilter)
    return rows
  }, [allVideos, search, statusFilter])

  const visibleRows = filteredData.slice(0, visibleCount)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Videos</h2>
          <p className="text-gray-500 text-sm mt-0.5">{allVideos.length} video{allVideos.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/videos/create">
          <Button iconLeft={<Plus className="w-4 h-4" />}>Add Video</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); setVisibleCount(20) }}
          placeholder="Search videos..."
          className="flex-1 min-w-48"
        />
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setVisibleCount(20) }}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'archived', label: 'Archived' },
          ]}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Video</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Views</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Added</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : visibleRows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No videos found</td></tr>
              ) : (
                visibleRows.map((row) => {
                  const thumb = row.thumbnailUrl || extractYoutubeThumbnail(row.videoUrl)
                  return (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 relative">
                            {thumb ? (
                              <img src={thumb} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Play className="w-5 h-5 text-white/60" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{row.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{row.videoUrl}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{row.category || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-gray-400" />
                          {row.views.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3"><Badge variant={row.status}>{row.status}</Badge></td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(row.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {row.status === 'draft' && (
                            <button
                              onClick={() => setPublishId(row.id)}
                              className="p-1.5 text-[#1a6b3a] hover:bg-[#1a6b3a]/5 rounded-lg"
                              title="Publish"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          <Link href={`/admin/videos/create?edit=${row.id}`}>
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
                  )
                })
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
        title="Publish Video"
        message="This video will become visible to the public."
        loading={publishMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Video"
        message="Are you sure you want to delete this video? This cannot be undone."
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
