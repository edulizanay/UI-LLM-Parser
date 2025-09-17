// ABOUTME: Test suite for PreviewPanel component
// ABOUTME: Tests real-time categorization preview and conversation examples

import { render, screen } from '@testing-library/react'
import { PreviewPanel } from '@/components/categorization/PreviewPanel'

const mockPreviewData = [
  {
    conversation_id: '4d8ad794-2efe-4612-ad7b-33d8f1abfab6',
    conversation_title: 'Inquiring About Pricing Difference and Discount',
    sample_content: 'Answer Spencer that I see it\'s more expensive than the website, if he could clarify the difference with the website. Ask him if he\'s willing to make us a discount...',
    predicted_tags: ['business', 'negotiation']
  },
  {
    conversation_id: 'ca7e1835-b085-4048-b4d5-f9fe2a99c78e',
    conversation_title: 'Learning Python Data Structures',
    sample_content: 'Hey Claude, I want to learn more about Python dictionaries and how to use them effectively in my code.',
    predicted_tags: ['personal_growth', 'coding', 'programming']
  }
]

const mockStatistics = {
  conversations: 3,
  categories: 5,
  avg_tags: 2.1,
  coverage: 94
}

const defaultProps = {
  selectedCategories: [
    { type: 'llm_friendly', id: 'business', name: 'business' },
    { type: 'llm_friendly', id: 'personal_growth', name: 'personal_growth' }
  ],
  previewData: mockPreviewData,
  statistics: mockStatistics
}

