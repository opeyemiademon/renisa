'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, ZoomIn, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { getGallery, getGalleryAlbums, getGalleryYears } from '@/lib/api_services/galleryApiServices'
import { buildImageUrl } from '@/lib/utils'
import { PageLoader } from '@/components/shared/Spinner'
import { GalleryItem } from '@/types'

export default function GalleryPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<number | undefined>()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const { data: albums } = useQuery({ queryKey: ['gallery-albums'], queryFn: getGalleryAlbums })
  const { data: apiYears } = useQuery({ queryKey: ['gallery-years'], queryFn: getGalleryYears })
  
  const { data: galleryData, isLoading } = useQuery({
    queryKey: ['gallery', selectedAlbum, selectedYear],
    queryFn: () => getGallery({ albumName: selectedAlbum || undefined, year: selectedYear}),
  })

  const apiItems = Array.isArray(galleryData) ? galleryData : []
  const items: GalleryItem[] = apiItems

  // Derive years from items when API has none
  const years: number[] = apiYears && apiYears.length > 0
    ? apiYears
    : Array.from(new Set(items.map((i) => i.year).filter(Boolean))).sort((a, b) => b - a)

  // Group items by year for display
  const groupedByYear = selectedYear
    ? { [selectedYear]: items }
    : items.reduce<Record<number, GalleryItem[]>>((acc, item) => {
        const yr = item.year ?? 0
        if (!acc[yr]) acc[yr] = []
        acc[yr].push(item)
        return acc
      }, {})
  const sortedYears = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a)

  // Lightbox helpers
  const lightboxItem = lightboxIndex !== null ? items[lightboxIndex] : null
  const goPrev = useCallback(() => setLightboxIndex((i) => (i !== null ? (i - 1 + items.length) % items.length : null)), [items.length])
  const goNext = useCallback(() => setLightboxIndex((i) => (i !== null ? (i + 1) % items.length : null)), [items.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'Escape') setLightboxIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, goPrev, goNext])

  const imgSrc = (url: string) => url.startsWith('http') ? url : buildImageUrl(url)

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">Memories</p>
          <h1 className="text-4xl font-bold text-white font-serif">Photo Gallery</h1>
          <p className="text-white/80 mt-3">Capturing moments of excellence and camaraderie</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Year filter pills */}
          {years.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Filter by Year</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedYear(undefined)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    !selectedYear ? 'bg-[#0d4a25] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Years
                </button>
                {years.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedYear === yr ? 'bg-[#0d4a25] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Album filter pills */}
          {albums && albums.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Filter by Album</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedAlbum('')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedAlbum === '' ? 'bg-[#1a6b3a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Albums
                </button>
                {albums.map((album) => (
                  <button
                    key={album}
                    onClick={() => setSelectedAlbum(album)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedAlbum === album ? 'bg-[#1a6b3a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {album}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <PageLoader />
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No photos found</p>
            </div>
          ) : (
            <>
              {sortedYears.map((yr) => (
                <div key={yr} className="mb-12">
                  {/* Year heading */}
                  {!selectedYear && (
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-px flex-1 bg-gray-200" />
                      <span className="bg-[#0d4a25] text-white text-sm font-bold px-4 py-1 rounded-full">
                        {yr || 'Unknown'}
                      </span>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {groupedByYear[yr].map((item) => {
                      const globalIdx = items.indexOf(item)
                      return (
                        <div
                          key={item.id}
                          onClick={() => setLightboxIndex(globalIdx)}
                          className="relative group cursor-pointer rounded-xl overflow-hidden bg-gray-100 aspect-square"
                        >
                          <img
                            src={imgSrc(item.imageUrl)}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-medium truncate">{item.title}</p>
                            <p className="text-white/70 text-xs">{item.albumName}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxItem && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="w-7 h-7" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIndex + 1} / {items.length}
          </div>

          {/* Prev */}
          <button
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next */}
          <button
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); goNext() }}
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image */}
          <div onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full">
            <img
              src={imgSrc(lightboxItem.imageUrl)}
              alt={lightboxItem.title}
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="text-white font-medium">{lightboxItem.title}</p>
              <p className="text-gray-400 text-sm">{lightboxItem.albumName} &bull; {lightboxItem.year}</p>
              {lightboxItem.description && (
                <p className="text-gray-300 text-sm mt-1">{lightboxItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
