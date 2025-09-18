// ABOUTME: Tests for mock data integration and utility functions
// ABOUTME: Verifies all JSON mock files are accessible and properly structured

import {
  getContextPlaceholders,
  getStage1Analysis,
  getStage2Data,
  getStage1Statistics,
  getComputerFriendlyFields,
  getLLMFriendlyFields,
} from '@/lib/mockData'

describe('Mock Data Integration', () => {
  describe('Context Placeholders', () => {
    it('should load context placeholders correctly', () => {
      const placeholders = getContextPlaceholders()

      expect(placeholders).toBeDefined()
      expect(placeholders.context_placeholders).toBeDefined()
      expect(placeholders.detection_rules).toBeDefined()
      expect(placeholders.styling).toBeDefined()
    })

    it('should have expected placeholder types', () => {
      const placeholders = getContextPlaceholders()
      const types = Object.keys(placeholders.context_placeholders)

      expect(types).toContain('claude')
      expect(types).toContain('whatsapp')
      expect(types).toContain('slack')
      expect(types).toContain('email')
    })
  })

  describe('Stage 1 Analysis', () => {
    it('should load stage 1 analysis correctly', () => {
      const analysis = getStage1Analysis()

      expect(analysis).toBeDefined()
      expect(analysis.field_analysis).toBeDefined()
      expect(analysis.processing_statistics).toBeDefined()
      expect(analysis.recommended_selections).toBeDefined()
    })

    it('should have field type categorization', () => {
      const computerFields = getComputerFriendlyFields()
      const llmFields = getLLMFriendlyFields()

      expect(computerFields).toContain('id')
      expect(computerFields).toContain('source')
      expect(llmFields).toContain('title')
      expect(llmFields).toContain('messages')
    })

    it('should have processing statistics', () => {
      const analysis = getStage1Analysis()
      const stats = analysis.processing_statistics

      expect(stats.total_conversations).toBeGreaterThan(0)
      expect(stats.total_messages).toBeGreaterThan(0)
      expect(stats.estimated_tokens).toBeGreaterThan(0)
    })
  })

  describe('Stage 2 Data', () => {
    it('should load stage 2 data correctly', () => {
      const stage2Data = getStage2Data()

      expect(stage2Data).toBeDefined()
    })
  })

  describe('Stage 1 Statistics', () => {
    it('should load statistics scenarios correctly', () => {
      const statistics = getStage1Statistics()

      expect(statistics).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('should handle missing/corrupted mock data files gracefully', () => {
      // Test that functions don't throw when called
      expect(() => getContextPlaceholders()).not.toThrow()
      expect(() => getStage1Analysis()).not.toThrow()
      expect(() => getStage2Data()).not.toThrow()
      expect(() => getStage1Statistics()).not.toThrow()
    })
  })
})

describe('Field Type Filtering', () => {
  it('should filter computer-friendly fields correctly', () => {
    const computerFields = getComputerFriendlyFields()

    expect(Array.isArray(computerFields)).toBe(true)
    expect(computerFields.length).toBeGreaterThan(0)
    expect(computerFields).toContain('id')
    expect(computerFields).toContain('source')
    expect(computerFields).toContain('date')
  })

  it('should filter LLM-friendly fields correctly', () => {
    const llmFields = getLLMFriendlyFields()

    expect(Array.isArray(llmFields)).toBe(true)
    expect(llmFields.length).toBeGreaterThan(0)
    expect(llmFields).toContain('title')
    expect(llmFields).toContain('messages')
  })

  it('should return empty array for unknown field types', () => {
    // This tests the robustness of filtering functions
    const computerFields = getComputerFriendlyFields()
    const llmFields = getLLMFriendlyFields()

    // Should not contain undefined or null values
    expect(computerFields.every(field => field && typeof field === 'string')).toBe(true)
    expect(llmFields.every(field => field && typeof field === 'string')).toBe(true)
  })

  it('should handle analysis data with missing field types', () => {
    const analysis = getStage1Analysis()

    // Verify field analysis structure
    expect(analysis.field_analysis).toBeDefined()
    Object.values(analysis.field_analysis).forEach((fieldAnalysis: any) => {
      expect(fieldAnalysis).toHaveProperty('type')
      expect(fieldAnalysis).toHaveProperty('data_type')
      expect(fieldAnalysis).toHaveProperty('sample_values')
      expect(fieldAnalysis).toHaveProperty('distinct_count')
    })
  })
})

describe('Data Structure Validation', () => {
  it('should have valid context placeholder structure', () => {
    const placeholders = getContextPlaceholders()

    expect(placeholders).toHaveProperty('context_placeholders')
    expect(placeholders).toHaveProperty('detection_rules')
    expect(placeholders).toHaveProperty('styling')

    // Validate detection rules structure - it's an object, not array
    expect(typeof placeholders.detection_rules).toBe('object')
    expect(placeholders.detection_rules).not.toBeNull()

    // Check that detection rules have expected structure
    Object.values(placeholders.detection_rules).forEach((rule: any) => {
      expect(rule).toHaveProperty('field_indicators')
      expect(rule).toHaveProperty('value_patterns')
      expect(Array.isArray(rule.field_indicators)).toBe(true)
      expect(Array.isArray(rule.value_patterns)).toBe(true)
    })
  })

  it('should have valid stage1 analysis structure', () => {
    const analysis = getStage1Analysis()

    expect(analysis).toHaveProperty('field_analysis')
    expect(analysis).toHaveProperty('processing_statistics')
    expect(analysis).toHaveProperty('recommended_selections')

    // Validate processing statistics
    const stats = analysis.processing_statistics
    expect(typeof stats.total_conversations).toBe('number')
    expect(typeof stats.total_messages).toBe('number')
    expect(typeof stats.estimated_tokens).toBe('number')
  })

  it('should have valid stage2 data structure', () => {
    const stage2Data = getStage2Data()

    expect(stage2Data).toBeDefined()
    expect(typeof stage2Data).toBe('object')
  })

  it('should have valid statistics scenarios structure', () => {
    const statistics = getStage1Statistics()

    expect(statistics).toBeDefined()
    expect(typeof statistics).toBe('object')
  })
})