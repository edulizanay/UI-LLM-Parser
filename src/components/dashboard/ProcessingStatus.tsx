// ABOUTME: Processing status component showing active parsing operations with progress
// ABOUTME: Implements Zone 2 (Processing Status) from @dashboard-design.md specifications

'use client'

import { formatTimeRemaining } from '@/lib/dashboardData'

interface ProcessingItem {
  projectId: string
  fileName?: string
  status?: string
  currentTask?: string
  progress: number
  timeRemaining?: string
  estimatedTimeRemaining?: number
}

interface ProcessingStatusProps {
  processing: ProcessingItem[]
}

export function ProcessingStatus({ processing }: ProcessingStatusProps) {
  // Don't render if no active processing
  if (!processing || processing.length === 0) {
    return null
  }

  return (
    <section className="bg-surface-white p-ds-small rounded-ds-lg shadow-panel">
      <h3 className="text-ds-body font-medium text-text-primary mb-ds-small">
        Currently Processing
      </h3>

      <div className="space-y-2">
        {processing.map((item) => {
          const displayName = item.fileName || `Project ${item.projectId}`
          const timeText = item.timeRemaining ||
            (item.estimatedTimeRemaining ? formatTimeRemaining(item.estimatedTimeRemaining) : '')

          return (
            <div key={item.projectId} className="flex items-center gap-4 text-ds-small">
              {/* Project name */}
              <span className="text-text-primary font-medium w-32 truncate">
                {displayName}
              </span>

              {/* Progress bar - 30% shorter */}
              <div className="flex-1 max-w-24">
                <div className="w-full h-2 bg-border-default rounded-full overflow-hidden">
                  <div
                    role="progressbar"
                    aria-valuenow={item.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-full bg-primary-blue transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              {/* Percentage */}
              <span className="text-primary-blue font-medium w-10 text-right">
                {item.progress}%
              </span>

              {/* Time remaining - larger column */}
              {timeText && (
                <span className="text-text-muted w-28 text-right">
                  {timeText}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}