'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#1a6b3a] text-white hover:bg-[#0d4a25] active:bg-[#0d4a25] focus:ring-[#1a6b3a]/30',
  secondary:
    'bg-[#d4a017] text-white hover:bg-[#b88c12] active:bg-[#b88c12] focus:ring-[#d4a017]/30',
  outline:
    'border-2 border-[#1a6b3a] text-[#1a6b3a] bg-transparent hover:bg-[#1a6b3a] hover:text-white focus:ring-[#1a6b3a]/30',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500/30',
  ghost:
    'bg-transparent text-[#1a6b3a] hover:bg-[#1a6b3a]/10 focus:ring-[#1a6b3a]/20',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : iconLeft ? (
        <span className="flex-shrink-0">{iconLeft}</span>
      ) : null}
      {children}
      {!loading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  )
}
