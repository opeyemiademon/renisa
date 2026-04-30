'use client'

import { useQuery } from '@tanstack/react-query'
import { Twitter, Linkedin, Facebook, Instagram, ArrowLeft, Calendar, MapPin, Hash, Medal } from 'lucide-react'
import Link from 'next/link'
import { getLeadershipBySlug, getLeadershipMember } from '@/lib/api_services/leadershipApiServices'
import { buildImageUrl, formatDate } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'
import type { LeadershipMember } from '@/types'

interface LeadershipProfileProps {
  slug: string
  backHref: string
  backLabel: string
}

function displayName(m: LeadershipMember): string {
  if (m.name?.trim()) return m.name.trim()
  const mid = m.memberId
  if (mid) return `${mid.firstName || ''} ${mid.lastName || ''}`.trim() || 'Member'
  return 'Member'
}

function profilePhoto(m: LeadershipMember): string | null {
  const mid = m.memberId
  return m.profilePicture || m.photo || mid?.profilePicture || m.nonMemberPhoto || null
}

export function LeadershipProfile({ slug, backHref, backLabel }: LeadershipProfileProps) {
  const { data: member, isLoading } = useQuery({
    queryKey: ['leadership-profile', slug],
    queryFn: async () => {
      try {
        const bySlug = await getLeadershipBySlug(slug)
        if (bySlug) return bySlug
      } catch {
        // not a valid slug — fall through to ID lookup
      }
      return getLeadershipMember(slug)
    },
  })

  if (isLoading) return <PageLoader />
  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Member not found</p>
      </div>
    )
  }

  const name = displayName(member)
  const pic = profilePhoto(member)
  const mid = member.memberId && typeof member.memberId === 'object' ? member.memberId : null
  const bioText = mid?.bio || member.bio || member.nonMemberBio

  const tenureLabel = member.tenure
    ? member.tenure
    : member.tenureStart
      ? `${formatDate(member.tenureStart, 'MMM yyyy')}${member.tenureEnd ? ` – ${formatDate(member.tenureEnd, 'MMM yyyy')}` : ' – Present'}`
      : null

  return (
    <div className="bg-white min-h-screen">

      {/* Hero — green gradient, matches member profile style */}
      <section className="relative bg-gradient-to-br from-[#0d4a25] via-[#0d4a25] to-[#1a6b3a] py-20 overflow-hidden">
        {/* decorative rings */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-2 border-[#EBD279]" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full border-2 border-[#EBD279]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Photo with gold ring */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-br from-[#EBD279] to-[#d4a017] shadow-2xl">
                <div className="w-full h-full rounded-full p-1 bg-[#0d4a25]">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {pic ? (
                      <img
                        src={pic.startsWith('http') ? pic : buildImageUrl(pic)}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1a6b3a] flex items-center justify-center">
                        <span className="text-white text-5xl font-bold">{name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Name, role, meta */}
            <div className="text-center md:text-left">
              {mid?.sport && (
                <span className="inline-block bg-[#d4a017] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase mb-3">
                  {mid.sport}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-white font-serif">{name}</h1>
              <p className="text-[#EBD279] font-semibold mt-1">{member.position}</p>

              {(member.state || mid?.state) && (
                <p className="text-white/60 text-sm mt-1 flex items-center gap-1.5 justify-center md:justify-start">
                  <MapPin className="w-3.5 h-3.5" />
                  {member.state || mid?.state}
                </p>
              )}

              {tenureLabel && (
                <p className="text-white/50 text-xs mt-1 flex items-center gap-1.5 justify-center md:justify-start">
                  <Calendar className="w-3 h-3" />
                  Tenure: {tenureLabel}
                </p>
              )}

              {/* Social links */}
              {member.socialLinks && (
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                  {member.socialLinks.twitter && (
                    <a href={member.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {member.socialLinks.linkedin && (
                    <a href={member.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.socialLinks.facebook && (
                    <a href={member.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {member.socialLinks.instagram && (
                    <a href={member.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 md:gap-10 items-start">

            {/* Bio — left 2/3 */}
            <div className="md:col-span-2 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 font-serif mb-5">Biography</h2>
              {bioText ? (
                <div
                  className="prose prose-sm sm:prose max-w-none text-gray-600 leading-relaxed break-words
                    [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                    [&_a]:text-[#1a6b3a] [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: bioText.replace(/\n/g, '<br/>') }}
                />
              ) : (
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
                  <Medal className="w-10 h-10 mx-auto mb-3 text-[#d4a017] opacity-60" />
                  <p className="text-gray-500 font-medium">
                    {name} is a proud member of the RENISA leadership.
                  </p>
                  <p className="text-gray-400 text-sm mt-2">Detailed biography coming soon.</p>
                </div>
              )}

              {/* Gallery */}
              {member.galleryImages && member.galleryImages.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-bold text-gray-900 font-serif mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {member.galleryImages.map((img, i) => (
                      <div key={i} className="rounded-xl overflow-hidden aspect-square bg-gray-100">
                        <img src={buildImageUrl(img)} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar — right 1/3 */}
            <div className="min-w-0 space-y-6">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                  Details
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs text-gray-400 uppercase tracking-wide">Role</dt>
                    <dd className="text-sm font-semibold text-gray-900 mt-0.5">{member.position}</dd>
                  </div>

                  {tenureLabel && (
                    <div>
                      <dt className="text-xs text-gray-400 uppercase tracking-wide">Tenure</dt>
                      <dd className="text-sm font-semibold text-gray-900 mt-0.5">{tenureLabel}</dd>
                    </div>
                  )}

                  {(member.state || mid?.state) && (
                    <div>
                      <dt className="text-xs text-gray-400 uppercase tracking-wide">State</dt>
                      <dd className="text-sm font-semibold text-gray-900 mt-0.5">{member.state || mid?.state}</dd>
                    </div>
                  )}

                  {mid?.sport && (
                    <div>
                      <dt className="text-xs text-gray-400 uppercase tracking-wide">Sport</dt>
                      <dd className="text-sm font-semibold text-gray-900 mt-0.5">{mid.sport}</dd>
                    </div>
                  )}

               

                  <div>
                    <dt className="text-xs text-gray-400 uppercase tracking-wide">Status</dt>
                    <dd className="mt-0.5">
                      <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                        member.isCurrent
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {member.isCurrent ? 'Current' : 'Former'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <Link href={backHref}>
                <div className="flex items-center gap-2 text-sm font-medium text-[#1a6b3a] hover:text-[#d4a017] transition-colors group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  {backLabel}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
