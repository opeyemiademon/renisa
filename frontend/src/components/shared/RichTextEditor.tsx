'use client'

import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

const Editor = dynamic(() => import('@tinymce/tinymce-react').then((m) => m.Editor), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  placeholder?: string
  className?: string
  height?: number
}

export function RichTextEditor({
  value,
  onChange,
  label,
  error,
  placeholder,
  className,
  height = 300,
}: RichTextEditorProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <div className={cn('rounded-lg overflow-hidden', error ? 'ring-2 ring-red-500' : '')}>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TYINYMCE_KEY}
          value={value}
          onEditorChange={onChange}
          init={{
            height,
            menubar: false,
            placeholder,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'charmap',
              'searchreplace', 'visualblocks', 'code',
              'insertdatetime', 'table', 'wordcount',
            ],
            toolbar:
              'undo redo | blocks | bold italic forecolor | ' +
              'alignleft aligncenter alignright | bullist numlist | ' +
              'link | removeformat | code',
            content_style: 'body { font-family: Arial, sans-serif; font-size: 14px; }',
            branding: false,
          }}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
