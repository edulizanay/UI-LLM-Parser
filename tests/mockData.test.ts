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
})