'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye, CheckCircle, XCircle, Truck } from 'lucide-react'
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

export default function IDCardRequestsPage() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [photoModal, setPhotoModal] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [deliveryModal, setDeliveryModal] = useState<string | null>(null)
  const [deliveryStatus, setDeliveryStatus] = useState('processing')

  const { data, isLoading } = useQuery({
    queryKey: ['id-card-requests'],
    queryFn: () => getAllIDCardRequests(),
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

  const filteredData = useMemo(() => {
    let rows = allRequests
    if (statusFilter) rows = rows.filter((r: any) => r.adminStatus === statusFilter)
    if (typeFilter) rows = rows.filter((r: any) => r.requestType === typeFilter)
    return rows
  }, [allRequests, statusFilter, typeFilter])

  const visibleRows = filteredData.slice(0, visibleCount)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">ID Card Requests</h2>
        <p className="text-gray-500 text-sm mt-0.5">{allRequests.length} total requests</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setVisibleCount(20) }}
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
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setVisibleCount(20) }}
          options={[
            { value: '', label: 'All Types' },
            { value: 'online', label: 'Online (Digital)' },
            { value: 'physical', label: 'Physical' },
          ]}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Member</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Photo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Payment</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : visibleRows.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No ID card requests found</td></tr>
              ) : (
                visibleRows.map((row: any) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
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
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {row.photo && (
                          <button onClick={() => setPhotoModal(row.photo)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title="View photo">
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
            <Button variant="outline" onClick={() => setRejectModal(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => rejectMutation.mutate({ id: rejectModal!, reason: rejectReason })}
              loading={rejectMutation.isPending}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delivery Status Modal */}
      <Modal isOpen={!!deliveryModal} onClose={() => setDeliveryModal(null)} title="Update Delivery Status" size="sm">
        <div className="space-y-4">
          <select
            value={deliveryStatus}
            onChange={(e) => setDeliveryStatus(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
          >
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDeliveryModal(null)}>Cancel</Button>
            <Button
              onClick={() => deliveryMutation.mutate({ id: deliveryModal!, status: deliveryStatus })}
              loading={deliveryMutation.isPending}
            >
              Update
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
