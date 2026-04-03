'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Calendar, Newspaper, Bell, Loader2 } from 'lucide-react'
import { getAllEvents } from '@/lib/api_services/eventApiServices'
import { buildImageUrl, formatDate } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'
import { Badge } from '@/components/shared/Badge'
import { SAMPLE_EVENTS } from '@/lib/sampleData'

const eventTypes = [
  { value: '', label: 'All', icon: null },
  { value: 'news', label: 'News', icon: <Newspaper className="w-4 h-4" /> },
  { value: 'event', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
  { value: 'announcement', label: 'Announcements', icon: <Bell className="w-4 h-4" /> },
]

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState('')
  const sentinelRef = useRef<HTMLDivElement>(null)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['events', selectedType],
    queryFn: ({ pageParam = 1 }) =>
      getAllEvents({ eventType: selectedType || undefined, status: 'published' }),
    getNextPageParam: (lastPage:any) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  }) 

  const apiEvents = data?.pages.flatMap((p:any) => p.data) ?? []
  const events = apiEvents.length > 0 ? apiEvents : (selectedType === '' ? SAMPLE_EVENTS : [])
  const canLoadMore = true;//hasNextPage && apiEvents.length > 0

  // Auto-load when sentinel scrolls into view
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && canLoadMore && !isFetchingNextPage) fetchNextPage()
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [canLoadMore, isFetchingNextPage, fetchNextPage])

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
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200">
            {eventTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  selectedType === type.value
                    ? 'border-[#1a6b3a] text-[#1a6b3a]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <PageLoader />
          ) : events.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No items found</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Link key={event.id} href={`/events/${event.slug}`}>
                    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      {event.coverImage ? (
                        <div className="overflow-hidden">
                          <img
                            src={event.coverImage.startsWith('http') ? event.coverImage : buildImageUrl(event.coverImage)}
                            alt={event.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-[#1a6b3a] to-[#2d9a57] flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-white/30" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={event.eventType as string}>
                            {event.eventType}
                          </Badge>
                          {event.eventDate && (
                            <span className="text-gray-400 text-xs">{formatDate(event.eventDate)}</span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#1a6b3a] transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2">{event.excerpt}</p>
                        {event.venue && (
                          <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                            📍 {event.venue}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More button (shown when auto-scroll hasn't triggered) */}
              {canLoadMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="bg-[#1a6b3a] text-white px-8 py-3 rounded-lg hover:bg-[#0d4a25] transition-colors text-sm font-medium disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isFetchingNextPage ? 'Loading…' : 'Load More'}
                  </button>
                </div>
              )}

              {/* Sentinel for IntersectionObserver auto-loading */}
              <div ref={sentinelRef} className="h-4 mt-4" />

              {isFetchingNextPage && (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-[#1a6b3a]" />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
