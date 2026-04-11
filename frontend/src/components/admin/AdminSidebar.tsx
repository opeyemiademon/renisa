'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import NextImage from 'next/image'
import {
  LayoutDashboard, Users, UserPlus, Hash, GraduationCap,
  CreditCard, ListChecks, Vote, Crown, Network, Trophy, Heart,
  IdCard, Settings, Calendar, Image, FileText, MessageSquare, Mail,
  ChevronDown, LogOut, Banknote, Gift, UserCog, Medal, Bell, LifeBuoy
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { logout } from '@/lib/store/authSlice'
import { setSidebarOpen } from '@/lib/store/appSlice'
import { getInitials } from '@/lib/utils'

interface NavItem {
  label: string
  href?: string
  icon: React.ElementType
  children?: NavItem[]
  ignorePathPrefixes?: string[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  {
    label: 'Membership',
    icon: Users,
    children: [
      { label: 'All Members', href: '/admin/members', icon: Users, ignorePathPrefixes: ['/admin/members/add'] },
      { label: 'Add Member', href: '/admin/members/add', icon: UserPlus },
      { label: 'Member Codes', href: '/admin/member-codes', icon: Hash },
      /*  { label: 'Alumni', href: '/admin/alumni', icon: GraduationCap }, */
    ],
  },
  {
    label: 'Finance',
    icon: CreditCard,
    children: [
      { label: 'Payments', href: '/admin/payments', icon: Banknote },
      { label: 'Payment Types', href: '/admin/payments/payment-types', icon: ListChecks },
    ],
  },
  { label: 'Elections', href: '/admin/elections', icon: Vote },
  {
    label: 'Association',
    icon: Crown,
    children: [
      { label: 'Executives', href: '/admin/executives', icon: Crown },
      { label: 'Leadership', href: '/admin/leadership', icon: Network },
      { label: 'Awards', href: '/admin/awards', icon: Trophy, ignorePathPrefixes: ['/admin/awards/categories', '/admin/awards/winners'] },
      { label: 'Award Categories', href: '/admin/awards/categories', icon: ListChecks },
      { label: 'Award Winners', href: '/admin/awards/winners', icon: Medal },
      { label: 'Donations', href: '/admin/donations', icon: Heart },
      { label: 'Donation Types', href: '/admin/donations/types', icon: Gift },
    ],
  },
  {
    label: 'ID Cards',
    icon: IdCard,
    children: [
      { label: 'Requests', href: '/admin/id-card-requests', icon: IdCard },
      { label: 'Settings', href: '/admin/id-card-settings', icon: Settings },
    ],
  },
  {
    label: 'Content',
    icon: FileText,
    children: [
      { label: 'Hero Slides', href: '/admin/hero-slides', icon: Image },
      { label: 'Events', href: '/admin/events', icon: Calendar },
      { label: 'Gallery', href: '/admin/gallery', icon: Image },
      { label: 'CMS', href: '/admin/website', icon: FileText },
    ],
  },
  { label: 'Communications', href: '/admin/communications', icon: MessageSquare },
  { label: 'Contact Messages', href: '/admin/contact-messages', icon: Mail },
  { label: 'Support Tickets', href: '/admin/tickets', icon: LifeBuoy },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  {
    label: 'System',
    icon: Settings,
    children: [
      { label: 'User Management', href: '/admin/users', icon: UserCog },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

function NavItemComponent({ item, depth = 0, siblingPrefixes = [] }: { item: NavItem; depth?: number; siblingPrefixes?: string[] }) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(() => {
    if (!item.children) return false
    return item.children.some((c) => c.href && pathname.startsWith(c.href))
  })

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      dispatch(setSidebarOpen(false))
    }
  }

  // A leaf item is active if the path matches exactly or starts with href+'/'.
  // Exclude if any sibling's href prefix matches (prevents parent bleeding into sibling sub-routes)
  // or if item has explicit ignorePathPrefixes.
  const isActive = item.href
    ? (pathname === item.href || pathname.startsWith(item.href + '/')) &&
      !siblingPrefixes.some((p) => pathname.startsWith(p)) &&
      !(item.ignorePathPrefixes?.some((p) => pathname.startsWith(p)))
    : false

  if (item.children) {
    const hasActiveChild = item.children.some((c) => c.href && pathname.startsWith(c.href))
    const childHrefs = item.children.map((c) => c.href).filter(Boolean) as string[]
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all',
            hasActiveChild ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'
          )}
        >
          <item.icon className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
        </button>
        {open && (
          <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
            {item.children.map((child, childIndex) => {
              // exclude siblings that are a path-prefix of this child's own href
              // (e.g. don't let /admin/awards block /admin/awards/categories)
              const siblings = childHrefs.filter(
                (h, i) => i !== childIndex && !child.href?.startsWith(h + '/')
              )
              return <NavItemComponent key={child.href} item={child} depth={depth + 1} siblingPrefixes={siblings} />
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link href={item.href!} onClick={handleNavClick}>
      <div
        className={cn(
          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
          isActive
            ? 'bg-[#d4a017] text-white font-semibold shadow-sm'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        )}
      >
        <item.icon className="w-4 h-4 shrink-0" />
        {item.label}
      </div>
    </Link>
  )
}

export function AdminSidebar() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { adminUser } = useAppSelector((s) => s.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push('/admin-login')
  }

  return (
    <aside className="w-64 h-screen bg-[#0d4a25] flex flex-col sticky top-0 shadow-2xl overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
      
            <img src="/logo.png" alt="RENISA" width={40} height={40} className="object-contain w-14 h-14 rounded-full" />
         
          <div>
            <p className="text-white font-bold font-serif text-base">RENISA</p>
            <p className="text-white/50 text-xs">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map((item, i) => (
          <NavItemComponent key={i} item={item} />
        ))}
      </nav>

      {/* Admin user */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-1.5">
          <div className="w-8 h-8 rounded-full bg-[#d4a017] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">
              {adminUser ? getInitials(adminUser.username) : 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{adminUser?.username || 'Admin'}</p>
            <p className="text-white/50 text-xs capitalize">{adminUser?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
