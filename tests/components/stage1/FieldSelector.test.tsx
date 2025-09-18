// ABOUTME: Test suite for FieldSelector component - field categorization and selection
// ABOUTME: Tests computer/LLM-friendly visual distinction, collapse functionality, and statistics updates

import { render, screen, fireEvent } from '@testing-library/react'
import { FieldSelector } from '@/components/upload/FieldSelector'

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
    }
  ],
  detectedStructure: [
    { name: 'id', type: 'computer_friendly' as const, category: 'identifier' },
    { name: 'participant_a', type: 'computer_friendly' as const, category: 'metadata' },
    { name: 'participant_b', type: 'computer_friendly' as const, category: 'metadata' },
    { name: 'timestamp', type: 'computer_friendly' as const, category: 'metadata' },
    { name: 'messages', type: 'llm_friendly' as const, category: 'content', collapsible: true }
  ]
}

describe('FieldSelector Component', () => {
  const mockOnFieldSelectionChange = jest.fn()
  const mockOnStatisticsUpdate = jest.fn()

  beforeEach(() => {
    mockOnFieldSelectionChange.mockClear()
    mockOnStatisticsUpdate.mockClear()
  })

  describe('Field Structure Display', () => {
    it('should render all detected fields', () => {
      render(
        <FieldSelector
          fileData={mockFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
        />
      )

      expect(screen.getByText('id')).toBeInTheDocument()
      expect(screen.getByText('participant_a')).toBeInTheDocument()
      expect(screen.getByText('participant_b')).toBeInTheDocument()
      expect(screen.getByText('timestamp')).toBeInTheDocument()
      expect(screen.getByText('messages')).toBeInTheDocument()
    })

    it('should apply correct styling for computer-friendly fields', () => {
      render(
        <FieldSelector
          fileData={mockFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
        />
      )

      const idField = screen.getByTestId('field-id')
      expect(idField).toHaveClass('text-field-computer-friendly')
    })

    it('should apply correct styling for LLM-friendly fields', () => {
      render(
        <FieldSelector
          fileData={mockFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
        />
      )

      const messagesField = screen.getByTestId('field-messages')
      expect(messagesField).toHaveClass('text-field-llm-friendly')
    })

    it('should show special styling for collapsible messages field', () => {
      render(
        <FieldSelector
          fileData={mockFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
        />
      )

      const messagesField = screen.getByTestId('field-messages')
      expect(messagesField).toHaveClass('bg-slate-100')
    })
  })

  describe('Field Selection Functionality', () => {
    it('should allow toggling field selection', () => {
      render(
        <FieldSelector
          fileData={mockFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
        />
      )

      const idCheckbox = screen.getByTestId('checkbox-id')
      fireEvent.click(idCheckbox)

      expect(mockOnFieldSelectionChange).toHaveBeenCalledWith(['participant_a', 'participant_b', 'timestamp', 'messages'])
    })

    it('should apply dimmed styling to unselected fields', () => {
      render(
        <FieldSelector
          fileData={mockFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
          selectedFields={['id', 'messages']}
        />
      )

      const participantField = screen.getByTestId('field-participant_a')
      expect(participantField).toHaveClass('opacity-40')
    })

    it('should update statistics when field selection changes', () => {
      render(
        <FieldSelector
          fileData={mockFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
        />
      )

      const idCheckbox = screen.getByTestId('checkbox-id')
      fireEvent.click(idCheckbox)

      expect(mockOnStatisticsUpdate).toHaveBeenCalledWith({
        conversationCount: 1,
        interactionCount: 2,
        tokenCount: expect.any(Number)
      })
    })
  })

  describe('Messages Field Collapse Functionality', () => {
    it('should show collapse tooltip on messages field hover', () => {
      render(
        <FieldSelector
          fileData={mockFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
        />
      )

      const messagesField = screen.getByTestId('field-messages')
      fireEvent.mouseEnter(messagesField)

      expect(screen.getByText('Click to collapse')).toBeInTheDocument()
    })

    it('should toggle collapse state when messages field is clicked', () => {
      render(
        <FieldSelector
          fileData={mockFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
        />
      )

      const messagesField = screen.getByTestId('field-messages')
      fireEvent.click(messagesField)

      expect(screen.getByText('Collapsed - entire conversation will be tagged as one unit')).toBeInTheDocument()
    })

    it('should update statistics when messages field is collapsed', () => {
      render(
        <FieldSelector
          fileData={mockFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
        />
      )

      const messagesField = screen.getByTestId('field-messages')
      fireEvent.click(messagesField) // Collapse

      expect(mockOnStatisticsUpdate).toHaveBeenCalledWith({
        conversationCount: 1,
        interactionCount: 1, // Should be conversation count when collapsed
        tokenCount: expect.any(Number)
      })
    })

    it('should show uncollapse tooltip when messages field is collapsed', () => {
      render(
        <FieldSelector
          fileData={mockFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
          isMessagesCollapsed={true}
        />
      )

      const messagesField = screen.getByTestId('field-messages')
      fireEvent.mouseEnter(messagesField)

      expect(screen.getByText('Click to uncollapse')).toBeInTheDocument()
    })
  })

  describe('Field Categorization Display', () => {
    it('should show field type badges', () => {
      render(
        <FieldSelector
          fileData={mockFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
        />
      )

      expect(screen.getByText('computer-friendly')).toBeInTheDocument()
      expect(screen.getByText('llm-friendly')).toBeInTheDocument()
    })

    it('should display field categories', () => {
      render(
        <FieldSelector
          fileData={mockFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
        />
      )

      expect(screen.getByText('identifier')).toBeInTheDocument()
      expect(screen.getByText('metadata')).toBeInTheDocument()
      expect(screen.getByText('content')).toBeInTheDocument()
    })
  })

  describe('Error States', () => {
    it('should handle empty file data gracefully', () => {
      const emptyFileData = { ...mockFileData, content: [], detectedStructure: [] }

      render(
        <FieldSelector
          fileData={emptyFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
        />
      )

      expect(screen.getByText('No fields detected in uploaded file')).toBeInTheDocument()
    })

    it('should handle invalid field data', () => {
      const invalidFileData = {
        ...mockFileData,
        detectedStructure: [{ name: null, type: 'unknown' }]
      } as any // Type assertion for intentionally invalid test data

      render(
        <FieldSelector
          fileData={invalidFileData}
          onFieldSelectionChange={mockOnFieldSelectionChange}
          onStatisticsUpdate={mockOnStatisticsUpdate}
        />
      )

      expect(screen.getByText('Error processing field structure')).toBeInTheDocument()
    })
  })
})