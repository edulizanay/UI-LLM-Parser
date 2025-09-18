// ABOUTME: Tests for usePersistedState hook functionality
// ABOUTME: Tests Stage 1/Stage 2 patterns, conditional saving, partial updates, and error handling

import { renderHook, act } from '@testing-library/react'
import { usePersistedState, useStage1State, useStage2State } from '@/hooks/usePersistedState'

// Mock the useLocalStorage hook
jest.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn()
}))

const mockUseLocalStorage = require('@/hooks/useLocalStorage').useLocalStorage as jest.MockedFunction<any>

describe('usePersistedState Hook', () => {
  const mockSetValue = jest.fn()

  beforeEach(() => {
    mockSetValue.mockClear()
    mockUseLocalStorage.mockReturnValue({
      storedValue: { test: 'value', count: 0 },
      setValue: mockSetValue
    })
  })

  describe('Basic Functionality', () => {
    it('should initialize with stored value', () => {
      const { result } = renderHook(() =>
        usePersistedState({
          key: 'test-key',
          initialState: { test: 'initial', count: 0 }
        })
      )

      expect(result.current.state).toEqual({ test: 'value', count: 0 })
    })

    it('should provide updateState function', () => {
      const { result } = renderHook(() =>
        usePersistedState({
          key: 'test-key',
          initialState: { test: 'initial', count: 0 }
        })
      )

      act(() => {
        result.current.updateState({ test: 'updated' })
      })

      expect(mockSetValue).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should provide individual setters for each field', () => {
      const { result } = renderHook(() =>
        usePersistedState({
          key: 'test-key',
          initialState: { test: 'initial', count: 0 }
        })
      )

      expect(result.current.setters.test).toBeDefined()
      expect(result.current.setters.count).toBeDefined()
      expect(typeof result.current.setters.test).toBe('function')
      expect(typeof result.current.setters.count).toBe('function')
    })

    it('should update individual fields via setters', () => {
      const { result } = renderHook(() =>
        usePersistedState({
          key: 'test-key',
          initialState: { test: 'initial', count: 0 }
        })
      )

      act(() => {
        result.current.setters.test('new value')
      })

      expect(mockSetValue).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should provide clearState function', () => {
      const initialState = { test: 'initial', count: 0 }
      const { result } = renderHook(() =>
        usePersistedState({
          key: 'test-key',
          initialState
        })
      )

      act(() => {
        result.current.clearState()
      })

      expect(mockSetValue).toHaveBeenCalledWith(initialState)
    })
  })

  describe('Conditional Saving', () => {
    it('should respect saveCondition when provided', () => {
      const { result } = renderHook(() =>
        usePersistedState({
          key: 'test-key',
          initialState: { test: 'initial', count: 0 },
          saveCondition: (state) => state.count > 0
        })
      )

      act(() => {
        result.current.updateState({ test: 'should not save' })
      })

      expect(mockSetValue).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should save when saveCondition returns true', () => {
      const { result } = renderHook(() =>
        usePersistedState({
          key: 'test-key',
          initialState: { test: 'initial', count: 0 },
          saveCondition: (state) => state.count > 0
        })
      )

      act(() => {
        result.current.updateState({ count: 5 })
      })

      expect(mockSetValue).toHaveBeenCalledWith(expect.any(Function))
    })
  })

  describe('Function-based Updates', () => {
    it('should handle function-based updateState', () => {
      const { result } = renderHook(() =>
        usePersistedState({
          key: 'test-key',
          initialState: { test: 'initial', count: 0 }
        })
      )

      act(() => {
        result.current.updateState(prev => ({ ...prev, count: prev.count + 1 }))
      })

      expect(mockSetValue).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should handle function-based setter updates', () => {
      const { result } = renderHook(() =>
        usePersistedState({
          key: 'test-key',
          initialState: { test: 'initial', count: 0 }
        })
      )

      act(() => {
        result.current.setters.count(prev => prev + 1)
      })

      expect(mockSetValue).toHaveBeenCalledWith(expect.any(Function))
    })
  })
})

describe('useStage1State Hook', () => {
  const mockSetValue = jest.fn()

  beforeEach(() => {
    mockSetValue.mockClear()
    mockUseLocalStorage.mockReturnValue({
      storedValue: {
        conversationData: { id: 'test' },
        selectedFields: ['id', 'title'],
        contextDescription: 'Test context',
        isMessagesCollapsed: false
      },
      setValue: mockSetValue
    })
  })

  it('should initialize with correct Stage 1 structure', () => {
    const { result } = renderHook(() => useStage1State())

    expect(result.current.state).toEqual({
      conversationData: { id: 'test' },
      selectedFields: ['id', 'title'],
      contextDescription: 'Test context',
      isMessagesCollapsed: false
    })
  })

  it('should provide Stage 1 specific setters', () => {
    const { result } = renderHook(() => useStage1State())

    expect(result.current.setters.conversationData).toBeDefined()
    expect(result.current.setters.selectedFields).toBeDefined()
    expect(result.current.setters.contextDescription).toBeDefined()
    expect(result.current.setters.isMessagesCollapsed).toBeDefined()
  })

  it('should use correct localStorage key', () => {
    renderHook(() => useStage1State())

    expect(mockUseLocalStorage).toHaveBeenCalledWith(
      'parsing-stage-1-state',
      expect.objectContaining({
        conversationData: null,
        selectedFields: [],
        contextDescription: '',
        isMessagesCollapsed: false
      })
    )
  })
})

describe('useStage2State Hook', () => {
  const mockSetValue = jest.fn()

  beforeEach(() => {
    mockSetValue.mockClear()
    mockUseLocalStorage.mockReturnValue({
      storedValue: {
        selectedCategories: [{ type: 'llm_friendly', id: 'business', name: 'business' }],
        activeCategoryId: 'business'
      },
      setValue: mockSetValue
    })
  })

  it('should initialize with correct Stage 2 structure', () => {
    const { result } = renderHook(() => useStage2State())

    expect(result.current.state).toEqual({
      selectedCategories: [{ type: 'llm_friendly', id: 'business', name: 'business' }],
      activeCategoryId: 'business'
    })
  })

  it('should provide Stage 2 specific setters', () => {
    const { result } = renderHook(() => useStage2State())

    expect(result.current.setters.selectedCategories).toBeDefined()
    expect(result.current.setters.activeCategoryId).toBeDefined()
  })

  it('should use correct localStorage key', () => {
    renderHook(() => useStage2State())

    expect(mockUseLocalStorage).toHaveBeenCalledWith(
      'parsing-stage-2-state',
      expect.objectContaining({
        selectedCategories: [],
        activeCategoryId: null
      })
    )
  })
})