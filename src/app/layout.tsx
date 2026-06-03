import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
