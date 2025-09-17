// ABOUTME: Hero section component for dashboard with primary CTA and secondary navigation
// ABOUTME: Implements Zone 1 from @dashboard-design.md specifications

'use client'

import Link from 'next/link'
import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function HeroSection() {
  return (
    <div className="flex">
      <Link
        href="/parse"
        className="inline-flex items-center gap-4 bg-primary-blue hover:bg-primary-blue-hover
                 text-white px-12 py-6 rounded-ds-lg text-xl font-medium
                 transition-all duration-200 hover:-translate-y-px
                 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
      >
        Parse New Data
        <Upload data-testid="upload-icon" className="w-8 h-8" />
      </Link>
    </div>
  )
}