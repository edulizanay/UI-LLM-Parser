// ABOUTME: Test suite for CategoryBuilder component
// ABOUTME: Tests category selection, custom creation, and computer/LLM category proposals

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategoryBuilder } from '@/components/categorization/CategoryBuilder'

const mockComputerCategories = [
  {
    field_name: 'date',
    distinct_count: 3,
    categories: [
      {
        value: '2024-11-04',
        conversation_count: 1,
        sample_titles: ['Inquiring About Pricing Difference and Discount']
      },
      {
        value: '2024-09-24',
        conversation_count: 1,
        sample_titles: ['Learning Python Data Structures']
      }
    ]
  }
]

const mockLLMCategories = [
  {
    category_name: 'business',
    editable_prompt: 'choose this option if the conversation involves work, negotiations, professional matters, or business decisions'
  },
  {
    category_name: 'personal_growth',
    editable_prompt: 'choose this option if I\'m learning something new, developing skills, or seeking knowledge for personal development'
  },
  {
    category_name: 'design',
    editable_prompt: 'choose this option if the conversation is about design, user experience, visual aesthetics, or creative work'
  }
]

const defaultProps = {
  computerCategories: mockComputerCategories,
  llmCategories: mockLLMCategories,
  selectedCategories: [],
  onCategorySelect: jest.fn(),
  onCategoryRemove: jest.fn(),
  onCustomCategoryAdd: jest.fn()
}

