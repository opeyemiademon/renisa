'use client'

import { Bell, Menu } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { toggleSidebar } from '@/lib/store/appSlice'
import { buildImageUrl, getInitials } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const routeTitles: Record<string, string> = {
  '/member/dashboard': 'Dashboard',
  '/member/profile': 'My Profile',
  '/member/payments': 'Payments',
  '/member/payments/make-payment': 'Make Payment',
  '/member/elections': 'Elections',
  '/member/id-card': 'ID Card',
  '/member/id-card/request': 'Request ID Card',
  '/member/awards': 'Awards',
}

export function MemberTopbar() {
  const { member } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()
  const pathname = usePathname()

  const title = routeTitles[pathname] || 'Member Portal'

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 sticky top-0 z-30 shadow-sm">
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-semibold text-gray-900 flex-1">{title}</h1>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 relative">
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1a6b3a]">
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
