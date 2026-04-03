'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  rows?: number
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2.5 rounded-lg border text-sm transition-colors',
            'border-gray-300 bg-white text-gray-900 placeholder-gray-400',
            'focus:outline-none focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/20',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            props.disabled && 'bg-gray-50 cursor-not-allowed opacity-70',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, rows = 4, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            'w-full px-3 py-2.5 rounded-lg border text-sm transition-colors resize-vertical',
            'border-gray-300 bg-white text-gray-900 placeholder-gray-400',
            'focus:outline-none focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/20',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            props.disabled && 'bg-gray-50 cursor-not-allowed opacity-70',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
