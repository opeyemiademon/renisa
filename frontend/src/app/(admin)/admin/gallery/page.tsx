'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Image as ImageIcon, X, Camera, ChevronLeft, ChevronRight, Pencil } from 'lucide-react'
import { getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } from '@/lib/api_services/galleryApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { PhotoCaptureModal } from '@/components/shared/PhotoCaptureModal'
import { SearchBar } from '@/components/shared/SearchBar'
import { buildImageUrl } from '@/lib/utils'
import { uploadFile } from '@/lib/api_services/uploadApiService'
import toast from 'react-hot-toast'

function LightboxViewer({ items, index, onClose, onNavigate }: {
  items: any[]
  index: number | null
  onClose: () => void
  onNavigate: (i: number) => void
}) {
  const prev = useCallback(() => {
    if (index === null) return
    onNavigate((index - 1 + items.length) % items.length)
  }, [index, items.length, onNavigate])

  const next = useCallback(() => {
    if (index === null) return
    onNavigate((index + 1) % items.length)
  }, [index, items.length, onNavigate])

  useEffect(() => {
    if (index === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index, prev, next, onClose])

  if (index === null || !items[index]) return null
  const item = items[index]
  const imgSrc = (url: string) => url?.startsWith('http') ? url : buildImageUrl(url)

  return (
    <div
      className="fixed inset-0 bg-black/92 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
        onClick={onClose}
      >
        <X className="w-7 h-7" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm select-none">
        {index + 1} / {items.length}
      </div>

      {/* Prev */}
      {items.length > 1 && (
        <button
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); prev() }}
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image + caption */}
      <div
        className="max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imgSrc(item.imageUrl)}
          alt={item.caption || item.title || ''}
          className="w-full max-h-[75vh] object-contain rounded-lg"
        />
        {(item.caption || item.title || item.album || item.albumName) && (
          <div className="text-center mt-4">
            {(item.caption || item.title) && (
              <p className="text-white font-medium">{item.caption || item.title}</p>
            )}
            {(item.album || item.albumName || item.year) && (
              <p className="text-gray-400 text-sm mt-1">
                {item.album || item.albumName}{item.year ? ` \u2022 ${item.year}` : ''}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Next */}
      {items.length > 1 && (
        <button
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); next() }}
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}

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
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [capturedImageFile, setCapturedImageFile] = useState<File | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
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
    mutationFn: async () => {
      // If there's a captured image file, upload it first
      if (capturedImageFile) {
        setUploading(true)
        try {
          const result = await uploadFile(capturedImageFile)
          uploadForm.imageUrl = result.url
          setCapturedImageFile(null)
        } catch (error) {
          console.error('Upload error:', error)
          throw new Error('Failed to upload image')
        } finally {
          setUploading(false)
        }
      }
      return addGalleryItem({
        imageUrl: uploadForm.imageUrl,
        caption: uploadForm.caption || undefined,
        album: uploadForm.album || undefined,
        year: parseInt(uploadForm.year),
      })
    },
    onSuccess: () => {
      toast.success('Photo added to gallery')
      queryClient.invalidateQueries({ queryKey: ['gallery-admin'] })
      setShowUpload(false)
      setUploadForm({ imageUrl: '', caption: '', album: '', year: String(currentYear) })
      setCapturedImageFile(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingId) throw new Error('No gallery item selected for update')

      let imageUrl = uploadForm.imageUrl
      if (capturedImageFile) {
        setUploading(true)
        try {
          const result = await uploadFile(capturedImageFile)
          imageUrl = result.url
          setCapturedImageFile(null)
        } catch (error) {
          console.error('Upload error:', error)
          throw new Error('Failed to upload image')
        } finally {
          setUploading(false)
        }
      }

      return updateGalleryItem(editingId, {
        imageUrl,
        caption: uploadForm.caption || undefined,
        album: uploadForm.album || undefined,
        year: parseInt(uploadForm.year),
      })
    },
    onSuccess: () => {
      toast.success('Photo updated')
      queryClient.invalidateQueries({ queryKey: ['gallery-admin'] })
      setShowUpload(false)
      setEditingId(null)
      setUploadForm({ imageUrl: '', caption: '', album: '', year: String(currentYear) })
      setCapturedImageFile(null)
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

  const handleCapture = (file: File) => {
    setShowPhotoModal(false)
    // Create local preview URL immediately
    const previewUrl = URL.createObjectURL(file)
    setUploadForm((p) => ({ ...p, imageUrl: previewUrl }))
    setCapturedImageFile(file)
    toast.success('Image ready for upload')
  }

  const openCreateModal = () => {
    setEditingId(null)
    setUploadForm({ imageUrl: '', caption: '', album: '', year: String(currentYear) })
    setCapturedImageFile(null)
    setShowUpload(true)
  }

  const openEditModal = (item: any) => {
    setEditingId(item.id)
    setUploadForm({
      imageUrl: item.imageUrl || '',
      caption: item.caption || '',
      album: item.album || item.albumName || '',
      year: String(item.year || currentYear),
    })
    setCapturedImageFile(null)
    setShowUpload(true)
  }

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
        <Button iconLeft={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
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
                  onClick={() => setLightboxIndex(filteredData.findIndex((d: any) => d.id === item.id))}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="w-full p-2 flex items-end justify-between">
                    {item.caption && (
                      <p className="text-white text-xs line-clamp-2 flex-1">{item.caption}</p>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditModal(item) }}
                      className="ml-auto mr-1 p-1.5 bg-white/90 text-gray-800 rounded-lg flex-shrink-0 hover:bg-white"
                      title="Edit photo details"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }}
                      className="p-1.5 bg-red-500 text-white rounded-lg flex-shrink-0"
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
      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title={editingId ? 'Edit Photo' : 'Upload Photo'} size="sm">
        <div className="space-y-4">
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1.5">Photo</span>
            {uploadForm.imageUrl ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={uploadForm.imageUrl.startsWith('blob:') ? uploadForm.imageUrl : buildImageUrl(uploadForm.imageUrl)}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setUploadForm((p) => ({ ...p, imageUrl: '' }))}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                disabled={uploading}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center gap-3 hover:border-[#1a6b3a]/50 hover:bg-gray-50 transition-colors"
              >
                {uploading ? (
                  <p className="text-sm text-gray-500">Uploading...</p>
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-gray-300" />
                    <p className="text-sm font-medium text-gray-700">Take or Upload Photo</p>
                  </>
                )}
              </button>
            )}
          </div>
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
              onClick={() => {
                if (editingId) updateMutation.mutate()
                else addMutation.mutate()
              }}
              loading={addMutation.isPending || updateMutation.isPending}
              disabled={!uploadForm.imageUrl}
              className="flex-1"
            >
              {editingId ? 'Update' : 'Upload'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Lightbox */}
      <LightboxViewer
        items={filteredData}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Photo"
        message="Are you sure you want to remove this photo from the gallery?"
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />

      <PhotoCaptureModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onCapture={handleCapture}
        title="Gallery Photo"
      />
    </div>
  )
}
