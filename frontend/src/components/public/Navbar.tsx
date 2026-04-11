'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const leadershipLinks = [
  { label: 'Board of Trustees', href: '/leadership/board-of-trustees' },
  { label: 'National Executives', href: '/executives' },
  { label: 'State Executives', href: '/leadership/state-executives' },
  { label: 'Directorate', href: '/leadership/directorate' },
]

const mediaLinks = [
  { label: 'Gallery', href: '/gallery' },
  { label: 'Event', href: '/events' },
  { label: 'Awardees', href: '/awardees' },
  { label: 'Games', href: '#' }
]

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Media', href: '/gallery', children: mediaLinks },
  { label: 'Leadership', href: '/leadership', children: leadershipLinks },
  { label: 'Donation', href: '/donation' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileOpenSection, setMobileOpenSection] = useState<string | null>(null)
  // desktop open dropdown (click-based so touch works)
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close desktop dropdown on outside click/touch
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDesktopOpen(null)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setDesktopOpen(null)
    setMobileOpen(false)
    setMobileOpenSection(null)
  }, [pathname])

  return (
    <nav className="sticky top-0 z-50" ref={navRef}>
      {/* Gold top accent line */}
      <div className="h-1 bg-gradient-to-r from-[#EBD279] via-[#d4a017] to-[#EBD279]" />

      {/* Main nav bar */}
      <div
        className={cn(
          'bg-[#0d4a25] transition-shadow',
          scrolled && 'shadow-xl shadow-black/30'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="">
                <img
                  src="/logo.png"
                  alt="RENISA Logo"
                  className="object-contain w-14 h-14 rounded-full"
                />
              </div>
              <div className="leading-none">
                <span className="text-white font-bold text-lg tracking-wide block"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  RENISA
                </span>
                <span className="text-[#EBD279]/70 text-[9px] uppercase tracking-[0.2em] font-medium">
                  Retired Nigerian Women &amp; Men Sports Association
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative">
                    <button
                      type="button"
                      onClick={() => setDesktopOpen(desktopOpen === link.label ? null : link.label)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors',
                        pathname.startsWith(link.href) && 'bg-white/10 text-white'
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', desktopOpen === link.label && 'rotate-180')} />
                    </button>
                    {desktopOpen === link.label && (
                      <div className="absolute top-full left-0 z-50 w-52 pt-2">
                        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                          <div className="h-0.5 bg-gradient-to-r from-[#EBD279] to-[#d4a017]" />
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#0d4a25]/5 hover:text-[#0d4a25] transition-colors',
                                pathname === child.href && 'bg-[#0d4a25]/5 text-[#0d4a25] font-semibold'
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors relative',
                      pathname === link.href && 'text-white'
                    )}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-[#EBD279] rounded-full" />
                    )}
                  </Link>
                )
              )}
            </div>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-2">
              <Link href="/registration" className="hidden sm:block">
                <button className="bg-[#EBD279] hover:bg-[#d4a017] text-[#0d4a25] text-sm font-bold px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                  Register
                </button>
              </Link>
              <Link href="/login" className="hidden sm:block">
                <button className="border border-white/30 hover:border-[#EBD279]/60 text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200">
                  Login
                </button>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen((o) => !o)
                  setMobileOpenSection(null)
                }}
                className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0a3a1c] border-t border-[#EBD279]/20">
          <div className="px-4 py-3 space-y-0.5 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileOpenSection((prev) => (prev === link.label ? null : link.label))
                    }
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform duration-200',
                        mobileOpenSection === link.label && 'rotate-180'
                      )}
                    />
                  </button>
                  {mobileOpenSection === link.label && (
                    <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-[#EBD279]/30 pl-3 mb-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => {
                            setMobileOpen(false)
                            setMobileOpenSection(null)
                          }}
                          className="block px-3 py-2 text-sm text-white/70 hover:text-[#EBD279] rounded-lg hover:bg-white/5 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 text-sm text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors',
                    pathname === link.href && 'text-[#EBD279] bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 pb-1 border-t border-white/10 flex gap-2">
              <Link href="/registration" onClick={() => setMobileOpen(false)} className="flex-1">
                <button className="w-full bg-[#EBD279] hover:bg-[#d4a017] text-[#0d4a25] text-sm font-bold px-4 py-2.5 rounded-lg transition-colors">
                  Register
                </button>
              </Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                <button className="w-full border border-white/30 text-white/80 text-sm font-medium px-4 py-2.5 rounded-lg hover:border-[#EBD279]/60 transition-colors">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
