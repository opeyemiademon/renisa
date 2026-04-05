'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Vote, Calendar, FileText, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'
import { getAllElections } from '@/lib/api_services/electionApiServices'
import { getMyApplications } from '@/lib/api_services/electionApplicationApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

function applicationSummary(app: any) {
  if (app.status === 'approved') {
    return { label: 'Approved — on ballot', color: 'bg-green-100 text-green-700', icon: CheckCircle }
  }
  if (app.status === 'rejected') {
    return { label: 'Not approved', color: 'bg-red-100 text-red-700', icon: XCircle }
  }
  if (app.paymentStatus === 'pending') {
    return { label: 'Awaiting payment', color: 'bg-amber-100 text-amber-800', icon: DollarSign }
  }
  return { label: 'Under admin review', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
}

function MyApplicationCard({ app }: { app: any }) {
  const cfg = applicationSummary(app)
  const Icon = cfg.icon
  const election = app.electionId
  const position = app.positionId

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{election?.title}</p>
          <p className="text-sm text-gray-500 mt-0.5">
            Position: <span className="font-medium text-gray-700">{position?.title}</span>
          </p>
        </div>
        <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 shrink-0', cfg.color)}>
          <Icon className="w-3.5 h-3.5" />
          {cfg.label}
        </span>
      </div>

      {app.status === 'rejected' && app.rejectionReason && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2.5 text-xs text-red-700">
          <span className="font-semibold">Reason: </span>
          {app.rejectionReason}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {app.status === 'pending' && app.paymentStatus === 'pending' && election?.status === 'active' && (
          <Link href={`/member/elections/${election.id}/apply`}>
            <Button size="sm">Complete payment</Button>
          </Link>
        )}
        {app.status === 'pending' && app.paymentStatus === 'paid' && election?.status === 'active' && (
          <Link href={`/member/elections/${election.id}`}>
            <Button size="sm" variant="outline">
              View status
            </Button>
          </Link>
        )}
        {app.status === 'rejected' && election?.status === 'active' && (
          <Link href={`/member/elections/${election.id}/apply`}>
            <Button size="sm" variant="secondary">
              Apply for another position
            </Button>
          </Link>
        )}
        {election?.id && (
          <Link href={`/member/elections/${election.id}`}>
            <Button size="sm" variant="outline">
              Election details
            </Button>
          </Link>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-2">Submitted {formatDate(app.createdAt)}</p>
    </div>
  )
}

export default function MemberElectionsPage() {
  const { data: elections, isLoading } = useQuery({
    queryKey: ['all-elections'],
    queryFn: getAllElections,
  })

  const { data: applications } = useQuery({
    queryKey: ['my-election-applications'],
    queryFn: getMyApplications,
  })

  const all = (elections || []) as any[]
  const myApps = (applications || []) as any[]

  const activeElections = all.filter((e) => e.status === 'active')
  const otherElections = all.filter((e) => e.status !== 'active')

  const myActiveAppByElection = myApps.reduce((acc: Record<string, any>, app: any) => {
    const eId = app.electionId?.id
    if (eId && app.status !== 'rejected') {
      acc[eId] = app
    }
    return acc
  }, {})

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Elections</h2>
        <p className="text-sm text-gray-500 mt-0.5">Vote in active elections or apply as a candidate</p>
      </div>

      {myApps.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            My candidacy applications
          </h3>
          <div className="space-y-3">
            {myApps.map((app: any) => (
              <MyApplicationCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      )}

      {activeElections.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Active elections
          </h3>
          <div className="space-y-4">
            {activeElections.map((election: any) => {
              const myApp = myActiveAppByElection[election.id]
              const hasApproved = myApps.some((a: any) => a.electionId?.id === election.id && a.status === 'approved')
              const hasAnyActive = !!myApp
              const canApply = !hasAnyActive

              return (
                <div key={election.id} className="bg-white rounded-xl border-2 border-primary p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="active">Active</Badge>
                        <span className="text-xs text-gray-400">{election.year}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">{election.title}</h3>
                      {election.description && (
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{election.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        {election.endDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Closes {formatDate(election.endDate)}
                          </span>
                        )}
                        <span>
                          {election.positions?.length || 0} position{election.positions?.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
                    <Link href={`/member/elections/${election.id}`}>
                      <Button size="sm" iconRight={<Vote className="w-4 h-4" />}>
                        Open election
                      </Button>
                    </Link>
                    {canApply && (
                      <Link href={`/member/elections/${election.id}/apply`}>
                        <Button size="sm" variant="outline" iconRight={<FileText className="w-4 h-4" />}>
                          Apply as candidate
                        </Button>
                      </Link>
                    )}
                    {hasApproved && (
                      <span className="flex items-center gap-1.5 text-sm text-green-700 font-medium bg-green-50 px-3 py-1.5 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                        You are on the ballot
                      </span>
                    )}
                    {myApp && !hasApproved && (
                      <span className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Clock className="w-4 h-4" />
                        {applicationSummary(myApp).label}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {otherElections.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-3">Other elections</h3>
          <div className="space-y-3">
            {otherElections.map((election: any) => (
              <div key={election.id} className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                <Badge variant={election.status} className="mb-2">
                  {election.status}
                </Badge>
                <h3 className="font-semibold text-gray-900">{election.title}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {election.endDate ? `Ended ${formatDate(election.endDate)}` : `Year ${election.year}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {all.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Vote className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No elections at this time</p>
        </div>
      )}
    </div>
  )
}
