'use client'

import { useState, useEffect, Suspense } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Play, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { createVideo, updateVideo, getVideo } from '@/lib/api_services/videoApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { generateSlug } from '@/lib/utils'
import toast from 'react-hot-toast'

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  return match ? match[1] : null
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match ? match[1] : null
}

function VideoPreview({ url }: { url: string }) {
  const ytId = extractYoutubeId(url)
  const vimeoId = extractVimeoId(url)

  if (ytId) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}`}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    )
  }

  if (vimeoId) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
        />
      </div>
    )
  }

  return (
    <div className="aspect-video w-full rounded-lg bg-gray-100 flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300">
      <ExternalLink className="w-8 h-8 text-gray-300" />
      <p className="text-sm text-gray-400">Enter a YouTube or Vimeo URL above to preview</p>
    </div>
  )
}

function CreateVideoForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: '',
    isFeatured: false,
  })
  const [showPreview, setShowPreview] = useState(false)

  const setField = (f: string, v: any) => setForm((p) => ({ ...p, [f]: v }))

  const { data: existingVideo } = useQuery({
    queryKey: ['video', editId],
    queryFn: () => getVideo(editId!),
    enabled: !!editId,
    staleTime: 0,
  })

  useEffect(() => {
    if (existingVideo) {
      setForm({
        title: existingVideo.title,
        slug: existingVideo.slug,
        description: existingVideo.description || '',
        videoUrl: existingVideo.videoUrl,
        thumbnailUrl: existingVideo.thumbnailUrl || '',
        category: existingVideo.category || '',
        isFeatured: existingVideo.isFeatured,
      })
      setShowPreview(true)
    }
  }, [existingVideo])

  const handleTitleChange = (title: string) => {
    setForm((p) => ({ ...p, title, slug: editId ? p.slug : generateSlug(title) }))
  }

  const handleVideoUrlChange = (url: string) => {
    setField('videoUrl', url)
    // Auto-derive YouTube thumbnail if no custom one set
    if (!form.thumbnailUrl) {
      const ytId = extractYoutubeId(url)
      if (ytId) setField('thumbnailUrl', `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`)
    }
    setShowPreview(url.trim().length > 10)
  }

  const mutation = useMutation({
    mutationFn: () => {
      const data = {
        title: form.title,
        slug: form.slug || undefined,
        description: form.description || undefined,
        videoUrl: form.videoUrl,
        thumbnailUrl: form.thumbnailUrl || undefined,
        category: form.category || undefined,
        isFeatured: form.isFeatured,
      }
      return editId ? updateVideo(editId, data) : createVideo(data)
    },
    onSuccess: () => {
      toast.success(editId ? 'Video updated' : 'Video created')
      queryClient.invalidateQueries({ queryKey: ['videos-admin'] })
      queryClient.invalidateQueries({ queryKey: ['featured-videos'] })
      if (editId) queryClient.invalidateQueries({ queryKey: ['video', editId] })
      router.push('/admin/videos')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const categoryOptions = [
    { value: '', label: 'No category' },
    { value: 'highlight', label: 'Highlight' },
    { value: 'event', label: 'Event' },
    { value: 'interview', label: 'Interview' },
    { value: 'training', label: 'Training' },
    { value: 'documentary', label: 'Documentary' },
    { value: 'announcement', label: 'Announcement' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/videos">
          <button className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></button>
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">{editId ? 'Edit Video' : 'Add Video'}</h2>
      </div>

      {/* Video URL & Preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Video Source</h3>
        <Input
          label="Video URL *"
          placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
          value={form.videoUrl}
          onChange={(e) => handleVideoUrlChange(e.target.value)}
          helperText="Paste a YouTube or Vimeo link. The video will be embedded on the public page."
        />
        {showPreview && form.videoUrl && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
            <VideoPreview url={form.videoUrl} />
          </div>
        )}
        {!showPreview && (
          <div className="aspect-video w-full rounded-lg bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
            <Play className="w-10 h-10 text-gray-200" />
            <p className="text-sm text-gray-400">Paste a video URL above to see a preview</p>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Video Details</h3>
        <Input
          label="Title *"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Video title"
        />
        <Input
          label="URL Slug"
          value={form.slug}
          onChange={(e) => setField('slug', e.target.value)}
          helperText="Auto-generated from title"
        />
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => setField('category', e.target.value)}
          options={categoryOptions}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={4}
            placeholder="Brief description of the video..."
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>
        <Input
          label="Custom Thumbnail URL (optional)"
          value={form.thumbnailUrl}
          onChange={(e) => setField('thumbnailUrl', e.target.value)}
          placeholder="Auto-set from YouTube — override here if needed"
        />
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setField('isFeatured', e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm font-medium text-gray-700">Featured (shown prominently on the videos page)</span>
        </label>
      </div>

      <div className="flex gap-3">
        <Link href="/admin/videos"><Button variant="outline">Cancel</Button></Link>
        <Button
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          disabled={!form.title || !form.videoUrl}
        >
          {editId ? 'Save Changes' : 'Create Video'}
        </Button>
      </div>
    </div>
  )
}

export default function CreateVideoPage() {
  return (
    <Suspense>
      <CreateVideoForm />
    </Suspense>
  )
}
