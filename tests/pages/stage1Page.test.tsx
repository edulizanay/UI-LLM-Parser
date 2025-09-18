// ABOUTME: Tests for Stage 1 file upload and field selection page
// ABOUTME: Verifies page integration, file upload workflow, and localStorage persistence

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import Stage1Page from '@/app/parse/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock file API
const mockFileReader = {
  readAsText: jest.fn(),
  result: '',
  onload: null as any,
  onerror: null as any,
}

Object.defineProperty(window, 'FileReader', {
  writable: true,
  value: jest.fn(() => mockFileReader),
})

const mockPush = jest.fn()
const mockBack = jest.fn()

beforeEach(() => {
  ;(useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
    back: mockBack,
  })
  mockPush.mockClear()
  mockBack.mockClear()

  // Clear localStorage
  localStorage.clear()

  // Reset FileReader mock
  mockFileReader.result = ''
  mockFileReader.onload = null
  mockFileReader.onerror = null
})

const mockConversationData = {
  id: 'conv-1',
  title: 'Test Conversation',
  date: '2024-09-18',
  source: 'claude',
  message_count: 2,
  duration_minutes: 15,
  messages: [
    {
      role: 'user',
      content: 'Hello, how are you?',
      timestamp: '2024-09-18T10:00:00Z',
      original_id: 'msg-1'
    },
    {
      role: 'assistant',
      content: 'I am doing well, thank you for asking!',
      timestamp: '2024-09-18T10:01:00Z',
      original_id: 'msg-2'
    }
  ],
  metadata: { test: true }
}

