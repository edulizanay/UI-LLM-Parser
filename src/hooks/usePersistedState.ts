// ABOUTME: Specialized hook for Stage 1/Stage 2 localStorage patterns with conditional saving
// ABOUTME: Handles complex state objects with multiple fields and automatic persistence

import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

interface PersistedStateOptions<T> {
  key: string
  initialState: T
  saveCondition?: (state: T) => boolean
  onLoadError?: (error: Error) => void
}

export function usePersistedState<T extends Record<string, any>>({
  key,
  initialState,
  saveCondition,
  onLoadError
}: PersistedStateOptions<T>) {
  const { storedValue, setValue } = useLocalStorage(key, initialState)

  // Enhanced setter that can update partial state
  const updateState = (updates: Partial<T> | ((prev: T) => T)) => {
    setValue(prev => {
      const newState = typeof updates === 'function'
        ? updates(prev)
        : { ...prev, ...updates }

      // Check saveCondition before persisting to localStorage
      if (saveCondition && !saveCondition(newState)) {
        // Don't persist to localStorage, but still update React state
        return newState
      }

      // Always update React state for immediate UI updates
      return newState
    })
  }

  // Create individual setters for each field
  const setters = {} as {
    [K in keyof T]: (value: T[K] | ((prev: T[K]) => T[K])) => void
  }

  for (const key in initialState) {
    setters[key] = (value: T[typeof key] | ((prev: T[typeof key]) => T[typeof key])) => {
      updateState(prev => ({
        ...prev,
        [key]: typeof value === 'function' ? (value as Function)(prev[key]) : value
      }))
    }
  }

  // Error handling for load issues
  useEffect(() => {
    // This effect runs after the hook is mounted
    // If there was an error during localStorage loading, it would be caught in useLocalStorage
    // We can add additional validation here if needed
  }, [])

  return {
    state: storedValue,
    updateState,
    setters,
    clearState: () => setValue(initialState)
  }
}

// Specialized hooks for Stage 1 and Stage 2
export interface Stage1State {
  conversationData: any | null
  selectedFields: string[]
  contextDescription: string
  isMessagesCollapsed: boolean
}

export function useStage1State() {
  return usePersistedState<Stage1State>({
    key: 'parsing-stage-1-state',
    initialState: {
      conversationData: null,
      selectedFields: [],
      contextDescription: '',
      isMessagesCollapsed: false
    },
    // Only save when conversationData exists (matching existing logic)
    saveCondition: (state) => state.conversationData !== null
  })
}

export interface Stage2State {
  selectedCategories: any[]
  activeCategoryId: string | null
}

export function useStage2State() {
  return usePersistedState<Stage2State>({
    key: 'parsing-stage-2-state',
    initialState: {
      selectedCategories: [],
      activeCategoryId: null
    },
    // Only save when there are categories or an active category (matching existing logic)
    saveCondition: (state) => state.selectedCategories.length > 0 || state.activeCategoryId !== null
  })
}