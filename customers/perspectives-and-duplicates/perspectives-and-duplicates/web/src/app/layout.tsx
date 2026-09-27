import type {Metadata} from 'next'
import {Geist} from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Landing Page perspectives',
  description: 'Preview Sanity published, draft, and Content Release perspectives',
}

export default function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-100 font-sans text-zinc-900">{children}</body>
    </html>
  )
}
