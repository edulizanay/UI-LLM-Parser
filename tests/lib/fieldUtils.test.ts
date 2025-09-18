// ABOUTME: Comprehensive tests for field categorization utilities and styling helpers
// ABOUTME: Tests getFieldStyling, getFieldClasses, analyzeFieldType, and specialized field styling functions

import {
  getFieldStyling,
  getFieldClasses,
  analyzeFieldType,
  getMessagesFieldClasses,
  getRawDataClasses,
  getPanelClasses,
  getButtonClasses,
  getStatsDisplayClasses,
  getContextPlaceholderClasses,
  getErrorClasses,
  getSuccessClasses,
  getLoadingClasses,
  type FieldStyling
} from '@/lib/fieldUtils'
import { type FieldAnalysis } from '@/lib/mockData'
import { semantic } from '@/lib/designTokens'

describe('getFieldStyling', () => {
  it('should return correct styling for computer_friendly fields', () => {
    const styling = getFieldStyling('computer_friendly')

    expect(styling).toEqual({
      textColor: semantic.fieldTypes.computerFriendly.color,
      className: 'text-field-computer-friendly',
      opacity: 1,
      description: semantic.fieldTypes.computerFriendly.description
    })
  })

  it('should return correct styling for llm_friendly fields', () => {
    const styling = getFieldStyling('llm_friendly')

    expect(styling).toEqual({
      textColor: semantic.fieldTypes.llmFriendly.color,
      className: 'text-field-llm-friendly',
      opacity: 1,
      description: semantic.fieldTypes.llmFriendly.description
    })
  })

  it('should apply dimmed opacity when isDimmed=true', () => {
    const styling = getFieldStyling('computer_friendly', true, true)

    expect(styling.opacity).toBe(parseFloat(semantic.states.dimmed.opacity))
  })

  it('should apply selected opacity when isSelected=false', () => {
    const styling = getFieldStyling('computer_friendly', false, false)

    expect(styling.opacity).toBe(parseFloat(semantic.states.selected.opacity))
  })

  it('should handle invalid field types gracefully', () => {
    // @ts-expect-error - Testing invalid type
    const styling = getFieldStyling('invalid_type')

    // Should default to llmFriendly styling
    expect(styling.textColor).toBe(semantic.fieldTypes.llmFriendly.color)
  })

  it('should prioritize dimmed over selected when both are true', () => {
    const styling = getFieldStyling('computer_friendly', false, true)

    expect(styling.opacity).toBe(parseFloat(semantic.states.dimmed.opacity))
  })
})

describe('getFieldClasses', () => {
  it('should generate correct Tailwind classes for computer_friendly fields', () => {
    const classes = getFieldClasses('computer_friendly')

    expect(classes).toContain('text-field-computer-friendly')
    expect(classes).toContain('transition-all duration-ds-fast')
    expect(classes).not.toContain('bg-field-computer-friendly/10')
  })

  it('should generate correct Tailwind classes for llm_friendly fields', () => {
    const classes = getFieldClasses('llm_friendly')

    expect(classes).toContain('text-field-llm-friendly')
    expect(classes).toContain('transition-all duration-ds-fast')
    expect(classes).not.toContain('bg-field-llm-friendly/10')
  })

  it('should include background classes when includeBackground=true', () => {
    const computerClasses = getFieldClasses('computer_friendly', true, false, true)
    const llmClasses = getFieldClasses('llm_friendly', true, false, true)

    expect(computerClasses).toContain('bg-field-computer-friendly/10')
    expect(llmClasses).toContain('bg-field-llm-friendly/10')
  })

  it('should apply state classes for dimmed/selected states', () => {
    const dimmedClasses = getFieldClasses('computer_friendly', true, true)
    const unselectedClasses = getFieldClasses('computer_friendly', false, false)

    expect(dimmedClasses).toContain('field-dimmed')
    expect(unselectedClasses).toContain('field-selected')
  })

  it('should include transition classes', () => {
    const classes = getFieldClasses('computer_friendly')

    expect(classes).toContain('transition-all')
    expect(classes).toContain('duration-ds-fast')
  })

  it('should handle edge cases with empty parameters', () => {
    // Should work with defaults
    const classes = getFieldClasses('computer_friendly')

    expect(classes).toBeTruthy()
    expect(typeof classes).toBe('string')
  })
})

