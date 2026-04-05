'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { ArrowLeft, CheckCircle, XCircle, User, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { getElectionApplications, approveApplication, rejectApplication } from '@/lib/api_services/electionApplicationApiServices'
import { getElection } from '@/lib/api_services/electionApiServices'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { buildImageUrl, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ElectionApplicationsPage() {
  const params = useParams()
  const queryClient = useQueryClient()
  const electionId = params.id as string

  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [approveTarget, setApproveTarget] = useState<any>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const { data: election } = useQuery({
    queryKey: ['election', electionId],
    queryFn: () => getElection(electionId),
  })

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['election-applications', electionId],
    queryFn: () => getElectionApplications(electionId),
  })

  const approveMutation = useMutation({
    mutationFn: (applicationId: string) => approveApplication(applicationId),
    onSuccess: () => {
      toast.success('Application approved successfully')
      setApproveTarget(null)
      queryClient.invalidateQueries({ queryKey: ['election-applications', electionId] })
      queryClient.invalidateQueries({ queryKey: ['election-candidates', electionId] })
      queryClient.invalidateQueries({ queryKey: ['ballot', electionId] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ applicationId, reason }: { applicationId: string; reason: string }) =>
      rejectApplication(applicationId, reason),
    onSuccess: () => {
      toast.success('Application rejected')
      queryClient.invalidateQueries({ queryKey: ['election-applications', electionId] })
      queryClient.invalidateQueries({ queryKey: ['election-candidates', electionId] })
      queryClient.invalidateQueries({ queryKey: ['ballot', electionId] })
      setShowRejectModal(false)
      setSelectedApp(null)
      setRejectionReason('')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleApprove = (app: any) => setApproveTarget(app)

  const handleReject = (app: any) => {
    setSelectedApp(app)
    setShowRejectModal(true)
  }

  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    rejectMutation.mutate({ applicationId: selectedApp.id, reason: rejectionReason })
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  }

  const paymentStatusColor: Record<string, string> = {
    pending: 'bg-orange-50 text-orange-700 border-orange-200',
    paid: 'bg-green-50 text-green-700 border-green-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
  }

  const pendingApps = applications.filter((a: any) => a.status === 'pending' && a.paymentStatus === 'paid')
  const approvedApps = applications.filter((a: any) => a.status === 'approved')
  const rejectedApps = applications.filter((a: any) => a.status === 'rejected')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/admin/elections/${electionId}`}>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Election Applications</h2>
          <p className="text-gray-500 text-sm mt-0.5">{election?.title}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{applications.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <p className="text-sm text-yellow-700">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">{pendingApps.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-sm text-green-700">Approved</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{approvedApps.length}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <p className="text-sm text-red-700">Rejected</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{rejectedApps.length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-5 bg-gray-100 rounded w-48 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-32" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <User className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No applications submitted yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Applications */}
          {pendingApps.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Pending Review ({pendingApps.length})</h3>
              <div className="space-y-3">
                {pendingApps.map((app: any) => (
                  <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex gap-4">
                      {app.photoUrl && (
                        <img
                          src={buildImageUrl(app.photoUrl)}
                          alt={`${app.memberId.firstName} ${app.memberId.lastName}`}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {app.memberId.firstName} {app.memberId.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">Member #{app.memberId.memberNumber}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={app.status} className={statusColor[app.status]}>
                              {app.status}
                            </Badge>
                            <Badge variant={app.paymentStatus} className={paymentStatusColor[app.paymentStatus]}>
                              {app.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Position: {app.positionId.title}</p>
                          {app.manifesto && (
                            <p className="text-sm text-gray-600 line-clamp-2">{app.manifesto}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ₦{app.paymentAmount.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(app.createdAt)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(app)}
                            disabled={approveMutation.isPending}
                            iconLeft={<CheckCircle className="w-4 h-4" />}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(app)}
                            iconLeft={<XCircle className="w-4 h-4" />}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved Applications */}
          {approvedApps.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Approved ({approvedApps.length})</h3>
              <div className="space-y-3">
                {approvedApps.map((app: any) => (
                  <div key={app.id} className="bg-green-50 rounded-xl border border-green-200 p-5">
                    <div className="flex gap-4">
                      {app.photoUrl && (
                        <img
                          src={buildImageUrl(app.photoUrl)}
                          alt={`${app.memberId.firstName} ${app.memberId.lastName}`}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {app.memberId.firstName} {app.memberId.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">Position: {app.positionId.title}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Approved {app.approvedAt && formatDate(app.approvedAt)}
                            </p>
                          </div>
                          <Badge variant={app.status} className={statusColor[app.status]}>
                            {app.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejected Applications */}
          {rejectedApps.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Rejected ({rejectedApps.length})</h3>
              <div className="space-y-3">
                {rejectedApps.map((app: any) => (
                  <div key={app.id} className="bg-red-50 rounded-xl border border-red-200 p-5">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {app.memberId.firstName} {app.memberId.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">Position: {app.positionId.title}</p>
                          </div>
                          <Badge variant={app.status} className={statusColor[app.status]}>
                            {app.status}
                          </Badge>
                        </div>
                        {app.rejectionReason && (
                          <div className="bg-white rounded-lg p-3 mt-2">
                            <p className="text-xs font-medium text-gray-700 mb-1">Rejection Reason:</p>
                            <p className="text-sm text-gray-600">{app.rejectionReason}</p>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Rejected {app.rejectedAt && formatDate(app.rejectedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={!!approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={() => approveTarget && approveMutation.mutate(approveTarget.id)}
        title="Approve application"
        message={
          approveTarget
            ? `Approve the candidacy application from ${approveTarget.memberId.firstName} ${approveTarget.memberId.lastName} for the position of ${approveTarget.positionId.title}? They will appear on the member ballot.`
            : ''
        }
        confirmLabel="Approve"
        loading={approveMutation.isPending}
      />

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false)
          setSelectedApp(null)
          setRejectionReason('')
        }}
        title="Reject Application"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You are about to reject the application from{' '}
            <span className="font-semibold">
              {selectedApp?.memberId.firstName} {selectedApp?.memberId.lastName}
            </span>{' '}
            for the position of <span className="font-semibold">{selectedApp?.positionId.title}</span>.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Provide a clear reason for rejection..."
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false)
                setSelectedApp(null)
                setRejectionReason('')
              }}
            >
              Cancel
            </Button>
            <Button onClick={submitRejection} loading={rejectMutation.isPending}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
