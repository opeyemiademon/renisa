'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: { value: number; label?: string }
  variant?: 'green' | 'gold' | 'white'
  className?: string
}

export function StatCard({ title, value, icon, trend, variant = 'white', className }: StatCardProps) {
  const variants = {
    green: 'bg-[#1a6b3a] text-white',
    gold: 'bg-[#d4a017] text-white',
    white: 'bg-white text-gray-900 border border-gray-200',
  }

  const iconVariants = {
    green: 'bg-white/20 text-white',
    gold: 'bg-white/20 text-white',
    white: 'bg-[#1a6b3a]/10 text-[#1a6b3a]',
  }

  const textVariants = {
    green: 'text-white/80',
    gold: 'text-white/80',
    white: 'text-gray-500',
  }

  return (
    <div className={cn('rounded-xl p-5 shadow-sm', variants[variant], className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cn('text-sm font-medium mb-1', textVariants[variant])}>{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <div className={cn('flex items-center gap-1 mt-1.5 text-xs', textVariants[variant])}>
              {trend.value >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              )}
              <span>
                {trend.value >= 0 ? '+' : ''}
                {trend.value}% {trend.label || 'vs last month'}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('p-2.5 rounded-lg', iconVariants[variant])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
