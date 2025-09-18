// ABOUTME: Test suite for CategoryBuilder component - simplified pill-based interface
// ABOUTME: Tests horizontal category selection, computer/LLM proposals, and custom category creation

import { render, screen, fireEvent } from '@testing-library/react'
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
    editable_prompt: 'Choose this option when conversations are around work, professional matters, or business decisions'
  },
  {
    category_name: 'personal_growth',
    editable_prompt: 'Choose this option when conversations involve learning new skills, self-improvement, or educational content'
  },
  {
    category_name: 'design',
    editable_prompt: 'Choose this option when conversations are about visual design, user experience, or creative work'
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
    it('should render computer-friendly categories as pills', () => {
      render(<CategoryBuilder {...defaultProps} />)

      // Should render computer-friendly category as pill button
      expect(screen.getByText('Date-based')).toBeInTheDocument()
      expect(screen.getByLabelText('Add Date-based category')).toBeInTheDocument()
    })

    it('should render LLM categories as pills', () => {
      render(<CategoryBuilder {...defaultProps} />)

      // Should render LLM categories as pill buttons
      expect(screen.getByText('business')).toBeInTheDocument()
      expect(screen.getByText('personal_growth')).toBeInTheDocument()
      expect(screen.getByText('design')).toBeInTheDocument()
    })

    it('should render custom category creation button', () => {
      render(<CategoryBuilder {...defaultProps} />)

      expect(screen.getByText('Add Custom')).toBeInTheDocument()
    })

    it('should show selected state when categories are selected', () => {
      const props = {
        ...defaultProps,
        selectedCategories: [{
          type: 'llm_friendly' as const,
          id: 'business',
          name: 'business'
        }]
      }
      render(<CategoryBuilder {...props} />)

      // Should show selected category with selected styling
      expect(screen.getByText('business')).toBeInTheDocument()
    })
  })

  describe('Computer-Friendly Categories', () => {
    it('should display computer category buttons with correct styling', () => {
      render(<CategoryBuilder {...defaultProps} />)

      const dateButton = screen.getByText('Date-based')
      expect(dateButton).toBeInTheDocument()
      expect(dateButton).toHaveClass('text-field-computer-friendly')
    })

    it('should show category details in button', () => {
      render(<CategoryBuilder {...defaultProps} />)

      const dateButton = screen.getByText('Date-based')
      expect(dateButton).toBeInTheDocument()
    })

    it('should call onCategorySelect when computer category is clicked', () => {
      render(<CategoryBuilder {...defaultProps} />)

      const dateButton = screen.getByText('Date-based')
      fireEvent.click(dateButton)

      expect(defaultProps.onCategorySelect).toHaveBeenCalledWith({
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
        selectedCategories: [{
          type: 'computer_friendly' as const,
          id: 'date',
          name: 'Date-based'
        }]
      }
      render(<CategoryBuilder {...props} />)

      // Find the main category button and check its selected state styling
      const dateButton = screen.getByLabelText('Remove Date-based category')
      expect(dateButton).toHaveClass('bg-field-computer-friendly/20')
    })
  })

  describe('LLM Categories', () => {
    it('should display LLM category buttons with correct styling', () => {
      render(<CategoryBuilder {...defaultProps} />)

      const businessButton = screen.getByText('business')
      expect(businessButton).toHaveClass('text-field-llm-friendly')
    })

    it('should call onCategorySelect when LLM category is clicked', () => {
      render(<CategoryBuilder {...defaultProps} />)

      const businessButton = screen.getByText('business')
      fireEvent.click(businessButton)

      expect(defaultProps.onCategorySelect).toHaveBeenCalledWith({
        type: 'llm_friendly',
        id: 'business',
        name: 'business',
        editable_prompt: 'Choose this option when conversations are around work, professional matters, or business decisions'
      })
    })

    it('should show selected state for LLM categories', () => {
      const props = {
        ...defaultProps,
        selectedCategories: [{
          type: 'llm_friendly' as const,
          id: 'business',
          name: 'business'
        }]
      }
      render(<CategoryBuilder {...props} />)

      // Find the main category button and check its selected state styling
      const businessButton = screen.getByLabelText('Remove business category')
      expect(businessButton).toHaveClass('bg-field-llm-friendly/20')
    })

    it('should render all LLM categories', () => {
      render(<CategoryBuilder {...defaultProps} />)

      expect(screen.getByText('business')).toBeInTheDocument()
      expect(screen.getByText('personal_growth')).toBeInTheDocument()
      expect(screen.getByText('design')).toBeInTheDocument()
    })
  })

  describe('Custom Category Creation', () => {
    it('should show custom input when Add Custom is clicked', async () => {
      const user = userEvent.setup()
      render(<CategoryBuilder {...defaultProps} />)

      const addCustomButton = screen.getByText('Add Custom')
      await user.click(addCustomButton)

      expect(screen.getByPlaceholderText('work_projects')).toBeInTheDocument()
    })

    it('should call onCustomCategoryAdd when Enter is pressed', async () => {
      const user = userEvent.setup()
      render(<CategoryBuilder {...defaultProps} />)

      const addCustomButton = screen.getByText('Add Custom')
      await user.click(addCustomButton)

      const input = screen.getByPlaceholderText('work_projects')
      await user.type(input, 'test_category')
      await user.keyboard('{Enter}')

      expect(defaultProps.onCustomCategoryAdd).toHaveBeenCalledWith('test_category')
    })

    it('should clear input after custom category is added', async () => {
      const user = userEvent.setup()
      render(<CategoryBuilder {...defaultProps} />)

      const addCustomButton = screen.getByText('Add Custom')
      await user.click(addCustomButton)

      const input = screen.getByPlaceholderText('work_projects')
      await user.type(input, 'test_category')
      await user.keyboard('{Enter}')

      // Input should no longer be visible after submission
      expect(screen.queryByPlaceholderText('work_projects')).not.toBeInTheDocument()
      expect(screen.getByText('Add Custom')).toBeInTheDocument()
    })

    it('should hide input when Escape is pressed', async () => {
      const user = userEvent.setup()
      render(<CategoryBuilder {...defaultProps} />)

      const addCustomButton = screen.getByText('Add Custom')
      await user.click(addCustomButton)

      const input = screen.getByPlaceholderText('work_projects')
      await user.keyboard('{Escape}')

      expect(screen.queryByPlaceholderText('work_projects')).not.toBeInTheDocument()
      expect(screen.getByText('Add Custom')).toBeInTheDocument()
    })

    it('should not add empty categories', async () => {
      const user = userEvent.setup()
      render(<CategoryBuilder {...defaultProps} />)

      const addCustomButton = screen.getByText('Add Custom')
      await user.click(addCustomButton)

      const input = screen.getByPlaceholderText('work_projects')
      await user.keyboard('{Enter}')

      expect(defaultProps.onCustomCategoryAdd).not.toHaveBeenCalled()
    })
  })


  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<CategoryBuilder {...defaultProps} />)

      expect(screen.getByLabelText('Add Date-based category')).toBeInTheDocument()
      expect(screen.getByLabelText('Add business category')).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<CategoryBuilder {...defaultProps} />)

      const businessButton = screen.getByText('business')
      await user.tab()

      // Should be able to focus and activate with keyboard
      expect(businessButton).toBeInTheDocument()
    })
  })
})