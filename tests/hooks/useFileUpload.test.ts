// ABOUTME: Test suite for useFileUpload hook - file handling, validation, and error states
// ABOUTME: Tests file upload workflow, JSON parsing, field initialization, and error recovery

import { renderHook, act } from '@testing-library/react'
import { useFileUpload } from '@/hooks/useFileUpload'

// Mock File.prototype.text() for test environment
global.File = class extends File {
  private mockContent: string

  constructor(fileBits: any[], fileName: string, options: any = {}) {
    super(fileBits, fileName, options)
    this.mockContent = typeof fileBits[0] === 'string' ? fileBits[0] : '{}'
  }

  text(): Promise<string> {
    return Promise.resolve(this.mockContent)
  }
}

describe('useFileUpload Hook', () => {
  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useFileUpload())

      expect(result.current.conversationData).toBeNull()
      expect(result.current.selectedFields).toEqual([])
      expect(result.current.error).toBeNull()
    })
  })

  describe('File Upload', () => {
    it('should process valid JSON file with conversations array', async () => {
      const { result } = renderHook(() => useFileUpload())

      const validData = {
        conversations: [{
          id: 'conv1',
          title: 'Test Conversation',
          date: '2023-01-01',
          messages: [
            { role: 'user', content: 'Hello', timestamp: '2023-01-01T10:00:00Z' }
          ]
        }]
      }

      const file = new File([JSON.stringify(validData)], 'test.json', { type: 'application/json' })

      await act(async () => {
        await result.current.uploadFile(file)
      })

      expect(result.current.conversationData).toEqual(validData.conversations[0])
      expect(result.current.selectedFields).toEqual(['id', 'title', 'date', 'messages'])
      expect(result.current.error).toBeNull()
    })

    it('should process valid JSON file with flat array', async () => {
      const { result } = renderHook(() => useFileUpload())

      const validData = [{
        id: 'conv1',
        title: 'Test Conversation',
        messages: []
      }]

      const file = new File([JSON.stringify(validData)], 'test.json', { type: 'application/json' })

      await act(async () => {
        await result.current.uploadFile(file)
      })

      expect(result.current.conversationData).toEqual(validData[0])
      expect(result.current.selectedFields).toEqual(['id', 'title', 'messages'])
      expect(result.current.error).toBeNull()
    })

    it('should handle empty file', async () => {
      const { result } = renderHook(() => useFileUpload())

      const file = new File([''], 'empty.json', { type: 'application/json' })

      await act(async () => {
        await result.current.uploadFile(file)
      })

      expect(result.current.conversationData).toBeNull()
      expect(result.current.selectedFields).toEqual([])
      expect(result.current.error).toBe('File appears to be empty')
    })

    it('should handle invalid JSON', async () => {
      const { result } = renderHook(() => useFileUpload())

      const file = new File(['invalid json'], 'invalid.json', { type: 'application/json' })

      await act(async () => {
        await result.current.uploadFile(file)
      })

      expect(result.current.conversationData).toBeNull()
      expect(result.current.selectedFields).toEqual([])
      expect(result.current.error).toBe('Error processing file: Invalid JSON format')
    })

    it('should handle file without conversations data', async () => {
      const { result } = renderHook(() => useFileUpload())

      const file = new File([JSON.stringify({ other: 'data' })], 'other.json', { type: 'application/json' })

      await act(async () => {
        await result.current.uploadFile(file)
      })

      expect(result.current.conversationData).toBeNull()
      expect(result.current.selectedFields).toEqual([])
      expect(result.current.error).toBe('File must contain conversations data')
    })

    it('should handle empty conversations array', async () => {
      const { result } = renderHook(() => useFileUpload())

      const file = new File([JSON.stringify({ conversations: [] })], 'empty.json', { type: 'application/json' })

      await act(async () => {
        await result.current.uploadFile(file)
      })

      expect(result.current.conversationData).toBeNull()
      expect(result.current.selectedFields).toEqual([])
      expect(result.current.error).toBe('No conversations found in file')
    })
  })

  describe('Field Selection', () => {
    beforeEach(async () => {
      // Helper to set up a hook with uploaded data
    })

    it('should update selected fields', async () => {
      const { result } = renderHook(() => useFileUpload())

      // First upload a file
      const validData = { conversations: [{ id: 'conv1', title: 'Test', messages: [] }] }
      const file = new File([JSON.stringify(validData)], 'test.json', { type: 'application/json' })

      await act(async () => {
        await result.current.uploadFile(file)
      })

      // Then update fields
      act(() => {
        result.current.setSelectedFields(['id', 'title'])
      })

      expect(result.current.selectedFields).toEqual(['id', 'title'])
    })

    it('should update selected fields with function', async () => {
      const { result } = renderHook(() => useFileUpload())

      // First upload a file
      const validData = { conversations: [{ id: 'conv1', title: 'Test', messages: [] }] }
      const file = new File([JSON.stringify(validData)], 'test.json', { type: 'application/json' })

      await act(async () => {
        await result.current.uploadFile(file)
      })

      // Then update fields with function
      act(() => {
        result.current.setSelectedFields(prev => prev.filter(field => field !== 'messages'))
      })

      expect(result.current.selectedFields).toEqual(['id', 'title'])
    })
  })

  describe('Error Handling', () => {
    it('should clear error', async () => {
      const { result } = renderHook(() => useFileUpload())

      // First cause an error
      const file = new File(['invalid'], 'invalid.json', { type: 'application/json' })
      await act(async () => {
        await result.current.uploadFile(file)
      })

      expect(result.current.error).toBeTruthy()

      // Then clear it
      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })

    it('should reset all state', async () => {
      const { result } = renderHook(() => useFileUpload())

      // First upload a file
      const validData = { conversations: [{ id: 'conv1', title: 'Test', messages: [] }] }
      const file = new File([JSON.stringify(validData)], 'test.json', { type: 'application/json' })

      await act(async () => {
        await result.current.uploadFile(file)
      })

      expect(result.current.conversationData).toBeTruthy()
      expect(result.current.selectedFields.length).toBeGreaterThan(0)

      // Then reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.conversationData).toBeNull()
      expect(result.current.selectedFields).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('should clear error on new upload attempt', async () => {
      const { result } = renderHook(() => useFileUpload())

      // First cause an error
      const invalidFile = new File(['invalid'], 'invalid.json', { type: 'application/json' })
      await act(async () => {
        await result.current.uploadFile(invalidFile)
      })

      expect(result.current.error).toBeTruthy()

      // Then upload valid file
      const validData = { conversations: [{ id: 'conv1', title: 'Test', messages: [] }] }
      const validFile = new File([JSON.stringify(validData)], 'test.json', { type: 'application/json' })

      await act(async () => {
        await result.current.uploadFile(validFile)
      })

      expect(result.current.error).toBeNull()
      expect(result.current.conversationData).toBeTruthy()
    })
  })
})