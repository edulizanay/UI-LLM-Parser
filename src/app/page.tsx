// ABOUTME: Main dashboard page implementing Phase 2 three-zone layout design
// ABOUTME: Entry point for conversation parser platform with project management interface

'use client'

import { HeroSection } from '@/components/dashboard/HeroSection'
import { ProcessingStatus } from '@/components/dashboard/ProcessingStatus'
import { ProjectGrid } from '@/components/dashboard/ProjectGrid'
import { PromptRefinerSection } from '@/components/dashboard/PromptRefinerSection'
import { DragDropOverlay } from '@/components/dashboard/DragDropOverlay'
import { getMockProjects, getMockProcessingStatus } from '@/lib/dashboardData'

// Export named component for testing
export function DashboardPage() {
  // Load mock data
  const projects = getMockProjects()
  const processingStatus = getMockProcessingStatus()

  return (
    <>
      {/* Drag and drop overlay */}
      <DragDropOverlay />

      {/* Main dashboard content */}
      <main className="min-h-screen bg-surface-background flex items-center justify-center" data-testid="dashboard-main">
        <div className="max-w-[1000px] w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Action Buttons */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <HeroSection />
            <PromptRefinerSection />
          </div>

          {/* Right Column - Content Stack */}
          <div className="space-y-6">
            <ProcessingStatus processing={processingStatus} />
            <ProjectGrid projects={projects} />
          </div>
        </div>
      </main>
    </>
  )
}

export default DashboardPage