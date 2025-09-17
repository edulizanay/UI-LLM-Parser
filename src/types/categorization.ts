// ABOUTME: TypeScript definitions for data categorization and LLM prompt functionality
// ABOUTME: Defines data structures for Stage 2 (Data Categorization) components

export type CategorySource = 'computer_friendly' | 'llm_suggested' | 'user_created'

export interface CategoryDefinition {
  id: string
  name: string
  source: CategorySource
  prompt: string
  isEditable: boolean
  isSelected: boolean
  exampleConversations?: string[]
}

export interface CategorizationPreview {
  conversationId: string
  conversationText: string
  suggestedCategories: string[]
  confidence: number
}

export interface CategorizationState {
  availableCategories: CategoryDefinition[]
  selectedCategories: CategoryDefinition[]
  customCategories: CategoryDefinition[]
  previewResults: CategorizationPreview[]
  isProcessing: boolean
}

export interface CategoryCreationData {
  name: string
  prompt: string
  source: CategorySource
}

export interface LLMProcessingResult {
  categoryId: string
  conversationsTagged: number
  processingTime: number
  outputFiles: string[]
  success: boolean
  error?: string
}