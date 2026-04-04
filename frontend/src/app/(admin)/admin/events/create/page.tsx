'use client'

import { useState, useEffect, Suspense } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Camera, X } from 'lucide-react'
import Link from 'next/link'
import { createEvent, updateEvent, getEvent } from '@/lib/api_services/eventApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { PhotoCaptureModal } from '@/components/shared/PhotoCaptureModal'
import { generateSlug, buildImageUrl } from '@/lib/utils'
import { fileToBase64 } from '@/lib/fileUpload'
import { Editor } from '@tinymce/tinymce-react'
import toast from 'react-hot-toast'

function CreateEventForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    photoBase64: '',
    isFeatured: false,
  })

  const setField = (f: string, v: any) => setForm((p) => ({ ...p, [f]: v }))

  const [showPhotoModal, setShowPhotoModal] = useState(false)

  const handleCapture = async (file: File) => {
    try {
      const base64 = await fileToBase64(file)
      setForm((prev) => ({ ...prev, photoBase64: base64, coverImage: URL.createObjectURL(file) }))
      toast.success('Photo captured successfully!')
    } catch (error) {
      toast.error('Failed to process photo')
    }
    setShowPhotoModal(false)
  }

  const { data: existingEvent } = useQuery({
    queryKey: ['event', editId],
    queryFn: () => getEvent(editId!),
    enabled: !!editId,
  })

  useEffect(() => {
    if (existingEvent) {
      setForm({
        title: existingEvent.title,
        slug: existingEvent.slug,
        excerpt: existingEvent.excerpt || '',
        content: existingEvent.content || '',
        coverImage: existingEvent.coverImage || '',
        photoBase64: '',
        isFeatured: existingEvent.isFeatured || false,
      })
    }
  }, [existingEvent])

  const handleTitleChange = (title: string) => {
    setForm((p) => ({ ...p, title, slug: editId ? p.slug : generateSlug(title) }))
  }

  const mutation = useMutation({
    mutationFn: () => editId ? updateEvent(editId, form) : createEvent(form),
    onSuccess: () => {
      toast.success(editId ? 'Event updated' : 'Event created')
      queryClient.invalidateQueries({ queryKey: ['events-admin'] })
      router.push('/admin/events')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/events">
          <button className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></button>
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">{editId ? 'Edit Event' : 'Create Event'}</h2>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Event Details</h3>
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</span>
          {form.coverImage ? (
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={form.coverImage.startsWith('blob:') ? form.coverImage : buildImageUrl(form.coverImage)}
                alt="Cover preview"
                className="w-full h-40 object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <button
                type="button"
                onClick={() => setField('coverImage', '')}
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
        <Input label="Title" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
        <Input label="URL Slug" value={form.slug} onChange={(e) => setField('slug', e.target.value)} helperText="Auto-generated from title" />
        <Input label="Short Excerpt" placeholder="Brief event summary..." value={form.excerpt} onChange={(e) => setField('excerpt', e.target.value)} />
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isFeatured"
            checked={form.isFeatured}
            onChange={(e) => setField('isFeatured', e.target.checked)}
            className="w-4 h-4 accent-[#1a6b3a]"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Featured event (show on homepage)</label>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Event Content</h3>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TYINYMCE_KEY}
          value={form.content}
          onEditorChange={(content) => setField('content', content)}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
        />
      </div>

      <div className="flex gap-3">
        <Link href="/admin/events"><Button variant="outline">Cancel</Button></Link>
        <Button
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          disabled={!form.title}
        >
          {editId ? 'Save Changes' : 'Create Event'}
        </Button>
      </div>

      <PhotoCaptureModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onCapture={handleCapture}
        title="Event Cover Image"
      />
    </div>
  )
}

export default function CreateEventPage() {
  return (
    <Suspense>
      <CreateEventForm />
    </Suspense>
  )
}
