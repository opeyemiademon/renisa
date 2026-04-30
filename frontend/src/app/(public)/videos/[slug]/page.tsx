'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Film, Eye, Calendar } from 'lucide-react'
import Link from 'next/link'
import { getVideoBySlug, getAllVideos } from '@/lib/api_services/videoApiServices'
import { PageLoader } from '@/components/shared/Spinner'
import { formatDate } from '@/lib/utils'
import type { Video } from '@/types'

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  return match ? match[1] : null
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match ? match[1] : null
}

function VideoPlayer({ url }: { url: string }) {
  const ytId = extractYoutubeId(url)
  const vimeoId = extractVimeoId(url)

  if (ytId) {
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-xl">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    )
  }

  if (vimeoId) {
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-xl">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
        />
      </div>
    )
  }

  return (
    <div className="aspect-video w-full rounded-xl bg-gray-100 flex flex-col items-center justify-center gap-3 border border-gray-200">
      <Film className="w-12 h-12 text-gray-300" />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#1a6b3a] text-sm font-medium hover:underline"
      >
        Open video link
      </a>
    </div>
  )
}

function RelatedCard({ video }: { video: Video }) {
  const thumb = video.thumbnailUrl || (extractYoutubeId(video.videoUrl) ? `https://img.youtube.com/vi/${extractYoutubeId(video.videoUrl)}/mqdefault.jpg` : null)
  return (
    <Link href={`/videos/${video.slug}`}>
      <div className="group flex gap-3 items-start hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
        <div className="w-28 h-16 rounded-lg overflow-hidden bg-gray-900 shrink-0 relative">
          {thumb ? (
            <img src={thumb} alt={video.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-5 h-5 text-white/40" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 group-hover:text-[#1a6b3a] transition-colors line-clamp-2">{video.title}</p>
          {video.category && (
            <p className="text-xs text-gray-400 mt-0.5 capitalize">{video.category}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  const { data: video, isLoading } = useQuery({
    queryKey: ['public-video', slug],
    queryFn: () => getVideoBySlug(slug),
    staleTime: 60_000,
  })

  const { data: allVideos = [] } = useQuery({
    queryKey: ['public-videos'],
    queryFn: () => getAllVideos({ status: 'published' }),
    staleTime: 60_000,
  })

  const related = allVideos
    .filter((v) => v.slug !== slug && v.status === 'published')
    .slice(0, 6)

  if (isLoading) return <PageLoader />

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Film className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Video not found</p>
          <Link href="/videos" className="text-[#1a6b3a] text-sm mt-2 inline-block hover:underline">
            Back to Videos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Dark header strip */}
      <div className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/videos" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Videos
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          {/* Main content */}
          <div className="min-w-0">
            <VideoPlayer url={video.videoUrl} />

            <div className="mt-6">
              {video.category && (
                <span className="text-xs font-semibold text-[#1a6b3a] uppercase tracking-wide">{video.category}</span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mt-1">{video.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {video.views.toLocaleString()} views
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(video.publishedAt || video.createdAt)}
                </span>
              </div>

              {video.description && (
                <div className="mt-6 text-gray-600 leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-6">
                  {video.description}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar — related videos */}
          {related.length > 0 && (
            <aside className="mt-10 lg:mt-0 lg:sticky lg:top-24 self-start">
              <h2 className="text-base font-bold text-gray-900 mb-4">More Videos</h2>
              <div className="space-y-2">
                {related.map((v) => <RelatedCard key={v.id} video={v} />)}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
