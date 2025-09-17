// ABOUTME: Dedicated Prompt Refiner section component for dashboard
// ABOUTME: Implements standalone prompt refiner access as requested by user feedback

'use client'

import Link from 'next/link'
import { Wand2 } from 'lucide-react'

export function PromptRefinerSection() {
  return (
    <div className="flex">
      <Link
        href="/prompt-refiner"
        className="inline-flex items-center gap-2 bg-surface-background hover:bg-border-default
                 text-text-primary px-6 py-3 rounded-ds-md text-base font-medium
                 transition-all duration-200 w-fit
                 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
      >
        <Wand2 className="w-5 h-5" />
        Refine Your Prompts
      </Link>
    </div>
  )
}