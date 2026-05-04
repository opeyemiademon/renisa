'use client'

import { useQuery } from '@tanstack/react-query'
import { Trophy, Target, Eye, History, Users, Star, Calendar, Medal, HeartHandshake, BookOpen, ShieldCheck, Lightbulb } from 'lucide-react'
import { getPublicSiteStats } from '@/lib/api_services/publicSiteApiServices'
import { getSiteContent } from '@/lib/api_services/siteContentApiServices'
import { buildImageUrl } from '@/lib/utils'
import { cleanHtml } from '@/components/public/Navbar'

export default function AboutPage() {
  const { data: siteStats } = useQuery({
    queryKey: ['public-site-stats'],
    queryFn: getPublicSiteStats,
    staleTime: 60_000,
  })

  const { data: aboutContent } = useQuery({
    queryKey: ['site-content', 'about'],
    queryFn: () => getSiteContent('about'),
    staleTime: 300_000,
  })

  const { data: missionContent } = useQuery({
    queryKey: ['site-content', 'mission'],
    queryFn: () => getSiteContent('mission'),
    staleTime: 300_000,
  })

  const { data: historyContent } = useQuery({
    queryKey: ['site-content', 'history'],
    queryFn: () => getSiteContent('history'),
    staleTime: 300_000,
  })

  const { data: coreValuesContent } = useQuery({
    queryKey: ['site-content', 'core_values'],
    queryFn: () => getSiteContent('core_values'),
    staleTime: 300_000,
  })

  const aboutMeta = (aboutContent as any)?.metadata || {}
  const missionMeta = (missionContent as any)?.metadata || {}
  const historyMeta = (historyContent as any)?.metadata || {}
  const coreValuesMeta = (coreValuesContent as any)?.metadata || {}

  const statsRow = siteStats
    ? [
        { icon: <Users className="w-6 h-6" />, value: String(siteStats.activeMembers), label: 'Active members' },
        { icon: <Star className="w-6 h-6" />, value: String(siteStats.awardedHonors), label: 'Honours recorded' },
      ]
    : [
        { icon: <Users className="w-6 h-6" />, value: '—', label: 'Active members' },
        { icon: <Star className="w-6 h-6" />, value: '—', label: 'Honours recorded' },
      ]

  return (
    <div className="bg-white">
      {/* Hero — background image with dark green overlay */}
      <section className="relative py-28">
        {/* Background image — clipped to section bounds without hiding section content */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1600&q=80&auto=format&fit=crop"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
        {/* Dark green overlay — two layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d4a25]/95 via-[#1a6b3a]/85 to-[#0d4a25]/90" />
        {/* Subtle gold accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EBD279] via-[#d4a017] to-[#EBD279]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">
            Who We Are
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white font-serif mb-5">
            {aboutMeta.title || 'About RENISA'}
          </h1>
          {aboutMeta.content ? (
            <div
              className="text-white/85 max-w-2xl mx-auto text-lg leading-relaxed prose prose-invert w-full overflow-hidden"
              dangerouslySetInnerHTML={{ __html: cleanHtml(aboutMeta.content) }}
            />
          ) : (
            <p className="text-white/85 max-w-2xl mx-auto text-lg leading-relaxed">
              The Association of Retired Nigerian Sports Men &amp; Women — celebrating excellence,
              preserving legacy, and supporting our sports heroes.
            </p>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-[#1a6b3a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            {statsRow.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[#d4a017] flex justify-center mb-2">{stat.icon}</div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/70 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#1a6b3a]/5 border border-[#1a6b3a]/15 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-[#1a6b3a] rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-serif">Our Mission</h2>
              </div>
              {missionMeta.mission ? (
                <div
                  className="text-gray-600 leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: cleanHtml(missionMeta.mission) }}
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  To recognize, celebrate, and support retired Nigerian sports men and women by
                  providing a unified platform that honors their contributions to Nigerian sports,
                  facilitates networking, and advocates for their welfare and rights.
                </p>
              )}
            </div>
            <div className="bg-[#d4a017]/5 border border-[#d4a017]/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-[#d4a017] rounded-xl">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-serif">Our Vision</h2>
              </div>
              {missionMeta.vision ? (
                <div
                  className="text-gray-600 leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: cleanHtml(missionMeta.vision) }}
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  To be the foremost association championing the legacy of Nigerian sports excellence,
                  ensuring that every retired athlete is celebrated, supported, and remembered for
                  their invaluable contributions to the nation.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Left — image */}
            <div className="relative pb-10">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src={historyMeta.image ? buildImageUrl(historyMeta.image) : 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=80&auto=format&fit=crop'}
                  alt="Nigerian sports heritage"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0d4a25]/20" />
              </div>
              <div className="absolute -bottom-2 -right-2 sm:-bottom-5 sm:-right-5 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0d4a25] shadow-xl flex flex-col items-center justify-center">
                <span className="text-[#d4a017] text-3xl font-extrabold font-serif leading-none">7</span>
                <span className="text-white/80 text-xs mt-1 text-center leading-tight px-2">Years of Legacy</span>
              </div>
              <div className="absolute -top-3 -left-3 w-12 h-12 rounded-tl-2xl border-t-2 border-l-2 border-[#d4a017]" />
            </div>

            {/* Right — content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#1a6b3a] rounded-xl shrink-0">
                  <History className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 font-serif">Our History</h2>
              </div>

              {historyMeta.content ? (
                <div
                  className={[
                    'prose prose-lg max-w-none text-gray-600',
                    '**:max-w-full [&_img]:w-full',
                    'wrap-break-word',
                  ].join(' ')}
                  dangerouslySetInnerHTML={{ __html: cleanHtml(historyMeta.content) }}
                />
              ) : (
                <div className="prose prose-lg max-w-none text-gray-600">
                  <p className="leading-relaxed mb-4">
                    RENISA was founded over two decades ago by a group of pioneering retired athletes
                    who recognized the need for an organized body to cater to the welfare and interests
                    of Nigeria&apos;s sporting legends. What started as informal gatherings among former
                    Olympians and national champions has grown into a formidable association with
                    hundreds of members spanning every sport discipline.
                  </p>
                  <p className="leading-relaxed mb-4">
                    Over the years, RENISA has successfully advocated for better pension schemes for
                    retired athletes, organized annual awards ceremonies, facilitated reunions, and
                    provided welfare support to members in need. Our annual awards gala has become one
                    of Nigeria&apos;s most prestigious events in the sports calendar.
                  </p>
                  <p className="leading-relaxed">
                    Today, RENISA stands as a testament to the enduring spirit of Nigerian sports, with
                    members representing legends from football, athletics, boxing, swimming, gymnastics,
                    and many other disciplines who have brought honor to the green and white flag on
                    the world stage.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#d4a017] font-semibold text-sm uppercase tracking-widest mb-3">
              What We Stand For
            </p>
            <h2 className="text-3xl font-bold text-gray-900 font-serif">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: coreValuesMeta.value1_title || 'Excellence',
                description: coreValuesMeta.value1_description || 'We celebrate the pursuit of excellence that defines every great athletes and carry that standard into everything we do.',
                color: 'bg-[#1a6b3a]',
                icon: <Medal className="w-5 h-5 text-white" />,
              },
              {
                title: coreValuesMeta.value2_title || 'Unity',
                description: coreValuesMeta.value2_description || 'Bringing together retired athletes from diverse sports and backgrounds, fostering brotherhood and sisterhood.',
                color: 'bg-[#d4a017]',
                icon: <Users className="w-5 h-5 text-white" />,
              },
              {
                title: coreValuesMeta.value3_title || 'Legacy',
                description: coreValuesMeta.value3_description || 'Preserving the stories, achievements, and contributions of Nigerian sports legends for future generations.',
                color: 'bg-[#0d4a25]',
                icon: <BookOpen className="w-5 h-5 text-white" />,
              },
              {
                title: coreValuesMeta.value4_title || 'Welfare',
                description: coreValuesMeta.value4_description || 'Ensuring the physical, financial, and emotional wellbeing of our members through advocacy and support.',
                color: 'bg-[#2d9a57]',
                icon: <HeartHandshake className="w-5 h-5 text-white" />,
              },
              {
                title: coreValuesMeta.value5_title || 'Integrity',
                description: coreValuesMeta.value5_description || 'Upholding the highest standards of honesty, transparency, and accountability in all our operations.',
                color: 'bg-[#1a6b3a]',
                icon: <ShieldCheck className="w-5 h-5 text-white" />,
              },
              {
                title: coreValuesMeta.value6_title || 'Inspiration',
                description: coreValuesMeta.value6_description || 'Using the stories of our members to inspire the next generation of Nigerian sports champions.',
                color: 'bg-[#d4a017]',
                icon: <Lightbulb className="w-5 h-5 text-white" />,
              },
            ].map((value) => (
              <div
                key={value.title}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow group"
              >
                <div className={`w-11 h-11 ${value.color} rounded-xl mb-4 flex items-center justify-center`}>
                  {value.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
