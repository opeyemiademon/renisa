'use client'

import { useQuery } from '@tanstack/react-query'
import { Trophy } from 'lucide-react'
import { getAllAwards } from '@/lib/api_services/awardApiServices'
import { AwardVotingCard } from '@/components/member/AwardVotingCard'
import { PageLoader } from '@/components/shared/Spinner'
import { SAMPLE_MEMBER_AWARDS } from '@/lib/sampleData'

export default function MemberAwardsPage() {
  const { data: awardsData, isLoading } = useQuery({
    queryKey: ['awards-voting'],
    queryFn: () => getAllAwards({ votingEnabled: true, limit: 50 }),
  })

  const awards = (awardsData?.data && awardsData.data.length > 0) ? awardsData.data : SAMPLE_MEMBER_AWARDS as any[]

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Awards & Voting</h2>
        <p className="text-gray-500 text-sm mt-1">Vote for your favorite awardees</p>
      </div>

      {awards.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No active award voting at this time</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {awards.map((award) => (
            <AwardVotingCard key={award.id} award={award} />
          ))}
        </div>
      )}
    </div>
  )
}
