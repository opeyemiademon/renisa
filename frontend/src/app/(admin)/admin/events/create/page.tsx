'use client'

import { useState, useEffect, Suspense } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createEvent, updateEvent, getEvent } from '@/lib/api_services/eventApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { FileUpload } from '@/components/shared/FileUpload'
import { RichTextEditor } from '@/components/shared/RichTextEditor'
import { generateSlug } from '@/lib/utils'
import toast from 'react-hot-toast'

function CreateEventForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    type: 'conference',
    startDate: '',
    endDate: '',
    location: '',
    address: '',
    coverImage: '',
    registrationLink: '',
    isFeatured: false,
  })

  const setField = (f: string, v: any) => setForm((p) => ({ ...p, [f]: v }))

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
        description: existingEvent.description || '',
        content: existingEvent.content || '',
        type: existingEvent.type || existingEvent.eventType || 'conference',
        startDate: existingEvent.startDate ? existingEvent.startDate.slice(0, 16) : '',
        endDate: existingEvent.endDate ? existingEvent.endDate.slice(0, 16) : '',
        location: existingEvent.location || '',
        address: existingEvent.address || '',
        coverImage: existingEvent.coverImage || '',
        registrationLink: existingEvent.registrationLink || '',
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
        <FileUpload label="Cover Image" value={form.coverImage} onChange={(url) => setField('coverImage', url)} />
        <Input label="Title" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
        <Input label="URL Slug" value={form.slug} onChange={(e) => setField('slug', e.target.value)} helperText="Auto-generated from title" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="Event Type"
            value={form.type}
            onChange={(e) => setField('type', e.target.value)}
            options={[
              { value: 'conference', label: 'Conference' },
              { value: 'tournament', label: 'Tournament' },
              { value: 'meeting', label: 'Meeting' },
              { value: 'award', label: 'Award Ceremony' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <Input label="Registration Link (optional)" type="url" value={form.registrationLink} onChange={(e) => setField('registrationLink', e.target.value)} />
        </div>
        <Input label="Short Description" placeholder="Brief event summary..." value={form.description} onChange={(e) => setField('description', e.target.value)} />
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

      {/* Dates & Location */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Date & Location</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Start Date & Time" type="datetime-local" value={form.startDate} onChange={(e) => setField('startDate', e.target.value)} />
          <Input label="End Date & Time" type="datetime-local" value={form.endDate} onChange={(e) => setField('endDate', e.target.value)} />
        </div>
        <Input label="Location / Venue" value={form.location} onChange={(e) => setField('location', e.target.value)} />
        <Input label="Full Address (optional)" value={form.address} onChange={(e) => setField('address', e.target.value)} />
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Full Content</h3>
        <RichTextEditor
          label="Event Content"
          value={form.content}
          onChange={(v) => setField('content', v)}
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
