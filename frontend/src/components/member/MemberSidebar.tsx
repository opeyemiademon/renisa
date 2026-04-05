'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, User, CreditCard, Vote, IdCard, Award, LogOut, Bell, LifeBuoy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { logout } from '@/lib/store/authSlice'
import { buildImageUrl, getInitials } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/member/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', href: '/member/profile', icon: User },
  { label: 'Payments', href: '/member/payments', icon: CreditCard },
  { label: 'Elections', href: '/member/elections', icon: Vote },
  { label: 'ID Card', href: '/member/id-card', icon: IdCard },
  { label: 'Awards', href: '/member/awards', icon: Award },
  { label: 'Notifications', href: '/member/notifications', icon: Bell },
  { label: 'Support', href: '/member/tickets', icon: LifeBuoy },
]

export function MemberSidebar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { member } = useAppSelector((s) => s.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  return (
    <aside className="w-64 h-screen bg-[#1a6b3a] flex flex-col sticky top-0 shadow-xl">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
            <img src="/logo.png" alt="RENISA" width={40} height={40} className="object-contain w-14 h-14 rounded-full" />
          <div>
            <p className="text-white font-bold font-serif">RENISA</p>
            <p className="text-white/60 text-xs">Member Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                  isActive
                    ? 'bg-[#d4a017] text-white font-semibold shadow-sm'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-white/20 shrink-0">
            {member?.profilePicture ? (
              <img src={buildImageUrl(member.profilePicture)} alt={member.firstName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {member ? getInitials(`${member.firstName} ${member.lastName}`) : 'M'}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {member ? `${member.firstName} ${member.lastName}` : 'Member'}
            </p>
            <p className="text-white/60 text-xs truncate">{member?.memberNumber}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
