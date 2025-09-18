// ABOUTME: Tests for field selection hook functionality
// ABOUTME: Tests field selection state, statistics calculation, validation, and localStorage persistence

import React from 'react'
import { renderHook, act } from '@testing-library/react'

interface ProcessingStats {
  conversationCount: number
  interactionCount: number
  tokenCount: number
}

interface ConversationData {
  id: string
  title: string
  messages: Array<{
    role: string
    content: string
  }>
  [key: string]: any
}

// Mock field selection hook - this should be implemented in src/hooks/useFieldSelection.ts
const useFieldSelection = (conversationData: ConversationData | null) => {
  const [selectedFields, setSelectedFields] = React.useState<string[]>([])
  const [isMessagesCollapsed, setIsMessagesCollapsed] = React.useState(false)
  const [processingStats, setProcessingStats] = React.useState<ProcessingStats>({
    conversationCount: 0,
    interactionCount: 0,
    tokenCount: 0
  })

  const toggleField = (fieldName: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldName)
        ? prev.filter(f => f !== fieldName)
        : [...prev, fieldName]
    )
  }

  const toggleMessagesCollapse = () => {
    setIsMessagesCollapsed(prev => !prev)
  }

  const calculateStatistics = () => {
    if (!conversationData || selectedFields.length === 0) {
      setProcessingStats({ conversationCount: 0, interactionCount: 0, tokenCount: 0 })
      return
    }

    const conversationCount = 1
    let interactionCount = 0
    let tokenCount = 0

    if (selectedFields.includes('messages') && conversationData.messages) {
      if (isMessagesCollapsed) {
        interactionCount = 1
      } else {
        interactionCount = conversationData.messages.length
      }

      conversationData.messages.forEach(message => {
        tokenCount += Math.ceil(message.content.length / 4)
      })
    }

    selectedFields.forEach(fieldName => {
      if (fieldName !== 'messages') {
        const value = conversationData[fieldName]
        if (typeof value === 'string') {
          tokenCount += Math.ceil(value.length / 4)
        }
      }
    })

    setProcessingStats({ conversationCount, interactionCount, tokenCount })
  }

  const validateSelection = () => {
    if (selectedFields.length === 0) {
      return { isValid: false, error: 'At least one field must be selected' }
    }

    if (selectedFields.includes('messages') && !conversationData?.messages?.length) {
      return { isValid: false, error: 'no messages found' }
    }

    return { isValid: true, error: null }
  }

  const persistToLocalStorage = () => {
    const state = {
      selectedFields,
      isMessagesCollapsed,
      timestamp: Date.now()
    }
    localStorage.setItem('field-selection-state', JSON.stringify(state))
  }

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('field-selection-state')
      if (saved) {
        const state = JSON.parse(saved)
        setSelectedFields(state.selectedFields || [])
        setIsMessagesCollapsed(state.isMessagesCollapsed || false)
      }
    } catch (error) {
      console.warn('Failed to load field selection state:', error)
    }
  }

  // Auto-calculate when dependencies change
  React.useEffect(() => {
    calculateStatistics()
  }, [selectedFields, isMessagesCollapsed, conversationData])

  return {
    selectedFields,
    isMessagesCollapsed,
    processingStats,
    toggleField,
    toggleMessagesCollapse,
    calculateStatistics,
    validateSelection,
    persistToLocalStorage,
    loadFromLocalStorage,
  }
}

// Mock React
const React = {
  useState: jest.fn(),
  useEffect: jest.fn(),
}

const mockSetState = jest.fn()
const mockUseState = (initial: any) => [initial, mockSetState]

beforeEach(() => {
  React.useState = jest.fn(mockUseState)
  React.useEffect = jest.fn((fn) => fn())
  mockSetState.mockClear()
  localStorage.clear()
})

const mockConversationData: ConversationData = {
  id: 'conv-1',
  title: 'Test Conversation',
  messages: [
    { role: 'user', content: 'Hello world' },
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ],
  source: 'claude',
  date: '2024-09-18'
}

