'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trophy, ThumbsUp, Clock, CheckCircle, Users } from 'lucide-react'
import { getAllAwards, getAwardCategories } from '@/lib/api_services/awardApiServices'
import { castAwardVote, getMyAwardVotes } from '@/lib/api_services/awardVoteApiServices'
import { PageLoader } from '@/components/shared/Spinner'
import { Button } from '@/components/shared/Button'
import { buildImageUrl, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useState, useEffect, useMemo } from 'react'
import type { AwardCategory } from '@/types'

function awardCategoryId(award: { categoryId?: { id?: string } | string }): string | null {
  const c = award.categoryId
  if (c == null) return null
  return typeof c === 'object' && c.id != null ? String(c.id) : String(c)
}

/** Epoch ms or null if value is missing / not parseable (avoids NaN in countdown UI). */
function parseTimeMs(value?: string | null): number | null {
  if (value == null || String(value).trim() === '') return null
  const t = new Date(value).getTime()
  return Number.isFinite(t) ? t : null
}

function useCountdown(endDate?: string | null) {
  const [timeLeft, setTimeLeft] = useState('')
  useEffect(() => {
    const endMs = parseTimeMs(endDate)
    if (endMs == null) {
      setTimeLeft('')
      return
    }
    const tick = () => {
      const diff = endMs - Date.now()
      if (diff <= 0) {
        setTimeLeft('Ended')
        return
      }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`)
    }
    tick()
    const interval = setInterval(tick, 60000)
    return () => clearInterval(interval)
  }, [endDate])
  return timeLeft
}

function CategoryPoll({ category, awards, myVotedIds, onVote, voting }: {
  category: any
  awards: any[]
  myVotedIds: Set<string>
  onVote: (awardId: string) => void
  voting: string | null
}) {
  const countdown = useCountdown(category.votingEndDate)
  const endMs = parseTimeMs(category.votingEndDate)
  const startMs = parseTimeMs(category.votingStartDate)
  const isEnded = endMs != null && endMs < Date.now()
  const hasNotStarted = startMs != null && startMs > Date.now()
  const votedAwardId = awards.find((a) => myVotedIds.has(a.id))?.id
  const totalVotes = awards.reduce((sum, a) => sum + (a.totalVotes ?? 0), 0)

  return (
    <div
      id={`award-cat-${category.id}`}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden scroll-mt-24"
    >
      {/* Category Header */}
      <div className="bg-gradient-to-r from-[#1a6b3a] to-[#2d9a57] px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-white font-bold text-lg">{category.name}</h3>
            {category.description && (
              <p className="text-white/70 text-sm mt-0.5">{category.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isEnded ? (
              <span className="bg-red-500/20 text-red-200 text-xs px-2.5 py-1 rounded-full font-medium">Closed</span>
            ) : hasNotStarted ? (
              <span className="bg-yellow-500/20 text-yellow-200 text-xs px-2.5 py-1 rounded-full font-medium">
                Opens {formatDate(category.votingStartDate)}
              </span>
            ) : (
              <span className="bg-green-500/30 text-green-100 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                Live
              </span>
            )}
            {!isEnded && !hasNotStarted && countdown && (
              <span className="flex items-center gap-1 text-xs text-white/80">
                <Clock className="w-3.5 h-3.5" />
                {countdown} left
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-white/70">
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{awards.length} nominee{awards.length !== 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
          {category.votingEndDate && !isEnded && (
            <span>Ends {formatDate(category.votingEndDate)}</span>
          )}
        </div>
      </div>

      {/* Voted Banner */}
      {votedAwardId && (
        <div className="bg-[#1a6b3a]/8 border-b border-[#1a6b3a]/20 px-6 py-2.5 flex items-center gap-2 text-sm text-[#1a6b3a] font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          You have voted in this category
        </div>
      )}

      {/* Nominees */}
      {hasNotStarted ? (
        <div className="px-6 py-8 text-center text-gray-400 text-sm">
          Voting opens {formatDate(category.votingStartDate)}
        </div>
      ) : awards.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-400 text-sm">No nominees yet</div>
      ) : (
        <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map((award) => {
            const isVotedThis = myVotedIds.has(award.id)
            const alreadyVotedInCategory = !!votedAwardId
            const canVote = !isEnded && !hasNotStarted && !alreadyVotedInCategory
            const member = award.memberId

            return (
              <div
                key={award.id}
                className={`rounded-xl border-2 overflow-hidden transition-all ${
                  isVotedThis
                    ? 'border-[#1a6b3a] bg-[#1a6b3a]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Nominee photo */}
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-36 flex items-center justify-center">
                  {member?.profilePicture ? (
                    <img
                      src={buildImageUrl(member.profilePicture)}
                      alt={`${member.firstName} ${member.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#1a6b3a]/20 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-[#1a6b3a]/50" />
                    </div>
                  )}
                  {isVotedThis && (
                    <div className="absolute top-2 right-2 bg-[#1a6b3a] rounded-full p-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {member ? `${member.firstName} ${member.lastName}` : award.recipientName || 'Unknown'}
                  </p>
                  {member?.memberNumber && (
                    <p className="text-xs text-gray-400 mt-0.5">{member.memberNumber}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {award.totalVotes ?? 0}
                    </span>
                    {isVotedThis ? (
                      <span className="text-xs font-semibold text-[#1a6b3a]">Your vote</span>
                    ) : alreadyVotedInCategory ? (
                      <span className="text-xs text-gray-400">—</span>
                    ) : isEnded ? (
                      <span className="text-xs text-gray-400">Closed</span>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        loading={voting === award.id}
                        disabled={!canVote || !!voting}
                        onClick={() => onVote(award.id)}
                        iconLeft={<ThumbsUp className="w-3 h-3" />}
                      >
                        Vote
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function MemberAwardsPage() {
  const queryClient = useQueryClient()
  const currentYear = new Date().getFullYear()
  const [voting, setVoting] = useState<string | null>(null)

  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: ['award-categories'],
    queryFn: getAwardCategories,
  })

  const { data: awards, isLoading: awardsLoading } = useQuery({
    queryKey: ['awards-voting', currentYear],
    // Category polls control voting (see castAwardVote); per-award votingEnabled is not required
    queryFn: () => getAllAwards({ year: currentYear }),
  })

  const { data: myVotedIds = [], isLoading: votesLoading } = useQuery({
    queryKey: ['my-award-votes', currentYear],
    queryFn: () => getMyAwardVotes(currentYear),
  })

  const voteMutation = useMutation({
    mutationFn: (awardId: string) => castAwardVote(awardId),
    onSuccess: () => {
      toast.success('Vote cast successfully!')
      queryClient.invalidateQueries({ queryKey: ['my-award-votes'] })
      queryClient.invalidateQueries({ queryKey: ['awards-voting', currentYear] })
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to cast vote'),
    onSettled: () => setVoting(null),
  })

  const handleVote = (awardId: string) => {
    setVoting(awardId)
    voteMutation.mutate(awardId)
  }

  const activeCategories = useMemo(
    () => (categories || []).filter((c: AwardCategory) => c.pollActive),
    [categories],
  )

  const activeCategoryIdSet = useMemo(
    () => new Set(activeCategories.map((c) => String(c.id))),
    [activeCategories],
  )

  const awardsByCategory = useMemo(() => {
    const list = (awards as any[]) || []
    return list.reduce((acc: Record<string, any[]>, award: any) => {
      if (award.status === 'awarded') return acc
      const catId = awardCategoryId(award)
      if (!catId || !activeCategoryIdSet.has(catId)) return acc
      if (!acc[catId]) acc[catId] = []
      acc[catId].push(award)
      return acc
    }, {})
  }, [awards, activeCategoryIdSet])

  if (catLoading || awardsLoading || votesLoading) return <PageLoader />

  const votedSet = new Set(myVotedIds)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Awards &amp; Voting</h2>
        <p className="text-gray-500 text-sm mt-1">
          Vote for one nominee per category ({currentYear}). Open polls are listed below; jump to a category using the
          shortcuts.
        </p>
      </div>

      {activeCategories.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No active award polls at this time</p>
          <p className="text-sm mt-1">Check back later when voting is open</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="sticky top-0 z-10 -mx-1 px-1 py-2 bg-[#f6f7f9]/95 backdrop-blur-sm border-b border-gray-200/80 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-2">Categories with an open poll</p>
            <div className="flex flex-wrap gap-2">
              {activeCategories.map((category) => (
                <a
                  key={category.id}
                  href={`#award-cat-${category.id}`}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:border-[#1a6b3a]/40 hover:text-[#1a6b3a] transition-colors"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
          {activeCategories.map((category: any) => (
            <CategoryPoll
              key={category.id}
              category={category}
              awards={awardsByCategory[category.id] || []}
              myVotedIds={votedSet}
              onVote={handleVote}
              voting={voting}
            />
          ))}
        </div>
      )}
    </div>
  )
}