describe('Stage 1 Page', () => {
  describe('Page Integration', () => {
    it('should integrate all Stage 1 components correctly', () => {
      render(<Stage1Page />)

      expect(screen.getByTestId('stage1-page')).toBeInTheDocument()
      expect(screen.getByTestId('stage1-main')).toBeInTheDocument()

      // Should show navigation
      expect(screen.getByText('Back')).toBeInTheDocument()
      expect(screen.getByText('Stage 1: Upload & Configure Data')).toBeInTheDocument()

      // Should show upload zone initially
      expect(screen.getByText('Drop your conversation file here')).toBeInTheDocument()
    })

    it('should handle file upload workflow end-to-end', async () => {
      const user = userEvent.setup()
      render(<Stage1Page />)

      // Create a mock file
      const file = new File([JSON.stringify([mockConversationData])], 'test.json', {
        type: 'application/json',
      })

      // Mock FileReader behavior
      mockFileReader.readAsText.mockImplementation(() => {
        mockFileReader.result = JSON.stringify([mockConversationData])
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: mockFileReader } as any)
        }
      })

      // Find file input and upload file
      const fileInput = screen.getByTestId('file-input')
      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(screen.getByText('Test Conversation')).toBeInTheDocument()
      })

      // Should show interactive JSON and context panel
      expect(screen.getByText('title')).toBeInTheDocument()
      expect(screen.getByText('messages')).toBeInTheDocument()
      expect(screen.getByTestId('processing-stats')).toBeInTheDocument()
    })

    it('should persist state to localStorage on field selection', async () => {
      const user = userEvent.setup()
      render(<Stage1Page />)

      // Upload file first
      const file = new File([JSON.stringify([mockConversationData])], 'test.json', {
        type: 'application/json',
      })

      mockFileReader.readAsText.mockImplementation(() => {
        mockFileReader.result = JSON.stringify([mockConversationData])
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: mockFileReader } as any)
        }
      })

      const fileInput = screen.getByTestId('file-input')
      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(screen.getByText('Test Conversation')).toBeInTheDocument()
      })

      // Verify localStorage was updated
      const savedState = localStorage.getItem('parsing-stage-1-state')
      expect(savedState).toBeTruthy()

      const state = JSON.parse(savedState!)
      expect(state.conversationData).toBeDefined()
      expect(state.selectedFields).toContain('id')
      expect(state.selectedFields).toContain('title')
    })

    it('should validate required fields before allowing continue', async () => {
      const user = userEvent.setup()
      render(<Stage1Page />)

      // Initially, continue button should not be present
      expect(screen.queryByTestId('continue-button')).not.toBeInTheDocument()

      // Upload file
      const file = new File([JSON.stringify([mockConversationData])], 'test.json', {
        type: 'application/json',
      })

      mockFileReader.readAsText.mockImplementation(() => {
        mockFileReader.result = JSON.stringify([mockConversationData])
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: mockFileReader } as any)
        }
      })

      const fileInput = screen.getByTestId('file-input')
      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(screen.getByTestId('continue-button')).toBeInTheDocument()
      })

      // Should be enabled with fields selected
      const continueButton = screen.getByTestId('continue-button')
      expect(continueButton).not.toBeDisabled()

      // Click continue should navigate
      await user.click(continueButton)
      expect(mockPush).toHaveBeenCalledWith('/parse/categorize')
    })
  })

  describe('Stage 1 Error Handling', () => {
    it('should handle large file upload failures', async () => {
      const user = userEvent.setup()
      render(<Stage1Page />)

      // Mock FileReader to simulate failure
      mockFileReader.readAsText.mockImplementation(() => {
        if (mockFileReader.onerror) {
          mockFileReader.onerror({ target: mockFileReader } as any)
        }
      })

      const file = new File(['invalid content'], 'test.json', {
        type: 'application/json',
      })

      const fileInput = screen.getByTestId('file-input')
      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(screen.getByText(/Error processing file/)).toBeInTheDocument()
      })
    })

    it('should recover from malformed JSON files', async () => {
      const user = userEvent.setup()
      render(<Stage1Page />)

      mockFileReader.readAsText.mockImplementation(() => {
        mockFileReader.result = 'invalid json'
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: mockFileReader } as any)
        }
      })

      const file = new File(['invalid json'], 'test.json', {
        type: 'application/json',
      })

      const fileInput = screen.getByTestId('file-input')
      await user.upload(fileInput, file)

      await waitFor(() => {
        expect(screen.getByText(/Invalid JSON format/)).toBeInTheDocument()
      })

      // Should still show upload zone for retry
      expect(screen.getByText('Drop your conversation file here')).toBeInTheDocument()
    })

    it('should handle network interruptions during file processing', async () => {
      // This test simulates file reading interruption
      const user = userEvent.setup()
      render(<Stage1Page />)

      mockFileReader.readAsText.mockImplementation(() => {
        // Simulate network interruption
        setTimeout(() => {
          if (mockFileReader.onerror) {
            mockFileReader.onerror({ target: mockFileReader } as any)
          }
        }, 10)
      })

      const file = new File([JSON.stringify([mockConversationData])], 'test.json', {
        type: 'application/json',
      })

      const fileInput = screen.getByTestId('file-input')
      await user.upload(fileInput, file)

      // Should handle the error gracefully
      await waitFor(() => {
        expect(screen.getByText(/Error processing file/)).toBeInTheDocument()
      })
    })

    it('should provide clear error messages for user actions', async () => {
      const user = userEvent.setup()
      render(<Stage1Page />)

      // Test empty file
      mockFileReader.readAsText.mockImplementation(() => {
        mockFileReader.result = ''
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: mockFileReader } as any)
        }
      })

      const emptyFile = new File([''], 'empty.json', {
        type: 'application/json',
      })

      const fileInput = screen.getByTestId('file-input')
      await user.upload(fileInput, emptyFile)

      await waitFor(() => {
        expect(screen.getByText('File appears to be empty')).toBeInTheDocument()
      })

      // Test file without conversations
      mockFileReader.readAsText.mockImplementation(() => {
        mockFileReader.result = JSON.stringify({ other: 'data' })
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: mockFileReader } as any)
        }
      })

      const invalidFile = new File([JSON.stringify({ other: 'data' })], 'invalid.json', {
        type: 'application/json',
      })

      await user.upload(fileInput, invalidFile)

      await waitFor(() => {
        expect(screen.getByText('File must contain conversations data')).toBeInTheDocument()
      })
    })
  })

  describe('State Management', () => {
    it('should restore state from localStorage on mount', () => {
      const savedState = {
        conversationData: mockConversationData,
        selectedFields: ['id', 'title'],
        contextDescription: 'Test context',
        isMessagesCollapsed: false,
      }

      localStorage.setItem('parsing-stage-1-state', JSON.stringify(savedState))

      render(<Stage1Page />)

      // Should restore the conversation data
      expect(screen.getByText('Test Conversation')).toBeInTheDocument()
      expect(screen.getByTestId('continue-button')).toBeInTheDocument()
    })

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('parsing-stage-1-state', 'invalid json')

      // Should not crash
      render(<Stage1Page />)

      expect(screen.getByTestId('stage1-page')).toBeInTheDocument()
      expect(screen.getByText('Drop your conversation file here')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should handle back navigation', async () => {
      const user = userEvent.setup()
      render(<Stage1Page />)

      const backButton = screen.getByText('Back')
      await user.click(backButton)

      expect(mockBack).toHaveBeenCalled()
    })

    it('should navigate to categorization on continue', async () => {
      const user = userEvent.setup()

      const savedState = {
        conversationData: mockConversationData,
        selectedFields: ['id', 'title', 'messages'],
        contextDescription: '',
        isMessagesCollapsed: false,
      }

      localStorage.setItem('parsing-stage-1-state', JSON.stringify(savedState))

      render(<Stage1Page />)

      const continueButton = screen.getByTestId('continue-button')
      await user.click(continueButton)

      expect(mockPush).toHaveBeenCalledWith('/parse/categorize')
    })
  })

  describe('Statistics Calculation', () => {
    it('should calculate statistics correctly', async () => {
      const savedState = {
        conversationData: mockConversationData,
        selectedFields: ['id', 'title', 'messages'],
        contextDescription: '',
        isMessagesCollapsed: false,
      }

      localStorage.setItem('parsing-stage-1-state', JSON.stringify(savedState))

      render(<Stage1Page />)

      const statsSection = screen.getByTestId('processing-stats')

      // Should show correct conversation count
      expect(statsSection).toHaveTextContent('1')
      expect(statsSection).toHaveTextContent('Conversation')

      // Should show message count when expanded
      expect(statsSection).toHaveTextContent('Messages')
    })
  })
})