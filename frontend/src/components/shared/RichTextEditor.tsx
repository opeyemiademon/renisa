'use client'

import dynamic from 'next/dynamic'
// @ts-ignore
import 'react-quill-new/dist/quill.snow.css'
import { cn } from '@/lib/utils'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

const DEFAULT_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
}

const DEFAULT_FORMATS = ['bold', 'italic', 'underline', 'list', 'align', 'link']

export const EMAIL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
}

export const EMAIL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'align', 'link',
]

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  placeholder?: string
  className?: string
  height?: number
  modules?: Record<string, unknown>
  formats?: string[]
}

export function RichTextEditor({
  value,
  onChange,
  label,
  error,
  placeholder,
  className,
  height = 300,
  modules,
  formats,
}: RichTextEditorProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <div className={cn('rounded-lg overflow-hidden', error ? 'ring-2 ring-red-500' : '')}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules ?? DEFAULT_MODULES}
          formats={formats ?? DEFAULT_FORMATS}
          placeholder={placeholder}
          style={{ height }}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
