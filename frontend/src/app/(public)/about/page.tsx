'use client'

import { Trophy, Target, Eye, History, Users, Star, Calendar, Medal, HeartHandshake, BookOpen, ShieldCheck, Lightbulb } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">
            Who We Are
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white font-serif mb-5">
            About RENISA
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed">
            The Association of Retired Nigerian Sports Men &amp; Women — celebrating excellence,
            preserving legacy, and supporting our sports heroes.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-[#1a6b3a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Users className="w-6 h-6" />, value: '500+', label: 'Members' },
              { icon: <Calendar className="w-6 h-6" />, value: '20+', label: 'Years Active' },
              { icon: <Trophy className="w-6 h-6" />, value: '20+', label: 'Sports' },
              { icon: <Star className="w-6 h-6" />, value: '100+', label: 'Awardees' },
            ].map((stat) => (
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
              <p className="text-gray-600 leading-relaxed">
                To recognize, celebrate, and support retired Nigerian sports men and women by
                providing a unified platform that honors their contributions to Nigerian sports,
                facilitates networking, and advocates for their welfare and rights.
              </p>
            </div>
            <div className="bg-[#d4a017]/5 border border-[#d4a017]/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-[#d4a017] rounded-xl">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-serif">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To be the foremost association championing the legacy of Nigerian sports excellence,
                ensuring that every retired athlete is celebrated, supported, and remembered for
                their invaluable contributions to the nation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-[#1a6b3a] rounded-xl">
              <History className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-serif">Our History</h2>
          </div>
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
                title: 'Excellence',
                description: 'We celebrate the pursuit of excellence that defines every great athlete and carry that standard into everything we do.',
                color: 'bg-[#1a6b3a]',
                icon: <Medal className="w-5 h-5 text-white" />,
              },
              {
                title: 'Unity',
                description: 'Bringing together retired athletes from diverse sports and backgrounds, fostering brotherhood and sisterhood.',
                color: 'bg-[#d4a017]',
                icon: <Users className="w-5 h-5 text-white" />,
              },
              {
                title: 'Legacy',
                description: 'Preserving the stories, achievements, and contributions of Nigerian sports legends for future generations.',
                color: 'bg-[#0d4a25]',
                icon: <BookOpen className="w-5 h-5 text-white" />,
              },
              {
                title: 'Welfare',
                description: 'Ensuring the physical, financial, and emotional wellbeing of our members through advocacy and support.',
                color: 'bg-[#2d9a57]',
                icon: <HeartHandshake className="w-5 h-5 text-white" />,
              },
              {
                title: 'Integrity',
                description: 'Upholding the highest standards of honesty, transparency, and accountability in all our operations.',
                color: 'bg-[#1a6b3a]',
                icon: <ShieldCheck className="w-5 h-5 text-white" />,
              },
              {
                title: 'Inspiration',
                description: 'Using the stories of our members to inspire the next generation of Nigerian sports champions.',
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