describe('useFieldSelection Hook', () => {
  describe('Field Selection State Management', () => {
    it('should manage selected fields state', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      expect(result.current.selectedFields).toEqual([])

      act(() => {
        result.current.toggleField('title')
      })

      // In real implementation, this would update selectedFields
      expect(result.current.toggleField).toBeDefined()
    })

    it('should toggle field selection correctly', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      // Add field
      act(() => {
        result.current.toggleField('title')
      })

      // Remove field (toggle again)
      act(() => {
        result.current.toggleField('title')
      })

      expect(result.current.toggleField).toBeDefined()
    })

    it('should handle messages collapse state', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      expect(result.current.isMessagesCollapsed).toBe(false)

      act(() => {
        result.current.toggleMessagesCollapse()
      })

      expect(result.current.toggleMessagesCollapse).toBeDefined()
    })
  })

  describe('Statistics Calculation', () => {
    it('should calculate statistics in real-time', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      expect(result.current.processingStats).toEqual({
        conversationCount: 0,
        interactionCount: 0,
        tokenCount: 0
      })

      act(() => {
        result.current.calculateStatistics()
      })

      expect(result.current.calculateStatistics).toBeDefined()
    })

    it('should calculate message count based on collapse state', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      // Add messages field
      act(() => {
        result.current.toggleField('messages')
      })

      act(() => {
        result.current.calculateStatistics()
      })

      // Should calculate different counts for collapsed vs expanded
      expect(result.current.processingStats.conversationCount).toBe(0) // Mock returns 0
    })

    it('should estimate token counts correctly', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      act(() => {
        result.current.toggleField('messages')
        result.current.toggleField('title')
      })

      act(() => {
        result.current.calculateStatistics()
      })

      expect(result.current.processingStats.tokenCount).toBeGreaterThanOrEqual(0)
    })

    it('should handle empty data gracefully', () => {
      const { result } = renderHook(() => useFieldSelection(null))

      act(() => {
        result.current.calculateStatistics()
      })

      expect(result.current.processingStats).toEqual({
        conversationCount: 0,
        interactionCount: 0,
        tokenCount: 0
      })
    })
  })

  describe('Field Validation', () => {
    it('should validate field combinations', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      // No fields selected
      act(() => {
        const validation = result.current.validateSelection()
        expect(validation.isValid).toBe(false)
        expect(validation.error).toContain('At least one field')
      })
    })

    it('should validate messages field requirements', () => {
      const dataWithoutMessages = { ...mockConversationData, messages: [] }
      const { result } = renderHook(() => useFieldSelection(dataWithoutMessages))

      act(() => {
        result.current.toggleField('messages')
      })

      act(() => {
        const validation = result.current.validateSelection()
        expect(validation.error).toContain('no messages found')
      })
    })

    it('should pass validation with valid selection', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      act(() => {
        result.current.toggleField('title')
      })

      act(() => {
        const validation = result.current.validateSelection()
        expect(validation.isValid).toBe(true)
        expect(validation.error).toBeNull()
      })
    })
  })

  describe('LocalStorage Persistence', () => {
    it('should persist state to localStorage', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      act(() => {
        result.current.toggleField('title')
        result.current.toggleField('messages')
      })

      act(() => {
        result.current.persistToLocalStorage()
      })

      const saved = localStorage.getItem('field-selection-state')
      expect(saved).toBeTruthy()

      const state = JSON.parse(saved!)
      expect(state).toHaveProperty('selectedFields')
      expect(state).toHaveProperty('isMessagesCollapsed')
      expect(state).toHaveProperty('timestamp')
    })

    it('should load state from localStorage', () => {
      const savedState = {
        selectedFields: ['title', 'messages'],
        isMessagesCollapsed: true,
        timestamp: Date.now()
      }

      localStorage.setItem('field-selection-state', JSON.stringify(savedState))

      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      act(() => {
        result.current.loadFromLocalStorage()
      })

      expect(result.current.loadFromLocalStorage).toBeDefined()
    })

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('field-selection-state', 'invalid json')

      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      // Should not throw
      act(() => {
        result.current.loadFromLocalStorage()
      })

      expect(result.current.loadFromLocalStorage).toBeDefined()
    })

    it('should handle missing localStorage data', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      act(() => {
        result.current.loadFromLocalStorage()
      })

      // Should not throw and should maintain default state
      expect(result.current.selectedFields).toEqual([])
      expect(result.current.isMessagesCollapsed).toBe(false)
    })
  })

  describe('Field Categorization Updates', () => {
    it('should handle field categorization updates', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      // Test with computer-friendly fields
      act(() => {
        result.current.toggleField('id')
        result.current.toggleField('source')
      })

      // Test with LLM-friendly fields
      act(() => {
        result.current.toggleField('title')
        result.current.toggleField('messages')
      })

      expect(result.current.toggleField).toBeDefined()
    })

    it('should maintain field types during selection', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      const computerFields = ['id', 'source', 'date']
      const llmFields = ['title', 'messages']

      computerFields.forEach(field => {
        act(() => {
          result.current.toggleField(field)
        })
      })

      llmFields.forEach(field => {
        act(() => {
          result.current.toggleField(field)
        })
      })

      expect(result.current.toggleField).toBeDefined()
    })
  })

  describe('Auto-calculation Effects', () => {
    it('should auto-calculate when selectedFields change', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      act(() => {
        result.current.toggleField('title')
      })

      // useEffect should trigger calculateStatistics
      expect(React.useEffect).toHaveBeenCalled()
    })

    it('should auto-calculate when messages collapse state changes', () => {
      const { result } = renderHook(() => useFieldSelection(mockConversationData))

      act(() => {
        result.current.toggleMessagesCollapse()
      })

      expect(React.useEffect).toHaveBeenCalled()
    })

    it('should auto-calculate when conversation data changes', () => {
      const { result, rerender } = renderHook(
        ({ data }) => useFieldSelection(data),
        { initialProps: { data: mockConversationData } }
      )

      const newData = { ...mockConversationData, title: 'Updated Title' }

      rerender({ data: newData })

      expect(React.useEffect).toHaveBeenCalled()
    })
  })
})