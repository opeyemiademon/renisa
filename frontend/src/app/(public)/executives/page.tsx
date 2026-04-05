'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Users, Award, Twitter, Facebook, Linkedin } from 'lucide-react'
import { getAllExecutives } from '@/lib/api_services/executiveApiServices'
import { buildImageUrl } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'

const SocialIcon = ({ platform }: { platform: string }) => {
  const icons: Record<string, React.ReactNode> = {
    twitter: <Twitter className="w-3.5 h-3.5" />,
    facebook: <Facebook className="w-3.5 h-3.5" />,
    linkedin: <Linkedin className="w-3.5 h-3.5" />,
  }
  return <>{icons[platform] || null}</>
}

export default function ExecutivesPage() {
  const { data: apiExecutives, isLoading } = useQuery({
    queryKey: ['executives'],
    queryFn: getAllExecutives,
  })

  const executives = (apiExecutives || []).map((e: any) => {
    const mid = e.memberId
    const sportMid = typeof mid === 'object' && mid != null ? mid.sport : undefined
    return {
      ...e,
      sport: e.sport || e.member?.sport || sportMid,
      photo: e.photo || e.profilePicture,
    }
  })

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0d4a25] via-[#0d4a25] to-[#1a6b3a] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-2 border-[#EBD279]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full border-2 border-[#EBD279]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <p className="text-[#EBD279] font-medium text-xs uppercase tracking-[0.3em] mb-4">
            Leadership
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif">Our Executives</h1>
          <p className="text-white/70 mt-4 max-w-xl mx-auto text-lg">
            Dedicated leaders steering RENISA toward a brighter future for retired Nigerian sports heroes.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <PageLoader />
          ) : executives.length === 0 ? (
            <p className="text-center text-gray-400 py-20">No executives listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {executives.map((exec) => (
                <Link key={exec.id} href={`/executives/${exec.id}`}>
                  <div className="group bg-white rounded-2xl border border-gray-100 hover:border-[#d4a017]/40 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
                    {/* Photo */}
                    <div className="relative bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] pt-8 pb-6 flex justify-center">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="relative">
                        {/* Double gold ring */}
                        <div className="w-28 h-28 rounded-full p-0.5 bg-gradient-to-br from-[#EBD279] to-[#d4a017] shadow-lg">
                          <div className="w-full h-full rounded-full p-0.5 bg-[#0d4a25]">
                            <div className="w-full h-full rounded-full overflow-hidden">
                              {exec.photo ? (
                                <img
                                  src={exec.photo.startsWith('http') ? exec.photo : buildImageUrl(exec.photo)}
                                  alt={exec.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#1a6b3a] flex items-center justify-center">
                                  <span className="text-white text-3xl font-bold">{exec.name.charAt(0)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Sport badge */}
                        {exec.sport && (
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#d4a017] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow">
                            {exec.sport}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="px-5 pt-5 pb-4 text-center">
                      <h3 className="font-bold text-gray-900 text-base group-hover:text-[#1a6b3a] transition-colors leading-tight">
                        {exec.name}
                      </h3>
                      <p className="text-[#1a6b3a] font-semibold text-sm mt-1">{exec.position}</p>
                      {exec.tenure && (
                        <p className="text-gray-400 text-xs mt-1 flex items-center justify-center gap-1">
                          <Award className="w-3 h-3" />
                          {exec.tenure}
                        </p>
                      )}

                      {/* Social links */}
                      {exec.socialLinks && exec.socialLinks.length > 0 && (
                        <div className="flex justify-center gap-2 mt-3">
                          {exec.socialLinks.map((link: { platform: string; url: string }, i: number) => (
                            <a
                              key={i}
                              href={link.url}
                              onClick={(e) => e.stopPropagation()}
                              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#1a6b3a] hover:text-white text-gray-500 flex items-center justify-center transition-colors"
                            >
                              <SocialIcon platform={link.platform} />
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <span className="text-[#1a6b3a] text-xs font-medium group-hover:text-[#d4a017] transition-colors">
                          View Profile →
                        </span>
                      </div>
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
