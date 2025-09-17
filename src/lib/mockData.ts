// ABOUTME: Utility functions for loading and managing mock data files
// ABOUTME: Provides consistent access to JSON mock data throughout the application

import contextPlaceholders from '@/mock-data/context_placeholders.json'
import claudeStage1 from '@/mock-data/claude_stage1.json'
import claudeStage2 from '@/mock-data/claude_stage2.json'
import claudeStage1Statistics from '@/mock-data/claude_stage1_statistics_scenarios.json'

export type FieldAnalysisType = 'computer_friendly' | 'llm_friendly'

export interface FieldAnalysis {
  distinct_count: number
  type: FieldAnalysisType
  sample_values: any[]
  data_type: string
  aggregation_note?: string
}

export interface Stage1Analysis {
  source_file: string
  analysis_timestamp: string
  field_analysis: Record<string, FieldAnalysis>
  processing_statistics: {
    total_conversations: number
    total_messages: number
    estimated_tokens: number
    average_conversation_length: number
    date_range: {
      earliest: string
      latest: string
    }
  }
  recommended_selections: {
    conversation_level: string[]
    message_level: string[]
    metadata_level: string[]
  }
}

export interface ContextPlaceholders {
  context_placeholders: Record<string, string>
  detection_rules: Record<string, {
    field_indicators: string[]
    value_patterns: string[]
  }>
  styling: {
    font_style: string
    opacity: number
    color: string
  }
}

// Mock data accessors
export const getContextPlaceholders = (): ContextPlaceholders => contextPlaceholders

export const getStage1Analysis = (): Stage1Analysis => claudeStage1

export const getStage2Data = () => claudeStage2

export const getStage1Statistics = () => claudeStage1Statistics

// Helper functions
export const getFieldsByType = (type: FieldAnalysisType): string[] => {
  const analysis = getStage1Analysis()
  return Object.entries(analysis.field_analysis)
    .filter(([, field]) => field.type === type)
    .map(([name]) => name)
}

export const getComputerFriendlyFields = () => getFieldsByType('computer_friendly')
export const getLLMFriendlyFields = () => getFieldsByType('llm_friendly')