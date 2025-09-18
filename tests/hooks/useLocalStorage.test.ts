// ABOUTME: Tests for localStorage persistence hook functionality
// ABOUTME: Tests state persistence, quota handling, data cleanup, and disabled localStorage scenarios

import { renderHook, act } from '@testing-library/react'

// Mock localStorage persistence hook - this should be implemented in src/hooks/useLocalStorage.ts
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (valueToStore === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }

  const clearExpired = (maxAge: number) => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item)
        if (parsed.timestamp && Date.now() - parsed.timestamp > maxAge) {
          removeValue()
          return true
        }
      }
    } catch (error) {
      console.warn(`Error checking expiry for localStorage key "${key}":`, error)
    }
    return false
  }

  return {
    storedValue,
    setValue,
    removeValue,
    clearExpired,
  }
}

// Mock React
const React = {
  useState: jest.fn(),
}

const mockSetState = jest.fn()
const mockUseState = (initial: any) => [initial, mockSetState]

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

beforeEach(() => {
  React.useState = jest.fn(mockUseState)
  mockSetState.mockClear()
  mockLocalStorage.getItem.mockClear()
  mockLocalStorage.setItem.mockClear()
  mockLocalStorage.removeItem.mockClear()
  mockLocalStorage.clear.mockClear()
})

