'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Trophy, Medal } from 'lucide-react'
import { getAwardWinnersReport } from '@/lib/api_services/awardApiServices'
import { buildImageUrl } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'
import type { AwardWinnerInfo, CategoryWinner } from '@/types'

/** Same rule as admin/awards/winners: #1 is winner only when they have at least one vote. */
function categoryHasDecidedWinner(cat: CategoryWinner): boolean {
  return cat.nominees.length > 0 && cat.nominees[0].voteCount > 0
}

function topNominee(cat: CategoryWinner): AwardWinnerInfo | null {
  return cat.nominees[0] ?? null
}

export default function AwardeesPage() {
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i)
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const { data, isLoading } = useQuery({
    queryKey: ['public-award-winners', selectedYear],
    queryFn: () => getAwardWinnersReport(selectedYear),
    staleTime: 60_000,
  })

  const categories: CategoryWinner[] = data || []
  const categoriesWithNominees = categories.filter((c) => c.nominees.length > 0)

  const yearSidebar = (
    <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">Year</h2>
      <p className="text-xs text-gray-500 mb-3">Winners are the top vote‑getter in each category (same as admin report).</p>
      <ul className="space-y-1 max-h-64 overflow-y-auto">
        {yearOptions.map((yr) => (
          <li key={yr}>
            <button
              type="button"
              onClick={() => setSelectedYear(yr)}
              className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                selectedYear === yr ? 'bg-[#1a6b3a] text-white' : 'text-gray-700 hover:bg-white'
              }`}
            >
              {yr}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">Recognition</p>
          <h1 className="text-4xl font-bold text-white font-serif">Award Recipients</h1>
          <p className="text-white/80 mt-3">Winners by category — {selectedYear}</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <PageLoader />
          ) : categoriesWithNominees.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No award nominees for {selectedYear} yet.</p>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="order-2 lg:order-1 min-w-0 space-y-6">
                {categoriesWithNominees.map((cat) => (
                  <CategoryWinnerCard key={cat.categoryId} category={cat} />
                ))}
              </div>

              <aside className="order-1 lg:order-2 mb-8 lg:mb-0 lg:sticky lg:top-24 self-start">
                <div className="hidden lg:block">{yearSidebar}</div>
                <details className="lg:hidden rounded-xl border border-gray-200 bg-gray-50/80 open:bg-white">
                  <summary className="px-4 py-3 text-sm font-semibold text-gray-900 cursor-pointer list-none">
                    Select year
                  </summary>
                  <div className="px-4 pb-4 pt-0">{yearSidebar}</div>
                </details>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function CategoryWinnerCard({ category }: { category: CategoryWinner }) {
  const decided = categoryHasDecidedWinner(category)
  const leader = topNominee(category)
  if (!leader) return null

  return (
    <article className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="bg-gradient-to-r from-[#1a6b3a] to-[#0d4a25] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-white font-semibold text-lg font-serif">{category.categoryName}</h2>
          <p className="text-white/70 text-xs mt-1">
            {category.pollActive ? (
              <>Poll active{category.votingEndDate ? ` · ends ${new Date(category.votingEndDate).toLocaleDateString()}` : ''}</>
            ) : (
              'Polling closed'
            )}
          </p>
        </div>
        {decided && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#d4a017] text-[#0d4a25] shrink-0 self-start sm:self-center">
            Winner · {leader.voteCount} votes
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          {leader.recipientPhoto ? (
            <img
              src={leader.recipientPhoto.startsWith('http') ? leader.recipientPhoto : buildImageUrl(leader.recipientPhoto)}
              alt=""
              className={`w-28 h-28 rounded-full object-cover border-4 ${
                decided ? 'border-[#d4a017]' : 'border-gray-200'
              }`}
            />
          ) : (
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center border-4 text-2xl font-bold ${
                decided ? 'bg-[#d4a017]/20 border-[#d4a017] text-[#0d4a25]' : 'bg-gray-100 border-gray-200 text-gray-400'
              }`}
            >
              {leader.recipientName?.[0] ?? '?'}
            </div>
          )}
        </div>
        <div className="flex-1 text-center sm:text-left min-w-0">
          <p className={`text-xl font-bold font-serif flex items-center justify-center sm:justify-start gap-2 flex-wrap ${decided ? 'text-[#0d4a25]' : 'text-gray-800'}`}>
            {leader.recipientName}
            {decided && <Medal className="w-5 h-5 text-[#d4a017] shrink-0" />}
          </p>
          {leader.memberNumber && <p className="text-sm text-gray-500 mt-1">Member {leader.memberNumber}</p>}
          {!decided && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3 inline-block">
              No votes recorded yet — winner will be the nominee with the most votes when polling ends.
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
