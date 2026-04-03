'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Save, ChevronDown, FileText, Globe } from 'lucide-react'
import { getAllSiteContent, updateSiteContent } from '@/lib/api_services/siteContentApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { RichTextEditor } from '@/components/shared/RichTextEditor'
import { FileUpload } from '@/components/shared/FileUpload'
import toast from 'react-hot-toast'

const CMS_SECTIONS = [
  {
    key: 'hero',
    label: 'Homepage Hero',
    fields: [
      { key: 'title', label: 'Headline', type: 'text' },
      { key: 'subtitle', label: 'Subheadline', type: 'text' },
      { key: 'ctaText', label: 'CTA Button Text', type: 'text' },
      { key: 'backgroundImage', label: 'Background Image', type: 'image' },
    ],
  },
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

  useEffect(() => {
    const initial: Record<string, string> = {}
    section.fields.forEach((f) => { initial[f.key] = content?.[f.key] || '' })
    setForm(initial)
    setDirty(false)
  }, [content, section])

  const setField = (k: string, v: string) => { setForm((p) => ({ ...p, [k]: v })); setDirty(true) }

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
                  <FileUpload
                    label={field.label}
                    value={form[field.key] || ''}
                    onChange={(url) => setField(field.key, url)}
                  />
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