describe('PreviewPanel Component', () => {
  describe('Rendering Structure', () => {
    it('should render header and description', () => {
      render(<PreviewPanel {...defaultProps} />)

      expect(screen.getByText('Preview Results')).toBeInTheDocument()
      expect(screen.getByText('See how your categories will be applied')).toBeInTheDocument()
    })

    it('should render conversation examples when categories are selected', () => {
      render(<PreviewPanel {...defaultProps} />)

      expect(screen.getByText('Inquiring About Pricing Difference and Discount')).toBeInTheDocument()
      expect(screen.getByText('Learning Python Data Structures')).toBeInTheDocument()
    })

    it('should render statistics summary', () => {
      render(<PreviewPanel {...defaultProps} />)

      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('2.1')).toBeInTheDocument()
      expect(screen.getByText('94%')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no categories selected', () => {
      const props = {
        ...defaultProps,
        selectedCategories: [],
        previewData: []
      }
      render(<PreviewPanel {...props} />)

      expect(screen.getByText('Select categories to see preview')).toBeInTheDocument()
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument()
    })

    it('should not show conversation examples in empty state', () => {
      const props = {
        ...defaultProps,
        selectedCategories: [],
        previewData: []
      }
      render(<PreviewPanel {...props} />)

      expect(screen.queryByText('Inquiring About Pricing Difference and Discount')).not.toBeInTheDocument()
    })
  })

  describe('Conversation Examples', () => {
    it('should display conversation titles', () => {
      render(<PreviewPanel {...defaultProps} />)

      expect(screen.getByText('Inquiring About Pricing Difference and Discount')).toBeInTheDocument()
      expect(screen.getByText('Learning Python Data Structures')).toBeInTheDocument()
    })

    it('should display conversation content snippets', () => {
      render(<PreviewPanel {...defaultProps} />)

      expect(screen.getByText(/Answer Spencer that I see it's more expensive/)).toBeInTheDocument()
      expect(screen.getByText(/Hey Claude, I want to learn more about Python dictionaries/)).toBeInTheDocument()
    })

    it('should truncate long content appropriately', () => {
      const longContentProps = {
        ...defaultProps,
        previewData: [{
          ...mockPreviewData[0],
          sample_content: 'This is a very long conversation content that should be truncated to show only the first few lines and not overwhelm the preview panel with too much text content that would make it hard to read.'
        }]
      }
      render(<PreviewPanel {...longContentProps} />)

      const content = screen.getByText(/This is a very long conversation/)
      expect(content.textContent!.length).toBeLessThan(200)
    })

    it('should limit to maximum 2 conversation examples', () => {
      const manyExamplesProps = {
        ...defaultProps,
        previewData: [
          ...mockPreviewData,
          {
            conversation_id: 'extra-1',
            conversation_title: 'Extra Conversation 1',
            sample_content: 'Extra content 1',
            predicted_tags: ['extra']
          },
          {
            conversation_id: 'extra-2',
            conversation_title: 'Extra Conversation 2',
            sample_content: 'Extra content 2',
            predicted_tags: ['extra']
          }
        ]
      }
      render(<PreviewPanel {...manyExamplesProps} />)

      expect(screen.getByText('Inquiring About Pricing Difference and Discount')).toBeInTheDocument()
      expect(screen.getByText('Learning Python Data Structures')).toBeInTheDocument()
      expect(screen.queryByText('Extra Conversation 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Extra Conversation 2')).not.toBeInTheDocument()
    })
  })

  describe('Predicted Tags', () => {
    it('should display predicted tags as pills', () => {
      render(<PreviewPanel {...defaultProps} />)

      expect(screen.getByText('business')).toBeInTheDocument()
      expect(screen.getByText('negotiation')).toBeInTheDocument()
      expect(screen.getByText('personal_growth')).toBeInTheDocument()
      expect(screen.getByText('coding')).toBeInTheDocument()
      expect(screen.getByText('programming')).toBeInTheDocument()
    })

    it('should style computer-friendly tags with blue colors', () => {
      const props = {
        ...defaultProps,
        selectedCategories: [
          { type: 'computer_friendly', id: 'date', name: 'date' }
        ],
        previewData: [{
          ...mockPreviewData[0],
          predicted_tags: ['date', 'business']
        }]
      }
      render(<PreviewPanel {...props} />)

      const dateTag = screen.getByText('date')
      expect(dateTag).toHaveClass('bg-blue-100', 'text-blue-800')
    })

    it('should style LLM-friendly tags with red colors', () => {
      render(<PreviewPanel {...defaultProps} />)

      const businessTag = screen.getByText('business')
      expect(businessTag).toHaveClass('bg-red-100', 'text-red-800')
    })

    it('should style custom tags with gray colors', () => {
      const props = {
        ...defaultProps,
        selectedCategories: [
          { type: 'custom', id: 'my_category', name: 'my_category' }
        ],
        previewData: [{
          ...mockPreviewData[0],
          predicted_tags: ['my_category', 'business']
        }]
      }
      render(<PreviewPanel {...props} />)

      const customTag = screen.getByText('my_category')
      expect(customTag).toHaveClass('bg-gray-100', 'text-gray-700')
    })
  })

  describe('Confidence Indicators', () => {
    it('should display confidence scores', () => {
      render(<PreviewPanel {...defaultProps} />)

      const confidenceTexts = screen.getAllByText(/\d+% confidence/)
      expect(confidenceTexts.length).toBeGreaterThan(0)
    })

    it('should show confidence score for each conversation', () => {
      render(<PreviewPanel {...defaultProps} />)

      // Should have confidence indicators for both conversations
      const confidenceIndicators = screen.getAllByText(/confidence/)
      expect(confidenceIndicators).toHaveLength(2)
    })
  })

  describe('Statistics Summary', () => {
    it('should display all statistics with correct labels', () => {
      render(<PreviewPanel {...defaultProps} />)

      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('conversations')).toBeInTheDocument()

      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('categories')).toBeInTheDocument()

      expect(screen.getByText('2.1')).toBeInTheDocument()
      expect(screen.getByText('avg tags')).toBeInTheDocument()

      expect(screen.getByText('94%')).toBeInTheDocument()
      expect(screen.getByText('coverage')).toBeInTheDocument()
    })

    it('should use 2x2 grid layout for statistics', () => {
      render(<PreviewPanel {...defaultProps} />)

      const statisticsSection = screen.getByText('conversations').closest('.grid')
      expect(statisticsSection).toHaveClass('grid-cols-2')
    })

    it('should handle zero statistics gracefully', () => {
      const props = {
        ...defaultProps,
        statistics: {
          conversations: 0,
          categories: 0,
          avg_tags: 0,
          coverage: 0
        }
      }
      render(<PreviewPanel {...props} />)

      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('should handle conversation cards in single column', () => {
      render(<PreviewPanel {...defaultProps} />)

      const conversationCards = screen.getAllByTestId('conversation-card')
      expect(conversationCards).toHaveLength(2)

      conversationCards.forEach(card => {
        expect(card).toHaveClass('bg-gray-50')
      })
    })
  })

  describe('Loading and Updates', () => {
    it('should handle preview data updates', () => {
      const { rerender } = render(<PreviewPanel {...defaultProps} />)

      expect(screen.getByText('Inquiring About Pricing Difference and Discount')).toBeInTheDocument()

      const newProps = {
        ...defaultProps,
        previewData: [{
          conversation_id: 'new-id',
          conversation_title: 'New Conversation',
          sample_content: 'New content',
          predicted_tags: ['new_tag']
        }]
      }

      rerender(<PreviewPanel {...newProps} />)

      expect(screen.getByText('New Conversation')).toBeInTheDocument()
      expect(screen.queryByText('Inquiring About Pricing Difference and Discount')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<PreviewPanel {...defaultProps} />)

      expect(screen.getByText('Preview Results')).toBeInTheDocument()
      expect(screen.getByText('Preview Results').tagName).toBe('H3')
    })

    it('should have accessible conversation cards', () => {
      render(<PreviewPanel {...defaultProps} />)

      const conversationCards = screen.getAllByTestId('conversation-card')
      conversationCards.forEach(card => {
        expect(card).toHaveAttribute('role', 'article')
      })
    })

    it('should have accessible tag pills', () => {
      render(<PreviewPanel {...defaultProps} />)

      const tagPills = screen.getAllByText('business')
      tagPills.forEach(pill => {
        expect(pill).toHaveAttribute('role', 'button')
        expect(pill).toHaveAttribute('aria-label', 'business category tag')
      })
    })
  })
})