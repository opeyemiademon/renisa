'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Heart, ExternalLink } from 'lucide-react'
import { getAllDonations, acknowledgeDonation } from '@/lib/api_services/donationApiServices'
import { Badge } from '@/components/shared/Badge'
import { Select } from '@/components/shared/Select'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { SearchBar } from '@/components/shared/SearchBar'
import { formatDate, formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

type Tab = 'monetary' | 'physical'

function CellHint({ text, className = '' }: { text: string; className?: string }) {
  if (!text || text === '—') return <span className="text-gray-400">—</span>
  return (
    <p className={`text-gray-700 text-xs leading-relaxed max-w-[220px] line-clamp-3 ${className}`} title={text}>
      {text}
    </p>
  )
}

function paymentStatusVariant(s: string | undefined) {
  if (s === 'successful') return 'paid' as const
  if (s === 'failed') return 'failed' as const
  return 'pending' as const
}

function recordStatusVariant(s: string | undefined) {
  if (s === 'acknowledged') return 'acknowledged' as const
  if (s === 'received' || s === 'completed') return 'completed' as const
  return 'pending' as const
}

function canAcknowledgeMonetary(row: {
  isAcknowledged?: boolean
  paymentStatus?: string
  paymentMethod?: string
}) {
  if (row.isAcknowledged) return false
  if (row.paymentMethod === 'bank_transfer') return true
  return row.paymentStatus === 'successful'
}

export default function DonationsPage() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<Tab>('monetary')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [acknowledgeId, setAcknowledgeId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['donations', tab],
    queryFn: () => getAllDonations({ type: tab }),
  })

  const acknowledgeMutation = useMutation({
    mutationFn: (id: string) => acknowledgeDonation(id),
    onSuccess: () => {
      toast.success('Donation acknowledged')
      queryClient.invalidateQueries({ queryKey: ['donations'] })
      setAcknowledgeId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const allDonations = (data || []) as any[]

  const statusOptions = useMemo(() => {
    if (tab === 'physical') {
      return [
        { value: '', label: 'All record statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'received', label: 'Received' },
        { value: 'acknowledged', label: 'Acknowledged' },
        { value: 'completed', label: 'Completed' },
      ]
    }
    return [
      { value: '', label: 'All payment statuses' },
      { value: 'pending', label: 'Payment pending' },
      { value: 'successful', label: 'Paid (successful)' },
      { value: 'failed', label: 'Payment failed' },
    ]
  }, [tab])

  const filteredData = useMemo(() => {
    let rows = allDonations
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (d: any) =>
          d.donorName?.toLowerCase().includes(q) ||
          d.donorEmail?.toLowerCase().includes(q) ||
          d.donorPhone?.toLowerCase().includes(q) ||
          d.items?.toLowerCase().includes(q) ||
          d.physicalItems?.toLowerCase().includes(q) ||
          d.notes?.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.paystackRef?.toLowerCase().includes(q) ||
          d.manualTransferReference?.toLowerCase().includes(q) ||
          d.invoice?.invoiceNumber?.toLowerCase().includes(q) ||
          d.member?.firstName?.toLowerCase().includes(q) ||
          d.member?.lastName?.toLowerCase().includes(q)
      )
    }
    if (statusFilter) {
      if (tab === 'physical') {
        rows = rows.filter((d: any) => d.status === statusFilter)
      } else {
        rows = rows.filter((d: any) => d.paymentStatus === statusFilter)
      }
    }
    return rows
  }, [allDonations, search, statusFilter, tab])

  const visibleRows = filteredData.slice(0, visibleCount)

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Donations</h2>
        <p className="text-gray-500 text-sm mt-0.5">{allDonations.length} donations in this tab</p>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(['monetary', 'physical'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t)
              setVisibleCount(20)
              setSearch('')
              setStatusFilter('')
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v)
            setVisibleCount(20)
          }}
          placeholder="Search donor, items, reference, invoice…"
          className="flex-1 min-w-[200px] max-w-md"
        />
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setVisibleCount(20)
          }}
          options={statusOptions}
        />
      </div>

      {filteredData.length === 0 && !isLoading ? (
        <div className="text-center py-16 text-gray-400">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No {tab} donations found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Donor
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Category
                  </th>
                  {tab === 'monetary' ? (
                    <>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                        Amount
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                        Invoice
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                        Payment
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                        Donor notes
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                        Payment status
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                        Record
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide min-w-[200px]">
                        Items donated
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                        Qty
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                        Est. value
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                        Drop-off
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                        Notes
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                        Status
                      </th>
                    </>
                  )}
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-28" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-12 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-12 text-center text-gray-400">
                      No records found
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((row: any) => {
                    const itemText = (row.items || row.physicalItems || '').trim() || ''
                    const notesText = (row.notes || row.description || '').trim() || ''
                    return (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors align-top">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">
                              {row.donorName || `${row.member?.firstName || ''} ${row.member?.lastName || ''}`.trim()}
                            </p>
                            {(row.donorEmail || row.donorPhone) && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {[row.donorEmail, row.donorPhone].filter(Boolean).join(' · ')}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{row.donationType?.name || '—'}</td>
                        {tab === 'monetary' ? (
                          <>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-gray-900">
                                {row.amount != null ? formatCurrency(row.amount) : '—'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {row.invoice?.invoiceNumber ? (
                                <div className="space-y-1">
                                  <p className="font-mono text-xs text-gray-800">{row.invoice.invoiceNumber}</p>
                                  <p className="text-[10px] text-gray-400 capitalize">{row.invoice.status}</p>
                                  {row.invoice.pdfUrl && (
                                    <a
                                      href={`${apiBase}${row.invoice.pdfUrl}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-0.5 text-[11px] text-[#1a6b3a] hover:underline"
                                    >
                                      PDF <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-xs text-gray-700 space-y-1 max-w-[200px]">
                                <p>
                                  <span className="text-gray-400">Method: </span>
                                  {row.paymentMethod === 'bank_transfer'
                                    ? 'Bank transfer'
                                    : row.paymentMethod === 'paystack'
                                      ? 'Paystack'
                                      : row.paymentMethod || '—'}
                                </p>
                                {row.paystackRef && (
                                  <p className="font-mono text-[11px] break-all" title={row.paystackRef}>
                                    Ref: {row.paystackRef}
                                  </p>
                                )}
                                {row.manualTransferReference && (
                                  <p className="font-mono text-[11px] break-all" title={row.manualTransferReference}>
                                    Transfer ref: {row.manualTransferReference}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <CellHint text={notesText || '—'} />
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={paymentStatusVariant(row.paymentStatus)}>
                                {row.paymentStatus || '—'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={recordStatusVariant(row.status)}>{row.status || '—'}</Badge>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3">
                              <CellHint text={itemText || '—'} className="max-w-[280px]" />
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {row.quantity != null && row.quantity !== '' ? row.quantity : '—'}
                            </td>
                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                              {row.estimatedValue != null ? formatCurrency(row.estimatedValue) : '—'}
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                              {row.preferredDropoffDate
                                ? formatDate(row.preferredDropoffDate, 'MMM d, yyyy')
                                : '—'}
                            </td>
                            <td className="px-4 py-3">
                              <CellHint text={notesText || '—'} />
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={recordStatusVariant(row.status)}>{row.status || '—'}</Badge>
                            </td>
                          </>
                        )}
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {formatDate(row.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          {tab === 'monetary' ? (
                            canAcknowledgeMonetary(row) ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setAcknowledgeId(row.id)
                                }}
                                className="flex items-center gap-1 text-xs text-[#1a6b3a] hover:bg-[#1a6b3a]/5 px-2 py-1.5 rounded-lg"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Acknowledge
                              </button>
                            ) : row.isAcknowledged ? (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Acknowledged
                              </span>
                            ) : null
                          ) : !row.isAcknowledged ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setAcknowledgeId(row.id)
                              }}
                              className="flex items-center gap-1 text-xs text-[#1a6b3a] hover:bg-[#1a6b3a]/5 px-2 py-1.5 rounded-lg"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Acknowledge
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Acknowledged
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          {visibleCount < filteredData.length && (
            <div className="px-4 py-4 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((v) => v + 20)}
                className="text-sm text-[#1a6b3a] hover:underline font-medium"
              >
                Load More ({filteredData.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={!!acknowledgeId}
        onClose={() => setAcknowledgeId(null)}
        onConfirm={() => acknowledgeId && acknowledgeMutation.mutate(acknowledgeId)}
        title="Acknowledge Donation"
        message="Confirm that this donation has been received and acknowledged."
        loading={acknowledgeMutation.isPending}
      />
    </div>
  )
}
