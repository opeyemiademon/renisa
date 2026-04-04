'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck, CreditCard, IdCard, Star, Gift } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getMemberNotifications, markMemberNotificationRead, markAllMemberNotificationsRead, MemberNotification } from '@/lib/api_services/memberNotificationApiServices'
import { Button } from '@/components/shared/Button'
import { formatDate } from '@/lib/utils'

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  welcome:          { icon: <Star className="w-5 h-5" />,    color: 'bg-green-100 text-green-700',  label: 'Welcome' },
  payment:          { icon: <CreditCard className="w-5 h-5" />, color: 'bg-blue-100 text-blue-700',  label: 'Payment' },
  id_card_approved: { icon: <IdCard className="w-5 h-5" />,  color: 'bg-emerald-100 text-emerald-700', label: 'ID Card' },
  id_card_rejected: { icon: <IdCard className="w-5 h-5" />,  color: 'bg-red-100 text-red-700',     label: 'ID Card' },
  general:          { icon: <Bell className="w-5 h-5" />,    color: 'bg-gray-100 text-gray-600',   label: 'Notice' },
}

export default function MemberNotificationsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['member-notifications-page'],
    queryFn: () => getMemberNotifications(50),
  })

  const markReadMutation = useMutation({
    mutationFn: markMemberNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-notifications-page'] })
      queryClient.invalidateQueries({ queryKey: ['member-notifications-bell'] })
    },
  })

  const markAllMutation = useMutation({
    mutationFn: markAllMemberNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-notifications-page'] })
      queryClient.invalidateQueries({ queryKey: ['member-notifications-bell'] })
    },
  })

  const handleClick = (n: MemberNotification) => {
    if (!n.isRead) markReadMutation.mutate(n.id)
    if (n.link) router.push(n.link)
  }

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            <p className="text-gray-500 text-sm mt-0.5">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
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
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No notifications yet</p>
            <p className="text-sm mt-1">We'll notify you about payments, ID card updates, and more.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => {
              const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.general
              return (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${config.color}`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
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
