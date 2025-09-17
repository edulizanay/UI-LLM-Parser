// ABOUTME: Main type exports for the conversation parser platform
// ABOUTME: Central export point for all TypeScript definitions across the application

// Parsing and file upload types
export type {
  FieldType,
  FieldDefinition,
  UploadedFile,
  FieldSelectionState,
  FileProcessingOptions,
  ContextPlaceholder,
} from './parsing'

// Categorization and LLM processing types
export type {
  CategorySource,
  CategoryDefinition,
  CategorizationPreview,
  CategorizationState,
  CategoryCreationData,
  LLMProcessingResult,
} from './categorization'

// Dashboard and project management types
export type {
  ProjectStatus,
  ProcessingStage,
  ProjectSummary,
  ProcessingStatus,
  DashboardStats,
  QuickAction,
} from './dashboard'

// Navigation and routing types
export type {
  RouteKey,
  NavigationItem,
  BreadcrumbItem,
  NavigationState,
  RouterParams,
  NavigationContext,
} from './navigation'

// Common utility types
export interface LoadingState {
  isLoading: boolean
  error?: string
  progress?: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
  timestamp: number
}

export interface ComponentProps {
  className?: string
  children?: React.ReactNode
  isLoading?: boolean
  error?: string
}