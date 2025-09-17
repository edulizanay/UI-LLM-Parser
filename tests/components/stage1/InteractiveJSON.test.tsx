// ABOUTME: Test suite for InteractiveJSON component
// ABOUTME: Tests field selection, messages collapse/merge, and value visibility

import { render, screen, fireEvent } from '@testing-library/react'
import { InteractiveJSON } from '@/components/upload/InteractiveJSON'

const mockConversation = {
  id: 'test-conv-1',
  title: 'Test Conversation',
  date: '2024-01-15',
  source: 'test',
  message_count: 3,
  duration_minutes: 45,
  messages: [
    {
      role: 'user',
      content: 'Hello, can you help me?',
      timestamp: '2024-01-15T10:00:00Z',
      original_id: 'msg-1'
    },
    {
      role: 'assistant',
      content: 'Of course! I\'d be happy to help you.',
      timestamp: '2024-01-15T10:01:00Z',
      original_id: 'msg-2'
    }
  ],
  metadata: {
    source_file: 'test.json',
    has_attachments: false
  }
}

const defaultProps = {
  conversation: mockConversation,
  selectedFields: ['id', 'title', 'date', 'messages'],
  onFieldToggle: jest.fn(),
  isMessagesCollapsed: false,
  onMessagesToggle: jest.fn()
}

