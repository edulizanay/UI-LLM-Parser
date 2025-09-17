// ABOUTME: TypeScript definitions for file parsing and field selection functionality
// ABOUTME: Defines data structures for Stage 1 (File Upload & Selection) components

export type FieldType = 'computer_friendly' | 'llm_friendly' | 'messages' | 'raw_data'

export interface FieldDefinition {
  name: string
  type: FieldType
  dataType: 'string' | 'number' | 'boolean' | 'object' | 'array'
  isSelected: boolean
  sampleValues: any[]
}

export interface UploadedFile {
  name: string
  size: number
  type: string
  content: any[]
  detectedStructure: FieldDefinition[]
  uploadTimestamp: number
}

export interface FieldSelectionState {
  uploadedFile: UploadedFile | null
  selectedFields: string[]
  contextDescription: string
  fieldCategorization: {
    computerFriendly: string[]
    llmFriendly: string[]
    messagesField?: string
  }
  processingStats: {
    conversationCount: number
    interactionCount: number
    tokenCount: number
    messagesCollapsed: boolean
  }
}

export interface FileProcessingOptions {
  maxFileSize: number
  supportedTypes: string[]
  maxPreviewItems: number
}

export interface ContextPlaceholder {
  fileType: string
  detectionRules: string[]
  placeholderText: string
  examples: string[]
}