'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Image as ImageIcon, X } from 'lucide-react'
import { getGallery, addGalleryItem, deleteGalleryItem } from '@/lib/api_services/galleryApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { FileUpload } from '@/components/shared/FileUpload'
import { SearchBar } from '@/components/shared/SearchBar'
import { buildImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 10 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}))

export default function GalleryPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [albumFilter, setAlbumFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [showUpload, setShowUpload] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [uploadForm, setUploadForm] = useState({
    imageUrl: '',
    caption: '',
    album: '',
    year: String(currentYear),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['gallery-admin'],
    queryFn: () => getGallery(),
  })

  const addMutation = useMutation({
    mutationFn: () => addGalleryItem({
      imageUrl: uploadForm.imageUrl,
      caption: uploadForm.caption || undefined,
      album: uploadForm.album || undefined,
      year: parseInt(uploadForm.year),
    }),
    onSuccess: () => {
      toast.success('Photo added to gallery')
      queryClient.invalidateQueries({ queryKey: ['gallery-admin'] })
      setShowUpload(false)
      setUploadForm({ imageUrl: '', caption: '', album: '', year: String(currentYear) })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGalleryItem(id),
    onSuccess: () => {
      toast.success('Photo removed')
      queryClient.invalidateQueries({ queryKey: ['gallery-admin'] })
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const allGallery = (data || []) as any[]

  const filteredData = useMemo(() => {
    let rows = allGallery
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter((item: any) =>
        item.caption?.toLowerCase().includes(q) ||
        item.album?.toLowerCase().includes(q) ||
        item.albumName?.toLowerCase().includes(q)
      )
    }
    if (albumFilter) rows = rows.filter((item: any) => item.album === albumFilter || item.albumName === albumFilter)
    if (yearFilter) rows = rows.filter((item: any) => String(item.year) === yearFilter)
    return rows
  }, [allGallery, search, albumFilter, yearFilter])

  const visibleRows = filteredData.slice(0, visibleCount)

  const albums = Array.from(new Set(allGallery.map((item: any) => item.album || item.albumName).filter(Boolean))) as string[]
  const albumOptions = [
    { value: '', label: 'All Albums' },
    ...albums.map((a) => ({ value: a, label: a })),
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gallery</h2>
          <p className="text-gray-500 text-sm mt-0.5">{allGallery.length} photos</p>
        </div>
        <Button iconLeft={<Plus className="w-4 h-4" />} onClick={() => setShowUpload(true)}>
          Upload Photo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); setVisibleCount(20) }}
          placeholder="Search photos..."
          className="flex-1 min-w-48"
        />
        <Select
          value={albumFilter}
          onChange={(e) => { setAlbumFilter(e.target.value); setVisibleCount(20) }}
          options={albumOptions}
        />
        <Select
          value={yearFilter}
          onChange={(e) => { setYearFilter(e.target.value); setVisibleCount(20) }}
          options={[{ value: '', label: 'All Years' }, ...yearOptions]}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No photos yet</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {visibleRows.map((item: any) => (
              <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={buildImageUrl(item.imageUrl)}
                  alt={item.caption || ''}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setLightbox(item.imageUrl)}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="w-full p-2 flex items-end justify-between">
                    {item.caption && (
                      <p className="text-white text-xs line-clamp-2 flex-1">{item.caption}</p>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }}
                      className="ml-auto p-1.5 bg-red-500 text-white rounded-lg flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {(item.album || item.albumName) && (
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.album || item.albumName}
                  </div>
                )}
              </div>
            ))}
          </div>
          {visibleCount < filteredData.length && (
            <div className="py-4 text-center">
              <button
                onClick={() => setVisibleCount((v) => v + 20)}
                className="text-sm text-[#1a6b3a] hover:underline font-medium"
              >
                Load More ({filteredData.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Photo" size="sm">
        <div className="space-y-4">
          <FileUpload
            label="Photo"
            value={uploadForm.imageUrl}
            onChange={(url) => setUploadForm((p) => ({ ...p, imageUrl: url }))}
          />
          <Input
            label="Caption (optional)"
            placeholder="Photo description..."
            value={uploadForm.caption}
            onChange={(e) => setUploadForm((p) => ({ ...p, caption: e.target.value }))}
          />
          <Input
            label="Album (optional)"
            placeholder="e.g. Annual Convention 2025"
            value={uploadForm.album}
            onChange={(e) => setUploadForm((p) => ({ ...p, album: e.target.value }))}
            list="album-list"
          />
          <datalist id="album-list">
            {albums.map((a) => <option key={a} value={a} />)}
          </datalist>
          <Select
            label="Year"
            value={uploadForm.year}
            onChange={(e) => setUploadForm((p) => ({ ...p, year: e.target.value }))}
            options={yearOptions}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowUpload(false)} className="flex-1">Cancel</Button>
            <Button
              onClick={() => addMutation.mutate()}
              loading={addMutation.isPending}
              disabled={!uploadForm.imageUrl}
              className="flex-1"
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-lg">
            <X className="w-6 h-6" />
          </button>
          <img
            src={buildImageUrl(lightbox)}
            alt=""
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Photo"
        message="Are you sure you want to remove this photo from the gallery?"
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
