import type {Metadata} from 'next'
import {Geist} from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Timeline preview',
  description: 'Preview landing pages as they will look at a chosen Content Release date',
}

export default function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-100 font-sans text-zinc-900">{children}</body>
    </html>
  )
}
