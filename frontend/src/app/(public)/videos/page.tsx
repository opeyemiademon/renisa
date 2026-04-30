'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Play, Film } from 'lucide-react'
import { getAllVideos, getVideoCategories } from '@/lib/api_services/videoApiServices'
import { PageLoader } from '@/components/shared/Spinner'
import { formatDate } from '@/lib/utils'
import type { Video } from '@/types'

function extractYoutubeThumbnail(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
  return null
}

function VideoCard({ video }: { video: Video }) {
  const thumb = video.thumbnailUrl || extractYoutubeThumbnail(video.videoUrl)
  return (
    <Link href={`/videos/${video.slug}`}>
      <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative overflow-hidden bg-gray-900">
          {thumb ? (
            <img
              src={thumb}
              alt={video.title}
              className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a]">
              <Film className="w-12 h-12 text-white/30" />
            </div>
          )}
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-[#d4a017] transition-colors">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>
          {video.isFeatured && (
            <span className="absolute top-2 left-2 bg-[#d4a017] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          {video.category && (
            <span className="text-xs font-medium text-[#1a6b3a] uppercase tracking-wide">{video.category}</span>
          )}
          <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-[#1a6b3a] transition-colors line-clamp-2">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{video.description}</p>
          )}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <span>{video.views.toLocaleString()} views</span>
            <span>{formatDate(video.publishedAt || video.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const { data: rawVideos, isLoading } = useQuery({
    queryKey: ['public-videos'],
    queryFn: () => getAllVideos({ status: 'published' }),
    staleTime: 60_000,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['video-categories'],
    queryFn: getVideoCategories,
    staleTime: 60_000,
  })

  const published = useMemo(() => {
    const list = (rawVideos || []).filter((v) => v.status === 'published')
    return [...list].sort((a, b) => {
      const ta = new Date(a.publishedAt || a.createdAt).getTime()
      const tb = new Date(b.publishedAt || b.createdAt).getTime()
      return tb - ta
    })
  }, [rawVideos])

  const featured = useMemo(() => published.filter((v) => v.isFeatured), [published])

  const filtered = useMemo(() => {
    if (!selectedCategory) return published
    return published.filter((v) => v.category === selectedCategory)
  }, [published, selectedCategory])

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">Media</p>
          <h1 className="text-4xl font-bold text-white font-serif">Videos</h1>
          <p className="text-white/80 mt-3">Watch highlights, events, and more from RENISA</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Featured videos */}
          {!selectedCategory && featured.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-serif mb-5">Featured Videos</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((v) => <VideoCard key={v.id} video={v} />)}
              </div>
            </div>
          )}

          {/* Category filter pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  !selectedCategory
                    ? 'bg-[#1a6b3a] text-white border-[#1a6b3a]'
                    : 'border-gray-300 text-gray-600 hover:border-[#1a6b3a] hover:text-[#1a6b3a]'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#1a6b3a] text-white border-[#1a6b3a]'
                      : 'border-gray-300 text-gray-600 hover:border-[#1a6b3a] hover:text-[#1a6b3a]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* All videos grid */}
          {isLoading ? (
            <PageLoader />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No videos available yet.</p>
            </div>
          ) : (
            <div>
              {selectedCategory && (
                <h2 className="text-xl font-bold text-gray-900 font-serif mb-5 capitalize">{selectedCategory} Videos</h2>
              )}
              {!selectedCategory && featured.length > 0 && (
                <h2 className="text-xl font-bold text-gray-900 font-serif mb-5">All Videos</h2>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((v) => <VideoCard key={v.id} video={v} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
