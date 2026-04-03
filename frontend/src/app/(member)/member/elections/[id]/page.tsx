'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle, Vote } from 'lucide-react'
import Link from 'next/link'
import { getElection, castVote, hasVoted, checkMemberEligibility } from '@/lib/api_services/electionApiServices'
import { getCandidatesForElection } from '@/lib/api_services/candidateApiServices'
import { Button } from '@/components/shared/Button'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { Badge } from '@/components/shared/Badge'
import { PageLoader } from '@/components/shared/Spinner'
import { buildImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ElectionBallotPage({ params }: { params: { id: string } }) {
  const [votes, setVotes] = useState<Record<string, string>>({})
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { data: election, isLoading: electionLoading } = useQuery({
    queryKey: ['election', params.id],
    queryFn: () => getElection(params.id),
  })

  const { data: candidates, isLoading: candLoading } = useQuery({
    queryKey: ['candidates', params.id],
    queryFn: () => getCandidatesForElection(params.id),
  })

  const { data: voted, isLoading: votedLoading } = useQuery({
    queryKey: ['has-voted', params.id],
    queryFn: () => hasVoted(params.id),
  })

  const { data: eligibility } = useQuery({
    queryKey: ['eligibility', params.id],
    queryFn: () => checkMemberEligibility(params.id),
  })

  const voteMutation = useMutation({
    mutationFn: () =>
      castVote({
        electionId: params.id,
        votes: Object.entries(votes).map(([positionId, candidateId]) => ({
          positionId,
          candidateId,
        })),
      }),
    onSuccess: () => {
      toast.success('Your vote has been recorded!')
      setConfirmOpen(false)
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to cast vote')
      setConfirmOpen(false)
    },
  })

  if (electionLoading || candLoading || votedLoading) return <PageLoader />
  if (!election) return <div className="text-gray-400 text-center py-10">Election not found</div>

  const candidatesByPosition = election.positions?.reduce(
    (acc, pos) => {
      acc[pos.id] = (candidates || []).filter((c) => c.positionId === pos.id && c.isApproved)
      return acc
    },
    {} as Record<string, typeof candidates>
  ) || {}

  const allPositionsVoted = election.positions?.every((pos) => votes[pos.id])

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/member/elections">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{election.title}</h2>
          <Badge variant={election.status}>{election.status}</Badge>
        </div>
      </div>

      {voted ? (
        <div className="bg-[#1a6b3a]/5 border border-[#1a6b3a] rounded-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-[#1a6b3a] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Vote Submitted!</h3>
          <p className="text-gray-500">You have already cast your vote in this election.</p>
        </div>
      ) : !eligibility?.eligible ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h3 className="font-semibold text-red-800 mb-2">Not Eligible to Vote</h3>
          <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
            {eligibility?.reasons.map((reason, i) => <li key={i}>{reason}</li>)}
          </ul>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            Please select one candidate per position. Your vote is anonymous and cannot be changed.
          </p>

          {election.positions?.map((position) => {
            const positionCandidates = candidatesByPosition[position.id] || []
            return (
              <div key={position.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{position.title}</h3>
                {position.description && (
                  <p className="text-gray-500 text-sm mb-4">{position.description}</p>
                )}
                {positionCandidates.length === 0 ? (
                  <p className="text-gray-400 text-sm">No approved candidates for this position</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {positionCandidates.map((candidate) => (
                      <label
                        key={candidate.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          votes[position.id] === candidate.id
                            ? 'border-[#1a6b3a] bg-[#1a6b3a]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={position.id}
                          value={candidate.id}
                          checked={votes[position.id] === candidate.id}
                          onChange={() => setVotes((v) => ({ ...v, [position.id]: candidate.id }))}
                          className="accent-[#1a6b3a] mt-1"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#1a6b3a] flex-shrink-0">
                            {candidate.profilePicture || candidate.member?.profilePicture ? (
                              <img
                                src={buildImageUrl(candidate.profilePicture || candidate.member?.profilePicture || '')}
                                alt={candidate.member?.firstName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                  {candidate.member?.firstName?.[0]}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {candidate.member?.firstName} {candidate.member?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{candidate.member?.memberNumber}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={!allPositionsVoted}
            iconLeft={<Vote className="w-4 h-4" />}
            className="w-full"
            size="lg"
          >
            Submit Vote
          </Button>
          {!allPositionsVoted && (
            <p className="text-yellow-600 text-xs text-center">Please vote for all positions before submitting.</p>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => voteMutation.mutate()}
        title="Confirm Your Vote"
        message="Are you sure you want to submit your vote? This action cannot be undone."
        confirmLabel="Submit Vote"
        loading={voteMutation.isPending}
      />
    </div>
  )
}
