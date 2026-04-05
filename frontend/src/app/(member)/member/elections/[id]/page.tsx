'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Vote, FileText, Calendar, CheckCircle, Clock, XCircle, AlertCircle, DollarSign, BarChart2 } from 'lucide-react'
import { getElection } from '@/lib/api_services/electionApiServices'
import { getMyApplicationForElection } from '@/lib/api_services/electionApplicationApiServices'
import { hasVoted, checkMemberEligibility, getElectionResults } from '@/lib/api_services/voteApiServices'
import { VoteResultChart } from '@/components/admin/VoteResultChart'
import type { VoteResult } from '@/types'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { PageLoader } from '@/components/shared/Spinner'
import { formatDate } from '@/lib/utils'

export default function ElectionDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { data: election, isLoading: electionLoading } = useQuery({
    queryKey: ['election', id],
    queryFn: () => getElection(id),
  })

  const { data: myApplication } = useQuery({
    queryKey: ['my-application', id],
    queryFn: () => getMyApplicationForElection(id),
  })

  const { data: alreadyVoted } = useQuery({
    queryKey: ['has-voted', id],
    queryFn: () => hasVoted(id),
  })

  const { data: eligibility } = useQuery({
    queryKey: ['eligibility', id],
    queryFn: () => checkMemberEligibility(id),
  })

  const electionStatus = election?.status as string | undefined
  const showResults =
    !!election && (electionStatus === 'completed' || electionStatus === 'cancelled')

  const { data: voteResults = [], isLoading: resultsLoading } = useQuery({
    queryKey: ['election-results', id],
    queryFn: () => getElectionResults(id),
    enabled: showResults,
  })

  if (electionLoading) return <PageLoader />
  if (!election) return <div className="text-gray-400 text-center py-10">Election not found</div>

  const canApply =
    election.status === 'active' &&
    (!myApplication || myApplication.status === 'rejected')
  const canVote =
    election.status === 'active' && !alreadyVoted && eligibility?.eligible

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/member/elections">
          <button type="button" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{election.title}</h2>
          <Badge variant={election.status}>{election.status}</Badge>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 text-sm text-gray-600">
        {election.description && <p>{election.description}</p>}
        <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          {election.endDate && (
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              Closes {formatDate(election.endDate)}
            </p>
          )}
          {election.votingStartDate && (
            <p className="flex items-center gap-2">
              <Vote className="w-4 h-4 text-gray-400" />
              Voting from {formatDate(election.votingStartDate)}
            </p>
          )}
          {election.votingEndDate && (
            <p className="flex items-center gap-2 text-gray-500">
              Voting until {formatDate(election.votingEndDate)}
            </p>
          )}
        </div>
      </div>

      {myApplication && myApplication.status !== 'rejected' && (
        <div
          className={`rounded-xl border p-5 ${
            myApplication.status === 'approved'
              ? 'bg-green-50 border-green-200'
              : myApplication.paymentStatus === 'pending'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            {myApplication.status === 'approved' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : myApplication.paymentStatus === 'pending' ? (
              <DollarSign className="w-5 h-5 text-amber-600" />
            ) : (
              <Clock className="w-5 h-5 text-yellow-600" />
            )}
            Your candidacy application
          </h3>
          <p className="text-sm text-gray-700">
            Position: <span className="font-medium">{myApplication.positionId?.title}</span>
          </p>
          {myApplication.status === 'pending' && myApplication.paymentStatus === 'pending' && (
            <p className="text-sm text-amber-800 mt-2">
              Complete payment so your application can be reviewed.
            </p>
          )}
          {myApplication.status === 'pending' && myApplication.paymentStatus === 'paid' && (
            <p className="text-sm text-yellow-800 mt-2">Awaiting admin approval.</p>
          )}
          {myApplication.status === 'approved' && (
            <p className="text-sm text-green-800 mt-2">You are on the ballot for this election.</p>
          )}
          {(myApplication.paymentStatus === 'pending' || myApplication.status === 'pending') && (
            <Link href={`/member/elections/${id}/apply`} className="inline-block mt-3">
              <Button size="sm" variant="outline">
                {myApplication.paymentStatus === 'pending' ? 'Complete payment' : 'View application'}
              </Button>
            </Link>
          )}
        </div>
      )}

      {myApplication?.status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Application not approved
          </h3>
          {myApplication.rejectionReason && (
            <p className="text-sm text-red-800 mb-3">{myApplication.rejectionReason}</p>
          )}
          {election.status === 'active' && (
            <Link href={`/member/elections/${id}/apply`}>
              <Button size="sm">Apply for another position</Button>
            </Link>
          )}
        </div>
      )}

      {showResults && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-primary" />
            Election results
          </h3>
          <p className="text-sm text-gray-500">
            Vote tallies by position. Percentages are share of votes cast for each office.
          </p>
          {resultsLoading ? (
            <div className="h-40 rounded-lg bg-gray-50 animate-pulse" />
          ) : (
            <VoteResultChart results={voteResults as VoteResult[]} />
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Voting</h3>
        {alreadyVoted ? (
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p>You have already cast your vote in this election.</p>
          </div>
        ) : !eligibility?.eligible ? (
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800 text-sm mb-1">Not eligible to vote</p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {eligibility?.reasons.map((reason: string, i: number) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : canVote ? (
          <>
            <p className="text-sm text-gray-600">
              Cast your vote for approved candidates. You can skip positions you do not wish to vote for.
            </p>
            <Link href={`/member/elections/${id}/vote`}>
              <Button iconLeft={<Vote className="w-4 h-4" />}>Go to ballot</Button>
            </Link>
          </>
        ) : (
          <p className="text-sm text-gray-500">Voting is not available for this election right now.</p>
        )}
      </div>

      {election.status === 'active' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h3 className="font-semibold text-gray-900">Stand as a candidate</h3>
          <p className="text-sm text-gray-600">
            Pay the form fee (if any), submit your manifesto, and wait for admin approval. You may only hold one
            active application per election; if rejected, you can apply for a different position.
          </p>
          {canApply ? (
            <Link href={`/member/elections/${id}/apply`}>
              <Button variant="outline" iconLeft={<FileText className="w-4 h-4" />}>
                Apply for a position
              </Button>
            </Link>
          ) : (
            <p className="text-sm text-gray-500">You already have an application in progress for this election.</p>
          )}
        </div>
      )}
    </div>
  )
}
