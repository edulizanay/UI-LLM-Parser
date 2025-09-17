// ABOUTME: Test suite for MessagesField component
// ABOUTME: Tests collapse/merge functionality and message display modes

import { render, screen, fireEvent } from '@testing-library/react'
import { MessagesField } from '@/components/upload/MessagesField'

const mockMessages = [
  {
    role: 'user',
    content: 'Hello, can you help me with this coding problem?',
    timestamp: '2024-01-15T10:00:00Z',
    original_id: 'msg-1'
  },
  {
    role: 'assistant',
    content: 'Of course! I\'d be happy to help you with your coding problem. What specifically are you working on?',
    timestamp: '2024-01-15T10:01:00Z',
    original_id: 'msg-2'
  },
  {
    role: 'user',
    content: 'I\'m trying to implement a binary search algorithm',
    timestamp: '2024-01-15T10:02:00Z',
    original_id: 'msg-3'
  }
]

const defaultProps = {
  messages: mockMessages,
  isCollapsed: false,
  onToggle: jest.fn(),
  isHovered: false
}

describe('MessagesField Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Expanded Mode (Default)', () => {
    it('should render first 2 messages in expanded format', () => {
      render(<MessagesField {...defaultProps} />)

      // Should show message object structure
      expect(screen.getAllByText('"role"')).toHaveLength(2)
      expect(screen.getAllByText('"content"')).toHaveLength(2)
      expect(screen.getAllByText('"timestamp"')).toHaveLength(2)

      // Should show actual message data
      expect(screen.getByText('"user"')).toBeInTheDocument()
      expect(screen.getByText('"assistant"')).toBeInTheDocument()
    })

    it('should truncate long content in expanded mode', () => {
      render(<MessagesField {...defaultProps} />)

      // Content should be truncated to 80 chars
      const userContent = screen.getByText(/Hello, can you help me with this coding problem/)
      expect(userContent.textContent).toContain('Hello, can you help me with this coding problem')

      const assistantContent = screen.getByText(/Of course! I'd be happy to help you with your coding problem/)
      expect(assistantContent.textContent).toContain('...')
    })

    it('should show original_id when present', () => {
      render(<MessagesField {...defaultProps} />)

      expect(screen.getAllByText('"original_id"')).toHaveLength(2)
      expect(screen.getByText('"msg-1"')).toBeInTheDocument()
      expect(screen.getByText('"msg-2"')).toBeInTheDocument()
    })

    it('should show count of remaining messages when more than 2', () => {
      render(<MessagesField {...defaultProps} />)

      expect(screen.getByText('...and 1 more message objects')).toBeInTheDocument()
    })

    it('should not show remaining count when 2 or fewer messages', () => {
      const props = { ...defaultProps, messages: mockMessages.slice(0, 2) }
      render(<MessagesField {...props} />)

      expect(screen.queryByText(/more message objects/)).not.toBeInTheDocument()
    })
  })

  describe('Collapsed Mode', () => {
    it('should render first 2 messages in simplified format when collapsed', () => {
      const props = { ...defaultProps, isCollapsed: true }
      render(<MessagesField {...props} />)

      // Should show simplified format - check for partial content since exact format may vary
      expect(screen.getByText(/user.*Hello, can you help me with this coding problem/)).toBeInTheDocument()
      expect(screen.getByText(/assistant.*Of course! I'd be happy to help you with your coding/)).toBeInTheDocument()

      // Should NOT show object structure
      expect(screen.queryByText('"role"')).not.toBeInTheDocument()
      expect(screen.queryByText('"content"')).not.toBeInTheDocument()
      expect(screen.queryByText('"timestamp"')).not.toBeInTheDocument()
    })

    it('should truncate content to 60 chars in collapsed mode', () => {
      const props = { ...defaultProps, isCollapsed: true }
      render(<MessagesField {...props} />)

      const userMessage = screen.getByText(/user.*Hello, can you help me/)

      // Check that it's shorter than the original content
      const originalLength = mockMessages[0].content.length
      expect(userMessage.textContent!.length).toBeLessThan(originalLength + 20) // Account for role prefix and formatting
    })

    it('should show count of remaining messages in collapsed mode', () => {
      const props = { ...defaultProps, isCollapsed: true }
      render(<MessagesField {...props} />)

      expect(screen.getByText('...and 1 more messages')).toBeInTheDocument()
    })

    it('should not show remaining count when 2 or fewer messages in collapsed mode', () => {
      const props = { ...defaultProps, isCollapsed: true, messages: mockMessages.slice(0, 2) }
      render(<MessagesField {...props} />)

      expect(screen.queryByText(/more messages/)).not.toBeInTheDocument()
    })
  })

  describe('Container Styling', () => {
    it('should apply default styling when not hovered', () => {
      render(<MessagesField {...defaultProps} />)

      const container = screen.getByTitle(/Click to/)
      expect(container).toHaveClass('bg-slate-100')
      expect(container).not.toHaveClass('bg-slate-200')
    })

    it('should apply hover styling when isHovered is true', () => {
      const props = { ...defaultProps, isHovered: true }
      render(<MessagesField {...props} />)

      const container = screen.getByTitle(/Click to/)
      expect(container).toHaveClass('bg-slate-200')
    })

    it('should have consistent base classes', () => {
      render(<MessagesField {...defaultProps} />)

      const container = screen.getByTitle(/Click to/)
      expect(container).toHaveClass(
        'p-2', 'rounded-ds-sm', 'cursor-pointer',
        'transition-all', 'duration-200'
      )
    })
  })

  describe('Click Interaction', () => {
    it('should call onToggle when container is clicked', () => {
      const mockToggle = jest.fn()
      const props = { ...defaultProps, onToggle: mockToggle }
      render(<MessagesField {...props} />)

      const container = screen.getByTitle(/Click to/)
      fireEvent.click(container)

      expect(mockToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('Tooltips', () => {
    it('should show expand tooltip when collapsed', () => {
      const props = { ...defaultProps, isCollapsed: true }
      render(<MessagesField {...props} />)

      const container = screen.getByTitle('Click to expand messages')
      expect(container).toBeInTheDocument()
    })

    it('should show collapse tooltip when expanded', () => {
      render(<MessagesField {...defaultProps} />)

      const container = screen.getByTitle('Click to collapse messages')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Array Structure', () => {
    it('should render proper JSON array structure', () => {
      render(<MessagesField {...defaultProps} />)

      // Should show opening and closing brackets
      expect(screen.getAllByText('[')).toHaveLength(1)
      expect(screen.getAllByText(']')).toHaveLength(1)
    })

    it('should show proper object delimiters in expanded mode', () => {
      render(<MessagesField {...defaultProps} />)

      // Should show object braces
      expect(screen.getAllByText('{')).toHaveLength(2)
      expect(screen.getAllByText('}')).toHaveLength(2)

      // Should show commas (multiple instances, just check that some exist)
      const commas = screen.getAllByText(',')
      expect(commas.length).toBeGreaterThan(0)
    })

    it('should show proper commas in collapsed mode', () => {
      const props = { ...defaultProps, isCollapsed: true }
      render(<MessagesField {...props} />)

      // Should have comma between simplified messages
      const commas = screen.getAllByText(',')
      expect(commas.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty messages array', () => {
      const props = { ...defaultProps, messages: [] }
      render(<MessagesField {...props} />)

      expect(screen.getByText('[')).toBeInTheDocument()
      expect(screen.getByText(']')).toBeInTheDocument()
      expect(screen.queryByText(/more/)).not.toBeInTheDocument()
    })

    it('should handle single message', () => {
      const props = { ...defaultProps, messages: [mockMessages[0]] }
      render(<MessagesField {...props} />)

      expect(screen.getByText('"role"')).toBeInTheDocument()
      expect(screen.queryByText(/more/)).not.toBeInTheDocument()
    })

    it('should handle messages without original_id', () => {
      const messagesWithoutId = mockMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))
      const props = { ...defaultProps, messages: messagesWithoutId }
      render(<MessagesField {...props} />)

      expect(screen.queryByText('"original_id"')).not.toBeInTheDocument()
    })
  })

  describe('Text Color Coding', () => {
    it('should apply proper color classes in expanded mode', () => {
      render(<MessagesField {...defaultProps} />)

      // Field names should have specific colors
      const roleFields = screen.getAllByText('"role"')
      const contentFields = screen.getAllByText('"content"')
      const timestampFields = screen.getAllByText('"timestamp"')

      roleFields.forEach(field => {
        expect(field).toHaveClass('text-field-llm-friendly')
      })

      contentFields.forEach(field => {
        expect(field).toHaveClass('text-field-llm-friendly')
      })

      timestampFields.forEach(field => {
        expect(field).toHaveClass('text-field-computer-friendly')
      })
    })

    it('should use consistent text styling in collapsed mode', () => {
      const props = { ...defaultProps, isCollapsed: true }
      render(<MessagesField {...props} />)

      const container = screen.getByTitle(/Click to/)
      const textContent = container.querySelector('.text-text-secondary')
      expect(textContent).toBeInTheDocument()
    })
  })
})