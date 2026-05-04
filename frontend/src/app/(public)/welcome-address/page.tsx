'use client'

import Link from 'next/link'
import { ArrowLeft, Quote, Award } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getAllExecutives } from '@/lib/api_services/executiveApiServices'
import type { Executive } from '@/types'
import { getSiteContent } from '@/lib/api_services/siteContentApiServices'
import { buildImageUrl } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'
import { cleanHtml } from '@/components/public/Navbar'

export default function WelcomeAddressPage() {
  const { data: executives, isLoading: execLoading } = useQuery({
    queryKey: ['executives'],
    queryFn: getAllExecutives,
  })

  const { data: siteContent, isLoading: contentLoading } = useQuery({
    queryKey: ['site-content', 'welcome_address'],
    queryFn: () => getSiteContent('welcome_address'),
    retry: false,
  })

  const president =
    executives?.find((e) => /president/i.test(e.position) && !/vice/i.test(e.position)) || executives?.[0]

  const pres = president as Executive | undefined
  const pm = pres?.memberId
  const presidentSport =
    pres?.sport || pres?.member?.sport || (typeof pm === 'object' && pm ? pm.sport : undefined)

  const rawPresPhoto = president?.photo || president?.profilePicture
  const photo = rawPresPhoto ? (rawPresPhoto.startsWith('http') ? rawPresPhoto : buildImageUrl(rawPresPhoto)) : null

  const meta = siteContent?.metadata as unknown as { quote?: string; preview?: string; content?: string; paragraphs?: string[] } | undefined
  const pullQuote = meta?.quote || 'Retirement from active competition does not mean retirement from impact.'
  const bodyHtml = (siteContent?.content?.trim() || meta?.content?.trim() || '').trim()
  const paragraphs = !bodyHtml && meta && Array.isArray(meta.paragraphs) ? meta.paragraphs : null

  if (execLoading || contentLoading) return <PageLoader />

  return (
    <div className="bg-white min-h-screen">
      <section className="relative bg-gradient-to-br from-[#0d4a25] via-[#0d4a25] to-[#1a6b3a] py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-2 border-[#EBD279]" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border-2 border-[#EBD279]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-[#EBD279] to-[#d4a017] shadow-2xl">
                <div className="w-full h-full rounded-full p-1 bg-[#0d4a25]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#1a6b3a] flex items-center justify-center">
                    {photo ? (
                      <img src={photo} alt={president?.name || 'President'} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-4xl font-bold">{president?.name?.charAt(0) || 'R'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center md:text-left">
              {presidentSport && (
                <span className="inline-block bg-[#d4a017] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
                  {presidentSport}
                </span>
              )}
              <p className="text-[#EBD279] text-xs font-semibold uppercase tracking-[0.3em] mb-2">Welcome Address</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-serif leading-tight">
                A Message from the<br className="hidden md:block" /> National President
              </h1>
              <p className="text-white/80 text-lg font-semibold mt-3">{president?.name || 'RENISA Leadership'}</p>
              <p className="text-[#EBD279] text-sm mt-1 flex items-center gap-1.5 justify-center md:justify-start">
                <Award className="w-3.5 h-3.5" />
                {president?.position || 'National President'}
                {president?.tenure ? ` · ${president.tenure}` : ''}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#0d4a25]/5 to-[#EBD279]/10 rounded-2xl border border-[#EBD279]/30 p-8 mb-12">
            <Quote className="absolute top-5 left-5 w-8 h-8 text-[#EBD279] opacity-40" />
            <p className="text-[#0d4a25] text-xl md:text-2xl font-serif leading-relaxed font-medium pl-6 italic">
              &ldquo;{pullQuote}&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-5 pl-6">
              <div className="w-8 h-0.5 bg-[#d4a017] rounded-full" />
              <p className="text-[#d4a017] font-semibold text-sm">{president?.name || 'RENISA'}</p>
            </div>
          </div>

          {bodyHtml.includes('<') ? (
            <div className="prose prose-lg max-w-none rich-text text-gray-600 overflow-hidden wrap-break-word" dangerouslySetInnerHTML={{ __html: cleanHtml(bodyHtml) }} />
          ) : paragraphs?.length ? (
            <div className="prose prose-lg max-w-none space-y-6 overflow-hidden wrap-break-word">
              {paragraphs.map((para, i) => (
                <p key={i} className={`leading-relaxed ${i === paragraphs.length - 1 ? 'text-gray-700 font-semibold' : 'text-gray-600'}`}>
                  {para}
                </p>
              ))}
            </div>
          ) : bodyHtml ? (
            <div className="prose prose-lg max-w-none space-y-6 text-gray-600 whitespace-pre-wrap overflow-hidden wrap-break-word">{cleanHtml(bodyHtml)}</div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              The full welcome address will appear here once it is published in the admin site content (section{' '}
              <code className="text-sm bg-gray-100 px-1 rounded">welcome_address</code>).
            </p>
          )}

          {president && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4a017] flex-shrink-0 bg-[#1a6b3a] flex items-center justify-center">
                  {photo ? (
                    <img src={photo} alt={president.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-xl font-bold">{president.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg font-serif">{president.name}</p>
                  <p className="text-[#1a6b3a] font-semibold text-sm">{president.position}, RENISA</p>
                  {president.tenure && <p className="text-gray-400 text-xs mt-0.5">{president.tenure}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-[#1a6b3a] hover:text-[#d4a017] transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Home
              </div>
            </Link>
            <Link href="/executives">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1a6b3a] transition-colors">
                Meet the Executives →
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
