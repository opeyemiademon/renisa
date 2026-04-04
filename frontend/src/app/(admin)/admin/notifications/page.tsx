'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck, Users, CreditCard, IdCard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getNotifications, markNotificationRead, markAllNotificationsRead, Notification } from '@/lib/api_services/notificationApiServices'
import { Button } from '@/components/shared/Button'
import { formatDate } from '@/lib/utils'

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  new_member: {
    icon: <Users className="w-5 h-5" />,
    label: 'New Member',
    color: 'bg-green-100 text-green-700',
  },
  new_payment: {
    icon: <CreditCard className="w-5 h-5" />,
    label: 'Payment',
    color: 'bg-blue-100 text-blue-700',
  },
  id_card_request: {
    icon: <IdCard className="w-5 h-5" />,
    label: 'ID Card Request',
    color: 'bg-amber-100 text-amber-700',
  },
}

export default function NotificationsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications-page'],
    queryFn: () => getNotifications(50),
  })

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-page'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-bell'] })
    },
  })

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-page'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-bell'] })
    },
  })

  const handleClick = (n: Notification) => {
    if (!n.isRead) markReadMutation.mutate(n.id)
    if (n.type === 'new_member' && n.refId) router.push(`/admin/members/${n.refId}`)
    else if (n.type === 'new_payment') router.push('/admin/payments')
    else if (n.type === 'id_card_request') router.push('/admin/id-card-requests')
  }

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-[#1a6b3a]" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            iconLeft={<CheckCheck className="w-4 h-4" />}
            onClick={() => markAllMutation.mutate()}
            loading={markAllMutation.isPending}
          >
            Mark all read
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No notifications yet</p>
            <p className="text-sm mt-1">You'll be notified of new members, payments, and ID card requests here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => {
              const config = TYPE_CONFIG[n.type]
              return (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-[#1a6b3a]/5' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${config?.color || 'bg-gray-100 text-gray-500'}`}>
                    {config?.icon || <Bell className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config?.color || 'bg-gray-100 text-gray-500'}`}>
                        {config?.label || n.type}
                      </span>
                      {!n.isRead && <span className="w-2 h-2 bg-[#d4a017] rounded-full" />}
                    </div>
                    <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
