'use client'

import { useState, useRef } from 'react'
import { Bold, Italic, Heading2, List, ListOrdered, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  label,
  error,
  placeholder,
  className,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const wrapSelection = (before: string, after: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.slice(start, end)
    const newValue = value.slice(0, start) + before + selected + after + value.slice(end)
    onChange(newValue)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const insertAtLine = (prefix: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart)
    onChange(newValue)
    setTimeout(() => ta.focus(), 0)
  }

  const tools = [
    { icon: <Bold className="w-4 h-4" />, action: () => wrapSelection('<strong>', '</strong>'), title: 'Bold' },
    { icon: <Italic className="w-4 h-4" />, action: () => wrapSelection('<em>', '</em>'), title: 'Italic' },
    { icon: <Heading2 className="w-4 h-4" />, action: () => wrapSelection('<h2>', '</h2>'), title: 'Heading' },
    { icon: <List className="w-4 h-4" />, action: () => insertAtLine('<li>'), title: 'List item' },
    { icon: <Link2 className="w-4 h-4" />, action: () => wrapSelection('<a href="#">', '</a>'), title: 'Link' },
  ]

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <div
        className={cn(
          'border rounded-lg overflow-hidden',
          error ? 'border-red-500' : 'border-gray-300 focus-within:border-[#1a6b3a] focus-within:ring-2 focus-within:ring-[#1a6b3a]/20'
        )}
      >
        <div className="flex gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
          {tools.map((tool, i) => (
            <button
              key={i}
              type="button"
              title={tool.title}
              onClick={tool.action}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
            >
              {tool.icon}
            </button>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={10}
          className="w-full p-3 text-sm text-gray-900 resize-vertical focus:outline-none bg-white"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
