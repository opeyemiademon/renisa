'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Users, ChevronRight } from 'lucide-react'
import { getLeadershipGroups } from '@/lib/api_services/leadershipApiServices'
import { PageLoader } from '@/components/shared/Spinner'

const groupLinks: Record<string, string> = {
  'board-of-trustees': '/leadership/board-of-trustees',
  'national-executives': '/leadership/national-executives',
  'state-executives': '/leadership/state-executives',
  directorate: '/leadership/directorate',
}

const groupColors: Record<string, string> = {
  'board-of-trustees': 'from-[#0d4a25] to-[#1a6b3a]',
  'national-executives': 'from-[#1a6b3a] to-[#2d9a57]',
  'state-executives': 'from-[#d4a017] to-[#e8b830]',
  directorate: 'from-[#2d9a57] to-[#1a6b3a]',
}

export default function LeadershipPage() {
  const { data: groups, isLoading } = useQuery({
    queryKey: ['leadership-groups'],
    queryFn: getLeadershipGroups,
  })

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">
            Governance
          </p>
          <h1 className="text-4xl font-bold text-white font-serif">RENISA Leadership</h1>
          <p className="text-white/80 mt-3 max-w-2xl mx-auto">
            Our leadership structure is built on excellence, commitment, and service to all
            retired Nigerian sports men and women.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <PageLoader />
          ) : !groups || groups.length === 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { slug: 'board-of-trustees', name: 'Board of Trustees', description: 'The highest governing body of RENISA, providing strategic direction and oversight.' },
                { slug: 'national-executives', name: 'National Executives', description: 'The executive team responsible for day-to-day operations and policy implementation.' },
                { slug: 'state-executives', name: 'State Executives', description: 'State-level representatives and executives across all 36 states and FCT.' },
                { slug: 'directorate', name: 'Directorate', description: 'Technical and administrative directors managing key departments.' },
              ].map((group) => (
                <Link key={group.slug} href={groupLinks[group.slug] || `/leadership/${group.slug}`}>
                  <div className={`bg-gradient-to-br ${groupColors[group.slug] || 'from-[#1a6b3a] to-[#2d9a57]'} rounded-2xl p-8 text-white hover:opacity-90 transition-opacity cursor-pointer`}>
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-white/15 rounded-xl mb-5">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <ChevronRight className="w-6 h-6 text-white/60" />
                    </div>
                    <h2 className="text-2xl font-bold font-serif mb-3">{group.name}</h2>
                    <p className="text-white/80 text-sm leading-relaxed">{group.description}</p>
                    <div className="mt-6 pt-4 border-t border-white/20">
                      <span className="text-sm font-medium text-white/90">View Members →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {groups.map((group) => (
                <Link key={group.id} href={groupLinks[group.slug] || `/leadership/${group.slug}`}>
                  <div className={`bg-gradient-to-br ${groupColors[group.slug] || 'from-[#1a6b3a] to-[#2d9a57]'} rounded-2xl p-8 text-white hover:opacity-90 transition-opacity cursor-pointer`}>
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-white/15 rounded-xl mb-5">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <ChevronRight className="w-6 h-6 text-white/60" />
                    </div>
                    <h2 className="text-2xl font-bold font-serif mb-3">{group.name}</h2>
                    <p className="text-white/80 text-sm leading-relaxed">{group.description}</p>
                    <div className="mt-6 pt-4 border-t border-white/20">
                      <span className="text-sm font-medium text-white/90">View Members →</span>
                    </div>
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
