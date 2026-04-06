'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Calendar, X } from 'lucide-react'
import { getAllEvents } from '@/lib/api_services/eventApiServices'
import { buildImageUrl, formatDate } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import type { Event } from '@/types'

const PAGE_SIZE = 9

/** Reject epoch / bad API values so the month sidebar never shows 1970. */
const MIN_POSTED_MS = Date.UTC(1990, 0, 1)

function archiveMonthLabel(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  if (!y || !m) return ym
  return new Date(y, m - 1, 15).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

function rawToPostedMs(raw: unknown): number | null {
  if (raw == null) return null
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw >= MIN_POSTED_MS ? raw : null
  }
  const str = String(raw).trim()
  if (!str) return null
  const t = /^\d+$/.test(str) ? Number(str) : Date.parse(str)
  if (!Number.isFinite(t) || t < MIN_POSTED_MS) return null
  return t
}

/** Prefer publishedAt, then createdAt, then updatedAt. */
function postedAtMs(e: Event): number | null {
  for (const raw of [e.publishedAt, e.createdAt, e.updatedAt]) {
    const t = rawToPostedMs(raw as unknown)
    if (t != null) return t
  }
  return null
}

function yearMonthLocalKey(ms: number): string {
  const d = new Date(ms)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function yearMonthKeyForEvent(e: Event): string | null {
  const ms = postedAtMs(e)
  return ms == null ? null : yearMonthLocalKey(ms)
}

function isPublishedNews(e: Event): boolean {
  if (e.status !== 'published') return false
  const t = e.eventType || 'news'
  return t === 'news'
}

function EventCard({ event }: { event: Event }) {
  const eventType = event.eventType || 'news'
  const postedMs = postedAtMs(event)
  return (
    <Link href={`/events/${event.slug}`}>
      <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {event.coverImage ? (
          <div className="overflow-hidden">
            <img
              src={event.coverImage.startsWith('http') ? event.coverImage : buildImageUrl(event.coverImage)}
              alt={event.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-[#1a6b3a] to-[#2d9a57] flex items-center justify-center shrink-0">
            <Calendar className="w-12 h-12 text-white/30" />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <Badge variant={eventType}>{eventType}</Badge>
            {postedMs != null && (
              <span className="text-gray-500 text-xs whitespace-nowrap">Posted {formatDate(postedMs)}</span>
            )}
          </div>
          {event.eventDate && (
            <p className="text-gray-400 text-xs mb-2">Event date: {formatDate(event.eventDate)}</p>
          )}
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#1a6b3a] transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2">{event.excerpt}</p>
          {event.venue && (
            <p className="text-gray-400 text-xs flex items-center gap-1 mt-auto pt-2">📍 {event.venue}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function EventsPage() {
  const [monthYear, setMonthYear] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const { data: rawEvents, isLoading } = useQuery({
    queryKey: ['public-events'],
    queryFn: () => getAllEvents(),
    staleTime: 60_000,
  })

  const publishedSorted = useMemo(() => {
    const list = (rawEvents || []).filter((e) => e.status === 'published')
    return [...list].sort((a, b) => {
      const ta = postedAtMs(a)
      const tb = postedAtMs(b)
      if (ta == null && tb == null) return 0
      if (ta == null) return 1
      if (tb == null) return -1
      return tb - ta
    })
  }, [rawEvents])

  const archiveMonths = useMemo(() => {
    const months = new Set<string>()
    for (const e of publishedSorted) {
      if (!isPublishedNews(e)) continue
      const key = yearMonthKeyForEvent(e)
      if (key) months.add(key)
    }
    return Array.from(months).sort((a, b) => b.localeCompare(a))
  }, [publishedSorted])

  const filtered = useMemo(() => {
    if (!monthYear) return publishedSorted
    return publishedSorted.filter((e) => {
      if (!isPublishedNews(e)) return false
      return yearMonthKeyForEvent(e) === monthYear
    })
  }, [publishedSorted, monthYear])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [monthYear])

  const visibleEvents = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  )
  const hasMore = visibleCount < filtered.length

  const archiveList =
    archiveMonths.length === 0 ? (
      <p className="text-xs text-gray-400">No news archive yet.</p>
    ) : (
      <ul className="space-y-1 max-h-64 overflow-y-auto">
        {archiveMonths.map((ym) => (
          <li key={ym}>
            <button
              type="button"
              onClick={() => setMonthYear(ym)}
              className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                monthYear === ym ? 'bg-[#1a6b3a] text-white' : 'text-gray-700 hover:bg-white'
              }`}
            >
              {archiveMonthLabel(ym)}
            </button>
          </li>
        ))}
      </ul>
    )

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">Stay Updated</p>
          <h1 className="text-4xl font-bold text-white font-serif">Events &amp; News</h1>
          <p className="text-white/80 mt-3">Latest happenings in the RENISA community</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_260px]">
            <div className="min-w-0 order-2 lg:order-1">
              {monthYear && (
                <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-[#1a6b3a]/20 bg-[#1a6b3a]/5 px-4 py-3">
                  <span className="text-sm text-gray-700">
                    Showing <strong>news</strong> from <strong>{archiveMonthLabel(monthYear)}</strong>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => setMonthYear(null)}
                  >
                    <X className="w-3.5 h-3.5" />
                    Show all
                  </Button>
                </div>
              )}

              {isLoading ? (
                <PageLoader />
              ) : visibleEvents.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No published items found</p>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {visibleEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="mt-10 flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                        className="min-w-[200px]"
                      >
                        Load more
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            <aside className="order-1 lg:order-2 mb-8 lg:mb-0 lg:sticky lg:top-24 self-start">
              <div className="hidden lg:block rounded-xl border border-gray-200 bg-gray-50/80 p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">News by month</h2>
                <p className="text-xs text-gray-500 mb-3">Jump to published news posts from a specific month.</p>
                {archiveList}
              </div>
              <details className="lg:hidden rounded-xl border border-gray-200 bg-gray-50/80 open:bg-white">
                <summary className="px-4 py-3 text-sm font-semibold text-gray-900 cursor-pointer list-none">
                  News by month
                </summary>
                <div className="px-4 pb-4 pt-0">{archiveList}</div>
              </details>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
