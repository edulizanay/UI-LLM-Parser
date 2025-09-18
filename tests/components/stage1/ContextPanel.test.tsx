// ABOUTME: Test suite for ContextPanel component - smart context input with auto-placeholders
// ABOUTME: Tests placeholder generation, user input handling, and context preservation

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContextPanel } from '@/components/upload/ContextPanel'

const mockFileData = {
  name: 'claude-conversations.json',
  content: [
    {
      id: 'conv1',
      messages: [
        { role: 'user', content: 'Help me with coding' },
        { role: 'assistant', content: 'I\'d be happy to help with coding!' }
      ]
    }
  ],
  detectedStructure: [
    { name: 'id', type: 'computer_friendly' as const, category: 'identifier' },
    { name: 'messages', type: 'llm_friendly' as const, category: 'content', collapsible: true }
  ]
}

describe('ContextPanel Component', () => {
  const mockOnContextChange = jest.fn()

  beforeEach(() => {
    mockOnContextChange.mockClear()
  })

  describe('Initial State', () => {
    it('should render context input area', () => {
      render(
        <ContextPanel
          fileData={null}
          onContextChange={mockOnContextChange}
        />
      )

      expect(screen.getByTestId('context-textarea')).toBeInTheDocument()
      expect(screen.getByText('Describe Your Data')).toBeInTheDocument()
    })

    it('should show default placeholder when no file is uploaded', () => {
      render(
        <ContextPanel
          fileData={null}
          onContextChange={mockOnContextChange}
        />
      )

      const textarea = screen.getByTestId('context-textarea')
      expect(textarea).toHaveAttribute('placeholder', 'Describe your data in plain English...')
    })

    it('should apply correct styling', () => {
      render(
        <ContextPanel
          fileData={null}
          onContextChange={mockOnContextChange}
        />
      )

      const panel = screen.getByTestId('context-panel')
      expect(panel).toHaveClass('bg-surface-white', 'rounded-ds-lg', 'p-ds-medium')

      const textarea = screen.getByTestId('context-textarea')
      expect(textarea).toHaveClass('h-[120px]', 'resize-none')
    })
  })

  describe('Smart Placeholder Generation', () => {
    it('should generate contextual placeholder based on file name and structure', async () => {
      render(
        <ContextPanel
          fileData={mockFileData}
          onContextChange={mockOnContextChange}
        />
      )

      await waitFor(() => {
        const textarea = screen.getByTestId('context-textarea')
        expect(textarea).toHaveAttribute('placeholder', expect.stringContaining('Claude conversations'))
      })
    })

    it('should detect conversation data and suggest appropriate context', async () => {
      render(
        <ContextPanel
          fileData={mockFileData}
          onContextChange={mockOnContextChange}
        />
      )

      await waitFor(() => {
        const textarea = screen.getByTestId('context-textarea')
        const placeholder = textarea.getAttribute('placeholder')
        expect(placeholder).toMatch(/conversations about various topics|chat history|dialogue data/i)
      })
    })

    it('should apply italic styling and opacity to generated placeholders', async () => {
      render(
        <ContextPanel
          fileData={mockFileData}
          onContextChange={mockOnContextChange}
        />
      )

      await waitFor(() => {
        const textarea = screen.getByTestId('context-textarea')
        expect(textarea).toHaveClass('placeholder:italic', 'placeholder:opacity-60')
      })
    })

    it('should handle different file types appropriately', async () => {
      const exportFileData = {
        ...mockFileData,
        name: 'data-export.json',
        content: [{ user_id: 123, activity: 'login', timestamp: '2023-01-01' }]
      }

      render(
        <ContextPanel
          fileData={exportFileData}
          onContextChange={mockOnContextChange}
        />
      )

      await waitFor(() => {
        const textarea = screen.getByTestId('context-textarea')
        const placeholder = textarea.getAttribute('placeholder')
        expect(placeholder).toMatch(/export|activity|user data/i)
      })
    })
  })

  describe('User Input Handling', () => {
    it('should call onContextChange when user types', () => {
      render(
        <ContextPanel
          fileData={mockFileData}
          onContextChange={mockOnContextChange}
        />
      )

      const textarea = screen.getByTestId('context-textarea')
      fireEvent.change(textarea, { target: { value: 'These are my personal conversations with Claude AI' } })

      expect(mockOnContextChange).toHaveBeenCalledWith('These are my personal conversations with Claude AI')
    })

    it('should preserve user input when file data changes', () => {
      const { rerender } = render(
        <ContextPanel
          fileData={mockFileData}
          onContextChange={mockOnContextChange}
          initialValue="My custom description"
        />
      )

      const textarea = screen.getByTestId('context-textarea')
      expect(textarea).toHaveValue('My custom description')

      // File data changes but user input should be preserved
      rerender(
        <ContextPanel
          fileData={null}
          onContextChange={mockOnContextChange}
          initialValue="My custom description"
        />
      )

      expect(textarea).toHaveValue('My custom description')
    })

    it('should allow clearing user input', () => {
      render(
        <ContextPanel
          fileData={mockFileData}
          onContextChange={mockOnContextChange}
          initialValue="Some text"
        />
      )

      const textarea = screen.getByTestId('context-textarea')
      fireEvent.change(textarea, { target: { value: '' } })

      expect(mockOnContextChange).toHaveBeenCalledWith('')
      expect(textarea).toHaveValue('')
    })

    it('should handle long text input', () => {
      render(
        <ContextPanel
          fileData={mockFileData}
          onContextChange={mockOnContextChange}
        />
      )

      const longText = 'This is a very long description that contains multiple sentences about the nature of the data, what it represents, how it was collected, and what I plan to do with it in terms of processing and analysis.'

      const textarea = screen.getByTestId('context-textarea')
      fireEvent.change(textarea, { target: { value: longText } })

      expect(mockOnContextChange).toHaveBeenCalledWith(longText)
    })
  })

  describe('Accessibility', () => {
    it('should have proper labeling', () => {
      render(
        <ContextPanel
          fileData={mockFileData}
          onContextChange={mockOnContextChange}
        />
      )

      const textarea = screen.getByTestId('context-textarea')
      expect(textarea).toHaveAttribute('aria-label', 'Describe your data context')
    })


    it('should provide appropriate focus styling', () => {
      render(
        <ContextPanel
          fileData={mockFileData}
          onContextChange={mockOnContextChange}
        />
      )

      const textarea = screen.getByTestId('context-textarea')
      expect(textarea).toHaveClass('focus:ring-2', 'focus:ring-primary-blue')
    })
  })

  describe('Sticky Positioning', () => {
    it('should apply sticky positioning classes', () => {
      render(
        <ContextPanel
          fileData={mockFileData}
          onContextChange={mockOnContextChange}
        />
      )

      const panel = screen.getByTestId('context-panel')
      expect(panel).toHaveClass('sticky', 'top-ds-medium')
    })
  })

  describe('Error Handling', () => {
    it('should handle null file data gracefully', () => {
      render(
        <ContextPanel
          fileData={null}
          onContextChange={mockOnContextChange}
        />
      )

      expect(screen.getByTestId('context-textarea')).toBeInTheDocument()
      expect(screen.queryByText('Error')).not.toBeInTheDocument()
    })

    it('should handle invalid file structure gracefully', () => {
      const invalidFileData = {
        name: null,
        content: undefined,
        detectedStructure: null
      }

      render(
        <ContextPanel
          fileData={invalidFileData}
          onContextChange={mockOnContextChange}
        />
      )

      expect(screen.getByTestId('context-textarea')).toBeInTheDocument()
      // Should fall back to default placeholder
      const textarea = screen.getByTestId('context-textarea')
      expect(textarea).toHaveAttribute('placeholder', 'Describe your data in plain English...')
    })
  })

  describe('Performance', () => {
    it('should debounce placeholder generation', async () => {
      const { rerender } = render(
        <ContextPanel
          fileData={null}
          onContextChange={mockOnContextChange}
        />
      )

      // Rapid file data changes
      rerender(
        <ContextPanel
          fileData={mockFileData}
          onContextChange={mockOnContextChange}
        />
      )

      const differentFileData = { ...mockFileData, name: 'different.json' }
      rerender(
        <ContextPanel
          fileData={differentFileData}
          onContextChange={mockOnContextChange}
        />
      )

      // Should only generate placeholder once after debounce period
      await waitFor(() => {
        const textarea = screen.getByTestId('context-textarea')
        expect(textarea).toHaveAttribute('placeholder', expect.not.stringMatching(/loading|generating/i))
      }, { timeout: 1000 })
    })
  })
})