describe('CategoryBuilder Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering Structure', () => {
    it('should render computer-friendly categories section', () => {
      render(<CategoryBuilder {...defaultProps} />)

      expect(screen.getByText('From Your Data')).toBeInTheDocument()
      expect(screen.getByText('Categories based on your file structure')).toBeInTheDocument()
    })

    it('should render LLM categories section', () => {
      render(<CategoryBuilder {...defaultProps} />)

      expect(screen.getByText('Content Categories')).toBeInTheDocument()
      expect(screen.getByText('AI will analyze conversation content')).toBeInTheDocument()
    })

    it('should render custom category section', () => {
      render(<CategoryBuilder {...defaultProps} />)

      expect(screen.getByText('Custom Categories')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('e.g., work_projects, family_discussions')).toBeInTheDocument()
      expect(screen.getByText('Press Enter to add category')).toBeInTheDocument()
    })

    it('should render selected categories summary', () => {
      render(<CategoryBuilder {...defaultProps} />)

      expect(screen.getByText('Selected Categories')).toBeInTheDocument()
    })
  })

  describe('Computer-Friendly Categories', () => {
    it('should display computer category buttons with correct styling', () => {
      render(<CategoryBuilder {...defaultProps} />)

      const dateButton = screen.getByText(/Date-based/)
      expect(dateButton).toBeInTheDocument()
      expect(dateButton).toHaveClass('border-blue-200', 'text-blue-700')
    })

    it('should show category details in button', () => {
      render(<CategoryBuilder {...defaultProps} />)

      expect(screen.getByText('Date-based')).toBeInTheDocument()
      expect(screen.getByText('3 time periods')).toBeInTheDocument()
    })

    it('should call onCategorySelect when computer category is clicked', () => {
      const mockSelect = jest.fn()
      const props = { ...defaultProps, onCategorySelect: mockSelect }
      render(<CategoryBuilder {...props} />)

      const dateButton = screen.getByText(/Date-based/)
      fireEvent.click(dateButton)

      expect(mockSelect).toHaveBeenCalledWith({
        type: 'computer_friendly',
        id: 'date',
        name: 'Date-based',
        field_name: 'date',
        categories: mockComputerCategories[0].categories
      })
    })

    it('should show selected state for computer categories', () => {
      const props = {
        ...defaultProps,
        selectedCategories: [{ type: 'computer_friendly', id: 'date', name: 'Date-based' }]
      }
      render(<CategoryBuilder {...props} />)

      const dateButton = screen.getByText(/Date-based/)
      expect(dateButton.closest('button')).toHaveClass('bg-blue-100', 'border-blue-400')
    })
  })

  describe('LLM Categories', () => {
    it('should display LLM category buttons with correct styling', () => {
      render(<CategoryBuilder {...defaultProps} />)

      const businessButton = screen.getByText('business')
      expect(businessButton).toBeInTheDocument()
      expect(businessButton).toHaveClass('border-red-200', 'text-red-700')
    })

    it('should call onCategorySelect when LLM category is clicked', () => {
      const mockSelect = jest.fn()
      const props = { ...defaultProps, onCategorySelect: mockSelect }
      render(<CategoryBuilder {...props} />)

      const businessButton = screen.getByText('business')
      fireEvent.click(businessButton)

      expect(mockSelect).toHaveBeenCalledWith({
        type: 'llm_friendly',
        id: 'business',
        name: 'business',
        editable_prompt: mockLLMCategories[0].editable_prompt
      })
    })

    it('should show selected state for LLM categories', () => {
      const props = {
        ...defaultProps,
        selectedCategories: [{ type: 'llm_friendly', id: 'business', name: 'business' }]
      }
      render(<CategoryBuilder {...props} />)

      const businessButton = screen.getByText('business')
      expect(businessButton.closest('button')).toHaveClass('bg-red-100', 'border-red-400')
    })

    it('should render all LLM categories', () => {
      render(<CategoryBuilder {...defaultProps} />)

      expect(screen.getByText('business')).toBeInTheDocument()
      expect(screen.getByText('personal_growth')).toBeInTheDocument()
      expect(screen.getByText('design')).toBeInTheDocument()
    })
  })

  describe('Custom Category Creation', () => {
    it('should handle custom category input', async () => {
      const user = userEvent.setup()
      render(<CategoryBuilder {...defaultProps} />)

      const input = screen.getByPlaceholderText('e.g., work_projects, family_discussions')
      await user.type(input, 'my_custom_category')

      expect(input).toHaveValue('my_custom_category')
    })

    it('should call onCustomCategoryAdd when Enter is pressed', async () => {
      const user = userEvent.setup()
      const mockAdd = jest.fn()
      const props = { ...defaultProps, onCustomCategoryAdd: mockAdd }
      render(<CategoryBuilder {...props} />)

      const input = screen.getByPlaceholderText('e.g., work_projects, family_discussions')
      await user.type(input, 'my_custom_category')
      await user.keyboard('{Enter}')

      expect(mockAdd).toHaveBeenCalledWith('my_custom_category')
    })

    it('should clear input after custom category is added', async () => {
      const user = userEvent.setup()
      render(<CategoryBuilder {...defaultProps} />)

      const input = screen.getByPlaceholderText('e.g., work_projects, family_discussions')
      await user.type(input, 'my_custom_category')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(input).toHaveValue('')
      })
    })

    it('should not add empty categories', async () => {
      const user = userEvent.setup()
      const mockAdd = jest.fn()
      const props = { ...defaultProps, onCustomCategoryAdd: mockAdd }
      render(<CategoryBuilder {...props} />)

      const input = screen.getByPlaceholderText('e.g., work_projects, family_discussions')
      await user.keyboard('{Enter}')

      expect(mockAdd).not.toHaveBeenCalled()
    })
  })

  describe('Selected Categories Summary', () => {
    it('should show empty state when no categories selected', () => {
      render(<CategoryBuilder {...defaultProps} />)

      const summarySection = screen.getByText('Selected Categories').closest('div')
      expect(summarySection).toBeInTheDocument()
      // Should not show any category pills
      expect(screen.queryByText('×')).not.toBeInTheDocument()
    })

    it('should display selected categories as pills', () => {
      const props = {
        ...defaultProps,
        selectedCategories: [
          { type: 'computer_friendly', id: 'date', name: 'Date-based' },
          { type: 'llm_friendly', id: 'business', name: 'business' }
        ]
      }
      render(<CategoryBuilder {...props} />)

      // Should show category pills in summary
      const summarySection = screen.getByText('Selected Categories').closest('div')
      expect(summarySection).toContainElement(screen.getByText('Date-based'))
      expect(summarySection).toContainElement(screen.getByText('business'))
    })

    it('should call onCategoryRemove when remove button is clicked', () => {
      const mockRemove = jest.fn()
      const props = {
        ...defaultProps,
        selectedCategories: [{ type: 'llm_friendly', id: 'business', name: 'business' }],
        onCategoryRemove: mockRemove
      }
      render(<CategoryBuilder {...props} />)

      const removeButton = screen.getByLabelText('Remove business category')
      fireEvent.click(removeButton)

      expect(mockRemove).toHaveBeenCalledWith({ type: 'llm_friendly', id: 'business', name: 'business' })
    })

    it('should style category pills with appropriate colors', () => {
      const props = {
        ...defaultProps,
        selectedCategories: [
          { type: 'computer_friendly', id: 'date', name: 'Date-based' },
          { type: 'llm_friendly', id: 'business', name: 'business' },
          { type: 'custom', id: 'my_category', name: 'my_category' }
        ]
      }
      render(<CategoryBuilder {...props} />)

      const summarySection = screen.getByText('Selected Categories').closest('div')
      const computerPill = summarySection!.querySelector('[data-category-id="date"]')
      const llmPill = summarySection!.querySelector('[data-category-id="business"]')
      const customPill = summarySection!.querySelector('[data-category-id="my_category"]')

      expect(computerPill).toHaveClass('bg-blue-100', 'text-blue-800')
      expect(llmPill).toHaveClass('bg-red-100', 'text-red-800')
      expect(customPill).toHaveClass('bg-gray-100', 'text-gray-800')
    })
  })

  describe('Icons and Visual Elements', () => {
    it('should display appropriate icons for each section', () => {
      render(<CategoryBuilder {...defaultProps} />)

      // Computer-friendly section should have database icon
      expect(screen.getByTestId('database-icon')).toBeInTheDocument()

      // LLM section should have brain icon
      expect(screen.getByTestId('brain-icon')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<CategoryBuilder {...defaultProps} />)

      const businessButton = screen.getByText('business')
      expect(businessButton.closest('button')).toHaveAttribute('aria-label', 'Add business category')
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<CategoryBuilder {...defaultProps} />)

      // Should be able to tab through category buttons
      await user.tab()
      expect(screen.getByText(/Date-based/).closest('button')).toHaveFocus()
    })
  })
})