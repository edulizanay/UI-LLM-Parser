// ABOUTME: TypeScript definitions for dashboard project management functionality
// ABOUTME: Defines data structures for Main Dashboard components and project tracking

export type ProjectStatus = 'completed' | 'processing' | 'failed' | 'draft'
export type ProcessingStage = 'uploading' | 'analyzing' | 'categorizing' | 'generating' | 'completed'

export interface ProjectSummary {
  id: string
  name: string
  status: ProjectStatus
  createdAt: Date
  lastModified: Date
  fileCount: number
  categoriesCreated: number
  conversationsProcessed: number
  outputFiles: string[]
}

export interface ProcessingStatus {
  projectId: string
  stage: ProcessingStage
  progress: number
  estimatedTimeRemaining: number
  currentTask: string
  startedAt: Date
}

export interface DashboardStats {
  totalProjects: number
  activeProcessing: number
  completedToday: number
  totalConversationsProcessed: number
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  href: string
  isPrimary: boolean
}