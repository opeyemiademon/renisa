'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  emptyIcon?: ReactNode
  keyExtractor?: (row: T, index: number) => string
  onRowClick?: (row: T) => void
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        </td>
      ))}
    </tr>
  )
}

export function DataTable<T>({
  columns,
  data,
  loading,
  emptyMessage = 'No data found',
  emptyIcon,
  keyExtractor,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))
            : data.length === 0
            ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    {emptyIcon}
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )
            : data.map((row, idx) => (
              <tr
                key={keyExtractor ? keyExtractor(row, idx) : idx}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-gray-100 hover:bg-gray-50 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('px-4 py-3 text-gray-700', col.className)}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