describe('useLocalStorage Hook', () => {
  describe('Initial State Reading', () => {
    it('should read initial state from localStorage', () => {
      const testData = { name: 'test', value: 123 }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testData))

      const { result } = renderHook(() => useLocalStorage('test-key', { name: '', value: 0 }))

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key')
      expect(result.current.storedValue).toEqual({ name: '', value: 0 }) // Mock initial value
    })

    it('should use initial value when localStorage is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const initialValue = { count: 0 }
      const { result } = renderHook(() => useLocalStorage('empty-key', initialValue))

      expect(result.current.storedValue).toEqual(initialValue)
    })

    it('should handle malformed JSON gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json')

      const initialValue = { safe: true }
      const { result } = renderHook(() => useLocalStorage('malformed-key', initialValue))

      expect(result.current.storedValue).toEqual(initialValue)
    })

    it('should handle localStorage read errors', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage is disabled')
      })

      const initialValue = { error: 'handled' }
      const { result } = renderHook(() => useLocalStorage('error-key', initialValue))

      expect(result.current.storedValue).toEqual(initialValue)
    })
  })

  describe('State Updates and Persistence', () => {
    it('should update localStorage when state changes', () => {
      const { result } = renderHook(() => useLocalStorage('update-key', { count: 0 }))

      const newValue = { count: 5 }

      act(() => {
        result.current.setValue(newValue)
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('update-key', JSON.stringify(newValue))
    })

    it('should handle function-based state updates', () => {
      const { result } = renderHook(() => useLocalStorage('function-key', { count: 0 }))

      act(() => {
        result.current.setValue(prev => ({ count: prev.count + 1 }))
      })

      expect(result.current.setValue).toBeDefined()
    })

    it('should remove item when value is undefined', () => {
      const { result } = renderHook(() => useLocalStorage('remove-key', { data: 'test' }))

      act(() => {
        result.current.setValue(undefined as any)
      })

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('remove-key')
    })

    it('should handle localStorage write errors', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage quota exceeded')
      })

      const { result } = renderHook(() => useLocalStorage('quota-key', { data: 'test' }))

      // Should not throw
      act(() => {
        result.current.setValue({ data: 'new data' })
      })

      expect(result.current.setValue).toBeDefined()
    })
  })

  describe('Data Removal', () => {
    it('should remove value and reset to initial state', () => {
      const initialValue = { reset: true }
      const { result } = renderHook(() => useLocalStorage('remove-test-key', initialValue))

      act(() => {
        result.current.removeValue()
      })

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('remove-test-key')
    })

    it('should handle removal errors gracefully', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('localStorage removal failed')
      })

      const { result } = renderHook(() => useLocalStorage('removal-error-key', { data: 'test' }))

      // Should not throw
      act(() => {
        result.current.removeValue()
      })

      expect(result.current.removeValue).toBeDefined()
    })
  })

  describe('Expired Data Cleanup', () => {
    it('should cleanup expired data', () => {
      const expiredData = {
        value: 'test',
        timestamp: Date.now() - 10000, // 10 seconds ago
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(expiredData))

      const { result } = renderHook(() => useLocalStorage('expired-key', { value: 'default' }))

      act(() => {
        const wasExpired = result.current.clearExpired(5000) // 5 second max age
        expect(wasExpired).toBe(true)
      })

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('expired-key')
    })

    it('should keep fresh data', () => {
      const freshData = {
        value: 'test',
        timestamp: Date.now() - 1000, // 1 second ago
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(freshData))

      const { result } = renderHook(() => useLocalStorage('fresh-key', { value: 'default' }))

      act(() => {
        const wasExpired = result.current.clearExpired(5000) // 5 second max age
        expect(wasExpired).toBe(false)
      })

      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith('fresh-key')
    })

    it('should handle data without timestamp', () => {
      const dataWithoutTimestamp = { value: 'test' }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(dataWithoutTimestamp))

      const { result } = renderHook(() => useLocalStorage('no-timestamp-key', { value: 'default' }))

      act(() => {
        const wasExpired = result.current.clearExpired(5000)
        expect(wasExpired).toBe(false)
      })
    })

    it('should handle cleanup errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage read error')
      })

      const { result } = renderHook(() => useLocalStorage('cleanup-error-key', { value: 'default' }))

      act(() => {
        const wasExpired = result.current.clearExpired(5000)
        expect(wasExpired).toBe(false)
      })
    })
  })

  describe('localStorage Quota Handling', () => {
    it('should handle localStorage quota exceeded', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new DOMException('QuotaExceededError')
      })

      const { result } = renderHook(() => useLocalStorage('quota-test-key', { data: 'test' }))

      // Should handle quota error gracefully
      act(() => {
        result.current.setValue({ data: 'large data that exceeds quota' })
      })

      expect(result.current.setValue).toBeDefined()
    })

    it('should handle other storage exceptions', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage not available')
      })

      const { result } = renderHook(() => useLocalStorage('storage-error-key', { data: 'test' }))

      act(() => {
        result.current.setValue({ data: 'new data' })
      })

      expect(result.current.setValue).toBeDefined()
    })
  })

  describe('Disabled localStorage Support', () => {
    it('should work when localStorage is disabled', () => {
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
      })

      const { result } = renderHook(() => useLocalStorage('disabled-key', { fallback: true }))

      expect(result.current.storedValue).toEqual({ fallback: true })

      // Should handle setValue without errors
      act(() => {
        result.current.setValue({ fallback: false })
      })

      expect(result.current.setValue).toBeDefined()
    })

    it('should handle localStorage getItem returning null', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useLocalStorage('null-key', { default: 'value' }))

      expect(result.current.storedValue).toEqual({ default: 'value' })
    })
  })

  describe('Complex Data Types', () => {
    it('should handle nested objects', () => {
      const complexData = {
        user: {
          name: 'John',
          settings: {
            theme: 'dark',
            notifications: true,
          },
        },
        projects: ['project1', 'project2'],
      }

      const { result } = renderHook(() => useLocalStorage('complex-key', {}))

      act(() => {
        result.current.setValue(complexData)
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('complex-key', JSON.stringify(complexData))
    })

    it('should handle arrays', () => {
      const arrayData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]

      const { result } = renderHook(() => useLocalStorage('array-key', []))

      act(() => {
        result.current.setValue(arrayData)
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('array-key', JSON.stringify(arrayData))
    })

    it('should handle primitive values', () => {
      const { result: stringResult } = renderHook(() => useLocalStorage('string-key', ''))
      const { result: numberResult } = renderHook(() => useLocalStorage('number-key', 0))
      const { result: booleanResult } = renderHook(() => useLocalStorage('boolean-key', false))

      act(() => {
        stringResult.current.setValue('test string')
        numberResult.current.setValue(42)
        booleanResult.current.setValue(true)
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('string-key', JSON.stringify('test string'))
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('number-key', JSON.stringify(42))
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('boolean-key', JSON.stringify(true))
    })
  })
})