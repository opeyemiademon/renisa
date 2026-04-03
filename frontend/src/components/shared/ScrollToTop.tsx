'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!visible) return null

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#0d4a25] hover:bg-[#1a6b3a] border border-[#EBD279]/40 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  )
}
