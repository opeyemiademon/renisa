'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Search, Menu, ChevronDown, User, LogOut, Users, CheckCheck } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { logout } from '@/lib/store/authSlice'
import { toggleSidebar } from '@/lib/store/appSlice'
import { getInitials, formatDate } from '@/lib/utils'
import { getAllMembers } from '@/lib/api_services/memberApiServices'
import { getNotifications, markNotificationRead, markAllNotificationsRead, Notification } from '@/lib/api_services/notificationApiServices'

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
  '/admin/notifications': 'Notifications',
  '/admin/settings': 'Settings',
}

const NOTIFICATION_ICONS: Record<string, string> = {
  new_member: '👤',
  new_payment: '💳',
  id_card_request: '🪪',
}

export function AdminTopbar() {
  const { adminUser } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const title = Object.entries(routeTitles).find(([path]) => pathname === path)?.[1] ||
    Object.entries(routeTitles).find(([path]) => pathname.startsWith(path + '/'))?.[1] ||
    'Admin Portal'

  // Member search
  const { data: searchResults = [] } = useQuery({
    queryKey: ['topbar-member-search', search],
    queryFn: () => getAllMembers({ search }),
    enabled: search.trim().length >= 2,
  })

  // Notifications
  const { data: notifData } = useQuery({
    queryKey: ['notifications-bell'],
    queryFn: () => getNotifications(10),
    refetchInterval: 30000,
  })

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications-bell'] }),
  })

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications-bell'] }),
  })

  const unreadCount = notifData?.unreadCount ?? 0
  const notifications = notifData?.notifications ?? []

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  const handleSelectMember = (id: string) => {
    setSearch('')
    setShowSearch(false)
    router.push(`/admin/members/${id}`)
  }

  const handleNotifClick = (n: Notification) => {
    if (!n.isRead) markReadMutation.mutate(n.id)
    setShowNotifications(false)
    if (n.type === 'new_member' && n.refId) router.push(`/admin/members/${n.refId}`)
    else if (n.type === 'new_payment') router.push('/admin/payments')
    else if (n.type === 'id_card_request') router.push('/admin/id-card-requests')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 sticky top-0 z-30 shadow-sm">
      <button onClick={() => dispatch(toggleSidebar())} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title="Toggle sidebar">
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-semibold text-gray-900 flex-1">{title}</h1>

      {/* Member Search */}
      <div ref={searchRef} className="hidden md:block relative">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-64 focus-within:border-[#1a6b3a] focus-within:ring-1 focus-within:ring-[#1a6b3a]/20 transition-all">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowSearch(true) }}
            onFocus={() => search.trim().length >= 2 && setShowSearch(true)}
            className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
          />
        </div>

        {showSearch && search.trim().length >= 2 && (
          <div className="absolute top-full mt-1 left-0 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 max-h-72 overflow-y-auto">
            {(searchResults as any[]).length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400">No members found</p>
            ) : (
              (searchResults as any[]).slice(0, 8).map((m: any) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectMember(m.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1a6b3a] shrink-0 flex items-center justify-center overflow-hidden">
                    {m.profilePicture ? (
                      <img src={m.profilePicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xs font-bold">{m.firstName?.[0]}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{m.firstName} {m.lastName}</p>
                    <p className="text-xs text-gray-400">{m.memberNumber} · {m.sport}</p>
                  </div>
                </button>
              ))
            )}
            <Link
              href={`/admin/members?search=${encodeURIComponent(search)}`}
              onClick={() => setShowSearch(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1a6b3a] font-medium hover:bg-gray-50 border-t border-gray-100 transition-colors"
            >
              <Users className="w-4 h-4" />
              View all results
            </Link>
          </div>
        )}
      </div>

      {/* Notification Bell */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[#d4a017] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h4 className="font-semibold text-gray-900 text-sm">Notifications</h4>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllMutation.mutate()}
                    className="text-xs text-[#1a6b3a] hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
                <Link href="/admin/notifications" onClick={() => setShowNotifications(false)} className="text-xs text-gray-400 hover:text-gray-600">
                  See all
                </Link>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-400 text-center">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotifClick(n)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 ${!n.isRead ? 'bg-[#1a6b3a]/5' : ''}`}
                  >
                    <span className="text-lg shrink-0">{NOTIFICATION_ICONS[n.type] || '🔔'}</span>
                    <div className="min-w-0">
                      <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                    </div>
                    {!n.isRead && <span className="w-2 h-2 bg-[#d4a017] rounded-full shrink-0 mt-1" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#1a6b3a] flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {adminUser ? getInitials(adminUser.name || adminUser.username) : 'A'}
            </span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-900 leading-none">{adminUser?.name || adminUser?.username}</p>
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
