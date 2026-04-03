'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar, MapPin, ArrowLeft, Share2, MessageSquare, Send, User } from 'lucide-react'
import Link from 'next/link'
import { getEvent } from '@/lib/api_services/eventApiServices'
import { buildImageUrl, formatDate } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'
import { Badge } from '@/components/shared/Badge'
import { SAMPLE_EVENTS } from '@/lib/sampleData'
import toast from 'react-hot-toast'

interface Comment {
  id: string
  name: string
  message: string
  date: string
}

const DEMO_COMMENTS: Comment[] = [
  { id: 'c1', name: 'Emeka Okafor', message: 'This is a wonderful initiative by RENISA. Looking forward to attending!', date: 'March 10, 2025' },
  { id: 'c2', name: 'Fatima Bello', message: 'Great news! Please can you share more details about registration?', date: 'March 8, 2025' },
]

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const [comments, setComments] = useState<Comment[]>(DEMO_COMMENTS)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const { data: apiEvent, isLoading } = useQuery({
    queryKey: ['event', params.slug],
    queryFn: () => getEvent(params.slug),
  })

  const event = apiEvent ?? (SAMPLE_EVENTS.find((e) => e.slug === params.slug) ?? SAMPLE_EVENTS[0]) as any

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      toast.error('Please enter your name and comment')
      return
    }
    setComments((prev) => [
      {
        id: Date.now().toString(),
        name: name.trim(),
        message: message.trim(),
        date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }),
      },
      ...prev,
    ])
    setMessage('')
    toast.success('Comment posted!')
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="bg-white min-h-screen">
      {/* Cover */}
      {event.coverImage && (
        <div className="relative h-72 md:h-96 bg-gray-900">
          <img
            src={event.coverImage?.startsWith('http') ? event.coverImage : buildImageUrl(event.coverImage)}
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
            onClick={handleShare}
            className="flex items-center gap-2 text-gray-500 hover:text-[#1a6b3a] text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Badge variant={event.eventType}>{event.eventType}</Badge>
          {event.eventDate && (
            <span className="flex items-center gap-1.5 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(event.eventDate, 'dd MMMM yyyy')}
            </span>
          )}
          {event.venue && (
            <span className="flex items-center gap-1.5 text-gray-500 text-sm">
              <MapPin className="w-4 h-4" />
              {event.venue}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif leading-tight mb-6">
          {event.title}
        </h1>

        {event.excerpt && (
          <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-[#d4a017] pl-4 italic">
            {event.excerpt}
          </p>
        )}

        <div
          className="rich-text prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: event.content }}
        />

        <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-400">
          Published {formatDate(event.createdAt, 'dd MMMM yyyy')}
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 font-serif mb-6">
            <MessageSquare className="w-5 h-5 text-[#1a6b3a]" />
            Comments ({comments.length})
          </h2>

          {/* Comment form */}
          <form onSubmit={handleComment} className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-4">Leave a comment</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3a]/30 focus:border-[#1a6b3a]"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Comment</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts…"
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3a]/30 focus:border-[#1a6b3a] resize-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#1a6b3a] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0d4a25] transition-colors"
            >
              <Send className="w-4 h-4" />
              Post Comment
            </button>
          </form>

          {/* Comment list */}
          <div className="space-y-5">
            {comments.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#1a6b3a]/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-[#1a6b3a]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{c.name}</span>
                      <span className="text-gray-400 text-xs">{c.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{c.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
