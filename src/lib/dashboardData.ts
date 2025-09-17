// ABOUTME: Utility functions for loading and formatting dashboard mock data
// ABOUTME: Integrates with mock data from /mock-data/dashboard_mock_data.json

import dashboardMockData from '@/mock-data/dashboard_mock_data.json'
import type { ProjectSummary, ProcessingStatus } from '@/types'

// Load mock projects and transform dates
export function getMockProjects(): ProjectSummary[] {
  return dashboardMockData.projects.map(project => ({
    ...project,
    status: project.status as ProjectSummary['status'],
    createdAt: new Date(project.createdAt),
    lastModified: new Date(project.lastModified),
  }))
}

// Load mock processing status
export function getMockProcessingStatus(): ProcessingStatus[] {
  return dashboardMockData.processingStatus.map(status => ({
    projectId: status.projectId,
    stage: status.stage as ProcessingStatus['stage'],
    progress: status.progress,
    estimatedTimeRemaining: status.estimatedTimeRemaining,
    currentTask: status.statusText,
    startedAt: new Date(status.startedAt)
  }))
}

// Get dashboard statistics
export function getDashboardStats() {
  return dashboardMockData.dashboardStats
}

// Format time remaining for display
export function formatTimeRemaining(seconds: number): string {
  if (seconds < 60) {
    return `~${seconds}s remaining`
  } else if (seconds < 3600) {
    const minutes = Math.round(seconds / 60)
    return `~${minutes} min remaining`
  } else {
    const hours = Math.round(seconds / 3600)
    return `~${hours} hr remaining`
  }
}

// Format date for display
export function formatProcessedDate(date: Date): string {
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  } else {
    const months = Math.floor(diffInDays / 30)
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  }
}