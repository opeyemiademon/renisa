'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trophy, ThumbsUp, Clock } from 'lucide-react'
import { castAwardVote, getAwardVoteResults } from '@/lib/api_services/awardVoteApiServices'
import { Award } from '@/types'
import { buildImageUrl, formatDate } from '@/lib/utils'
import { Button } from '@/components/shared/Button'
import toast from 'react-hot-toast'

interface AwardVotingCardProps {
  award: Award
}

function useCountdown(endDate?: string) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!endDate) return
    const tick = () => {
      const diff = new Date(endDate).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('Ended'); return }
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const mins = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(`${days}d ${hours}h ${mins}m`)
    }
    tick()
    const interval = setInterval(tick, 60000)
    return () => clearInterval(interval)
  }, [endDate])

  return timeLeft
}

export function AwardVotingCard({ award }: AwardVotingCardProps) {
  const queryClient = useQueryClient()
  const countdown = useCountdown(award.votingEndDate)

  const { data: voteData } = useQuery({
    queryKey: ['award-vote-results', award.id],
    queryFn: () => getAwardVoteResults(award.id),
    enabled: award.votingEnabled,
  })

  const voteMutation = useMutation({
    mutationFn: () => castAwardVote(award.id),
    onSuccess: () => {
      toast.success('Vote cast!')
      queryClient.invalidateQueries({ queryKey: ['award-vote-results', award.id] })
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to vote'),
  })

  const hasVoted = voteData?.hasVoted
  const isEnded = award.votingEndDate && new Date(award.votingEndDate) < new Date()

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-br from-[#1a6b3a] to-[#2d9a57] p-5 text-center">
        {award.recipientPhoto ? (
          <img
            src={buildImageUrl(award.recipientPhoto)}
            alt={award.recipientName}
            className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-[#d4a017]"
          />
        ) : (
          <div className="w-20 h-20 rounded-full mx-auto bg-[#d4a017]/20 border-4 border-[#d4a017] flex items-center justify-center">
            <Trophy className="w-8 h-8 text-[#d4a017]" />
          </div>
        )}
        <h3 className="text-white font-bold mt-3">{award.title}</h3>
        <p className="text-white/80 text-sm">{award.recipientName}</p>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs bg-[#d4a017]/10 text-[#d4a017] px-2.5 py-1 rounded-full font-medium">
            {award.category?.name || 'General'}
          </span>
          <span className="text-gray-400 text-xs">{award.year}</span>
        </div>

        {award.description && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{award.description}</p>
        )}

        {award.votingEnabled && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-gray-500">
                <ThumbsUp className="w-4 h-4" />
                <span>{voteData?.totalVotes ?? award.totalVotes ?? 0} votes</span>
              </div>
              {!isEnded && countdown && (
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <Clock className="w-3.5 h-3.5" />
                  {countdown}
                </div>
              )}
            </div>

            {hasVoted ? (
              <div className="bg-[#1a6b3a]/10 text-[#1a6b3a] text-sm font-medium text-center py-2 rounded-lg">
                You voted ✓
              </div>
            ) : isEnded ? (
              <div className="bg-gray-100 text-gray-500 text-sm text-center py-2 rounded-lg">
                Voting Closed
              </div>
            ) : (
              <Button
                onClick={() => voteMutation.mutate()}
                loading={voteMutation.isPending}
                iconLeft={<ThumbsUp className="w-4 h-4" />}
                className="w-full"
                size="sm"
                variant="secondary"
              >
                Vote
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
