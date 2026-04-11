'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Trophy, Medal, Users } from 'lucide-react'
import { getAwardWinnersReport } from '@/lib/api_services/awardApiServices'
import { buildImageUrl } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'
import type { AwardWinnerInfo, CategoryWinner } from '@/types'

function NomineesContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const categoryId = params.categoryId as string
  const categoryName = searchParams.get('name') || 'Award Category'

  const { data, isLoading } = useQuery({
    queryKey: ['public-award-winners'],
    queryFn: () => getAwardWinnersReport(),
    staleTime: 60_000,
  })

  const categories: CategoryWinner[] = data || []
  const category = categories.find((c) => c.categoryId === categoryId)
  const nominees: AwardWinnerInfo[] = category?.nominees ?? []

  // Sort by votes descending (API should already return sorted, but ensure it)
  const sorted = [...nominees].sort((a, b) => b.voteCount - a.voteCount)
  const totalVotes = sorted.reduce((sum, n) => sum + n.voteCount, 0)

  const winner = sorted[0]
  const pollClosed = category ? !category.pollActive : false
  const hasWinner = pollClosed && winner && winner.voteCount > 0

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/awardees"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Award Winners
          </Link>
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-2">
            Nominees
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif">
            {categoryName}
          </h1>
          {category && totalVotes > 0 && (
            <p className="text-white/70 text-sm mt-2">
              {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <PageLoader />
          ) : sorted.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No nominees found for this category.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sorted.map((nominee, index) => {
                const isWinner = hasWinner && index === 0
                const pct = totalVotes > 0 ? Math.round((nominee.voteCount / totalVotes) * 100) : 0

                return (
                  <div
                    key={nominee.awardId}
                    className={`rounded-2xl border p-5 flex flex-col sm:flex-row items-center gap-5 transition-shadow ${
                      isWinner
                        ? 'border-[#d4a017] bg-[#d4a017]/5 shadow-md'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    {/* Rank badge */}
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isWinner
                        ? 'bg-[#d4a017] text-[#0d4a25]'
                        : index === 1
                          ? 'bg-gray-300 text-gray-700'
                          : index === 2
                            ? 'bg-amber-600/70 text-white'
                            : 'bg-gray-100 text-gray-500'
                    }`}>
                      {isWinner ? <Trophy className="w-5 h-5" /> : `#${index + 1}`}
                    </div>

                    {/* Photo */}
                    <div className="shrink-0">
                      {nominee.recipientPhoto ? (
                        <img
                          src={nominee.recipientPhoto.startsWith('http') ? nominee.recipientPhoto : buildImageUrl(nominee.recipientPhoto)}
                          alt={nominee.recipientName}
                          className={`w-16 h-16 rounded-full object-cover border-2 ${
                            isWinner ? 'border-[#d4a017]' : 'border-gray-200'
                          }`}
                        />
                      ) : (
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2 ${
                          isWinner
                            ? 'bg-[#d4a017]/20 border-[#d4a017] text-[#0d4a25]'
                            : 'bg-gray-100 border-gray-200 text-gray-500'
                        }`}>
                          {nominee.recipientName?.[0] ?? '?'}
                        </div>
                      )}
                    </div>

                    {/* Info + progress bar */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className={`font-bold font-serif text-base ${isWinner ? 'text-[#0d4a25]' : 'text-gray-900'}`}>
                          {nominee.recipientName}
                        </p>
                        {isWinner && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#d4a017] text-[#0d4a25] px-2 py-0.5 rounded-full">
                            <Medal className="w-3 h-3" /> Winner
                          </span>
                        )}
                      </div>
                      {nominee.memberNumber && (
                        <p className="text-xs text-gray-400 mb-2">Member {nominee.memberNumber}</p>
                      )}
                      {/* Vote bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              isWinner ? 'bg-[#d4a017]' : 'bg-[#1a6b3a]'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap w-20 text-right">
                          {nominee.voteCount} vote{nominee.voteCount !== 1 ? 's' : ''} ({pct}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function NomineesPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <NomineesContent />
    </Suspense>
  )
}
