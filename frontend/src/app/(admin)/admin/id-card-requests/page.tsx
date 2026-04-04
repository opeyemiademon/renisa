'use client'

import { useState, useMemo, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Eye, CheckCircle, XCircle, Truck, Search, ChevronDown, ChevronUp,
  RotateCcw, X,
} from 'lucide-react'
import {
  getAllIDCardRequests,
  approveIDCardRequest,
  rejectIDCardRequest,
  updateIDCardDeliveryStatus,
} from '@/lib/api_services/idCardApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Select } from '@/components/shared/Select'
import { Modal } from '@/components/shared/Modal'
import { Input } from '@/components/shared/Input'
import { buildImageUrl, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface FilterState {
  adminStatus: string
  paymentStatus: string
  requestType: string
  memberName: string
  dateFrom: string
  dateTo: string
}

const emptyFilter: FilterState = {
  adminStatus: '', paymentStatus: '', requestType: '', memberName: '', dateFrom: '', dateTo: '',
}

export default function IDCardRequestsPage() {
  const queryClient = useQueryClient()

  // filter state
  const [filter, setFilter] = useState<FilterState>(emptyFilter)
  const [appliedFilter, setAppliedFilter] = useState<FilterState>(emptyFilter)
  const [filtersOpen, setFiltersOpen] = useState(true)

  // live search
  const [liveSearch, setLiveSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)

  // modals
  const [photoModal, setPhotoModal] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [deliveryModal, setDeliveryModal] = useState<string | null>(null)
  const [deliveryStatus, setDeliveryStatus] = useState('processing')

  const setField = (f: keyof FilterState, v: string) => setFilter((p) => ({ ...p, [f]: v }))

  const hasActiveFilters = Object.values(appliedFilter).some(Boolean)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['id-card-requests', appliedFilter],
    queryFn: () => getAllIDCardRequests({
      adminStatus: appliedFilter.adminStatus || undefined,
      paymentStatus: appliedFilter.paymentStatus || undefined,
    }),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['id-card-requests'] })

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveIDCardRequest(id),
    onSuccess: () => { toast.success('ID card approved'); invalidate() },
    onError: (err: Error) => toast.error(err.message),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectIDCardRequest(id, reason),
    onSuccess: () => { toast.success('Request rejected'); setRejectModal(null); invalidate() },
    onError: (err: Error) => toast.error(err.message),
  })

  const deliveryMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateIDCardDeliveryStatus(id, status),
    onSuccess: () => { toast.success('Delivery status updated'); setDeliveryModal(null); invalidate() },
    onError: (err: Error) => toast.error(err.message),
  })

  const allRequests = (data || []) as any[]

  // client-side filter for type, memberName, date range + live search
  const filtered = useMemo(() => {
    let rows = allRequests

    if (appliedFilter.requestType)
      rows = rows.filter((r: any) => r.requestType === appliedFilter.requestType)

    if (appliedFilter.memberName) {
      const q = appliedFilter.memberName.toLowerCase()
      rows = rows.filter((r: any) =>
        `${r.member?.firstName} ${r.member?.lastName}`.toLowerCase().includes(q) ||
        r.member?.memberNumber?.toLowerCase().includes(q)
      )
    }

    if (appliedFilter.dateFrom) {
      const from = new Date(appliedFilter.dateFrom)
      rows = rows.filter((r: any) => new Date(r.createdAt) >= from)
    }

    if (appliedFilter.dateTo) {
      const to = new Date(appliedFilter.dateTo)
      to.setHours(23, 59, 59, 999)
      rows = rows.filter((r: any) => new Date(r.createdAt) <= to)
    }

    if (liveSearch.trim()) {
      const q = liveSearch.toLowerCase()
      rows = rows.filter((r: any) =>
        `${r.member?.firstName} ${r.member?.lastName}`.toLowerCase().includes(q) ||
        r.member?.memberNumber?.toLowerCase().includes(q) ||
        r.requestType?.toLowerCase().includes(q) ||
        r.adminStatus?.toLowerCase().includes(q)
      )
    }

    return rows
  }, [allRequests, appliedFilter, liveSearch])

  const visibleRows = filtered.slice(0, visibleCount)

  const handleSearch = () => { setAppliedFilter({ ...filter }); setVisibleCount(20) }
  const handleReset = () => { setFilter(emptyFilter); setAppliedFilter(emptyFilter); setLiveSearch(''); setVisibleCount(20) }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">ID Card Requests</h2>
        {hasActiveFilters && (
          <p className="text-xs text-[#1a6b3a] mt-0.5">{allRequests.length} result(s) matching filters</p>
        )}
      </div>

      {/* Filter Panel — same style as members page */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#1a6b3a]" />
            <span>Search &amp; Filter</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-full bg-[#1a6b3a] text-white text-xs">
                {Object.values(appliedFilter).filter(Boolean).length} active
              </span>
            )}
          </div>
          {filtersOpen
            ? <ChevronUp className="w-4 h-4 text-gray-400" />
            : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {filtersOpen && (
          <div className="border-t border-gray-100 p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Member Name / Number"
                placeholder="Search by name or member no..."
                value={filter.memberName}
                onChange={(e) => setField('memberName', e.target.value)}
              />
              <Select
                label="Admin Status"
                value={filter.adminStatus}
                onChange={(e) => setField('adminStatus', e.target.value)}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'rejected', label: 'Rejected' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'dispatched', label: 'Dispatched' },
                  { value: 'delivered', label: 'Delivered' },
                ]}
              />
              <Select
                label="Payment Status"
                value={filter.paymentStatus}
                onChange={(e) => setField('paymentStatus', e.target.value)}
                options={[
                  { value: '', label: 'All Payment Statuses' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'failed', label: 'Failed' },
                ]}
              />
              <Select
                label="Request Type"
                value={filter.requestType}
                onChange={(e) => setField('requestType', e.target.value)}
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'online', label: 'Online (Digital)' },
                  { value: 'physical', label: 'Physical' },
                ]}
              />
              <Input
                label="Date From"
                type="date"
                value={filter.dateFrom}
                onChange={(e) => setField('dateFrom', e.target.value)}
              />
              <Input
                label="Date To"
                type="date"
                value={filter.dateTo}
                onChange={(e) => setField('dateTo', e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button onClick={handleSearch} loading={isFetching} iconLeft={<Search className="w-4 h-4" />}>
                Search
              </Button>
              <Button variant="outline" onClick={handleReset} iconLeft={<RotateCcw className="w-4 h-4" />}>
                Reset
              </Button>
              {hasActiveFilters && (
                <span className="text-sm text-gray-500 ml-1">{allRequests.length} request(s) found</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toolbar: live search left */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Quick search name, member no, status..."
            value={liveSearch}
            onChange={(e) => { setLiveSearch(e.target.value); setVisibleCount(20) }}
            className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a6b3a]/30 bg-white"
          />
          {liveSearch && (
            <button onClick={() => setLiveSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {liveSearch && (
          <span className="text-xs text-gray-500 flex-shrink-0">{filtered.length} result(s)</span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-3 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-10">SN</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Member</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Photo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Payment</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
                <th className="w-10 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-[#1a6b3a] border-t-transparent animate-spin" />
                      Searching...
                    </div>
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    {liveSearch ? `No results for "${liveSearch}".` : hasActiveFilters ? 'No requests match your filters.' : 'No ID card requests found.'}
                  </td>
                </tr>
              ) : (
                visibleRows.map((row: any, idx: number) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3">
                      <span className="text-xs text-gray-400 font-mono">{idx + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{row.member?.firstName} {row.member?.lastName}</p>
                      <p className="text-xs text-gray-400">{row.member?.memberNumber}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={row.requestType}>{row.requestType}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {row.photo && (
                        <button onClick={() => setPhotoModal(row.photo)} className="hover:opacity-80">
                          <img
                            src={buildImageUrl(row.photo)}
                            alt="ID photo"
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={row.paymentStatus}>{row.paymentStatus}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={row.adminStatus}>{row.adminStatus}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(row.createdAt)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        {row.photo && (
                          <button
                            onClick={() => setPhotoModal(row.photo)}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                            title="View photo"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {row.adminStatus === 'pending' && row.paymentStatus === 'paid' && (
                          <>
                            <button
                              onClick={() => approveMutation.mutate(row.id)}
                              className="p-1.5 rounded hover:bg-green-50 text-green-600"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setRejectModal(row.id); setRejectReason('') }}
                              className="p-1.5 rounded hover:bg-red-50 text-red-600"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {row.requestType === 'physical' && row.adminStatus === 'approved' && (
                          <button
                            onClick={() => { setDeliveryModal(row.id); setDeliveryStatus(row.deliveryStatus || 'processing') }}
                            className="p-1.5 rounded hover:bg-blue-50 text-blue-600"
                            title="Update delivery"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {visibleCount < filtered.length && (
          <div className="px-4 py-4 border-t border-gray-100 text-center">
            <button
              onClick={() => setVisibleCount((v) => v + 20)}
              className="text-sm text-[#1a6b3a] hover:underline font-medium"
            >
              Load More ({filtered.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      <Modal isOpen={!!photoModal} onClose={() => setPhotoModal(null)} title="ID Card Photo" size="sm">
        {photoModal && (
          <img src={buildImageUrl(photoModal)} alt="ID photo" className="w-full rounded-lg object-contain max-h-80" />
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={!!rejectModal} onClose={() => setRejectModal(null)} title="Reject ID Card Request" size="sm">
        <div className="space-y-4">
          <Input
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Explain why this request is being rejected"
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setRejectModal(null)} className="flex-1">Cancel</Button>
            <Button
              variant="danger"
              onClick={() => rejectMutation.mutate({ id: rejectModal!, reason: rejectReason })}
              loading={rejectMutation.isPending}
              className="flex-1"
              disabled={!rejectReason.trim()}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delivery Status Modal */}
      <Modal isOpen={!!deliveryModal} onClose={() => setDeliveryModal(null)} title="Update Delivery Status" size="sm">
        <div className="space-y-4">
          <Select
            label="Delivery Status"
            value={deliveryStatus}
            onChange={(e) => setDeliveryStatus(e.target.value)}
            options={[
              { value: 'processing', label: 'Processing' },
              { value: 'shipped', label: 'Shipped' },
              { value: 'delivered', label: 'Delivered' },
            ]}
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDeliveryModal(null)} className="flex-1">Cancel</Button>
            <Button
              onClick={() => deliveryMutation.mutate({ id: deliveryModal!, status: deliveryStatus })}
              loading={deliveryMutation.isPending}
              className="flex-1"
            >
              Update
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
