// ABOUTME: Tests for design tokens integration and utility functions
// ABOUTME: Verifies design system architecture is working correctly

import {
  colors,
  spacing,
  typography,
  components,
  getFieldTypeColor,
  getFieldTypeClass,
  generateCSSProperties
} from '@/lib/designTokens'

import {
  getFieldStyling,
  getFieldClasses,
  analyzeFieldType,
  getMessagesFieldClasses,
  getPanelClasses
} from '@/lib/fieldUtils'

describe('Design Tokens Integration', () => {
  describe('Design Tokens Export', () => {
    it('should export all required color tokens', () => {
      expect(colors.primary.blue).toBe('#3b82f6')
      expect(colors.field.computerFriendly).toBe('#1e40af')
      expect(colors.field.llmFriendly).toBe('#dc2626')
      expect(colors.surface.background).toBe('#f8fafc')
      expect(colors.text.primary).toBe('#334155')
    })

    it('should export typography tokens', () => {
      expect(typography.fontSize.display).toBe('24px')
      expect(typography.fontSize.heading).toBe('18px')
      expect(typography.fontFamily.system).toContain('-apple-system')
    })

    it('should export spacing tokens', () => {
      expect(spacing.base).toBe('4px')
      expect(spacing.medium).toBe('16px')
      expect(spacing.panelPadding).toBe('16px')
    })

    it('should export component tokens', () => {
      expect(components.borderRadius.medium).toBe('6px')
      expect(components.transition.fast).toBe('0.2s')
    })
  })

  describe('Field Type Functions', () => {
    it('should return correct colors for field types', () => {
      expect(getFieldTypeColor('computer_friendly')).toBe('#1e40af')
      expect(getFieldTypeColor('llm_friendly')).toBe('#dc2626')
    })

    it('should return correct Tailwind classes for field types', () => {
      expect(getFieldTypeClass('computer_friendly')).toBe('text-field-computer-friendly')
      expect(getFieldTypeClass('llm_friendly')).toBe('text-field-llm-friendly')
    })

    it('should generate CSS properties correctly', () => {
      const cssProps = generateCSSProperties()
      expect(cssProps['--color-primary-blue']).toBe('#3b82f6')
      expect(cssProps['--color-field-computer-friendly']).toBe('#1e40af')
      expect(cssProps['--spacing-base']).toBe('4px')
    })
  })

  describe('Field Utilities', () => {
    it('should return correct field styling', () => {
      const styling = getFieldStyling('computer_friendly', true, false)
      expect(styling.textColor).toBe('#1e40af')
      expect(styling.opacity).toBe(1)
      expect(styling.className).toBe('text-field-computer-friendly')
    })

    it('should handle dimmed state correctly', () => {
      const styling = getFieldStyling('llm_friendly', true, true)
      expect(styling.opacity).toBe(0.4)
    })

    it('should generate correct field classes', () => {
      const classes = getFieldClasses('computer_friendly', true, false, true)
      expect(classes).toContain('text-field-computer-friendly')
      expect(classes).toContain('bg-field-computer-friendly/10')
      expect(classes).toContain('transition-all')
    })

    it('should analyze field types correctly', () => {
      const mockAnalysis = { type: 'computer_friendly' as const, distinct_count: 1, sample_values: [], data_type: 'string' }
      expect(analyzeFieldType('id', mockAnalysis)).toBe('computer_friendly')

      const mockLLMAnalysis = { type: 'llm_friendly' as const, distinct_count: 1, sample_values: [], data_type: 'string' }
      expect(analyzeFieldType('title', mockLLMAnalysis)).toBe('llm_friendly')
    })

    it('should return panel classes', () => {
      const panelClasses = getPanelClasses()
      expect(panelClasses).toContain('ds-panel')
    })

    it('should return messages field classes', () => {
      const classes = getMessagesFieldClasses(false)
      expect(classes).toContain('messages-field')
      expect(classes).toContain('cursor-pointer')
    })
  })

  describe('Integration with Tailwind', () => {
    it('should have tokens accessible as const', () => {
      // Verify the tokens are properly typed as const
      const blue: '#3b82f6' = colors.primary.blue
      expect(blue).toBe('#3b82f6')
    })
  })
})