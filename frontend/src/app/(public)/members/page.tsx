'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getPublicMembers, getNewMembers } from '@/lib/api_services/memberApiServices'
import type { Member } from '@/types'
import { buildImageUrl } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'
import { SearchBar } from '@/components/shared/SearchBar'
import { NIGERIAN_STATES, SPORTS } from '@/lib/nigerianStates'

export default function MembersPage() {
  const [search, setSearch] = useState('')
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedState, setSelectedState] = useState('')

  const { data: newMembers, isLoading: newLoading } = useQuery({
    queryKey: ['new-members'],
    queryFn: () => getNewMembers(90),
  })

  const { data: memberList = [], isLoading: membersLoading  } = useQuery<Member[]>({
    queryKey: ['public-members'],
    queryFn: getPublicMembers,
  })

 
  const filteredMembers = useMemo(() => {
    
    return memberList.filter((m: Member) => {
      if (selectedSport && m.sport !== selectedSport) return false
      if (selectedState && m.state !== selectedState) return false
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        const name = `${m.firstName} ${m.lastName}`.toLowerCase()
        const num = (m.memberNumber || '').toLowerCase()
        if (!name.includes(q) && !num.includes(q)) return false
      }
      return true
    })
  }, [memberList, search, selectedSport, selectedState])

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">Community</p>
          <h1 className="text-4xl font-bold text-white font-serif">Our Members</h1>
          <p className="text-white/80 mt-3">New members and alumni of RENISA</p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#d4a017] rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900 font-serif">New Members</h2>
            <span className="bg-[#1a6b3a] text-white text-xs px-2.5 py-1 rounded-full">Last 90 days</span>
          </div>
          {newLoading ? (
            <PageLoader />
          ) : !newMembers?.length ? (
            <p className="text-center text-gray-400 py-12">No recent members to show yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {newMembers.map((member) => (
                <Link key={member.id} href={`/members/${member.id}`}>
                  <div className="text-center bg-white rounded-xl p-4 border border-gray-200 hover:border-[#d4a017]/50 hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-[#1a6b3a] mb-3 border-2 border-[#d4a017]/30 group-hover:border-[#d4a017] transition-colors">
                      {member.profilePicture ? (
                        <img
                          src={member.profilePicture.startsWith('http') ? member.profilePicture : buildImageUrl(member.profilePicture)}
                          alt={member.firstName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{member.firstName[0]}</span>
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-gray-900 text-sm truncate group-hover:text-[#1a6b3a] transition-colors">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-[#1a6b3a] text-xs">{member.sport}</p>
                    <p className="text-gray-400 text-xs">{member.stateOfOrigin}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#1a6b3a] rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900 font-serif">All Members</h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search members..."
              className="flex-1 min-w-48"
            />
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Sports</option>
              {SPORTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All States</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {membersLoading ? (
            <PageLoader />
          ) : filteredMembers.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No members match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredMembers.map((member: Member) => (
                <Link key={member.id} href={`/members/${member.id}`}>
                  <div className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:border-[#d4a017]/50 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-[#1a6b3a] mb-3 border-2 border-[#d4a017]/30 group-hover:border-[#d4a017] transition-colors">
                      {member.profilePicture ? (
                        <img
                          src={member.profilePicture.startsWith('http') ? member.profilePicture : buildImageUrl(member.profilePicture)}
                          alt={member.firstName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">{member.firstName[0]}</span>
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 group-hover:text-[#1a6b3a] transition-colors">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-[#1a6b3a] text-sm mt-0.5">{member.sport}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{member.stateOfOrigin}</p>
                    <p className="text-[#1a6b3a] text-xs font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">View Profile →</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
