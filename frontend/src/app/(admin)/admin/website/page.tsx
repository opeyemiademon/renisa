'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Save, ChevronDown, Globe, Camera, X } from 'lucide-react'
import { getAllSiteContent, updateSiteContent } from '@/lib/api_services/siteContentApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { RichTextEditor } from '@/components/shared/RichTextEditor'
import { PhotoCaptureModal } from '@/components/shared/PhotoCaptureModal'
import { uploadFile } from '@/lib/api_services/uploadApiService'
import { buildImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

const CMS_SECTIONS = [
 
  {
    key: 'about',
    label: 'About Section',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'content', label: 'About Content', type: 'richtext' },
      { key: 'image', label: 'About Image', type: 'image' },
    ],
  },
  {
    key: 'mission',
    label: 'Mission & Vision',
    fields: [
      { key: 'mission', label: 'Mission Statement', type: 'richtext' },
      { key: 'vision', label: 'Vision Statement', type: 'richtext' },
    ],
  },
  {
    key: 'history',
    label: 'History',
    fields: [
      { key: 'content', label: 'History Content', type: 'richtext' },
    ],
  },
  {
    key: 'welcome_address',
    label: "President's Welcome Address",
    fields: [
      { key: 'quote', label: 'Pull Quote (shown on homepage & address page)', type: 'text' },
      { key: 'preview', label: 'Homepage Preview Text', type: 'richtext' },
      { key: 'content', label: 'Full Welcome Address', type: 'richtext' },
    ],
  },
  {
    key: 'core_values',
    label: 'Core Values',
    fields: [
      { key: 'value1_title', label: 'Value 1 — Title', type: 'text' },
      { key: 'value1_description', label: 'Value 1 — Description', type: 'text' },
      { key: 'value2_title', label: 'Value 2 — Title', type: 'text' },
      { key: 'value2_description', label: 'Value 2 — Description', type: 'text' },
      { key: 'value3_title', label: 'Value 3 — Title', type: 'text' },
      { key: 'value3_description', label: 'Value 3 — Description', type: 'text' },
      { key: 'value4_title', label: 'Value 4 — Title', type: 'text' },
      { key: 'value4_description', label: 'Value 4 — Description', type: 'text' },
      { key: 'value5_title', label: 'Value 5 — Title', type: 'text' },
      { key: 'value5_description', label: 'Value 5 — Description', type: 'text' },
      { key: 'value6_title', label: 'Value 6 — Title', type: 'text' },
      { key: 'value6_description', label: 'Value 6 — Description', type: 'text' },
    ],
  },
  {
    key: 'contact',
    label: 'Contact Information',
    fields: [
      { key: 'address', label: 'Office Address', type: 'text' },
      { key: 'phone', label: 'Phone Number', type: 'text' },
      { key: 'email', label: 'Email Address', type: 'text' },
      { key: 'mapEmbed', label: 'Google Maps Embed URL', type: 'text' },
    ],
  },
  {
    key: 'social',
    label: 'Social Media Links',
    fields: [
      { key: 'facebook', label: 'Facebook URL', type: 'text' },
      { key: 'twitter', label: 'Twitter/X URL', type: 'text' },
      { key: 'instagram', label: 'Instagram URL', type: 'text' },
      { key: 'youtube', label: 'YouTube URL', type: 'text' },
      { key: 'linkedin', label: 'LinkedIn URL', type: 'text' },
    ],
  },
]

function CMSSection({ section, content, onSave }: { section: typeof CMS_SECTIONS[0]; content: any; onSave: (key: string, data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
  const [dirty, setDirty] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [currentImageField, setCurrentImageField] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const initial: Record<string, string> = {}
    section.fields.forEach((f) => { initial[f.key] = content?.[f.key] || '' })
    setForm(initial)
    setDirty(false)
  }, [content, section])

  const setField = (k: string, v: string) => { setForm((p) => ({ ...p, [k]: v })); setDirty(true) }

  const handleCapture = async (file: File) => {
    setShowPhotoModal(false)
    setUploading(true)
    try {
      const result = await uploadFile(file)
      if (currentImageField) {
        setField(currentImageField, result.url)
      }
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
      setCurrentImageField(null)
    }
  }

  const openPhotoModal = (fieldKey: string) => {
    setCurrentImageField(fieldKey)
    setShowPhotoModal(true)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{section.label}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
          <div className="pt-4 space-y-4">
            {section.fields.map((field) => (
              <div key={field.key}>
                {field.type === 'richtext' ? (
                  <RichTextEditor
                    label={field.label}
                    value={form[field.key] || ''}
                    onChange={(v) => setField(field.key, v)}
                  />
                ) : field.type === 'image' ? (
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</span>
                    {form[field.key] ? (
                      <div className="relative rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={buildImageUrl(form[field.key])}
                          alt={field.label}
                          className="w-full h-40 object-cover"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <button
                          type="button"
                          onClick={() => setField(field.key, '')}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openPhotoModal(field.key)}
                        disabled={uploading}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center gap-3 hover:border-[#1a6b3a]/50 hover:bg-gray-50 transition-colors"
                      >
                        {uploading && currentImageField === field.key ? (
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
                ) : (
                  <Input
                    label={field.label}
                    value={form[field.key] || ''}
                    onChange={(e) => setField(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button
              size="sm"
              iconLeft={<Save className="w-4 h-4" />}
              onClick={() => onSave(section.key, form)}
              disabled={!dirty}
            >
              Save {section.label}
            </Button>
          </div>
        </div>
      )}
      
      <PhotoCaptureModal
        isOpen={showPhotoModal}
        onClose={() => { setShowPhotoModal(false); setCurrentImageField(null) }}
        onCapture={handleCapture}
        title="Upload Image"
      />
    </div>
  )
}

export default function WebsiteCMSPage() {
  const queryClient = useQueryClient()

  const { data: contentData, isLoading } = useQuery({
    queryKey: ['site-content-all'],
    queryFn: () => getAllSiteContent(),
  })

  const mutation = useMutation({
    mutationFn: ({ section, data }: { section: string; data: any }) => updateSiteContent(section, data),
    onSuccess: () => {
      toast.success('Content saved')
      queryClient.invalidateQueries({ queryKey: ['site-content-all'] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const getContentForSection = (key: string) => {
    if (!contentData) return {}
    const item = contentData.find?.((c: any) => c.section === key)
    return item?.metadata || item?.content || {}
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="w-6 h-6 text-[#1a6b3a]" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Website Content (CMS)</h2>
          <p className="text-gray-500 text-sm mt-0.5">Edit website content, hero text, about section, and more</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-16" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {CMS_SECTIONS.map((section) => (
            <CMSSection
              key={section.key}
              section={section}
              content={getContentForSection(section.key)}
              onSave={(sectionKey, data) => mutation.mutate({ section: sectionKey, data })}
            />
          ))}
        </div>
      )}
    </div>
  )
}
