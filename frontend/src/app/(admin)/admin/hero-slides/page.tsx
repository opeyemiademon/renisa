'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Image as ImageIcon, ExternalLink, Camera, X } from 'lucide-react'
import {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} from '@/lib/api_services/heroSlideApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { PhotoCaptureModal } from '@/components/shared/PhotoCaptureModal'
import { HeroSlide } from '@/types'
import { uploadFile } from '@/lib/api_services/uploadApiService'
import { buildImageUrl } from '@/lib/utils'
import { fileToBase64 } from '@/lib/fileUpload'
import toast from 'react-hot-toast'

interface SlideForm {
  title: string
  subtitle: string
  caption: string
  imageUrl: string
  photoBase64?: string
  tag: string
  ctaText: string
  ctaLink: string
  isActive: boolean
}

const emptyForm: SlideForm = {
  title: '',
  subtitle: '',
  caption: '',
  imageUrl: '',
  tag: '',
  ctaText: 'Become a Member',
  ctaLink: '/registration',
  isActive: true,
}

export default function HeroSlidesPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<SlideForm>(emptyForm)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [showPhotoModal, setShowPhotoModal] = useState(false)

  const setField = (f: keyof SlideForm, v: any) => setForm((p) => ({ ...p, [f]: v }))

  const { data: slides = [], isLoading } = useQuery({
    queryKey: ['hero-slides-admin'],
    queryFn: () => getHeroSlides(),
  })

  const createMutation = useMutation({
    mutationFn: () => createHeroSlide(form),
    onSuccess: () => {
      toast.success('Slide added')
      queryClient.invalidateQueries({ queryKey: ['hero-slides-admin'] })
      queryClient.invalidateQueries({ queryKey: ['hero-slides-public'] })
      setShowModal(false)
      setForm(emptyForm)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: () => updateHeroSlide(editId!, form),
    onSuccess: () => {
      toast.success('Slide updated')
      queryClient.invalidateQueries({ queryKey: ['hero-slides-admin'] })
      queryClient.invalidateQueries({ queryKey: ['hero-slides-public'] })
      setShowModal(false)
      setEditId(null)
      setForm(emptyForm)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteHeroSlide(id),
    onSuccess: () => {
      toast.success('Slide removed')
      queryClient.invalidateQueries({ queryKey: ['hero-slides-admin'] })
      queryClient.invalidateQueries({ queryKey: ['hero-slides-public'] })
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateHeroSlide(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides-admin'] })
      queryClient.invalidateQueries({ queryKey: ['hero-slides-public'] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) => reorderHeroSlides(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides-admin'] })
      queryClient.invalidateQueries({ queryKey: ['hero-slides-public'] })
    },
  })

  const openCreate = () => {
    setEditId(null)
    setForm({ ...emptyForm, tag: `Slide ${slides.length + 1}` })
    setShowModal(true)
  }

  const openEdit = (slide: HeroSlide) => {
    setEditId(slide.id)
    setForm({
      title: slide.title,
      subtitle: slide.subtitle || '',
      caption: slide.caption || '',
      imageUrl: slide.imageUrl,
      tag: slide.tag || '',
      ctaText: slide.ctaText || 'Become a Member',
      ctaLink: slide.ctaLink || '/registration',
      isActive: slide.isActive,
    })
    setShowModal(true)
  }

  const handleCapture = async (file: File) => {
    try {
      const base64 = await fileToBase64(file)
      setForm((prev) => ({ ...prev, photoBase64: base64, imageUrl: URL.createObjectURL(file) }))
      toast.success('Photo captured successfully!')
    } catch (error) {
      toast.error('Failed to process photo')
    }
    setShowPhotoModal(false)
  }

  const handleSubmit = () => editId ? updateMutation.mutate() : createMutation.mutate()
  const isPending = createMutation.isPending || updateMutation.isPending

  // Drag-to-reorder
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('slideId', id)
  }
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData('slideId')
    if (draggedId === targetId) return
    const sorted = [...slides].sort((a, b) => a.order - b.order)
    const fromIdx = sorted.findIndex((s) => s.id === draggedId)
    const toIdx = sorted.findIndex((s) => s.id === targetId)
    const reordered = [...sorted]
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, moved)
    reorderMutation.mutate(reordered.map((s) => s.id))
    setDragOver(null)
  }

  const sorted = [...slides].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Hero Slides</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage homepage hero banner slides — images, titles and captions
          </p>
        </div>
        <Button iconLeft={<Plus className="w-4 h-4" />} onClick={openCreate}>
          Add Slide
        </Button>
      </div>

      {/* Slides list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse h-24" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No slides yet</p>
          <p className="text-sm mt-1">Add your first hero slide to get started</p>
          <button
            onClick={openCreate}
            className="mt-4 text-[#1a6b3a] text-sm font-medium hover:underline"
          >
            + Add Slide
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <GripVertical className="w-3.5 h-3.5" />
            Drag rows to reorder slides
          </p>
          {sorted.map((slide, i) => (
            <div
              key={slide.id}
              draggable
              onDragStart={(e) => handleDragStart(e, slide.id)}
              onDragOver={(e) => { e.preventDefault(); setDragOver(slide.id) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, slide.id)}
              className={`bg-white rounded-xl border transition-all duration-150 ${
                dragOver === slide.id
                  ? 'border-[#1a6b3a] shadow-lg scale-[1.01]'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!slide.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Drag handle */}
                <div className="cursor-grab text-gray-300 hover:text-gray-500 flex-shrink-0">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Order badge */}
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                  {i + 1}
                </div>

                {/* Preview image */}
                <div className="w-32 h-18 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative"
                  style={{ height: '4.5rem' }}>
                  {slide.imageUrl ? (
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                  {/* Active/inactive overlay */}
                  {!slide.isActive && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Text info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {slide.tag && (
                      <span className="text-xs bg-[#1a6b3a]/10 text-[#1a6b3a] px-2 py-0.5 rounded-full font-medium">
                        {slide.tag}
                      </span>
                    )}
                    {!slide.isActive && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{slide.title}</h3>
                  {slide.subtitle && (
                    <p className="text-sm text-gray-500 truncate mt-0.5">{slide.subtitle}</p>
                  )}
                  {slide.caption && (
                    <p className="text-xs text-gray-400 italic truncate">{slide.caption}</p>
                  )}
                </div>

                {/* CTA info */}
                {slide.ctaText && (
                  <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="max-w-28 truncate">{slide.ctaText}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleActiveMutation.mutate({ id: slide.id, isActive: !slide.isActive })}
                    className={`p-2 rounded-lg transition-colors ${
                      slide.isActive
                        ? 'text-[#1a6b3a] hover:bg-[#1a6b3a]/5'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={slide.isActive ? 'Hide slide' : 'Show slide'}
                  >
                    {slide.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(slide)}
                    className="p-2 text-gray-400 hover:text-[#1a6b3a] hover:bg-[#1a6b3a]/5 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(slide.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditId(null); setForm(emptyForm) }}
        title={editId ? 'Edit Slide' : 'Add Hero Slide'}
        size="md"
      >
        <div className="space-y-4">
          {/* Image capture / preview */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1.5">Background Image</span>
            
            {form.imageUrl ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={form.imageUrl.startsWith('blob:') ? form.imageUrl : buildImageUrl(form.imageUrl)}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <button
                  type="button"
                  onClick={() => setField('imageUrl', '')}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center gap-3 hover:border-[#1a6b3a]/50 hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-10 h-10 text-gray-300" />
                <p className="text-sm font-medium text-gray-700">Take or Upload Photo</p>
              </button>
            )}
          </div>

          {/* Image URL override (Unsplash etc.) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Or paste image URL (e.g. Unsplash)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={form.imageUrl}
              onChange={(e) => setField('imageUrl', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3a]/30"
            />
          </div>

          <Input
            label="Tag / Badge Text"
            placeholder="e.g. Celebrating Our Heroes"
            value={form.tag}
            onChange={(e) => setField('tag', e.target.value)}
          />

          <Input
            label="Title *"
            placeholder="Main headline for this slide"
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea
              rows={2}
              placeholder="Supporting text below the title"
              value={form.subtitle}
              onChange={(e) => setField('subtitle', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3a]/30"
            />
          </div>

          <Input
            label="Caption (italic line)"
            placeholder="e.g. RENISA — Where Champions Come Home"
            value={form.caption}
            onChange={(e) => setField('caption', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Button Text"
              placeholder="Become a Member"
              value={form.ctaText}
              onChange={(e) => setField('ctaText', e.target.value)}
            />
            <Input
              label="Button Link"
              placeholder="/registration"
              value={form.ctaLink}
              onChange={(e) => setField('ctaLink', e.target.value)}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setField('isActive', !form.isActive)}
              className={`w-11 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-[#1a6b3a]' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {form.isActive ? 'Visible on homepage' : 'Hidden from homepage'}
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={isPending}
              disabled={!form.title || !form.imageUrl}
              className="flex-1"
            >
              {editId ? 'Save Changes' : 'Add Slide'}
            </Button>
          </div>
        </div>
      </Modal>

      <PhotoCaptureModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onCapture={handleCapture}
        title="Slide Background Image"
      />

      {/* Delete confirm */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Remove Slide"
        message="Are you sure you want to delete this hero slide? This cannot be undone."
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
