// ABOUTME: Test suite for FilePreview component - JSON structure display with field filtering
// ABOUTME: Tests syntax highlighting, field selection filtering, and categorization colors

import { render, screen } from '@testing-library/react'
import { FilePreview } from '@/components/upload/FilePreview'

const mockFileData = {
  name: 'test-conversation.json',
  content: [
    {
      id: 'conv1',
      participant_a: 'user',
      participant_b: 'assistant',
      timestamp: '2023-01-01T10:00:00Z',
      messages: [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' }
      ]
    },
    {
      id: 'conv2',
      participant_a: 'user',
      participant_b: 'assistant',
      timestamp: '2023-01-01T11:00:00Z',
      messages: [
        { role: 'user', content: 'How are you?' },
        { role: 'assistant', content: 'I am doing well!' }
      ]
    }
  ],
  detectedStructure: [
    { name: 'id', type: 'computer_friendly', category: 'identifier' },
    { name: 'participant_a', type: 'computer_friendly', category: 'metadata' },
    { name: 'participant_b', type: 'computer_friendly', category: 'metadata' },
    { name: 'timestamp', type: 'computer_friendly', category: 'metadata' },
    { name: 'messages', type: 'llm_friendly', category: 'content', collapsible: true }
  ]
}

describe('FilePreview Component', () => {
  describe('Initial Display', () => {
    it('should show 2 examples from uploaded data', () => {
      render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id', 'participant_a', 'participant_b', 'timestamp', 'messages']}
        />
      )

      expect(screen.getByText('Example 1 of 2')).toBeInTheDocument()
      expect(screen.getByText('Example 2 of 2')).toBeInTheDocument()
    })

    it('should display JSON structure with proper formatting', () => {
      render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id', 'participant_a', 'participant_b', 'timestamp', 'messages']}
        />
      )

      expect(screen.getByText('"id":')).toBeInTheDocument()
      expect(screen.getByText('"conv1"')).toBeInTheDocument()
      expect(screen.getByText('"participant_a":')).toBeInTheDocument()
      expect(screen.getByText('"user"')).toBeInTheDocument()
    })

    it('should apply monospace font styling', () => {
      render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id', 'participant_a', 'participant_b', 'timestamp', 'messages']}
        />
      )

      const codeBlock = screen.getByTestId('json-preview-1')
      expect(codeBlock).toHaveClass('font-mono', 'text-ds-code')
    })
  })

  describe('Field Selection Filtering', () => {
    it('should hide unselected fields from examples', () => {
      render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id', 'messages']} // Only id and messages selected
        />
      )

      // Should show selected fields
      expect(screen.getByText('"id":')).toBeInTheDocument()
      expect(screen.getByText('"messages":')).toBeInTheDocument()

      // Should hide unselected fields
      expect(screen.queryByText('"participant_a":')).not.toBeInTheDocument()
      expect(screen.queryByText('"participant_b":')).not.toBeInTheDocument()
      expect(screen.queryByText('"timestamp":')).not.toBeInTheDocument()
    })

    it('should update preview when field selection changes', () => {
      const { rerender } = render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id', 'messages']}
        />
      )

      expect(screen.queryByText('"timestamp":')).not.toBeInTheDocument()

      rerender(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id', 'messages', 'timestamp']}
        />
      )

      expect(screen.getByText('"timestamp":')).toBeInTheDocument()
    })

    it('should maintain JSON structure validity when filtering fields', () => {
      render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id']}
        />
      )

      const jsonText = screen.getByTestId('json-preview-1').textContent
      expect(() => JSON.parse(jsonText || '')).not.toThrow()
    })
  })

  describe('Field Categorization Colors', () => {
    it('should apply blue color to computer-friendly field names', () => {
      render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id', 'participant_a', 'participant_b', 'timestamp', 'messages']}
        />
      )

      const idField = screen.getByTestId('field-name-id')
      expect(idField).toHaveClass('text-field-computer-friendly')
    })

    it('should apply warm color to LLM-friendly field names', () => {
      render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id', 'participant_a', 'participant_b', 'timestamp', 'messages']}
        />
      )

      const messagesField = screen.getByTestId('field-name-messages')
      expect(messagesField).toHaveClass('text-field-llm-friendly')
    })

    it('should apply neutral color to raw data values', () => {
      render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id', 'participant_a', 'participant_b', 'timestamp', 'messages']}
        />
      )

      const dataValue = screen.getByTestId('field-value-conv1')
      expect(dataValue).toHaveClass('text-text-secondary')
    })
  })

  describe('Messages Field Collapse State', () => {
    it('should show simplified format when messages field is collapsed', () => {
      render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id', 'messages']}
          isMessagesCollapsed={true}
        />
      )

      expect(screen.getByText('"user": "Hello"')).toBeInTheDocument()
      expect(screen.getByText('"assistant": "Hi there!"')).toBeInTheDocument()

      // Should not show full message objects
      expect(screen.queryByText('"role":')).not.toBeInTheDocument()
      expect(screen.queryByText('"content":')).not.toBeInTheDocument()
    })

    it('should show full format when messages field is expanded', () => {
      render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id', 'messages']}
          isMessagesCollapsed={false}
        />
      )

      expect(screen.getByText('"role":')).toBeInTheDocument()
      expect(screen.getByText('"content":')).toBeInTheDocument()
      expect(screen.getByText('"user"')).toBeInTheDocument()
      expect(screen.getByText('"Hello"')).toBeInTheDocument()
    })

    it('should show collapse indicator message', () => {
      render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id', 'messages']}
          isMessagesCollapsed={true}
        />
      )

      expect(screen.getByText('Collapsed - entire conversation will be tagged as one unit')).toBeInTheDocument()
    })

    it('should show expand indicator message', () => {
      render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['id', 'messages']}
          isMessagesCollapsed={false}
        />
      )

      expect(screen.getByText('Expanded - individual messages available for separate processing')).toBeInTheDocument()
    })
  })

  describe('Error States', () => {
    it('should handle empty file content', () => {
      const emptyFileData = { ...mockFileData, content: [] }

      render(
        <FilePreview
          fileData={emptyFileData}
          selectedFields={['id']}
        />
      )

      expect(screen.getByText('No data available for preview')).toBeInTheDocument()
    })

    it('should handle invalid JSON structure', () => {
      const invalidFileData = {
        ...mockFileData,
        content: [{ circular: undefined }]
      }

      render(
        <FilePreview
          fileData={invalidFileData}
          selectedFields={['circular']}
        />
      )

      expect(screen.getByText('Error displaying preview')).toBeInTheDocument()
    })

    it('should handle missing field data gracefully', () => {
      render(
        <FilePreview
          fileData={mockFileData}
          selectedFields={['nonexistent_field']}
        />
      )

      const jsonText = screen.getByTestId('json-preview-1').textContent
      expect(jsonText).toBe('{}') // Empty object for missing fields
    })
  })

  describe('Performance', () => {
    it('should limit to 2 examples regardless of data size', () => {
      const largeFileData = {
        ...mockFileData,
        content: Array(100).fill(mockFileData.content[0])
      }

      render(
        <FilePreview
          fileData={largeFileData}
          selectedFields={['id']}
        />
      )

      expect(screen.getByText('Example 1 of 2')).toBeInTheDocument()
      expect(screen.getByText('Example 2 of 2')).toBeInTheDocument()
      expect(screen.queryByText('Example 3 of')).not.toBeInTheDocument()
    })
  })
})