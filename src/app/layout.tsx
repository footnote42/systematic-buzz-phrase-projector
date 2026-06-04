import type { Metadata } from 'next'
import { VT323, Space_Grotesk } from 'next/font/google'
import './globals.css'

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-vt323',
})

const spaceGrotesk = Space_Grotesk({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Systematic Buzz Phrase Projector',
  description: "A digital homage to Philip Broughton's 1968 management jargon matrix.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`h-full ${vt323.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
