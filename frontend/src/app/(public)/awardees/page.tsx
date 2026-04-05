'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trophy, Star, ThumbsUp } from 'lucide-react'
import { getAllAwards, getAwardCategories } from '@/lib/api_services/awardApiServices'
import { castAwardVote, getAwardVoteResults } from '@/lib/api_services/awardVoteApiServices'
import { buildImageUrl, formatDate } from '@/lib/utils'
import { Badge } from '@/components/shared/Badge'
import { PageLoader } from '@/components/shared/Spinner'
import { useAppSelector } from '@/hooks/redux'
import toast from 'react-hot-toast'

export default function AwardeesPage() {
  const [selectedYear, setSelectedYear] = useState<number | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const queryClient = useQueryClient()
  const { isAuthenticated, portal } = useAppSelector((s) => s.auth)

  const { data: awardsData, isLoading } = useQuery({
    queryKey: ['awards', selectedYear, selectedCategory],
    queryFn: () =>
      getAllAwards({
        ...(selectedYear != null ? { year: selectedYear } : {}),
        ...(selectedCategory ? { categoryId: selectedCategory } : {}),
      }),
  })
  const { data: categories } = useQuery({ queryKey: ['award-categories'], queryFn: getAwardCategories })

  const voteMutation = useMutation({
    mutationFn: castAwardVote,
    onSuccess: () => {
      toast.success('Vote cast successfully!')
      queryClient.invalidateQueries({ queryKey: ['awards'] })
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to cast vote'),
  })

  const awards: any[] = awardsData || []
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">Recognition</p>
          <h1 className="text-4xl font-bold text-white font-serif">Award Recipients</h1>
          <p className="text-white/80 mt-3">Celebrating the champions who made Nigeria proud</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Years</option>
              {years.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <PageLoader />
          ) : awards.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No awards found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {awards.map((award) => (
                <div key={award.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-br from-[#1a6b3a] to-[#2d9a57] p-6 text-center">
                    {award.recipientPhoto ? (
                      <img
                        src={award.recipientPhoto.startsWith('http') ? award.recipientPhoto : buildImageUrl(award.recipientPhoto)}
                        alt={award.recipientName}
                        className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-[#d4a017]"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full mx-auto bg-[#d4a017]/20 border-4 border-[#d4a017] flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-[#d4a017]" />
                      </div>
                    )}
                    <h3 className="text-white font-bold text-lg mt-3">{award.recipientName}</h3>
                    <p className="text-white/80 text-sm mt-1">{award.title}</p>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="active" className="text-xs">
                        {award.category?.name || 'General'}
                      </Badge>
                      <span className="text-gray-400 text-xs font-medium">{award.year}</span>
                    </div>
                    {award.description && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {award.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{award.totalVotes || 0} votes</span>
                      </div>
                      {award.votingEnabled && isAuthenticated && portal === 'member' && (
                        <button
                          onClick={() => voteMutation.mutate(award.id)}
                          disabled={voteMutation.isPending}
                          className="bg-[#d4a017] hover:bg-[#b88c12] text-white text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                        >
                          Vote
                        </button>
                      )}
                      {award.votingEnabled && (
                        <Badge variant="active" className="text-xs">
                          Voting Open
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
