'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Heart } from 'lucide-react'
import { getAllDonations, acknowledgeDonation } from '@/lib/api_services/donationApiServices'
import { Badge } from '@/components/shared/Badge'
import { Select } from '@/components/shared/Select'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { SearchBar } from '@/components/shared/SearchBar'
import { formatDate, formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

type Tab = 'monetary' | 'physical'

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

  const filteredData = useMemo(() => {
    let rows = allDonations
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter((d: any) =>
        d.donorName?.toLowerCase().includes(q) ||
        d.donorEmail?.toLowerCase().includes(q) ||
        d.member?.firstName?.toLowerCase().includes(q) ||
        d.member?.lastName?.toLowerCase().includes(q)
      )
    }
    if (statusFilter) rows = rows.filter((d: any) => d.status === statusFilter)
    return rows
  }, [allDonations, search, statusFilter])

  const visibleRows = filteredData.slice(0, visibleCount)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Donations</h2>
        <p className="text-gray-500 text-sm mt-0.5">{allDonations.length} donations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(['monetary', 'physical'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setVisibleCount(20); setSearch(''); setStatusFilter('') }}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); setVisibleCount(20) }}
          placeholder="Search donor..."
          className="flex-1 max-w-sm"
        />
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setVisibleCount(20) }}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'successful', label: 'Successful' },
            { value: 'pending', label: 'Pending' },
            { value: 'failed', label: 'Failed' },
          ]}
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
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Donor</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Type</th>
                  {tab === 'monetary' ? (
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Amount</th>
                  ) : (
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Item Description</th>
                  )}
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Loading...</td></tr>
                ) : visibleRows.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No records found</td></tr>
                ) : (
                  visibleRows.map((row: any) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {row.donorName || `${row.member?.firstName} ${row.member?.lastName}`}
                          </p>
                          {(row.donorEmail || row.donorPhone) && (
                            <p className="text-xs text-gray-400">{row.donorEmail || row.donorPhone}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{row.donationType?.name || '—'}</td>
                      {tab === 'monetary' ? (
                        <td className="px-4 py-3"><span className="font-semibold">{formatCurrency(row.amount)}</span></td>
                      ) : (
                        <td className="px-4 py-3 text-gray-500">{row.items || '—'}</td>
                      )}
                      <td className="px-4 py-3"><Badge variant={row.status}>{row.status}</Badge></td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(row.createdAt)}</td>
                      <td className="px-4 py-3">
                        {tab === 'monetary' ? (
                          !row.isAcknowledged && row.paymentStatus === 'successful' ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); setAcknowledgeId(row.id) }}
                              className="flex items-center gap-1 text-xs text-[#1a6b3a] hover:bg-[#1a6b3a]/5 px-2 py-1.5 rounded-lg"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />Acknowledge
                            </button>
                          ) : row.isAcknowledged ? (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />Acknowledged
                            </span>
                          ) : null
                        ) : (
                          !row.isAcknowledged ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); setAcknowledgeId(row.id) }}
                              className="flex items-center gap-1 text-xs text-[#1a6b3a] hover:bg-[#1a6b3a]/5 px-2 py-1.5 rounded-lg"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />Acknowledge
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />Acknowledged
                            </span>
                          )
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {visibleCount < filteredData.length && (
            <div className="px-4 py-4 border-t border-gray-100 text-center">
              <button
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
