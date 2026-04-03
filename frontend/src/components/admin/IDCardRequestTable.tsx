'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye, CheckCircle, XCircle, Truck } from 'lucide-react'
import { approveIDCardRequest, rejectIDCardRequest, updateIDCardDeliveryStatus } from '@/lib/api_services/idCardApiServices'
import { IDCardRequest } from '@/types'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Modal } from '@/components/shared/Modal'
import { Input } from '@/components/shared/Input'
import { DataTable } from '@/components/shared/DataTable'
import { buildImageUrl, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface IDCardRequestTableProps {
  requests: IDCardRequest[]
  loading?: boolean
  onRefresh?: () => void
}

export function IDCardRequestTable({ requests, loading }: IDCardRequestTableProps) {
  const queryClient = useQueryClient()
  const [photoModal, setPhotoModal] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [deliveryModal, setDeliveryModal] = useState<string | null>(null)
  const [deliveryStatus, setDeliveryStatus] = useState('processing')

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['id-card-requests'] })

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveIDCardRequest(id),
    onSuccess: () => { toast.success('ID card approved'); invalidate() },
    onError: (err: Error) => toast.error(err.message),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectIDCardRequest(id, reason),
    onSuccess: () => { toast.success('ID card request rejected'); setRejectModal(null); invalidate() },
    onError: (err: Error) => toast.error(err.message),
  })

  const deliveryMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateIDCardDeliveryStatus(id, status),
    onSuccess: () => { toast.success('Delivery status updated'); setDeliveryModal(null); invalidate() },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <>
      <DataTable
        loading={loading}
        columns={[
          {
            key: 'member',
            header: 'Member',
            render: (row) => (
              <div>
                <p className="font-medium text-gray-900">
                  {row.member?.firstName} {row.member?.lastName}
                </p>
                <p className="text-xs text-gray-400">{row.member?.memberNumber}</p>
              </div>
            ),
          },
          {
            key: 'type',
            header: 'Type',
            render: (row) => <Badge variant={row.requestType}>{row.requestType}</Badge>,
          },
          {
            key: 'photo',
            header: 'Photo',
            render: (row) => (
              <button onClick={() => setPhotoModal(row.photo)} className="hover:opacity-80">
                <img
                  src={buildImageUrl(row.photo)}
                  alt="ID photo"
                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                />
              </button>
            ),
          },
          {
            key: 'payment',
            header: 'Payment',
            render: (row) => <Badge variant={row.paymentStatus}>{row.paymentStatus}</Badge>,
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <Badge variant={row.adminStatus}>{row.adminStatus}</Badge>,
          },
          {
            key: 'date',
            header: 'Date',
            render: (row) => <span className="text-gray-500 text-xs">{formatDate(row.createdAt)}</span>,
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPhotoModal(row.photo)} title="View photo" className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                  <Eye className="w-4 h-4" />
                </button>
                {row.adminStatus === 'pending' && row.paymentStatus === 'paid' && (
                  <>
                    <button
                      onClick={() => approveMutation.mutate(row.id)}
                      title="Approve"
                      className="p-1.5 rounded hover:bg-green-50 text-green-600"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setRejectModal(row.id)}
                      title="Reject"
                      className="p-1.5 rounded hover:bg-red-50 text-red-600"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
                {row.requestType === 'physical' && row.adminStatus === 'approved' && (
                  <button
                    onClick={() => { setDeliveryModal(row.id); setDeliveryStatus(row.deliveryStatus || 'processing') }}
                    title="Update delivery"
                    className="p-1.5 rounded hover:bg-blue-50 text-blue-600"
                  >
                    <Truck className="w-4 h-4" />
                  </button>
                )}
              </div>
            ),
          },
        ]}
        data={requests}
        keyExtractor={(row) => row.id}
        emptyMessage="No ID card requests"
      />

      {/* Photo Modal */}
      <Modal isOpen={!!photoModal} onClose={() => setPhotoModal(null)} title="ID Card Photo" size="sm">
        {photoModal && (
          <img src={buildImageUrl(photoModal)} alt="ID photo" className="w-full rounded-lg object-contain max-h-80" />
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectModal}
        onClose={() => setRejectModal(null)}
        title="Reject ID Card Request"
        size="sm"
      >
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
      <Modal
        isOpen={!!deliveryModal}
        onClose={() => setDeliveryModal(null)}
        title="Update Delivery Status"
        size="sm"
      >
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
    </>
  )
}
