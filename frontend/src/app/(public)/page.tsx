'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight, Trophy, Users, Calendar, Star,
  ChevronRight, Heart, ChevronLeft, Medal, Quote,
} from 'lucide-react'
import { getAllExecutives } from '@/lib/api_services/executiveApiServices'
import { getFeaturedEvents } from '@/lib/api_services/eventApiServices'
import { getGallery } from '@/lib/api_services/galleryApiServices'
import { getAllAwards } from '@/lib/api_services/awardApiServices'
import { getHeroSlides } from '@/lib/api_services/heroSlideApiServices'
import { formatDate, buildImageUrl } from '@/lib/utils'

// ─── Fallback Hero Slides (used when no slides in database) ──────────────────

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1920&q=85&auto=format&fit=crop',
    tag: 'Celebrating Our Heroes',
    title: "Nigeria's Sports Legends",
    subtitle: 'Honoring four decades of athletic excellence and national pride on the world stage.',
    caption: 'RENISA — Where Champions Come Home',
    ctaText: 'Become a Member',
    ctaLink: '/registration',
  },
  {
    id: 'f2',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=85&auto=format&fit=crop',
    tag: 'Football Legacy',
    title: 'The Beautiful Game Lives On',
    subtitle: "From local pitches to the World Cup — Nigeria's Super Eagles veterans led the way with pride.",
    caption: 'Preserving the Super Eagles Legacy Since 2003',
    ctaText: 'Become a Member',
    ctaLink: '/registration',
  },
  {
    id: 'f3',
    imageUrl: 'https://images.unsplash.com/photo-1546519638405-a2b03ac5f4bf?w=1920&q=85&auto=format&fit=crop',
    tag: 'Basketball Excellence',
    title: 'Champions of the Court',
    subtitle: "Nigeria's basketball pioneers who broke continental barriers and inspired millions nationwide.",
    caption: 'African Basketball Champions — 1988 · 2003 · 2015',
    ctaText: 'Become a Member',
    ctaLink: '/registration',
  },
  {
    id: 'f4',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=85&auto=format&fit=crop',
    tag: 'Boxing Heritage',
    title: 'Warriors of the Ring',
    subtitle: 'Nigerian boxing legends who conquered the world and put Africa on the global map forever.',
    caption: "Dick Tiger · Hogan Bassey — Nigeria's Boxing Immortals",
    ctaText: 'Become a Member',
    ctaLink: '/registration',
  },
  {
    id: 'f5',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=85&auto=format&fit=crop',
    tag: 'Athletics Glory',
    title: 'Running to Greatness',
    subtitle: 'From Chioma Ajunwa to Tobi Amusan — defining Olympic excellence for generations to come.',
    caption: "Nigeria's Athletics — Forever in the Record Books",
    ctaText: 'Become a Member',
    ctaLink: '/registration',
  },
]

// ─── Demo Data ────────────────────────────────────────────────────────────────

const SAMPLE_EXECUTIVES = [
  {
    id: 'x1', name: 'Chief Emmanuel Adeyemi', position: 'President', sport: 'Football',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'x2', name: 'Dr. Amaka Okafor', position: 'Vice President', sport: 'Athletics',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'x3', name: 'Barr. Chukwuemeka Nwosu', position: 'Secretary General', sport: 'Boxing',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'x4', name: 'Mrs. Fatima Bello', position: 'Treasurer', sport: 'Table Tennis',
    photo: 'https://images.unsplash.com/photo-1551717704-3f7bfc166498?w=400&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'x5', name: 'Engr. Biodun Afolabi', position: 'Public Relations Officer', sport: 'Tennis',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'x6', name: 'Prof. Ngozi Adichie-Eze', position: 'Welfare Officer', sport: 'Swimming',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'x7', name: 'Dr. Kayode Olawale', position: 'Legal Adviser', sport: 'Cricket',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'x8', name: 'Alhaji Sule Musa', position: 'Financial Secretary', sport: 'Weightlifting',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80&auto=format&fit=crop&crop=face',
  },
]

