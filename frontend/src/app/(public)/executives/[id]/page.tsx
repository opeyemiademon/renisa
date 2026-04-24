'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Award, Twitter, Facebook, Linkedin, Globe, Mail, Phone } from 'lucide-react'
import { getExecutive } from '@/lib/api_services/executiveApiServices'
import { buildImageUrl } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'

const SocialIcon = ({ platform }: { platform: string }) => {
  const map: Record<string, React.ReactNode> = {
    twitter: <Twitter className="w-4 h-4" />,
    facebook: <Facebook className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    website: <Globe className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    phone: <Phone className="w-4 h-4" />,
  }
  return <>{map[platform] || <Globe className="w-4 h-4" />}</>
}

const SocialLabel: Record<string, string> = {
  twitter: 'Twitter',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  website: 'Website',
  email: 'Email',
  phone: 'Phone',
}

export default function ExecutiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { data: exec, isLoading } = useQuery({
    queryKey: ['executive', id],
    queryFn: () => getExecutive(id),
  })

  if (isLoading) return <PageLoader />

  if (!exec) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Executive not found.</p>
          <Link href="/executives" className="text-[#1a6b3a] font-medium hover:underline">
            ← Back to Executives
          </Link>
        </div>
      </div>
    )
  }

  const mid = exec.memberId
  const sportFromMid = typeof mid === 'object' && mid != null ? mid.sport : undefined
  const sport = exec.sport || exec.member?.sport || sportFromMid
  const rawPhoto = exec.photo || exec.profilePicture
  const photoSrc = rawPhoto ? (rawPhoto.startsWith('http') ? rawPhoto : buildImageUrl(rawPhoto)) : null
  const socialLinks = exec.socialLinks || []

  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-gradient-to-br from-[#0d4a25] via-[#0d4a25] to-[#1a6b3a] py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-2 border-[#EBD279]" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full border-2 border-[#EBD279]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link
            href="/executives"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Executives
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-br from-[#EBD279] to-[#d4a017] shadow-2xl">
                <div className="w-full h-full rounded-full p-1 bg-[#0d4a25]">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {photoSrc ? (
                      <img src={photoSrc} alt={exec.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#1a6b3a] flex items-center justify-center">
                        <span className="text-white text-5xl font-bold">{exec.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center md:text-left">
              {sport && (
                <span className="inline-block bg-[#d4a017] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
                  {sport}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-white font-serif">{exec.name}</h1>
              <p className="text-[#EBD279] text-xl font-semibold mt-2">{exec.position}</p>
              {exec.tenure && (
                <p className="text-white/60 text-sm mt-1 flex items-center gap-1.5 justify-center md:justify-start">
                  <Award className="w-4 h-4" />
                  Tenure: {exec.tenure}
                </p>
              )}

              {socialLinks.length > 0 && (
                <div className="flex items-center gap-3 mt-5 justify-center md:justify-start flex-wrap">
                  {socialLinks.map((link: { platform: string; url: string }, i: number) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-white/10 hover:bg-[#EBD279] hover:text-[#0d4a25] text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    >
                      <SocialIcon platform={link.platform} />
                      {SocialLabel[link.platform] || link.platform}
                    </a>
                  ))}
                </div>
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
              <h2 className="text-2xl font-bold text-gray-900 font-serif mb-5">Biography</h2>
              {exec?.member?.bio ? (
                <div
                  className="prose prose-sm sm:prose max-w-none text-gray-600 leading-relaxed wrap-break-word [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: exec.member.bio }}
                />
              ) : (
                <p className="text-gray-400 italic">No biography available.</p>
              )}
            </div>

            {/* Sidebar — right 1/3 */}
            <div className="min-w-0 space-y-6">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Quick Info</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs text-gray-400 uppercase tracking-wide">Position</dt>
                    <dd className="text-sm font-semibold text-[#1a6b3a] mt-0.5 wrap-break-word">{exec.position}</dd>
                  </div>
                  {sport && (
                    <div>
                      <dt className="text-xs text-gray-400 uppercase tracking-wide">Sport</dt>
                      <dd className="text-sm font-semibold text-gray-900 mt-0.5">{sport}</dd>
                    </div>
                  )}
                  {exec.tenure && (
                    <div>
                      <dt className="text-xs text-gray-400 uppercase tracking-wide">Tenure</dt>
                      <dd className="text-sm font-semibold text-gray-900 mt-0.5">{exec.tenure}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <Link href="/executives">
                <div className="flex items-center gap-2 text-sm font-medium text-[#1a6b3a] hover:text-[#d4a017] transition-colors group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  All Executives
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