describe('analyzeFieldType', () => {
  it('should categorize ID fields as computer_friendly', () => {
    const analysis: FieldAnalysis = {
      type: 'computer_friendly',
      distinct_count: 100,
      sample_values: ['user_123', 'user_456'],
      data_type: 'string',
      aggregation_note: 'Unique identifier'
    }
    const result = analyzeFieldType('user_id', analysis)

    expect(result).toBe('computer_friendly')
  })

  it('should categorize content fields as llm_friendly', () => {
    const analysis: FieldAnalysis = { type: 'llm_friendly', distinct_count: 50, sample_values: ['Hello world'], data_type: 'string', aggregation_note: 'Text content' }
    const result = analyzeFieldType('message_content', analysis)

    expect(result).toBe('llm_friendly')
  })

  it('should use field analysis when available', () => {
    const analysis: FieldAnalysis = { type: 'llm_friendly', distinct_count: 10, sample_values: ['test'], data_type: 'string' }
    const result = analyzeFieldType('some_field', analysis)

    expect(result).toBe('llm_friendly')
  })

  it('should fallback to pattern matching for unknown fields', () => {
    const analysis: FieldAnalysis = { type: 'unknown' as any, distinct_count: 1, sample_values: ['unknown'], data_type: 'string' }

    // Test computer-friendly patterns
    expect(analyzeFieldType('timestamp', analysis)).toBe('computer_friendly')
    expect(analyzeFieldType('count', analysis)).toBe('computer_friendly')
    expect(analyzeFieldType('source_id', analysis)).toBe('computer_friendly')

    // Test LLM-friendly patterns
    expect(analyzeFieldType('title', analysis)).toBe('llm_friendly')
    expect(analyzeFieldType('message_text', analysis)).toBe('llm_friendly')
    expect(analyzeFieldType('description', analysis)).toBe('llm_friendly')
  })

  it('should default to computer_friendly for unrecognized patterns', () => {
    const analysis: FieldAnalysis = { type: 'unknown' as any, distinct_count: 1, sample_values: ['unknown'], data_type: 'string' }
    const result = analyzeFieldType('random_field_name', analysis)

    expect(result).toBe('computer_friendly')
  })

  it('should handle case insensitive field names', () => {
    const analysis: FieldAnalysis = { type: 'unknown' as any, distinct_count: 1, sample_values: ['unknown'], data_type: 'string' }

    expect(analyzeFieldType('USER_ID', analysis)).toBe('computer_friendly')
    expect(analyzeFieldType('MESSAGE_CONTENT', analysis)).toBe('llm_friendly')
    expect(analyzeFieldType('Title', analysis)).toBe('llm_friendly')
  })
})

describe('getMessagesFieldClasses', () => {
  it('should return correct classes for collapsed messages field', () => {
    const classes = getMessagesFieldClasses(true)

    expect(classes).toContain('messages-field')
    expect(classes).toContain('bg-surface-messages')
    expect(classes).toContain('cursor-pointer')
    expect(classes).toContain('transition-all')
    expect(classes).toContain('border')
  })

  it('should return correct classes for expanded messages field', () => {
    const classes = getMessagesFieldClasses(false)

    expect(classes).toContain('messages-field')
    expect(classes).toContain('bg-surface-white')
    expect(classes).toContain('cursor-pointer')
    expect(classes).toContain('transition-all')
  })

  it('should include cursor-pointer for interactive behavior', () => {
    const collapsedClasses = getMessagesFieldClasses(true)
    const expandedClasses = getMessagesFieldClasses(false)

    expect(collapsedClasses).toContain('cursor-pointer')
    expect(expandedClasses).toContain('cursor-pointer')
  })
})

describe('styling utility functions', () => {
  it('should generate consistent panel classes', () => {
    const classes = getPanelClasses()

    expect(classes).toContain('ds-panel')
    expect(classes).toContain('p-ds-panel')
  })

  it('should generate primary vs secondary button classes', () => {
    const primaryClasses = getButtonClasses('primary')
    const secondaryClasses = getButtonClasses('secondary')

    expect(primaryClasses).toContain('ds-button')
    expect(secondaryClasses).toContain('bg-surface-white')
    expect(secondaryClasses).toContain('border')
  })

  it('should generate error state classes with proper colors', () => {
    const classes = getErrorClasses()

    expect(classes).toContain('text-state-error')
    expect(classes).toContain('bg-state-error-bg')
    expect(classes).toContain('border-state-error/20')
  })

  it('should generate success state classes', () => {
    const classes = getSuccessClasses()

    expect(classes).toContain('text-state-success')
    expect(classes).toContain('bg-state-success-bg')
    expect(classes).toContain('border-state-success/20')
  })

  it('should generate loading state classes with animation', () => {
    const classes = getLoadingClasses()

    expect(classes).toContain('animate-pulse')
    expect(classes).toContain('text-text-muted')
  })

  it('should generate raw data styling classes', () => {
    const classes = getRawDataClasses()

    expect(classes).toContain('text-text-raw-data')
    expect(classes).toContain('font-mono')
    expect(classes).toContain('bg-surface-code')
  })

  it('should generate stats display classes', () => {
    const classes = getStatsDisplayClasses()

    expect(classes).toContain('text-ds-small')
    expect(classes).toContain('bg-surface-white')
    expect(classes).toContain('border')
  })

  it('should generate context placeholder classes', () => {
    const classes = getContextPlaceholderClasses()

    expect(classes).toContain('italic')
    expect(classes).toContain('opacity-60')
    expect(classes).toContain('text-text-muted')
  })
})