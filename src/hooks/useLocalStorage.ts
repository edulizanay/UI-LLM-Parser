// ABOUTME: localStorage persistence hook with error handling and cleanup functionality
// ABOUTME: Provides type-safe state management with automatic persistence, quota handling, and expiry cleanup

import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize state with value from localStorage or initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Check if localStorage is available
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key)
        return item ? JSON.parse(item) : initialValue
      }
      return initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Set value and persist to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== 'undefined' && window.localStorage) {
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key)
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // Remove value from localStorage and reset to initial value
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key)
      }
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Clear expired data based on timestamp
  const clearExpired = useCallback((maxAge: number): boolean => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key)
        if (item) {
          const parsed = JSON.parse(item)
          if (parsed.timestamp && Date.now() - parsed.timestamp > maxAge) {
            removeValue()
            return true
          }
        }
      }
    } catch (error) {
      console.warn(`Error checking expiry for localStorage key "${key}":`, error)
    }
    return false
  }, [key, removeValue])

  return {
    storedValue,
    setValue,
    removeValue,
    clearExpired,
  }
}