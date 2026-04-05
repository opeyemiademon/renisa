'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MemberSidebar } from '@/components/member/MemberSidebar'
import { MemberTopbar } from '@/components/member/MemberTopbar'
import { ChatRightbar } from '@/components/member/ChatRightbar'
import { useAppSelector } from '@/hooks/redux'
import { Spinner } from '@/components/shared/Spinner'
import { cn } from '@/lib/utils'

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, portal } = useAppSelector((s) => s.auth)
  const { sidebarOpen } = useAppSelector((s) => s.app)
  const router = useRouter()

  /* useEffect(() => {
    if (!isAuthenticated || portal !== 'member') {
      router.replace('/login')
    }
  }, [isAuthenticated, portal, router])

  if (!isAuthenticated || portal !== 'member') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  } */

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className={cn('flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden', sidebarOpen ? 'w-64' : 'w-0')}>
        <MemberSidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MemberTopbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <ChatRightbar />
    </div>
  )
}
