// ABOUTME: Integration test suite for Stage 1 complete workflow
// ABOUTME: Tests file upload through field selection to navigation - full user journey

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Stage1Page from '@/app/parse/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock File.prototype.text() method
global.File = class extends global.File {
  text(): Promise<string> {
    return Promise.resolve(this.mockContent || '{}')
  }

  constructor(fileBits: any[], fileName: string, options: any = {}) {
    super(fileBits, fileName, options)
    // Store content for mocking
    if (typeof fileBits[0] === 'string') {
      this.mockContent = fileBits[0]
    }
  }
}

const mockRouterPush = jest.fn()
const mockRouterBack = jest.fn()

describe('Stage 1 Integration', () => {
  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      back: mockRouterBack,
    })
    mockRouterPush.mockClear()
    mockRouterBack.mockClear()
  })

  describe('Page Layout and Navigation', () => {
    it('should render all main sections', () => {
      render(<Stage1Page />)

      expect(screen.getByText('Stage 1: Upload & Configure Data')).toBeInTheDocument()
      expect(screen.getByTestId('upload-zone')).toBeInTheDocument()
      expect(screen.getByTestId('context-panel')).toBeInTheDocument()
      // Processing stats only appear after file upload
      expect(screen.queryByTestId('processing-stats')).not.toBeInTheDocument()
    })

    it('should handle back navigation', () => {
      render(<Stage1Page />)

      const backButton = screen.getByText('Back')
      fireEvent.click(backButton)

      expect(mockRouterBack).toHaveBeenCalled()
    })

    it('should apply correct layout classes', () => {
      render(<Stage1Page />)

      const mainContent = screen.getByTestId('stage1-main')
      const gridContainer = mainContent.firstElementChild
      expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-3', 'gap-ds-large')
    })
  })

  describe('Complete Upload Workflow', () => {
    const validJsonContent = JSON.stringify({
      conversations: [{
        id: 'conv1',
        title: 'Test Conversation',
        date: '2023-01-01',
        messages: [
          { role: 'user', content: 'Hello', timestamp: '2023-01-01T10:00:00Z' },
          { role: 'assistant', content: 'Hi there!', timestamp: '2023-01-01T10:01:00Z' }
        ]
      }]
    })

    const validJsonFile = new File([validJsonContent], 'conversations.json', { type: 'application/json' })

    it('should show field selection interface after successful upload', async () => {
      render(<Stage1Page />)

      const uploadZone = screen.getByTestId('upload-zone')

      // Simulate file drop
      fireEvent.drop(uploadZone, {
        dataTransfer: { files: [validJsonFile] }
      })

      await waitFor(() => {
        expect(screen.getByText('Conversation Structure')).toBeInTheDocument()
        expect(screen.getByText(/Click field names to select/)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should update context panel with smart placeholder after upload', async () => {
      render(<Stage1Page />)

      const uploadZone = screen.getByTestId('upload-zone')
      const placeholderFile = new File([JSON.stringify({ conversations: [{ messages: [] }] })], 'test.json', { type: 'application/json' })
      fireEvent.drop(uploadZone, { dataTransfer: { files: [placeholderFile] } })

      await waitFor(() => {
        const contextTextarea = screen.getByTestId('context-textarea')
        expect(contextTextarea).toHaveAttribute('placeholder', expect.stringContaining('conversation'))
      })
    })

    it('should update processing statistics in real-time', async () => {
      render(<Stage1Page />)

      const uploadZone = screen.getByTestId('upload-zone')
      fireEvent.drop(uploadZone, { dataTransfer: { files: [validJsonFile] } })

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument() // Conversation count
        expect(screen.getByText('2')).toBeInTheDocument() // Interaction count
      })
    })
  })

  describe('Field Selection Integration', () => {
    beforeEach(async () => {
      render(<Stage1Page />)

      const uploadZone = screen.getByTestId('upload-zone')
      const testFile = new File([JSON.stringify({ conversations: [{ test: "data", messages: [] }] })], 'test.json', { type: 'application/json' })
      fireEvent.drop(uploadZone, { dataTransfer: { files: [testFile] } })

      await waitFor(() => {
        expect(screen.getByText('Conversation Structure')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should filter field values based on field selection', async () => {
      const testFieldButton = screen.getByText('"test"')
      fireEvent.click(testFieldButton) // Unselect test field

      await waitFor(() => {
        expect(screen.getByText('// field unselected')).toBeInTheDocument()
      })
    })

    it('should update statistics when fields are deselected', async () => {
      const initialStats = screen.getByTestId('processing-stats').textContent

      const messagesFieldButton = screen.getByText('"messages"')
      fireEvent.click(messagesFieldButton) // Unselect messages field

      await waitFor(() => {
        const newStats = screen.getByTestId('processing-stats').textContent
        expect(newStats).not.toBe(initialStats)
      })
    })

    it('should handle messages field collapse/expand', async () => {
      // Find the messages field container (slate background)
      const messagesContainer = screen.getByTitle(/Click to collapse/)
      fireEvent.click(messagesContainer) // Collapse

      await waitFor(() => {
        expect(screen.getByText('Collapsed - entire conversation will be tagged as one unit')).toBeInTheDocument()
      })

      fireEvent.click(messagesContainer) // Expand

      await waitFor(() => {
        expect(screen.getByText('Expanded - individual messages available for separate processing')).toBeInTheDocument()
      })
    })
  })

  describe('Error State Handling', () => {
    it('should display error for invalid file upload', async () => {
      render(<Stage1Page />)

      const uploadZone = screen.getByTestId('upload-zone')
      const invalidFile = new File(['invalid json content'], 'invalid.json', { type: 'application/json' })

      fireEvent.drop(uploadZone, { dataTransfer: { files: [invalidFile] } })

      mockFileReader.onerror?.({ target: { error: new Error('Invalid JSON') } } as any)

      await waitFor(() => {
        expect(screen.getByText(/error processing file/i)).toBeInTheDocument()
      })
    })

    it('should handle empty file upload', async () => {
      render(<Stage1Page />)

      const uploadZone = screen.getByTestId('upload-zone')
      const emptyFile = new File([''], 'empty.json', { type: 'application/json' })

      fireEvent.drop(uploadZone, { dataTransfer: { files: [emptyFile] } })

      mockFileReader.onload?.({ target: { result: '' } } as any)

      await waitFor(() => {
        expect(screen.getByText(/file appears to be empty/i)).toBeInTheDocument()
      })
    })

    it('should recover from error states', async () => {
      render(<Stage1Page />)

      const uploadZone = screen.getByTestId('upload-zone')

      // First upload invalid file
      const invalidFile = new File(['invalid'], 'invalid.json', { type: 'application/json' })
      fireEvent.drop(uploadZone, { dataTransfer: { files: [invalidFile] } })
      mockFileReader.onerror?.({ target: { error: new Error('Invalid') } } as any)

      await waitFor(() => {
        expect(screen.getByText(/error processing file/i)).toBeInTheDocument()
      })

      // Then upload valid file
      const validFile = new File(['{"valid": "json"}'], 'valid.json', { type: 'application/json' })
      fireEvent.drop(uploadZone, { dataTransfer: { files: [validFile] } })
      mockFileReader.onload?.({ target: { result: '{"valid": "json"}' } } as any)

      await waitFor(() => {
        expect(screen.queryByText(/error processing file/i)).not.toBeInTheDocument()
        expect(screen.getByText('Conversation Structure')).toBeInTheDocument()
      })
    })
  })

  describe('Stage Navigation', () => {
    it('should enable continue button when file is uploaded and fields selected', async () => {
      render(<Stage1Page />)

      // Initially disabled
      const continueButton = screen.getByTestId('continue-button')
      expect(continueButton).toBeDisabled()

      // Upload file
      const uploadZone = screen.getByTestId('upload-zone')
      const validFile = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' })
      fireEvent.drop(uploadZone, { dataTransfer: { files: [validFile] } })
      mockFileReader.onload?.({ target: { result: '{"test": "data"}' } } as any)

      await waitFor(() => {
        expect(continueButton).not.toBeDisabled()
      })
    })

    it('should navigate to Stage 2 when continue is clicked', async () => {
      render(<Stage1Page />)

      // Upload file and enable continue
      const uploadZone = screen.getByTestId('upload-zone')
      const validFile = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' })
      fireEvent.drop(uploadZone, { dataTransfer: { files: [validFile] } })
      mockFileReader.onload?.({ target: { result: '{"test": "data"}' } } as any)

      await waitFor(() => {
        const continueButton = screen.getByTestId('continue-button')
        expect(continueButton).not.toBeDisabled()
      })

      const continueButton = screen.getByTestId('continue-button')
      fireEvent.click(continueButton)

      expect(mockRouterPush).toHaveBeenCalledWith('/parse/categorize')
    })

    it('should preserve state when navigating back and forth', async () => {
      render(<Stage1Page />)

      // Upload file and make selections
      const uploadZone = screen.getByTestId('upload-zone')
      const validFile = new File(['{"test": "data", "messages": []}'], 'test.json', { type: 'application/json' })
      fireEvent.drop(uploadZone, { dataTransfer: { files: [validFile] } })
      mockFileReader.onload?.({ target: { result: '{"test": "data", "messages": []}' } } as any)

      await waitFor(() => {
        expect(screen.getByText('Conversation Structure')).toBeInTheDocument()
      })

      // Deselect a field
      const testFieldButton = screen.getByText('"test"')
      fireEvent.click(testFieldButton)

      // Add context description
      const contextTextarea = screen.getByTestId('context-textarea')
      fireEvent.change(contextTextarea, { target: { value: 'My test data description' } })

      // Simulate page refresh/re-render
      // State should be preserved via localStorage
      expect(contextTextarea).toHaveValue('My test data description')
    })
  })
})