'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, MapPin, Calendar, Hash, Medal } from 'lucide-react'
import { getPublicMemberProfile } from '@/lib/api_services/memberApiServices'
import { buildImageUrl, formatDate, formatDateOnly } from '@/lib/utils'

export default function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { data: member, isLoading } = useQuery({
    queryKey: ['public-member-profile', id],
    queryFn: () => getPublicMemberProfile(id),
    retry: 1,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse flex gap-8 items-center">
              <div className="w-40 h-40 rounded-full bg-white/20 flex-shrink-0" />
              <div className="space-y-3 flex-1">
                <div className="h-6 bg-white/20 rounded w-1/3" />
                <div className="h-8 bg-white/20 rounded w-2/3" />
                <div className="h-5 bg-white/20 rounded w-1/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Member profile not found.</p>
          <Link href="/members" className="text-[#1a6b3a] font-medium hover:underline">
            ← Back to Members
          </Link>
        </div>
      </div>
    )
  }

  const photo = member.profilePicture
    ? (member.profilePicture.startsWith('http') ? member.profilePicture : buildImageUrl(member.profilePicture))
    : null
  const fullName = `${member.firstName}${member.middleName ? ' ' + member.middleName : ''} ${member.lastName}`
  const isAlumni = member.isAlumni ?? true

  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-gradient-to-br from-[#0d4a25] via-[#0d4a25] to-[#1a6b3a] py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-2 border-[#EBD279]" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full border-2 border-[#EBD279]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link
            href="/members"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Members
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-br from-[#EBD279] to-[#d4a017] shadow-2xl">
                <div className="w-full h-full rounded-full p-1 bg-[#0d4a25]">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {photo ? (
                      <img src={photo} alt={fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#1a6b3a] flex items-center justify-center">
                        <span className="text-white text-5xl font-bold">{member.firstName[0]}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                {member.sport && (
                  <span className="bg-[#d4a017] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">
                    {member.sport}
                  </span>
                )}
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${isAlumni ? 'bg-white/20 text-white' : 'bg-green-500/80 text-white'}`}>
                  {isAlumni ? 'Alumni' : 'Member'}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-serif">{fullName}</h1>
             {/*  {member.memberNumber && (
                <p className="text-[#EBD279] text-sm font-medium mt-2 flex items-center gap-1.5 justify-center md:justify-start">
                  <Hash className="w-3.5 h-3.5" />
                  {member.memberNumber}
                </p>
              )} */}
              {member.state && (
                <p className="text-white/60 text-sm mt-1 flex items-center gap-1.5 justify-center md:justify-start">
                  <MapPin className="w-3.5 h-3.5" />
                  {member.city ? `${member.city}, ` : ''}{member.state}
                </p>
              )}
              {member.createdAt && (
                <p className="text-white/50 text-xs mt-1 flex items-center gap-1.5 justify-center md:justify-start">
                  <Calendar className="w-3 h-3" />
                  Member since {formatDateOnly(member.createdAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 md:gap-10 items-start">

            {/* Bio — left 2/3 */}
            <div className="md:col-span-2 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 font-serif mb-5">Profile</h2>
              {member.bio ? (
                <div
                  className="prose prose-sm sm:prose max-w-none text-gray-600 leading-relaxed wrap-break-word [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: member.bio }}
                />
              ) : (
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
                  <Medal className="w-10 h-10 mx-auto mb-3 text-[#d4a017] opacity-60" />
                  <p className="text-gray-500 font-medium">
                    {member.firstName} is a proud member of the RENISA community.
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Detailed biography coming soon.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar — right 1/3 */}
            <div className="min-w-0 space-y-6">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                  Member Info
                </h3>
                <dl className="space-y-3">
                  {member.sport && (
                    <div>
                      <dt className="text-xs text-gray-400 uppercase tracking-wide">Sport</dt>
                      <dd className="text-sm font-semibold text-gray-900 mt-0.5">{member.sport}</dd>
                    </div>
                  )}
                 {/*  {member.state && (
                    <div>
                      <dt className="text-xs text-gray-400 uppercase tracking-wide">State</dt>
                      <dd className="text-sm font-semibold text-gray-900 mt-0.5">{member.state}</dd>
                    </div>
                  )} */}
                  {member.stateOfOrigin && (
                    <div>
                      <dt className="text-xs text-gray-400 uppercase tracking-wide">State of Origin</dt>
                      <dd className="text-sm font-semibold text-gray-900 mt-0.5">{member.stateOfOrigin}</dd>
                    </div>
                  )}
                  {member.gender && (
                    <div>
                      <dt className="text-xs text-gray-400 uppercase tracking-wide">Gender</dt>
                      <dd className="text-sm font-semibold text-gray-900 mt-0.5 capitalize">{member.gender}</dd>
                    </div>
                  )}
                 {/*  {member.memberNumber && (
                    <div>
                      <dt className="text-xs text-gray-400 uppercase tracking-wide">Member Number</dt>
                      <dd className="text-sm font-semibold text-[#1a6b3a] mt-0.5">{member.memberNumber}</dd>
                    </div>
                  )} */}
                  <div>
                    <dt className="text-xs text-gray-400 uppercase tracking-wide">Status</dt>
                    <dd className="mt-0.5">
                      <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                        isAlumni ? 'bg-[#1a6b3a]/10 text-[#1a6b3a]' : 'bg-green-100 text-green-700'
                      }`}>
                        {isAlumni ? 'Alumni' : 'Active Member'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <Link href="/members">
                <div className="flex items-center gap-2 text-sm font-medium text-[#1a6b3a] hover:text-[#d4a017] transition-colors group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  Back to Members
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
