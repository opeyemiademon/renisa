'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { setSidebarOpen } from '@/lib/store/appSlice'
import { cn } from '@/lib/utils'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, portal } = useAppSelector((s) => s.auth)
  const { sidebarOpen } = useAppSelector((s) => s.app)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || portal !== 'admin') {
      router.replace('/admin-login')
    }
  }, [isAuthenticated, portal, router])

  // Close sidebar by default on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      dispatch(setSidebarOpen(false))
    }
  }, [dispatch])

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar — fixed overlay on mobile, inline on desktop */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out',
          'md:relative md:z-auto md:shrink-0 md:transition-all md:overflow-hidden',
          sidebarOpen
            ? 'translate-x-0 md:w-64'
            : '-translate-x-full md:translate-x-0 md:w-0'
        )}
      >
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
