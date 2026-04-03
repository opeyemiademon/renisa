'use client'

import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'pending'
  | 'completed'
  | 'alumni'
  | 'approved'
  | 'rejected'
  | 'paid'
  | 'failed'
  | 'published'
  | 'draft'
  | 'upcoming'
  | 'closed'
  | 'results_declared'
  | 'physical'
  | 'online'
  | 'monetary'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'acknowledged'
  | 'verified'

interface BadgeProps {
  variant: BadgeVariant | string
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  inactive: 'bg-gray-100 text-gray-700',
  suspended: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  alumni: 'bg-purple-100 text-purple-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
  paid: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
  published: 'bg-emerald-100 text-emerald-800',
  draft: 'bg-gray-100 text-gray-700',
  upcoming: 'bg-blue-100 text-blue-800',
  closed: 'bg-gray-100 text-gray-700',
  results_declared: 'bg-purple-100 text-purple-800',
  physical: 'bg-orange-100 text-orange-800',
  online: 'bg-blue-100 text-blue-800',
  monetary: 'bg-emerald-100 text-emerald-800',
  processing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  acknowledged: 'bg-emerald-100 text-emerald-800',
  verified: 'bg-emerald-100 text-emerald-800',
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        variantStyles[variant] || 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {children}
    </span>
  )
}
