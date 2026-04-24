'use client'

import { useQuery } from '@tanstack/react-query'
import { Twitter, Linkedin, Facebook, Instagram, ArrowLeft, Calendar } from 'lucide-react'
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
  return m.profilePicture || m.photo || mid?.profilePicture || null
}

export function LeadershipProfile({ slug, backHref, backLabel }: LeadershipProfileProps) {
  const { data: member, isLoading } = useQuery({
    queryKey: ['leadership-profile', slug],
    queryFn: async () => {
     
      try {
        const bySlug = await getLeadershipBySlug(slug)
        if (bySlug) return bySlug
      } catch {
        // not a valid slug — fall through to ID lookup below
      }
      return getLeadershipMember(slug)
    },
  })

  if (isLoading) return <PageLoader />
  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Member not found</p>
      </div>
    )
  }

  const name = displayName(member)
  const pic = profilePhoto(member)
  const bioText = member.memberId?.bio || member.bio
  const tenureLabel = member.tenure
    ? member.tenure
    : member.tenureStart
      ? `${formatDate(member.tenureStart, 'MMM yyyy')}${member.tenureEnd ? ` – ${formatDate(member.tenureEnd, 'MMM yyyy')}` : ' – Present'}`
      : '—'

  return (
    <div className="bg-white min-h-screen">
      <div className="relative h-56 md:h-72 bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a]">
        {member.coverPhoto && (
          <img src={buildImageUrl(member.coverPhoto)} alt="Cover" className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-4 mb-6">
          <Link href={backHref} className="flex items-center gap-2 text-[#1a6b3a] hover:text-[#0d4a25] text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
          <div className="relative -mt-16 sm:-mt-20 flex-shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[#1a6b3a]">
              {pic ? (
                <img src={buildImageUrl(pic)} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-2 sm:mt-4">
            <h1 className="text-3xl font-bold text-gray-900 font-serif">{name}</h1>
            <p className="text-[#1a6b3a] font-semibold mt-1">{member.position}</p>
            {member.state && <p className="text-gray-500 text-sm">{member.state}</p>}
            <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-2">
              <Calendar className="w-4 h-4" />
              <span>Tenure: {tenureLabel}</span>
            </div>
            {member.socialLinks && (
              <div className="flex gap-3 mt-3">
                {member.socialLinks.twitter && (
                  <a href={member.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1a6b3a]">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {member.socialLinks.linkedin && (
                  <a href={member.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1a6b3a]">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {member.socialLinks.facebook && (
                  <a href={member.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1a6b3a]">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {member.socialLinks.instagram && (
                  <a href={member.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1a6b3a]">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {bioText && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 font-serif mb-4">Biography</h2>
            <div className="rich-text text-gray-600 leading-relaxed whitespace-pre-wrap">{bioText}</div>
          </div>
        )}

        {member.galleryImages && member.galleryImages.length > 0 && (
          <div className="mb-12">
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
    </div>
  )
}
