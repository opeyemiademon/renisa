'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Trophy, Medal, Users } from 'lucide-react'
import { getAwardWinnersReport } from '@/lib/api_services/awardApiServices'
import { buildImageUrl } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'
import type { AwardWinnerInfo, CategoryWinner } from '@/types'

export default function AwardeesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['public-award-winners'],
    queryFn: () => getAwardWinnersReport(),
    staleTime: 60_000,
  })

  const categories: CategoryWinner[] = data || []
  const visibleCategories = categories.filter((cat) => cat.isPubliclyVisible)

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">Recognition</p>
          <h1 className="text-4xl font-bold text-white font-serif">Award Winners</h1>
          <p className="text-white/80 mt-3">Celebrating excellence in Nigerian sports</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <PageLoader />
          ) : visibleCategories.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No award winners have been announced yet.</p>
              <p className="text-sm mt-1">Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {visibleCategories.map((cat) => (
                <WinnerCard key={cat.categoryId} category={cat} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function WinnerCard({ category }: { category: CategoryWinner }) {
  const winner: AwardWinnerInfo = category.nominees[0]

  if (!winner) return null

  return (
    <article className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      {/* Category header */}
      <div className="bg-gradient-to-r from-[#1a6b3a] to-[#0d4a25] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-white font-semibold text-lg font-serif">{category.categoryName}</h2>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#d4a017] text-[#0d4a25] shrink-0 self-start sm:self-center">
          <Trophy className="w-3.5 h-3.5" />
          Winner · {winner.voteCount} vote{winner.voteCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Winner details */}
      <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="shrink-0">
          {winner.recipientPhoto ? (
            <img
              src={winner.recipientPhoto.startsWith('http') ? winner.recipientPhoto : buildImageUrl(winner.recipientPhoto)}
              alt={winner.recipientName}
              className="w-28 h-28 rounded-full object-cover border-4 border-[#d4a017] shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full flex items-center justify-center border-4 border-[#d4a017] bg-[#d4a017]/10 text-2xl font-bold text-[#0d4a25]">
              {winner.recipientName?.[0] ?? '?'}
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left min-w-0">
          <p className="text-xl font-bold font-serif text-[#0d4a25] flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            {winner.recipientName}
            <Medal className="w-5 h-5 text-[#d4a017] shrink-0" />
          </p>
          {winner.memberNumber && (
            <p className="text-sm text-gray-500 mt-1">Member {winner.memberNumber}</p>
          )}

          <Link
            href={`/awardees/${category.categoryId}?name=${encodeURIComponent(category.categoryName)}`}
            className="inline-flex items-center gap-1.5 mt-4 text-sm text-[#1a6b3a] font-medium border border-[#1a6b3a]/30 rounded-lg px-3 py-1.5 hover:bg-[#1a6b3a]/5 transition-colors"
          >
            <Users className="w-4 h-4" />
            View all nominees &amp; votes
          </Link>
        </div>
      </div>
    </article>
  )
}
