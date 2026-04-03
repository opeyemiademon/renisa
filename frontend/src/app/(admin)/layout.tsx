'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { useAppSelector } from '@/hooks/redux'
import { cn } from '@/lib/utils'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, portal } = useAppSelector((s) => s.auth)
  const { sidebarOpen } = useAppSelector((s) => s.app)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || portal !== 'admin') {
      //router.replace('/login')
    }
  }, [isAuthenticated, portal, router])

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar wrapper — transitions width for smooth collapse */}
      <div
        className={cn(
          'flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden',
          sidebarOpen ? 'w-64' : 'w-0'
        )}
      >
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
