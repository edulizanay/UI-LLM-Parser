// ABOUTME: Utility functions for field categorization and styling
// ABOUTME: Provides type-safe helpers for computer-friendly vs LLM-friendly field handling

import { colors, semantic, getFieldTypeColor, getFieldTypeClass, type FieldType } from '@/lib/designTokens'
import { type FieldAnalysis } from '@/lib/mockData'

/**
 * Field styling utilities for consistent categorization display
 */
export interface FieldStyling {
  textColor: string
  bgColor?: string
  className: string
  opacity: number
  description: string
}

/**
 * Get complete styling configuration for a field type
 */
export const getFieldStyling = (
  type: FieldType,
  isSelected: boolean = true,
  isDimmed: boolean = false
): FieldStyling => {
  const baseConfig = semantic.fieldTypes[type === 'computer_friendly' ? 'computerFriendly' : 'llmFriendly']

  let opacity = 1
  if (isDimmed) {
    opacity = parseFloat(semantic.states.dimmed.opacity)
  } else if (!isSelected) {
    opacity = parseFloat(semantic.states.selected.opacity)
  }

  return {
    textColor: baseConfig.color,
    className: getFieldTypeClass(type),
    opacity,
    description: baseConfig.description,
  }
}

/**
 * Get Tailwind classes for field categorization
 */
export const getFieldClasses = (
  type: FieldType,
  isSelected: boolean = true,
  isDimmed: boolean = false,
  includeBackground: boolean = false
): string => {
  const classes: string[] = []

  // Base color class
  if (type === 'computer_friendly') {
    classes.push('text-field-computer-friendly')
    if (includeBackground) {
      classes.push('bg-field-computer-friendly/10')
    }
  } else {
    classes.push('text-field-llm-friendly')
    if (includeBackground) {
      classes.push('bg-field-llm-friendly/10')
    }
  }

  // State classes
  if (isDimmed) {
    classes.push('field-dimmed')
  } else if (!isSelected) {
    classes.push('field-selected')
  }

  // Transition
  classes.push('transition-all duration-ds-fast')

  return classes.join(' ')
}

/**
 * Special styling for the messages field (collapsible)
 */
export const getMessagesFieldClasses = (isCollapsed: boolean = false): string => {
  const classes = [
    'messages-field',
    'transition-all',
    'duration-ds-fast',
    'cursor-pointer',
    'border',
    'border-border-default',
    'rounded-ds-md',
    'p-ds-small'
  ]

  if (isCollapsed) {
    classes.push('bg-surface-messages')
  } else {
    classes.push('bg-surface-white')
  }

  return classes.join(' ')
}

/**
 * Get raw data styling (for JSON content display)
 */
export const getRawDataClasses = (): string => {
  return 'text-text-raw-data font-mono text-ds-small bg-surface-code p-ds-small rounded-ds-sm'
}

/**
 * Panel styling utilities
 */
export const getPanelClasses = (): string => {
  return 'ds-panel p-ds-panel'
}

export const getButtonClasses = (variant: 'primary' | 'secondary' = 'primary'): string => {
  if (variant === 'primary') {
    return 'ds-button'
  }
  return 'bg-surface-white text-text-primary border border-border-default rounded-ds-md px-ds-small py-ds-form hover:bg-surface-background transition-all duration-ds-fast'
}

/**
 * Statistics display utilities
 */
export const getStatsDisplayClasses = (): string => {
  return 'text-ds-small text-text-secondary bg-surface-white border border-border-default rounded-ds-md p-ds-small'
}

/**
 * Field categorization analysis helpers
 */
export const analyzeFieldType = (fieldName: string, fieldAnalysis: FieldAnalysis): FieldType => {
  // Return the type from the analysis, with fallback logic
  if (fieldAnalysis.type === 'computer_friendly' || fieldAnalysis.type === 'llm_friendly') {
    return fieldAnalysis.type
  }

  // Fallback logic based on field name patterns
  const computerFriendlyPatterns = ['id', 'count', 'timestamp', 'date', 'source', 'duration']
  const llmFriendlyPatterns = ['title', 'content', 'message', 'text', 'description']

  const lowerFieldName = fieldName.toLowerCase()

  if (computerFriendlyPatterns.some(pattern => lowerFieldName.includes(pattern))) {
    return 'computer_friendly'
  }

  if (llmFriendlyPatterns.some(pattern => lowerFieldName.includes(pattern))) {
    return 'llm_friendly'
  }

  // Default to computer-friendly for unknown fields
  return 'computer_friendly'
}

/**
 * Context placeholder styling
 */
export const getContextPlaceholderClasses = (): string => {
  return 'italic opacity-60 text-text-muted text-ds-small'
}

/**
 * Error state styling
 */
export const getErrorClasses = (): string => {
  return 'text-state-error bg-state-error-bg border border-state-error/20 rounded-ds-md p-ds-small text-ds-small'
}

/**
 * Success state styling
 */
export const getSuccessClasses = (): string => {
  return 'text-state-success bg-state-success-bg border border-state-success/20 rounded-ds-md p-ds-small text-ds-small'
}

/**
 * Loading state styling
 */
export const getLoadingClasses = (): string => {
  return 'animate-pulse text-text-muted text-ds-small'
}