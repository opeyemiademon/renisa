'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Play, Square, CheckCircle, Plus, Users, BarChart2, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { getElection, updateElectionStatus, addElectoralPosition, getElectionResults } from '@/lib/api_services/electionApiServices'
import { getCandidatesForElection, approveCandidate } from '@/lib/api_services/candidateApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { PageLoader } from '@/components/shared/Spinner'
import { VoteResultChart } from '@/components/admin/VoteResultChart'
import { buildImageUrl, formatDate, formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useParams, useSearchParams, useRouter } from 'next/navigation'

type TabType = 'overview' | 'candidates' | 'results'

export default function ElectionDetailPage() {
  
   const params = useParams()
    const id = params.id as string
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<TabType>('overview')
  const [statusAction, setStatusAction] = useState<string | null>(null)
  const [showAddPosition, setShowAddPosition] = useState(false)
  const [positionForm, setPositionForm] = useState({ title: '', maxCandidates: '5', formFee: '0', description: '' })

  const { data: election, isLoading } = useQuery({
    queryKey: ['election', id],
    queryFn: () => getElection(id),
  })

  const { data: candidatesData } = useQuery({
    queryKey: ['election-candidates', id],
    queryFn: () => getCandidatesForElection(id),
    enabled: tab === 'candidates',
  })

  const { data: results } = useQuery({
    queryKey: ['election-results', id],
    queryFn: () => getElectionResults(id),
    enabled: tab === 'results',
  })

  const statusMutation = useMutation({
    mutationFn: (status: string) => updateElectionStatus(id, status),
    onSuccess: () => {
      toast.success('Election status updated')
      queryClient.invalidateQueries({ queryKey: ['election', id] })
      setStatusAction(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const addPositionMutation = useMutation({
    mutationFn: () => addElectoralPosition(id, {
      title: positionForm.title,
      maxCandidates: parseInt(positionForm.maxCandidates),
      formFee: parseFloat(positionForm.formFee),
      description: positionForm.description || undefined,
    }),
    onSuccess: () => {
      toast.success('Position added')
      queryClient.invalidateQueries({ queryKey: ['election', id] })
      setShowAddPosition(false)
      setPositionForm({ title: '', maxCandidates: '5', formFee: '0', description: '' })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveCandidate(id),
    onSuccess: () => {
      toast.success('Candidate approved')
      queryClient.invalidateQueries({ queryKey: ['election-candidates', id] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  if (isLoading) return <PageLoader />
  if (!election) return <div className="text-center py-10 text-gray-400">Election not found</div>

  const candidates = candidatesData || []

  const statusActions = {
    draft: [{ label: 'Activate', status: 'active', icon: <Play className="w-4 h-4" />, variant: 'primary' as const }],
    active: [
      { label: 'Complete', status: 'completed', icon: <CheckCircle className="w-4 h-4" />, variant: 'primary' as const },
      { label: 'Cancel', status: 'cancelled', icon: <Square className="w-4 h-4" />, variant: 'danger' as const },
    ],
    completed: [],
    cancelled: [],
  }

  const actions = statusActions[election.status as keyof typeof statusActions] || []

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/admin/elections">
            <button className="p-2 rounded-lg hover:bg-gray-100 mt-0.5"><ArrowLeft className="w-5 h-5" /></button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">{election.title}</h2>
              <Badge variant={election.status}>{election.status}</Badge>
            </div>
            <p className="text-gray-500 text-sm mt-1">Year {election.year}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {actions.map((action) => (
            <Button
              key={action.status}
              variant={action.variant}
              size="sm"
              iconLeft={action.icon}
              onClick={() => setStatusAction(action.status)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(['overview', 'candidates', 'results'] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Election Details</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Status', value: election.status },
                { label: 'Year', value: String(election.year) },
                { label: 'Start Date', value: election.startDate ? formatDate(election.startDate) : '—' },
                { label: 'End Date', value: election.endDate ? formatDate(election.endDate) : '—' },
                { label: 'Voting Start', value: election.votingStartDate ? formatDate(election.votingStartDate) : '—' },
                { label: 'Voting End', value: election.votingEndDate ? formatDate(election.votingEndDate) : '—' },
                { label: 'Min. Years Required', value: `${election.eligibilityMinYears} year(s)` },
                { label: 'Requires Dues', value: election.requiresDuesPayment ? 'Yes' : 'No' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">{item.label}</p>
                  <p className="text-gray-900 font-medium mt-0.5 capitalize">{item.value}</p>
                </div>
              ))}
            </div>
            {election.description && (
              <p className="text-gray-600 text-sm mt-4 pt-4 border-t border-gray-100">{election.description}</p>
            )}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <Link href={`/admin/elections/${id}/applications`}>
                <Button variant="outline" size="sm" iconLeft={<ClipboardList className="w-4 h-4" />}>
                  Review candidacy applications
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                Approve or reject applications after members pay and submit. Approved names appear on the member ballot.
              </p>
            </div>
          </div>

          {/* Positions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Electoral Positions ({election.positions?.length || 0})</h3>
              {election.status === 'draft' && (
                <Button variant="outline" size="sm" iconLeft={<Plus className="w-4 h-4" />} onClick={() => setShowAddPosition(true)}>
                  Add Position
                </Button>
              )}
            </div>
            {election.positions?.length > 0 ? (
              <div className="space-y-3">
                {election.positions.map((pos: any) => (
                  <div key={pos.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{pos.title}</p>
                      {pos.description && <p className="text-xs text-gray-400 mt-0.5">{pos.description}</p>}
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-500">Max: {pos.maxCandidates} candidates</p>
                      <p className="text-[#1a6b3a] font-medium">{formatCurrency(pos.formFee)} form fee</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">No positions added yet</p>
            )}
          </div>
        </div>
      )}

      {/* Candidates Tab */}
      {tab === 'candidates' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 pt-5 pb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1a6b3a]" />
            <h3 className="font-semibold text-gray-900">Candidates ({candidates.length})</h3>
          </div>
          {candidates.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No candidates yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {candidates.map((candidate: any) => (
                <div key={candidate.id} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a6b3a] overflow-hidden flex-shrink-0">
                      {candidate.member?.profilePicture ? (
                        <img src={buildImageUrl(candidate.member.profilePicture)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                          {candidate.member?.firstName?.[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {candidate.member?.firstName} {candidate.member?.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{candidate.position?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={candidate.status}>{candidate.status}</Badge>
                    {!candidate.isApproved && (
                      <Button size="sm" onClick={() => approveMutation.mutate(candidate.id)}>Approve</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results Tab */}
      {tab === 'results' && (
        <div className="space-y-5">
          {results && results.length > 0 ? (
            <VoteResultChart results={results} />
          ) : (
            <div className="text-center py-16 text-gray-400">
              <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No results available yet</p>
            </div>
          )}
        </div>
      )}

      {/* Status Confirm Modal */}
      <ConfirmModal
        isOpen={!!statusAction}
        onClose={() => setStatusAction(null)}
        onConfirm={() => statusAction && statusMutation.mutate(statusAction)}
        title={`${statusAction?.charAt(0).toUpperCase()}${statusAction?.slice(1)} Election`}
        message={`Are you sure you want to ${statusAction} this election?`}
        confirmVariant={statusAction === 'cancelled' ? 'danger' : 'primary'}
        loading={statusMutation.isPending}
      />

      {/* Add Position Modal */}
      <Modal isOpen={showAddPosition} onClose={() => setShowAddPosition(false)} title="Add Electoral Position" size="sm">
        <div className="space-y-4">
          <Input label="Position Title" value={positionForm.title} onChange={(e) => setPositionForm((p) => ({ ...p, title: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Max Candidates" type="number" value={positionForm.maxCandidates} onChange={(e) => setPositionForm((p) => ({ ...p, maxCandidates: e.target.value }))} />
            <Input label="Form Fee (₦)" type="number" value={positionForm.formFee} onChange={(e) => setPositionForm((p) => ({ ...p, formFee: e.target.value }))} />
          </div>
          <Input label="Description (optional)" value={positionForm.description} onChange={(e) => setPositionForm((p) => ({ ...p, description: e.target.value }))} />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowAddPosition(false)} className="flex-1">Cancel</Button>
            <Button onClick={() => addPositionMutation.mutate()} loading={addPositionMutation.isPending} className="flex-1" disabled={!positionForm.title}>
              Add Position
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
