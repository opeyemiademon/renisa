import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { ScrollToTop } from '@/components/shared/ScrollToTop'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
