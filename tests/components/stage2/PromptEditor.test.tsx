// ABOUTME: Test suite for PromptEditor component
// ABOUTME: Tests two-column layout, prompt editing, and category configuration

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptEditor } from '@/components/categorization/PromptEditor'

const mockSelectedCategories = [
  {
    type: 'computer_friendly',
    id: 'date',
    name: 'Date-based',
    field_name: 'date'
  },
  {
    type: 'llm_friendly',
    id: 'business',
    name: 'business',
    editable_prompt: 'choose this option if the conversation involves work, negotiations, professional matters, or business decisions'
  },
  {
    type: 'custom',
    id: 'my_category',
    name: 'my_category',
    editable_prompt: 'describe when conversations should receive this tag'
  }
]

const defaultProps = {
  selectedCategories: mockSelectedCategories,
  activeCategoryId: 'business',
  onCategorySelect: jest.fn(),
  onPromptEdit: jest.fn(),
  onCategoryRemove: jest.fn()
}

describe('PromptEditor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Layout Structure', () => {
    it('should render two-column layout', () => {
      render(<PromptEditor {...defaultProps} />)

      expect(screen.getByText('Categories')).toBeInTheDocument()
      expect(screen.getByText('Prompt Configuration')).toBeInTheDocument()
    })

    it('should show empty state when no categories selected', () => {
      const props = { ...defaultProps, selectedCategories: [] }
      render(<PromptEditor {...props} />)

      expect(screen.getByText('Select categories to configure')).toBeInTheDocument()
      expect(screen.getByText('Choose categories from the left to customize their prompts')).toBeInTheDocument()
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument()
    })
  })

  describe('Categories List (Left Column)', () => {
    it('should display all selected categories', () => {
      render(<PromptEditor {...defaultProps} />)

      expect(screen.getByText('Date-based')).toBeInTheDocument()
      expect(screen.getByText('business')).toBeInTheDocument()
      expect(screen.getByText('my_category')).toBeInTheDocument()
    })

    it('should show category types as subtitles', () => {
      render(<PromptEditor {...defaultProps} />)

      expect(screen.getByText('Computer-friendly')).toBeInTheDocument()
      expect(screen.getAllByText('LLM category')).toHaveLength(1)
      expect(screen.getByText('Custom')).toBeInTheDocument()
    })

    it('should highlight active category', () => {
      render(<PromptEditor {...defaultProps} />)

      const businessCategory = screen.getByText('business').closest('button')
      expect(businessCategory).toHaveClass('bg-blue-50', 'border-blue-300')

      const dateCategory = screen.getByText('Date-based').closest('button')
      expect(dateCategory).not.toHaveClass('bg-blue-50', 'border-blue-300')
    })

    it('should call onCategorySelect when category is clicked', () => {
      const mockSelect = jest.fn()
      const props = { ...defaultProps, onCategorySelect: mockSelect }
      render(<PromptEditor {...props} />)

      const dateCategory = screen.getByText('Date-based')
      fireEvent.click(dateCategory)

      expect(mockSelect).toHaveBeenCalledWith('date')
    })

    it('should show hover states for categories', async () => {
      const user = userEvent.setup()
      render(<PromptEditor {...defaultProps} />)

      const dateCategory = screen.getByText('Date-based').closest('button')

      await user.hover(dateCategory!)
      expect(dateCategory).toHaveClass('bg-gray-50')
    })
  })

  describe('Prompt Configuration (Right Column)', () => {
    it('should show configuration for active category', () => {
      render(<PromptEditor {...defaultProps} />)

      expect(screen.getByText('business')).toBeInTheDocument()
      expect(screen.getByText('This prompt guides the AI\'s categorization decisions')).toBeInTheDocument()
    })

    it('should display editable prompt for LLM categories', () => {
      render(<PromptEditor {...defaultProps} />)

      const textarea = screen.getByDisplayValue(/choose this option if the conversation involves work/)
      expect(textarea).toBeInTheDocument()
      expect(textarea).toHaveClass('opacity-60')
    })

    it('should show non-editable message for computer-friendly categories', () => {
      const props = { ...defaultProps, activeCategoryId: 'date' }
      render(<PromptEditor {...props} />)

      expect(screen.getByText('Categories will be created based on: date. No prompt needed.')).toBeInTheDocument()
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('should handle prompt editing for LLM categories', async () => {
      const user = userEvent.setup()
      const mockEdit = jest.fn()
      const props = { ...defaultProps, onPromptEdit: mockEdit }
      render(<PromptEditor {...props} />)

      const textarea = screen.getByDisplayValue(/choose this option if the conversation involves work/)

      await user.clear(textarea)
      await user.type(textarea, 'new prompt text')

      expect(textarea).toHaveValue('new prompt text')
    })

    it('should call onPromptEdit on blur', async () => {
      const user = userEvent.setup()
      const mockEdit = jest.fn()
      const props = { ...defaultProps, onPromptEdit: mockEdit }
      render(<PromptEditor {...props} />)

      const textarea = screen.getByDisplayValue(/choose this option if the conversation involves work/)

      await user.clear(textarea)
      await user.type(textarea, 'updated prompt')
      await user.tab() // This will blur the textarea

      expect(mockEdit).toHaveBeenCalledWith('business', 'updated prompt')
    })

    it('should call onPromptEdit on Enter key press', async () => {
      const user = userEvent.setup()
      const mockEdit = jest.fn()
      const props = { ...defaultProps, onPromptEdit: mockEdit }
      render(<PromptEditor {...props} />)

      const textarea = screen.getByDisplayValue(/choose this option if the conversation involves work/)

      await user.clear(textarea)
      await user.type(textarea, 'updated prompt')
      await user.keyboard('{Enter}')

      expect(mockEdit).toHaveBeenCalledWith('business', 'updated prompt')
    })
  })

  describe('Prompt Textarea Interactions', () => {
    it('should change opacity on hover', async () => {
      const user = userEvent.setup()
      render(<PromptEditor {...defaultProps} />)

      const textarea = screen.getByDisplayValue(/choose this option if the conversation involves work/)
      expect(textarea).toHaveClass('opacity-60')

      await user.hover(textarea)
      expect(textarea).toHaveClass('opacity-80')
    })

    it('should change to full opacity on focus', async () => {
      const user = userEvent.setup()
      render(<PromptEditor {...defaultProps} />)

      const textarea = screen.getByDisplayValue(/choose this option if the conversation involves work/)

      await user.click(textarea)
      expect(textarea).toHaveClass('opacity-100')
      expect(textarea).toHaveClass('text-gray-900')
      expect(textarea).toHaveClass('bg-white')
    })

    it('should show focus ring when focused', async () => {
      const user = userEvent.setup()
      render(<PromptEditor {...defaultProps} />)

      const textarea = screen.getByDisplayValue(/choose this option if the conversation involves work/)

      await user.click(textarea)
      expect(textarea).toHaveClass('border-blue-300', 'ring-2', 'ring-blue-200')
    })

    it('should show helper text below textarea', () => {
      render(<PromptEditor {...defaultProps} />)

      expect(screen.getByText('Be specific about what triggers this category')).toBeInTheDocument()
    })
  })

  describe('Category Type Handling', () => {
    it('should handle custom category prompts', () => {
      const props = { ...defaultProps, activeCategoryId: 'my_category' }
      render(<PromptEditor {...props} />)

      const textarea = screen.getByDisplayValue('describe when conversations should receive this tag')
      expect(textarea).toBeInTheDocument()
    })

    it('should show appropriate placeholder for custom categories', () => {
      const customCategory = {
        type: 'custom',
        id: 'new_custom',
        name: 'new_custom',
        editable_prompt: ''
      }

      const props = {
        ...defaultProps,
        selectedCategories: [...mockSelectedCategories, customCategory],
        activeCategoryId: 'new_custom'
      }
      render(<PromptEditor {...props} />)

      const textarea = screen.getByPlaceholderText('describe when conversations should receive this tag...')
      expect(textarea).toBeInTheDocument()
    })

    it('should prevent editing computer-friendly categories', () => {
      const props = { ...defaultProps, activeCategoryId: 'date' }
      render(<PromptEditor {...props} />)

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      expect(screen.getByText(/Categories will be created based on/)).toBeInTheDocument()
    })
  })

  describe('Active Category Switching', () => {
    it('should update prompt editor when active category changes', () => {
      const { rerender } = render(<PromptEditor {...defaultProps} />)

      expect(screen.getByDisplayValue(/choose this option if the conversation involves work/)).toBeInTheDocument()

      const newProps = { ...defaultProps, activeCategoryId: 'my_category' }
      rerender(<PromptEditor {...newProps} />)

      expect(screen.getByDisplayValue('describe when conversations should receive this tag')).toBeInTheDocument()
    })

    it('should not show prompt editor if no active category', () => {
      const props = { ...defaultProps, activeCategoryId: null }
      render(<PromptEditor {...props} />)

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      expect(screen.queryByText('This prompt guides the AI\'s categorization decisions')).not.toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have proper column widths', () => {
      render(<PromptEditor {...defaultProps} />)

      const leftColumn = screen.getByText('Categories').closest('div')
      const rightColumn = screen.getByText('Prompt Configuration').closest('div')

      expect(leftColumn).toHaveClass('w-2/5')
      expect(rightColumn).toHaveClass('w-3/5')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for categories', () => {
      render(<PromptEditor {...defaultProps} />)

      const businessCategory = screen.getByText('business').closest('button')
      expect(businessCategory).toHaveAttribute('aria-label', 'Select business category for editing')
    })

    it('should have proper label for textarea', () => {
      render(<PromptEditor {...defaultProps} />)

      const textarea = screen.getByDisplayValue(/choose this option if the conversation involves work/)
      expect(textarea).toHaveAttribute('aria-label', 'Edit prompt for business category')
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<PromptEditor {...defaultProps} />)

      // Should be able to tab through category buttons
      await user.tab()
      expect(screen.getByText('Date-based').closest('button')).toHaveFocus()

      await user.tab()
      expect(screen.getByText('business').closest('button')).toHaveFocus()
    })

    it('should have proper heading structure', () => {
      render(<PromptEditor {...defaultProps} />)

      const categoriesHeading = screen.getByText('Categories')
      const configHeading = screen.getByText('Prompt Configuration')

      expect(categoriesHeading.tagName).toBe('H3')
      expect(configHeading.tagName).toBe('H3')
    })
  })
})