const SAMPLE_EVENTS = [
  {
    id: 'e1', slug: '#', eventType: 'event', eventDate: '2025-07-18',
    title: 'RENISA Annual Awards Night 2025',
    excerpt: 'A grand evening celebrating our sports legends with awards, speeches and cultural performances.',
    coverImage: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'e2', slug: '#', eventType: 'event', eventDate: '2025-08-22',
    title: 'Veterans Sports Day — Lagos',
    excerpt: 'Retired athletes across disciplines come together for camaraderie, light sports and networking.',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'e3', slug: '#', eventType: 'announcement', eventDate: '2025-09-10',
    title: 'RENISA National Leadership Summit',
    excerpt: 'A two-day summit bringing together RENISA leadership, members and stakeholders to chart the future.',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop',
  },
]

const SAMPLE_GALLERY = [
  { id: 'g1', url: 'https://images.unsplash.com/photo-1546519638405-a2b03ac5f4bf?w=700&q=80&auto=format&fit=crop', title: 'Basketball Tournament Finals' },
  { id: 'g2', url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=700&q=80&auto=format&fit=crop', title: 'Athletics Championship 2024' },
  { id: 'g3', url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=700&q=80&auto=format&fit=crop', title: 'Football Exhibition Match' },
  { id: 'g4', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700&q=80&auto=format&fit=crop', title: 'National Stadium Anniversary' },
  { id: 'g5', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80&auto=format&fit=crop', title: 'Boxing Veterans Gala' },
  { id: 'g6', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=80&auto=format&fit=crop', title: 'RENISA Football Legends Day' },
]

const SAMPLE_AWARDS = [
  {
    id: 'a1', title: 'Lifetime Achievement Award', recipientName: 'Sunday Oliseh', year: 2024,
    category: { name: 'Football' },
    recipientPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'a2', title: 'Excellence in Athletics', recipientName: 'Chioma Ajunwa', year: 2024,
    category: { name: 'Athletics' },
    recipientPhoto: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&q=80&auto=format&fit=crop&crop=face',
  },
  {
    id: 'a3', title: 'Legend of the Year', recipientName: 'Dick Tiger Jr.', year: 2024,
    category: { name: 'Boxing' },
    recipientPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&auto=format&fit=crop&crop=face',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  // ── All queries first (hooks must be in consistent order) ──
  const { data: slidesData } = useQuery({
    queryKey: ['hero-slides-public'],
    queryFn: () => getHeroSlides(true),
    staleTime: 60_000,
  })
  const { data: executivesData } = useQuery({ queryKey: ['executives-preview'], queryFn: getAllExecutives })
  const { data: eventsData } = useQuery({ queryKey: ['featured-events'], queryFn: getFeaturedEvents })
  const { data: galleryData } = useQuery({ queryKey: ['gallery-preview'], queryFn: () => getGallery() })
  const { data: awardsData } = useQuery({ queryKey: ['awards-preview'], queryFn: () => getAllAwards() })

  // ── Derived values from queries ──
  const heroSlides = slidesData && slidesData.length > 0 ? slidesData : FALLBACK_SLIDES
  const slideCount = heroSlides.length

  // ── Slide navigation (useCallback after derived values is valid) ──
  const nextSlide = useCallback(
    () => setCurrentSlide((p) => (p + 1) % slideCount),
    [slideCount]
  )
  const prevSlide = useCallback(
    () => setCurrentSlide((p) => (p - 1 + slideCount) % slideCount),
    [slideCount]
  )

  useEffect(() => {
    if (paused) return
    const t = setInterval(nextSlide, 5500)
    return () => clearInterval(t)
  }, [paused, nextSlide])

  // ── Clamp currentSlide if slide count shrinks ──
  useEffect(() => {
    if (currentSlide >= slideCount) setCurrentSlide(0)
  }, [slideCount, currentSlide])

  // ── Other derived data ──
  const apiExecutives = (executivesData || []).map((e: any) => ({
    id: e.id, name: e.name, position: e.title, sport: '', photo: e.photo,
  }))
  const featuredEvents = (eventsData || []).slice(0, 3)
  const galleryItems = (galleryData?.data || []).slice(0, 6)
  const awards = (awardsData?.data || []).slice(0, 3)

  const displayExecutives = apiExecutives.length > 0 ? apiExecutives : SAMPLE_EXECUTIVES
  const displayEvents = featuredEvents.length > 0 ? featuredEvents : SAMPLE_EVENTS
  const displayGallery = galleryItems.length > 0
    ? galleryItems.map((g: any) => ({ id: g.id, url: buildImageUrl(g.imageUrl), title: g.title }))
    : SAMPLE_GALLERY
  const displayAwards = awards.length > 0 ? awards : SAMPLE_AWARDS

  const slide = heroSlides[currentSlide] ?? heroSlides[0]

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════════════════
          HERO — Full-screen slider with captions
      ═══════════════════════════════════════════════════════ */}
      <section
        className="relative h-screen min-h-[620px] overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slide images (fade transition) */}
        {heroSlides.map((s: any, i: number) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === currentSlide ? 1 : 0, zIndex: i === currentSlide ? 1 : 0 }}
          >
            <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[2]"
          style={{ background: 'linear-gradient(105deg, rgba(13,74,37,0.96) 0%, rgba(13,74,37,0.75) 55%, rgba(13,74,37,0.25) 100%)' }}
        />

        {/* Gold top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EBD279] via-[#d4a017] to-[#EBD279] z-[3]" />

        {/* Slide content */}
        <div className="relative z-[3] h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              {/* Tag badge */}
              <div className="inline-flex items-center gap-2 border border-[#EBD279]/60 bg-[#EBD279]/10 backdrop-blur-sm text-[#EBD279] px-4 py-1.5 rounded-full text-sm font-medium mb-5 transition-all duration-700">
                <Trophy className="w-3.5 h-3.5" />
                {slide.tag}
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-3 max-w-xl">
                {slide.subtitle}
              </p>

              {/* Caption */}
              <p className="text-[#EBD279] text-sm italic mb-10 flex items-center gap-2">
                <span className="w-8 h-px bg-[#EBD279]/60 inline-block" />
                {slide.caption}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href={slide?.ctaLink || '/registration'}>
                  <button className="bg-[#EBD279] hover:bg-[#d4a017] text-[#0d4a25] font-bold px-8 py-4 rounded-xl transition-all duration-200 flex items-center gap-2 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    {slide?.ctaText || 'Become a Member'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/donation">
                  <button className="border-2 border-white/40 hover:border-[#EBD279] text-white hover:text-[#EBD279] font-semibold px-8 py-4 rounded-xl transition-all duration-200 flex items-center gap-2 text-base">
                    <Heart className="w-5 h-5" />
                    Support Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Logo watermark (subtle) */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 z-[3] hidden xl:block opacity-10 pointer-events-none">
          <Image src="/logo.png" alt="" width={280} height={280} />
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-[4] w-11 h-11 rounded-full bg-white/10 hover:bg-[#EBD279]/30 border border-white/30 hover:border-[#EBD279] text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-[4] w-11 h-11 rounded-full bg-white/10 hover:bg-[#EBD279]/30 border border-white/30 hover:border-[#EBD279] text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-2">
          {heroSlides.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-400 ${
                i === currentSlide
                  ? 'w-8 h-2.5 bg-[#EBD279]'
                  : 'w-2.5 h-2.5 bg-white/35 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute bottom-7 right-6 z-[4] text-white/40 text-xs font-mono tracking-widest">
          {String(currentSlide + 1).padStart(2, '0')} &nbsp;/&nbsp; {String(slideCount).padStart(2, '0')}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[#0d4a25] border-b-4 border-[#EBD279]/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white/10">
            {[
              { label: 'Registered Members', value: '500+', icon: <Users className="w-5 h-5" /> },
              { label: 'Years of Excellence', value: '20+', icon: <Calendar className="w-5 h-5" /> },
              { label: 'Sports Represented', value: '20+', icon: <Trophy className="w-5 h-5" /> },
              { label: 'Award Recipients', value: '100+', icon: <Star className="w-5 h-5" /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-4">
                <div className="flex justify-center mb-2 text-[#EBD279]">{stat.icon}</div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/55 text-xs mt-1 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ABOUT
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image collage with logo badge */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=80&auto=format&fit=crop"
                alt="Nigerian football legends"
                className="rounded-2xl w-full h-96 object-cover shadow-2xl"
              />
           
              
              {/* Est. pill */}
              <div className="absolute top-5 right-5 bg-[#EBD279] text-[#0d4a25] px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                Est. 2003
              </div>
            </div>

            {/* Text */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10 bg-[#EBD279]" />
                <p className="text-[#d4a017] font-semibold text-sm uppercase tracking-widest">About RENISA</p>
              </div>
             
              <p className="text-gray-600 leading-relaxed mb-4 text-base">
                RENISA is a national body established to promote the welfare, unity,
physical well-being, and continued engagement of retired Nigerian athletes
who have served the nation with distinction at national and international
levels. 
              </p>
              <p className="text-gray-600 leading-relaxed mb-7 text-base">
                A major focus of the Association is the use of sports as a tool for
 healthy living, social inclusion, mentorship, and the preservation of
Nigeria’s rich sporting heritage.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Recognize and celebrate retired Nigerian sports heroes',
                  'Provide welfare support to veteran athletes in need',
                  'Connect generations of sports excellence',
                  'Advocate for the rights of retired sports persons',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#0d4a25] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#EBD279] text-xs font-bold">✓</span>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/about">
                <button className="bg-[#0d4a25] hover:bg-[#1a6b3a] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors flex items-center gap-2 shadow-md">
                  Learn More About RENISA <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PRESIDENT'S WELCOME ADDRESS PREVIEW
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Photo + name card */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Large photo */}
                <div className="w-72 h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80&auto=format&fit=crop&crop=face"
                    alt="National President"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Name plate */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#0d4a25] text-white rounded-xl px-6 py-3 shadow-xl whitespace-nowrap text-center min-w-[200px]">
                  <p className="font-bold text-sm font-serif">Chief Emmanuel Adeyemi</p>
                  <p className="text-[#EBD279] text-[10px] uppercase tracking-widest mt-0.5">National President</p>
                </div>
                {/* Gold accent ring */}
                <div className="absolute -top-3 -left-3 w-16 h-16 rounded-full border-2 border-[#EBD279] opacity-40" />
                <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-[#EBD279]/20 border border-[#EBD279]" />
              </div>
            </div>

            {/* Quote preview */}
            <div className="lg:pl-4 mt-8 lg:mt-0">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-[#EBD279]" />
                <p className="text-[#d4a017] font-semibold text-sm uppercase tracking-widest">
                  President's Message
                </p>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-serif leading-tight mb-6"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                A Welcome Address from the National President
              </h2>

              {/* Pull quote */}
              <div className="relative pl-5 border-l-4 border-[#EBD279] mb-6">
                <Quote className="absolute -top-1 -left-1 w-4 h-4 text-[#d4a017]" />
                <p className="text-gray-500 italic text-lg leading-relaxed">
                  "Retirement from active competition does not mean retirement from impact."
                </p>
              </div>

              <p className="text-gray-600 leading-relaxed mb-3">
                On behalf of the Board of Trustees, the National Executive Council, and the entire membership
                of RENISA, I am delighted to extend a warm welcome to you athletes, supporters, partners,
                and friends who share in our collective passion for Nigerian sports excellence.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                RENISA was founded on the belief that those who gave their youth, health, and talent to
                represent Nigeria on the world stage deserve to be celebrated and remembered long after their
                active careers have ended…
              </p>

              <Link href="/welcome-address">
                <button className="bg-[#0d4a25] hover:bg-[#1a6b3a] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors flex items-center gap-2 shadow-md">
                  Read Full Address <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          NATIONAL EXECUTIVE COUNCIL — New premium style
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a3a1c 0%, #1a6b3a 50%, #0a3a1c 100%)' }}
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full border border-[#EBD279]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full border border-[#EBD279]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#EBD279]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#EBD279]" />
              <Image src="/logo.png" alt="RENISA" width={56} height={56} className="opacity-90" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#EBD279]" />
            </div>
            <p className="text-[#EBD279] font-semibold text-xs uppercase tracking-[0.3em] mb-3">
              Leadership
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              National Executive Council
            </h2>
            <p className="text-white/55 max-w-lg mx-auto text-base">
              Distinguished retired athletes steering RENISA with integrity, vision and dedication.
            </p>
          </div>

          {/* Executive grid — shows ALL executives */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 lg:gap-12">
            {displayExecutives.map((exec, i) => (
              <div key={exec.id} className="group text-center">
                {/* Photo ring */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-4">
                  {/* Animated outer ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#EBD279]/30 group-hover:border-[#EBD279] group-hover:scale-110 transition-all duration-500" />
                  {/* Inner ring */}
                  <div className="absolute inset-1.5 rounded-full border border-[#EBD279]/15 group-hover:border-[#EBD279]/40 transition-all duration-500" />
                  {/* Photo */}
                  {exec.photo ? (
                    <img
                      src={exec.photo.startsWith('http') ? exec.photo : buildImageUrl(exec.photo)}
                      alt={exec.name}
                      className="w-full h-full rounded-full object-cover p-2"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#1a6b3a] border-2 border-[#EBD279]/30 flex items-center justify-center p-2">
                      <span className="text-[#EBD279] text-3xl font-bold">{exec.name[0]}</span>
                    </div>
                  )}
                  {/* President crown badge */}
                  {i === 0 && (
                    <div className="absolute -top-1 -right-1 w-9 h-9 bg-[#EBD279] rounded-full flex items-center justify-center shadow-xl border-2 border-[#0d4a25]">
                      <Trophy className="w-4 h-4 text-[#0d4a25]" />
                    </div>
                  )}
                  {/* Medal badge for VP */}
                  {i === 1 && (
                    <div className="absolute -top-1 -right-1 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shadow-xl border-2 border-[#EBD279]/40">
                      <Medal className="w-4 h-4 text-[#EBD279]" />
                    </div>
                  )}
                </div>

                {/* Animated gold line */}
                <div className="w-8 h-0.5 bg-[#EBD279]/40 mx-auto mb-3 group-hover:w-16 group-hover:bg-[#EBD279] transition-all duration-400" />

                {/* Name & role */}
                <h3 className="text-white font-semibold text-sm leading-snug px-1">{exec.name}</h3>
                <p className="text-[#EBD279] text-xs font-medium mt-1.5 uppercase tracking-wide">{exec.position}</p>
                {exec.sport && (
                  <p className="text-white/35 text-xs mt-0.5">{exec.sport}</p>
                )}
              </div>
            ))}
          </div>

          {/* Footer link */}
          <div className="text-center mt-14">
            <Link href="/executives">
              <button className="border border-[#EBD279]/50 hover:border-[#EBD279] text-[#EBD279] hover:bg-[#EBD279]/10 font-medium px-8 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 mx-auto text-sm">
                View Full Leadership Directory <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          EVENTS & NEWS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-[#EBD279]" />
                <p className="text-[#d4a017] font-semibold text-xs uppercase tracking-widest">Latest Updates</p>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Events &amp; News
              </h2>
            </div>
            <Link href="/events" className="text-[#1a6b3a] hover:text-[#0d4a25] font-medium text-sm flex items-center gap-1 hidden sm:flex">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {displayEvents.map((event: any) => (
              <Link key={event.id} href={event.slug && event.slug !== '#' ? `/events/${event.slug}` : '/events'}>
                <div className="group rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white h-full">
                  <div className="relative overflow-hidden h-52">
                    {event.coverImage ? (
                      <img
                        src={event.coverImage.startsWith('http') ? event.coverImage : buildImageUrl(event.coverImage)}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-white/30" />
                      </div>
                    )}
                    {/* Gold top stripe */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#EBD279] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#0d4a25]/90 backdrop-blur-sm text-[#EBD279] text-xs font-semibold px-3 py-1 rounded-full capitalize">
                        {event.eventType}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 border-t-2 border-transparent group-hover:border-[#EBD279] transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#0d4a25] transition-colors line-clamp-2 text-base">
                      {event.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{event.excerpt}</p>
                    {event.eventDate && (
                      <div className="flex items-center gap-1.5 mt-3 text-gray-400 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(event.eventDate)}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PHOTO GALLERY
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-[#EBD279]" />
                <p className="text-[#d4a017] font-semibold text-xs uppercase tracking-widest">Memories</p>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Photo Gallery
              </h2>
            </div>
            <Link href="/gallery" className="text-[#1a6b3a] hover:text-[#0d4a25] font-medium text-sm flex items-center gap-1 hidden sm:flex">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Masonry-style grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {displayGallery.map((item:any, i:number) => (
              <Link key={item.id} href="/gallery">
                <div className={`rounded-xl overflow-hidden bg-gray-100 cursor-pointer group ${i === 0 ? 'md:row-span-2' : ''}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.title}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${i === 0 ? 'h-56 md:h-full md:min-h-[22rem]' : 'h-44 sm:h-52'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white text-xs font-semibold">{item.title}</span>
                    </div>
                    {/* Gold corner accent on hover */}
                    <div className="absolute top-0 left-0 w-8 h-0.5 bg-[#EBD279] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-0 left-0 h-8 w-0.5 bg-[#EBD279] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          AWARD RECIPIENTS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-[#EBD279]" />
                <p className="text-[#d4a017] font-semibold text-xs uppercase tracking-widest">Recognition</p>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Award Recipients
              </h2>
            </div>
            <Link href="/awardees" className="text-[#1a6b3a] hover:text-[#0d4a25] font-medium text-sm flex items-center gap-1 hidden sm:flex">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {displayAwards.map((award: any) => (
              <div key={award.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                {/* Gold top stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EBD279] to-[#d4a017]" />
                <div className="flex items-start gap-4 mb-5">
                  {award.recipientPhoto ? (
                    <img
                      src={award.recipientPhoto.startsWith('http') ? award.recipientPhoto : buildImageUrl(award.recipientPhoto)}
                      alt={award.recipientName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#EBD279] flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#0d4a25] flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-8 h-8 text-[#EBD279]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#0d4a25] transition-colors leading-snug">{award.title}</h3>
                    <p className="text-[#1a6b3a] text-sm font-semibold mt-1">{award.recipientName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="bg-[#EBD279]/20 text-[#8a6500] text-xs px-3 py-1 rounded-full font-semibold border border-[#EBD279]/40">
                    {award.category?.name || 'General'}
                  </span>
                  <span className="text-gray-400 text-xs font-medium">{award.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          QUOTE / TESTIMONIAL
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#0d4a25] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-6 left-10 w-40 h-40 rounded-full border-2 border-[#EBD279]" />
          <div className="absolute bottom-6 right-10 w-24 h-24 rounded-full border-2 border-[#EBD279]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Quote className="w-10 h-10 text-[#EBD279]/60" />
          </div>
          <blockquote className="text-white text-xl sm:text-2xl leading-relaxed mb-6 font-medium"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontStyle: 'italic' }}>
            Sport is not just a game. It is a language that unites us, a legacy that defines us,
            and a fire that never dies in the hearts of true champions.
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[#EBD279]/50" />
            <p className="text-[#EBD279] text-sm font-semibold tracking-wide">RENISA Founding Statement</p>
            <div className="h-px w-12 bg-[#EBD279]/50" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA — Join RENISA
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80&auto=format&fit=crop"
          alt="Sports event"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0d4a25]/88" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EBD279] via-[#d4a017] to-[#EBD279]" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Image src="/logo.png" alt="RENISA" width={80} height={80} className="mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Join the RENISA Family
          </h2>
          <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto">
            Connect alumni with mentors or coaches who can offer them guidance, advice, or feedback on their personal or professional goals, They can also help them expand their network.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/registration">
              <button className="bg-[#EBD279] hover:bg-[#d4a017] text-[#0d4a25] font-bold px-10 py-4 rounded-xl transition-all duration-200 text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                Register Now
              </button>
            </Link>
            <Link href="/about">
              <button className="border-2 border-white/40 hover:border-[#EBD279] text-white hover:text-[#EBD279] font-semibold px-10 py-4 rounded-xl transition-all duration-200 text-base">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
