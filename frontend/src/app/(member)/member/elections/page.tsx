'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Vote, Calendar, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import { getAllElections } from '@/lib/api_services/electionApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { PageLoader } from '@/components/shared/Spinner'
import { formatDate } from '@/lib/utils'
import { SAMPLE_MEMBER_ELECTIONS } from '@/lib/sampleData'

export default function MemberElectionsPage() {
  const { data: electionsData, isLoading } = useQuery({
    queryKey: ['all-elections'],
    queryFn: () => getAllElections({ limit: 100 }),
  })

  if (isLoading) return <PageLoader />

  const elections = (electionsData?.data && electionsData.data.length > 0) ? electionsData.data : SAMPLE_MEMBER_ELECTIONS as any[]
  const activeElections = elections.filter((e) => e.status === 'active')
  const upcomingElections = elections.filter((e) => e.status === 'upcoming')
  const closedElections = elections.filter((e) => e.status === 'closed' || e.status === 'results_declared')

  return (
    <div className="space-y-6">
      {activeElections.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Active Elections
          </h3>
          <div className="space-y-3">
            {activeElections.map((election) => (
              <div key={election.id} className="bg-white rounded-xl border-2 border-[#1a6b3a] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="active">Active</Badge>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{election.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{election.description}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Ends {formatDate(election.endDate)}
                      </span>
                      <span>{election.positions?.length || 0} position{election.positions?.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <Link href={`/member/elections/${election.id}`}>
                    <Button size="sm" variant="secondary" iconRight={<ChevronRight className="w-4 h-4" />}>
                      Vote Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcomingElections.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Elections</h3>
          <div className="space-y-3">
            {upcomingElections.map((election) => (
              <div key={election.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge variant="upcoming" className="mb-2">Upcoming</Badge>
                    <h3 className="font-bold text-gray-900">{election.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{election.description}</p>
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      <span>Starts {formatDate(election.startDate)}</span>
                      <span>Ends {formatDate(election.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {closedElections.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Past Elections</h3>
          <div className="space-y-3">
            {closedElections.map((election) => (
              <div key={election.id} className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge variant={election.status}>{election.status.replace('_', ' ')}</Badge>
                    <h3 className="font-semibold text-gray-900 mt-2">{election.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">Ended {formatDate(election.endDate)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!elections || elections.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Vote className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No elections at this time</p>
        </div>
      ) : null}
    </div>
  )
}
