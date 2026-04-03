'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page?: number
  currentPage?: number
  totalPages: number
  total?: number
  totalItems?: number
  limit?: number
  itemsPerPage?: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, currentPage, totalPages, total, totalItems, limit, itemsPerPage, onPageChange }: PaginationProps) {
  const activePage = currentPage ?? page ?? 1
  const activeLimit = itemsPerPage ?? limit ?? 10
  const activeTotal = totalItems ?? total ?? 0
  const startItem = (activePage - 1) * activeLimit + 1
  const endItem = Math.min(activePage * activeLimit, activeTotal)

  const getPageNumbers = () => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (activePage > 3) pages.push('...')
      const start = Math.max(2, activePage - 1)
      const end = Math.min(totalPages - 1, activePage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (activePage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <p className="text-sm text-gray-500">
        Showing {startItem}–{endItem} of {activeTotal} items
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(activePage - 1)}
          disabled={activePage === 1}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-3 py-2 text-gray-400 text-sm">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                p === activePage
                  ? 'bg-[#1a6b3a] text-white'
                  : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(activePage + 1)}
          disabled={activePage === totalPages}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
