// ABOUTME: Root layout component for the conversation parser platform
// ABOUTME: Provides base HTML structure, global styles, and metadata

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Conversation Parser Platform',
  description: 'Parse and analyze personal conversation data for LLMs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}