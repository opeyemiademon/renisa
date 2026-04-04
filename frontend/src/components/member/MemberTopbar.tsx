'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Menu, CheckCheck } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { toggleSidebar } from '@/lib/store/appSlice'
import { buildImageUrl, formatDate, getInitials } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { getMemberNotifications, markMemberNotificationRead, markAllMemberNotificationsRead, MemberNotification } from '@/lib/api_services/memberNotificationApiServices'

const routeTitles: Record<string, string> = {
  '/member/dashboard': 'Dashboard',
  '/member/profile': 'My Profile',
  '/member/payments': 'Payments',
  '/member/payments/make-payment': 'Make Payment',
  '/member/elections': 'Elections',
  '/member/id-card': 'ID Card',
  '/member/id-card/request': 'Request ID Card',
  '/member/awards': 'Awards',
  '/member/notifications': 'Notifications',
}

const TYPE_ICONS: Record<string, string> = {
  welcome: '👋',
  payment: '💳',
  id_card_approved: '✅',
  id_card_rejected: '❌',
  general: '🔔',
}

export function MemberTopbar() {
  const { member } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  const title = routeTitles[pathname] || 'Member Portal'

  const { data: notifData } = useQuery({
    queryKey: ['member-notifications-bell'],
    queryFn: () => getMemberNotifications(10),
    enabled: !!member,
    refetchInterval: 30000,
  })

  const markReadMutation = useMutation({
    mutationFn: markMemberNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['member-notifications-bell'] }),
  })

  const markAllMutation = useMutation({
    mutationFn: markAllMemberNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['member-notifications-bell'] }),
  })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unreadCount = notifData?.unreadCount ?? 0
  const notifications = notifData?.notifications ?? []

  const handleNotifClick = (n: MemberNotification) => {
    if (!n.isRead) markReadMutation.mutate(n.id)
    setShowNotifications(false)
    if (n.link) router.push(n.link)
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 sticky top-0 z-30 shadow-sm">
      <button onClick={() => dispatch(toggleSidebar())} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-semibold text-gray-900 flex-1">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 bg-[#d4a017] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
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
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                  <Link href="/member/notifications" onClick={() => setShowNotifications(false)} className="text-xs text-gray-400 hover:text-gray-600">
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
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 ${!n.isRead ? 'bg-primary/5' : ''}`}
                    >
                      <span className="text-lg shrink-0">{TYPE_ICONS[n.type] || '🔔'}</span>
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

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-primary shrink-0">
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
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-none">
              {member ? `${member.firstName} ${member.lastName}` : 'Member'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{member?.memberNumber}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
