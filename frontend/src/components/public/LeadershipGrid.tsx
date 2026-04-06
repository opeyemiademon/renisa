'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Users } from 'lucide-react'
import { getLeadershipGroup, getLeadershipMembers } from '@/lib/api_services/leadershipApiServices'
import { buildImageUrl } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'
import { NIGERIAN_STATES } from '@/lib/nigerianStates'
import { useState } from 'react'
import type { LeadershipMember } from '@/types'

interface LeadershipGridProps {
  /** Public URL slug (e.g. board-of-trustees); backend resolves legacy bot/nec. */
  groupSlug: string
  /** Fallback title if group metadata is not loaded */
  groupTitle: string
  /** Fallback description */
  description: string
  profileUrlPrefix: string
  showStateFilter?: boolean
}

function memberPhoto(m: LeadershipMember): string | null | undefined {
  const mid = m.memberId as { profilePicture?: string } | undefined
  return m.profilePicture || m.photo || mid?.profilePicture || null
}

function memberDisplayName(m: LeadershipMember): string {
  if (m.name?.trim()) return m.name.trim()
  const mid = m.memberId as { firstName?: string; lastName?: string } | undefined
  if (mid) return `${mid.firstName || ''} ${mid.lastName || ''}`.trim()
  return 'Member'
}

export function LeadershipGrid({
  groupSlug,
  groupTitle,
  description,
  profileUrlPrefix,
  showStateFilter = false,
}: LeadershipGridProps) {
  const [selectedState, setSelectedState] = useState<string>('')

  const { data: groupMeta } = useQuery({
    queryKey: ['leadership-group-public', groupSlug],
    queryFn: async () => {
      try {
        return await getLeadershipGroup(groupSlug)
      } catch {
        return undefined
      }
    },
    staleTime: 60_000,
  })

  const { data: members, isLoading } = useQuery({
    queryKey: ['leadership-members-public', groupSlug, selectedState],
    queryFn: () =>
      getLeadershipMembers({
        groupSlug,
        state: selectedState || undefined,
      }),
    staleTime: 60_000,
  })

  const displayTitle = groupMeta?.name?.trim() || groupTitle
  const displayDescription = groupMeta?.description?.trim() || description
  const displayMembers = members || []

  const imgSrc = (pic: string | null | undefined) => {
    if (!pic) return ''
    return pic.startsWith('http') ? pic : buildImageUrl(pic)
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">RENISA Leadership</p>
          <h1 className="text-4xl font-bold text-white font-serif">{displayTitle}</h1>
          <p className="text-white/80 mt-3 max-w-2xl mx-auto">{displayDescription}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showStateFilter && (
            <div className="mb-8">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All States</option>
                {NIGERIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isLoading ? (
            <PageLoader />
          ) : displayMembers.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No members listed in this group yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayMembers.map((member) => {
                const pathId = member.slug || member.id
                const name = memberDisplayName(member)
                const pic = memberPhoto(member)
                return (
                  <Link key={member.id} href={`${profileUrlPrefix}/${pathId}`}>
                    <div className="group text-center cursor-pointer">
                      <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-[#d4a017]/20 group-hover:border-[#d4a017] transition-colors mb-3">
                        {pic ? (
                          <img src={imgSrc(pic)} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#1a6b3a] flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">{name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#1a6b3a] transition-colors">
                        {name}
                      </h3>
                      <p className="text-[#1a6b3a] text-sm mt-0.5">{member.position}</p>
                      {member.state && <p className="text-gray-400 text-xs mt-0.5">{member.state}</p>}
                      {member.tenure && (
                        <p className="text-gray-400 text-xs mt-0.5">Tenure: {member.tenure}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
