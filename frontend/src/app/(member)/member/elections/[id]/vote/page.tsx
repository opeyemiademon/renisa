'use client'

import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Vote as VoteIcon, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getElection } from '@/lib/api_services/electionApiServices'
import { getBallotCandidates } from '@/lib/api_services/candidateApiServices'
import { castVote, hasVoted, checkMemberEligibility } from '@/lib/api_services/voteApiServices'
import { Button } from '@/components/shared/Button'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { buildImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function VoteForElectionPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const electionId = params.id as string

  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({})
  const [confirmVoteOpen, setConfirmVoteOpen] = useState(false)

  const { data: election, isLoading: electionLoading } = useQuery({
    queryKey: ['election', electionId],
    queryFn: () => getElection(electionId),
  })

  const { data: ballot = [], isLoading: ballotLoading } = useQuery({
    queryKey: ['ballot', electionId],
    queryFn: () => getBallotCandidates(electionId),
    enabled: !!election,
  })

  const candidatesByPosition = useMemo(() => {
    const m: Record<string, any[]> = {}
    for (const c of ballot) {
      const pid = c.position?.id || c.positionId?.id
      if (!pid) continue
      if (!m[pid]) m[pid] = []
      m[pid].push(c)
    }
    return m
  }, [ballot])

  const { data: alreadyVoted } = useQuery({
    queryKey: ['has-voted', electionId],
    queryFn: () => hasVoted(electionId),
  })

  const { data: eligibility } = useQuery({
    queryKey: ['eligibility', electionId],
    queryFn: () => checkMemberEligibility(electionId),
  })

  const voteMutation = useMutation({
    mutationFn: () => {
      const votes = Object.entries(selectedVotes).map(([positionId, candidateId]) => ({
        positionId,
        candidateId,
      }))
      return castVote({ electionId, votes })
    },
    onSuccess: () => {
      setConfirmVoteOpen(false)
      toast.success('Your vote has been cast successfully!')
      queryClient.invalidateQueries({ queryKey: ['has-voted', electionId] })
      router.push(`/member/elections/${electionId}`)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleVote = (positionId: string, candidateId: string) => {
    setSelectedVotes((prev) => ({ ...prev, [positionId]: candidateId }))
  }

  const handleSubmit = () => {
    if (Object.keys(selectedVotes).length === 0) {
      toast.error('Please select at least one candidate')
      return
    }
    setConfirmVoteOpen(true)
  }

  const confirmSubmitVote = () => {
    voteMutation.mutate()
  }

  if (electionLoading || ballotLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-48 mb-4" />
          <div className="h-4 bg-gray-100 rounded w-full mb-2" />
        </div>
      </div>
    )
  }

  if (!election) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-gray-500">Election not found</p>
      </div>
    )
  }

  if (alreadyVoted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Vote Already Cast</h3>
          <p className="text-gray-600">You have already voted in this election. Thank you for participating!</p>
          <Link href="/member/elections">
            <Button className="mt-4" variant="outline">
              Back to Elections
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (eligibility && !eligibility.eligible) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Not Eligible to Vote</h3>
              <p className="text-gray-600 mb-3">You are not eligible to vote in this election for the following reasons:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {eligibility.reasons.map((reason: string, index: number) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
              <Link href="/member/elections">
                <Button className="mt-4" variant="outline">
                  Back to Elections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/member/elections/${electionId}`}>
          <button type="button" className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Cast Your Vote</h2>
          <p className="text-gray-500 text-sm mt-0.5">{election.title}</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Voting Instructions</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Only admin-approved candidates appear on the ballot</li>
          <li>• Select at most one candidate per position</li>
          <li>• You may skip positions you do not wish to vote for</li>
          <li>• Once submitted, your vote cannot be changed</li>
        </ul>
      </div>

      <div className="space-y-6">
        {election.positions.map((position: any) => {
          const candidates = candidatesByPosition[position.id] || []
          return (
            <div key={position.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-1">{position.title}</h3>
              {position.description && (
                <p className="text-sm text-gray-500 mb-4">{position.description}</p>
              )}

              {candidates.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No approved candidates for this position yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {candidates.map((candidate: any) => {
                    const member = candidate.member
                    const isSelected = selectedVotes[position.id] === candidate.id
                    const photo =
                      candidate.profilePicture || member?.profilePicture
                    return (
                      <label
                        key={candidate.id}
                        className={`flex gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`position-${position.id}`}
                          value={candidate.id}
                          checked={isSelected}
                          onChange={() => handleVote(position.id, candidate.id)}
                          className="w-5 h-5 accent-primary mt-1 flex-shrink-0"
                        />
                        <div className="flex gap-4 flex-1">
                          {photo && (
                            <img
                              src={buildImageUrl(photo)}
                              alt={`${member?.firstName} ${member?.lastName}`}
                              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {member?.firstName} {member?.lastName}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2">Member #{member?.memberNumber}</p>
                            {candidate.manifesto && (
                              <p className="text-sm text-gray-600 line-clamp-3">{candidate.manifesto}</p>
                            )}
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {Object.keys(selectedVotes).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Your Selections</h3>
          <div className="space-y-2 mb-4">
            {Object.entries(selectedVotes).map(([positionId, candidateId]) => {
              const position = election.positions.find((p: any) => p.id === positionId)
              const candidates = candidatesByPosition[positionId] || []
              const candidate = candidates.find((c: any) => c.id === candidateId)
              const m = candidate?.member
              return (
                <div key={positionId} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{position?.title}:</span>
                  <span className="font-medium text-gray-900">
                    {m?.firstName} {m?.lastName}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex gap-3">
            <Link href={`/member/elections/${electionId}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              onClick={handleSubmit}
              loading={voteMutation.isPending}
              iconLeft={<VoteIcon className="w-4 h-4" />}
            >
              Submit Vote
            </Button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmVoteOpen}
        onClose={() => setConfirmVoteOpen(false)}
        onConfirm={confirmSubmitVote}
        title="Submit your vote?"
        message="Are you sure you want to submit your vote? This action cannot be undone."
        confirmLabel="Submit vote"
        loading={voteMutation.isPending}
      />
    </div>
  )
}
