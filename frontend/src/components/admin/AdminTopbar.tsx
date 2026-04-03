'use client'

import { useState } from 'react'
import { Bell, Search, Menu, ChevronDown, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { logout } from '@/lib/store/authSlice'
import { toggleSidebar } from '@/lib/store/appSlice'
import { useRouter } from 'next/navigation'
import { getInitials } from '@/lib/utils'

const routeTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/members': 'Members',
  '/admin/members/add': 'Add Member',
  '/admin/member-codes': 'Member Codes',
  '/admin/payments': 'Payments',
  '/admin/payments/payment-types': 'Payment Types',
  '/admin/elections': 'Elections',
  '/admin/elections/create': 'Create Election',
  '/admin/executives': 'Executives',
  '/admin/leadership': 'Leadership',
  '/admin/awards': 'Awards',
  '/admin/awards/categories': 'Award Categories',
  '/admin/id-card-settings': 'ID Card Settings',
  '/admin/id-card-requests': 'ID Card Requests',
  '/admin/events': 'Events',
  '/admin/events/create': 'Create Event',
  '/admin/gallery': 'Gallery',
  '/admin/website': 'Website Content',
  '/admin/communications': 'Communications',
  '/admin/donations': 'Donations',
  '/admin/donations/types': 'Donation Types',
  '/admin/settings': 'Settings',
}

export function AdminTopbar() {
  const { adminUser } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const [showDropdown, setShowDropdown] = useState(false)

  const title = Object.entries(routeTitles).find(([path]) => pathname === path)?.[1] ||
    Object.entries(routeTitles).find(([path]) => pathname.startsWith(path + '/'))?.[1] ||
    'Admin Portal'

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 sticky top-0 z-30 shadow-sm">
      <button onClick={() => dispatch(toggleSidebar())} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title="Toggle sidebar">
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-semibold text-gray-900 flex-1">{title}</h1>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-64">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search members..."
          className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
        />
      </div>

      <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 relative">
        <Bell className="w-5 h-5" />
        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#d4a017] rounded-full" />
      </button>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#1a6b3a] flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {adminUser ? getInitials(adminUser.username) : 'A'}
            </span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-900 leading-none">{adminUser?.username}</p>
            <p className="text-xs text-gray-400 capitalize mt-0.5">{adminUser?.role}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
            <Link href="/admin/settings" onClick={() => setShowDropdown(false)}>
              <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <User className="w-4 h-4" />
                Profile & Settings
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
