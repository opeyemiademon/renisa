'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Upload, X, Image as ImageIcon, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadFile } from '@/lib/api_services/uploadApiService'
import toast from 'react-hot-toast'

interface FileUploadProps {
  value?: string
  onChange: (url: string) => void
  accept?: string
  label?: string
  className?: string
}

export function FileUpload({ value, onChange, accept = 'image/*', label, className }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB')
      return
    }
    try {
      setUploading(true)
      setProgress(0)
      const result = await uploadFile(file, setProgress)
      onChange(result.url)
      toast.success('File uploaded successfully')
    } catch {
      toast.error('Failed to upload file')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const isImage = accept?.includes('image')

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          {isImage ? (
            <img src={value} alt="Upload preview" className="w-full h-48 object-cover" />
          ) : (
            <div className="flex items-center gap-3 p-4">
              <FileText className="w-8 h-8 text-[#1a6b3a]" />
              <span className="text-sm text-gray-700 truncate">{value}</span>
            </div>
          )}
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors',
            isDragging ? 'border-[#1a6b3a] bg-[#1a6b3a]/5' : 'border-gray-300 hover:border-[#1a6b3a]/50 hover:bg-gray-50'
          )}
        >
          {uploading ? (
            <>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#1a6b3a] h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">Uploading... {progress}%</p>
            </>
          ) : (
            <>
              {isImage ? (
                <ImageIcon className="w-10 h-10 text-gray-300" />
              ) : (
                <Upload className="w-10 h-10 text-gray-300" />
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
              </div>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
