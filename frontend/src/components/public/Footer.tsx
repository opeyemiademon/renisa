'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getSiteContent } from '@/lib/api_services/siteContentApiServices'

export function Footer() {
  const year = new Date().getFullYear()

  const { data: contactContent } = useQuery({
    queryKey: ['site-content', 'contact'],
    queryFn: () => getSiteContent('contact'),
    staleTime: 300_000,
  })

  const { data: socialContent } = useQuery({
    queryKey: ['site-content', 'social'],
    queryFn: () => getSiteContent('social'),
    staleTime: 300_000,
  })

  const contactMeta = (contactContent as any)?.metadata || {}
  const socialMeta = (socialContent as any)?.metadata || {}

  const address = contactMeta.address || 'National Sports Commission Complex, Surulere, Lagos, Nigeria'
  const phone = contactMeta.phone || '+234 800 000 0000'
  const email = contactMeta.email || 'info@renisa.org.ng'

  const socialLinks = [
    { Icon: Facebook, href: socialMeta.facebook, label: 'Facebook' },
    { Icon: Twitter, href: socialMeta.twitter, label: 'Twitter/X' },
    { Icon: Instagram, href: socialMeta.instagram, label: 'Instagram' },
    { Icon: Youtube, href: socialMeta.youtube, label: 'YouTube' },
    { Icon: Linkedin, href: socialMeta.linkedin, label: 'LinkedIn' },
  ].filter((s) => s.href)

  return (
    <footer className="bg-[#0d4a25] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="">
                <img
                  src="/logo.png"
                  alt="RENISA Logo"
                  className=" object-contain w-14 h-14 rounded-full"
                />
              </div>
              <div className="leading-none">
                <span className="text-white font-bold text-xl font-serif block">RENISA</span>
                <span className="text-[#EBD279]/60 text-[9px] uppercase tracking-[0.15em]">
                 Retired Nigerian Women & Men Sports Association</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              The Association of Retired Nigerian Sports Men &amp; Women (RENISA) is dedicated to
              celebrating the legacy of Nigerian sports excellence and supporting our retired
              athletes.
            </p>
            {socialLinks.length > 0 ? (
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#d4a017] flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <span
                    key={i}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-40"
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#d4a017] font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'About RENISA', href: '/about' },
                { label: 'Events & News', href: '/events' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Our Executives', href: '/executives' },
                { label: 'Leadership', href: '/leadership' },
                { label: 'Awardees', href: '/awardees' },
                { label: 'Donate', href: '/donation' }
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#d4a017] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#d4a017] font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Information
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-[#d4a017] mt-0.5 shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="w-4 h-4 text-[#d4a017] shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="w-4 h-4 text-[#d4a017] shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[#d4a017] font-medium text-sm mb-1">Office Hours</p>
              <p className="text-white/60 text-xs">Monday – Friday: 9:00 AM – 5:00 PM</p>
              <p className="text-white/60 text-xs">Saturday: 10:00 AM – 2:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs">
            &copy; {year} RENISA — Association of Retired Nigerian Sports Men &amp; Women. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/contact" className="text-white/50 hover:text-white/80 text-xs transition-colors">
              Contact Us
            </Link>

            <Link href="/privacy" className="text-white/50 hover:text-white/80 text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/50 hover:text-white/80 text-xs transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
