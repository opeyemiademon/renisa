import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/providers/app'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RENISA - Association of Retired Nigerian Sports Men & Women',
  description:
    'Official platform of the Association of Retired Nigerian Sports Men & Women (RENISA)',

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <link rel="icon" href="/logo.png" />
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