describe('InteractiveJSON Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render conversation structure heading', () => {
      render(<InteractiveJSON {...defaultProps} />)
      expect(screen.getByText('Conversation Structure')).toBeInTheDocument()
      expect(screen.getByText(/Click field names to select/)).toBeInTheDocument()
    })

    it('should render all conversation fields as clickable buttons', () => {
      render(<InteractiveJSON {...defaultProps} />)

      expect(screen.getByText('"id"')).toBeInTheDocument()
      expect(screen.getByText('"title"')).toBeInTheDocument()
      expect(screen.getByText('"date"')).toBeInTheDocument()
      expect(screen.getByText('"messages"')).toBeInTheDocument()
      expect(screen.getByText('"source"')).toBeInTheDocument()
      expect(screen.getByText('"message_count"')).toBeInTheDocument()
      expect(screen.getByText('"duration_minutes"')).toBeInTheDocument()
      expect(screen.getByText('"metadata"')).toBeInTheDocument()
    })

    it('should display field values for selected fields', () => {
      render(<InteractiveJSON {...defaultProps} />)

      expect(screen.getByText('"test-conv-1"')).toBeInTheDocument()
      expect(screen.getByText('"Test Conversation"')).toBeInTheDocument()
      expect(screen.getByText('"2024-01-15"')).toBeInTheDocument()
    })

    it('should hide field values for unselected fields', () => {
      const props = {
        ...defaultProps,
        selectedFields: ['id', 'title'] // Only some fields selected
      }
      render(<InteractiveJSON {...props} />)

      // Selected fields should show values
      expect(screen.getByText('"test-conv-1"')).toBeInTheDocument()
      expect(screen.getByText('"Test Conversation"')).toBeInTheDocument()

      // Unselected fields should show placeholder
      expect(screen.getAllByText('// field unselected')).toHaveLength(6) // 8 total - 2 selected
    })
  })

  describe('Field Selection', () => {
    it('should call onFieldToggle when field button is clicked', () => {
      const mockToggle = jest.fn()
      const props = { ...defaultProps, onFieldToggle: mockToggle }
      render(<InteractiveJSON {...props} />)

      const titleField = screen.getByText('"title"')
      fireEvent.click(titleField)

      expect(mockToggle).toHaveBeenCalledWith('title')
    })

    it('should apply different styles for selected vs unselected fields', () => {
      const props = {
        ...defaultProps,
        selectedFields: ['id'] // Only id selected
      }
      render(<InteractiveJSON {...props} />)

      const selectedField = screen.getByText('"id"')
      const unselectedField = screen.getByText('"title"')

      // Check button classes - selected should not have dimmed styling
      expect(selectedField.closest('button')).not.toHaveClass('opacity-40')
      expect(unselectedField.closest('button')).toHaveClass('opacity-40')
    })
  })

  describe('Messages Field Special Behavior', () => {
    it('should render messages field with special slate styling', () => {
      render(<InteractiveJSON {...defaultProps} />)

      const messagesField = screen.getByText('"messages"')
      const messagesButton = messagesField.closest('button')

      expect(messagesButton).toHaveClass('bg-slate-100')
    })

    it('should call onMessagesToggle when messages field value is clicked', () => {
      const mockMessagesToggle = jest.fn()
      const props = { ...defaultProps, onMessagesToggle: mockMessagesToggle }
      render(<InteractiveJSON {...props} />)

      // Find the messages field value container with specific title
      const messagesContainer = screen.getByTitle('Click to collapse messages')
      fireEvent.click(messagesContainer)

      expect(mockMessagesToggle).toHaveBeenCalled()
    })

    it('should show expanded messages by default', () => {
      render(<InteractiveJSON {...defaultProps} />)

      // Should show individual message objects with role/content/timestamp
      expect(screen.getByText('"role"')).toBeInTheDocument()
      expect(screen.getByText('"content"')).toBeInTheDocument()
      expect(screen.getByText('"timestamp"')).toBeInTheDocument()
      expect(screen.getByText('"user"')).toBeInTheDocument()
      expect(screen.getByText('"assistant"')).toBeInTheDocument()
    })

    it('should show collapsed messages when isMessagesCollapsed is true', () => {
      const props = { ...defaultProps, isMessagesCollapsed: true }
      render(<InteractiveJSON {...props} />)

      // Should show simplified format - check for partial content since exact format may vary
      expect(screen.getByText(/user.*Hello, can you help me/)).toBeInTheDocument()
      expect(screen.getByText(/assistant.*Of course/)).toBeInTheDocument()

      // Should not show individual object structure
      expect(screen.queryByText('"role"')).not.toBeInTheDocument()
      expect(screen.queryByText('"content"')).not.toBeInTheDocument()
    })

    it('should show collapse state indicator', () => {
      const propsCollapsed = { ...defaultProps, isMessagesCollapsed: true }
      const propsExpanded = { ...defaultProps, isMessagesCollapsed: false }

      // Test collapsed state
      const { rerender } = render(<InteractiveJSON {...propsCollapsed} />)
      expect(screen.getByText('Messages collapsed - entire conversation will be tagged as one unit')).toBeInTheDocument()

      // Test expanded state
      rerender(<InteractiveJSON {...propsExpanded} />)
      expect(screen.getByText('Messages expanded - individual messages available for separate processing')).toBeInTheDocument()
    })
  })

  describe('Field Type Classification', () => {
    it('should apply computer-friendly styling to selected appropriate fields', () => {
      // Only test fields that are actually selected in defaultProps
      render(<InteractiveJSON {...defaultProps} />)

      // Computer-friendly fields that are selected should have blue styling
      const idField = screen.getByText('"id"')
      const dateField = screen.getByText('"date"')

      expect(idField.closest('button')).toHaveClass('bg-blue-100')
      expect(dateField.closest('button')).toHaveClass('bg-blue-100')
    })

    it('should apply LLM-friendly styling to selected appropriate fields', () => {
      render(<InteractiveJSON {...defaultProps} />)

      // LLM-friendly fields that are selected should have warm red styling
      const titleField = screen.getByText('"title"')

      expect(titleField.closest('button')).toHaveClass('bg-red-100')
    })

    it('should apply dimmed styling to unselected fields regardless of type', () => {
      render(<InteractiveJSON {...defaultProps} />)

      // Unselected fields should have dimmed gray styling
      const sourceField = screen.getByText('"source"')
      const messageCountField = screen.getByText('"message_count"')

      expect(sourceField.closest('button')).toHaveClass('opacity-40', 'bg-gray-100')
      expect(messageCountField.closest('button')).toHaveClass('opacity-40', 'bg-gray-100')
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no fields are selected', () => {
      const props = { ...defaultProps, selectedFields: [] }
      render(<InteractiveJSON {...props} />)

      expect(screen.getByText('No fields selected. Click field names above to include them in processing.')).toBeInTheDocument()
    })

    it('should not show empty state when fields are selected', () => {
      render(<InteractiveJSON {...defaultProps} />)

      expect(screen.queryByText('No fields selected. Click field names above to include them in processing.')).not.toBeInTheDocument()
    })
  })

  describe('Text Truncation', () => {
    it('should truncate long field values', () => {
      const longConversation = {
        ...mockConversation,
        title: 'This is a very long conversation title that should be truncated because it exceeds the maximum length limit'
      }
      const props = { ...defaultProps, conversation: longConversation }
      render(<InteractiveJSON {...props} />)

      // Should show truncated version with ellipsis
      const titleText = screen.getByText(/This is a very long conversation title that should be truncated/)
      expect(titleText.textContent).toContain('...')
      expect(titleText.textContent?.length).toBeLessThan(longConversation.title.length + 10) // Account for quotes and ellipsis
    })
  })
})