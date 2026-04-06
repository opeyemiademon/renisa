'use client'

import { useQuery } from '@tanstack/react-query'
import { Calendar, MapPin, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import { getEventBySlug } from '@/lib/api_services/eventApiServices'
import { buildImageUrl, formatDate } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'
import { Badge } from '@/components/shared/Badge'
import toast from 'react-hot-toast'

import { useParams } from 'next/navigation'

export default function EventDetailPage() {

  const params = useParams()
  const slug = params.slug as string
  const { data: event, isLoading } = useQuery({
    queryKey: ['event-by-slug', slug],
    queryFn: () => getEventBySlug(slug),
  })

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  if (isLoading) return <PageLoader />

  if (!event || event.status !== 'published') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">This article could not be found or is not published.</p>
          <Link href="/events" className="text-[#1a6b3a] font-medium hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const ev = event as typeof event & { eventType?: string; eventDate?: string; venue?: string }

  return (
    <div className="bg-white min-h-screen">
      {event.coverImage && (
        <div className="relative h-72 md:h-96 bg-gray-900">
          <img
            src={event.coverImage.startsWith('http') ? event.coverImage : buildImageUrl(event.coverImage)}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/events" className="flex items-center gap-2 text-[#1a6b3a] hover:text-[#0d4a25] text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1a6b3a] text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Badge variant={(ev.eventType || 'news') as string}>{ev.eventType || 'News'}</Badge>
          {ev.eventDate && (
            <span className="flex items-center gap-1.5 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(ev.eventDate)}
            </span>
          )}
          {ev.venue && (
            <span className="flex items-center gap-1.5 text-gray-500 text-sm">
              <MapPin className="w-4 h-4" />
              {ev.venue}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif leading-tight mb-6">{event.title}</h1>

        {event.excerpt && (
          <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-[#d4a017] pl-4 italic">{event.excerpt}</p>
        )}

        <div
          className="rich-text prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: event.content || '<p></p>' }}
        />

        <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-400">
          Published {formatDate(event.createdAt)}
        </div>
      </div>
    </div>
  )
}
