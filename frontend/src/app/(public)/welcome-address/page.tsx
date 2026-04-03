'use client'

import Link from 'next/link'
import { ArrowLeft, Quote, Award } from 'lucide-react'
import { SAMPLE_EXECUTIVES } from '@/lib/sampleData'

// The National President is the first executive
const PRESIDENT = SAMPLE_EXECUTIVES[0]

const WELCOME_PARAGRAPHS = [
  `On behalf of the Board of Trustees, the National Executive Council, and the entire membership of the Association of Retired Nigerian Sports Men and Women Association (RENISA), I am delighted to extend a warm welcome to you  athletes, supporters, partners, and friends who share in our collective passion for Nigerian sports excellence.`,

  `RENISA was founded on the belief that those who gave their youth, health, and talent to represent Nigeria on the world stage deserve to be celebrated, supported, and remembered long after their active careers have ended. We are proud custodians of an extraordinary legacy  one built across disciplines including football, athletics, boxing, swimming, basketball, tennis, and many more.`,

  `The road for a retired athlete is not always smooth. Transitions from active sports life can be challenging financially, physically, and emotionally. It is RENISA's unwavering commitment to ease that transition by providing a strong community of fellowship, advocacy, welfare support, and continued engagement in the nation's sporting culture.`,

  `Over the years, we have grown from a small gathering of veterans into a nationwide body that commands respect from the government, sports federations, and the public. We have seen members receive state honours, mentor the next generation of athletes, and continue to serve Nigeria in remarkable ways. This is the spirit of RENISA  that retirement from active competition does not mean retirement from impact.`,

  `I invite every eligible retired Nigerian sports person who has not yet registered to join us. I also call on corporate organizations, sports enthusiasts, and philanthropists to partner with RENISA in our mission. Together, we can build a future where no Nigerian sports hero is forgotten, where every athlete knows that there is a home awaiting them at the end of their competitive journey.`,

  `To our existing members: your loyalty and dedication are the foundation upon which this great association stands. Continue to show up, engage, and represent the very best of Nigerian sportsmanship  not just on the field of play, but in every area of life.`,

  `God bless RENISA. God bless Nigerian sports. God bless the Federal Republic of Nigeria.`,
]

export default function WelcomeAddressPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0d4a25] via-[#0d4a25] to-[#1a6b3a] py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-2 border-[#EBD279]" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border-2 border-[#EBD279]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-[#EBD279] to-[#d4a017] shadow-2xl">
                <div className="w-full h-full rounded-full p-1 bg-[#0d4a25]">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={PRESIDENT.photo}
                      alt={PRESIDENT.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center md:text-left">
              <span className="inline-block bg-[#d4a017] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
                {PRESIDENT.sport}
              </span>
              <p className="text-[#EBD279] text-xs font-semibold uppercase tracking-[0.3em] mb-2">
                Welcome Address
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-serif leading-tight">
                A Message from the<br className="hidden md:block" /> National President
              </h1>
              <p className="text-white/80 text-lg font-semibold mt-3">{PRESIDENT.name}</p>
              <p className="text-[#EBD279] text-sm mt-1 flex items-center gap-1.5 justify-center md:justify-start">
                <Award className="w-3.5 h-3.5" />
                {PRESIDENT.position} · {PRESIDENT.tenure}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Address body */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Opening quote */}
          <div className="relative bg-gradient-to-br from-[#0d4a25]/5 to-[#EBD279]/10 rounded-2xl border border-[#EBD279]/30 p-8 mb-12">
            <Quote className="absolute top-5 left-5 w-8 h-8 text-[#EBD279] opacity-40" />
            <p className="text-[#0d4a25] text-xl md:text-2xl font-serif leading-relaxed font-medium pl-6 italic">
              "Retirement from active competition does not mean retirement from impact."
            </p>
            <div className="flex items-center gap-3 mt-5 pl-6">
              <div className="w-8 h-0.5 bg-[#d4a017] rounded-full" />
              <p className="text-[#d4a017] font-semibold text-sm">{PRESIDENT.name}</p>
            </div>
          </div>

          {/* Full address */}
          <div className="prose prose-lg max-w-none">
            <div className="space-y-6">
              {WELCOME_PARAGRAPHS.map((para, i) => (
                <p
                  key={i}
                  className={`leading-relaxed ${
                    i === WELCOME_PARAGRAPHS.length - 1
                      ? 'text-gray-700 font-semibold'
                      : 'text-gray-600'
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Signature */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4a017] flex-shrink-0">
                <img
                  src={PRESIDENT.photo}
                  alt={PRESIDENT.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg font-serif">{PRESIDENT.name}</p>
                <p className="text-[#1a6b3a] font-semibold text-sm">{PRESIDENT.position}, RENISA</p>
                <p className="text-gray-400 text-xs mt-0.5">{PRESIDENT.tenure}</p>
              </div>
            </div>
          </div>

          {/* Back navigation */}
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
