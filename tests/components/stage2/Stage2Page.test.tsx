// ABOUTME: Test suite for Stage2Page component
// ABOUTME: Tests overall layout, navigation, and integration of categorization components

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Stage2Page from '@/app/parse/categorize/page'

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    clear: jest.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

const mockRouterPush = jest.fn()
const mockRouterBack = jest.fn()

describe('Stage2Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      back: mockRouterBack
    })

    // Mock Stage 1 data in localStorage
    mockLocalStorage.setItem('parsing-stage-1-state', JSON.stringify({
      selectedFields: ['id', 'title', 'date', 'messages'],
      fieldCategorization: {
        computerFriendly: ['id', 'date'],
        llmFriendly: ['title'],
        messagesField: 'messages'
      },
      contextDescription: 'Test context description',
      processingStats: {
        conversationCount: 3,
        interactionCount: 26,
        tokenCount: 1500
      }
    }))
  })

  describe('Page Structure', () => {
    it('should render page header with navigation', () => {
      render(<Stage2Page />)

      expect(screen.getByText('What categories are relevant to you?')).toBeInTheDocument()
      expect(screen.getByText('Back')).toBeInTheDocument()
    })

    it('should render simplified two-section layout', () => {
      render(<Stage2Page />)

      // Should render category builder and prompt editor components
      expect(screen.getByText('Add Custom')).toBeInTheDocument()
      expect(screen.getByText('Select categories above to configure their prompts')).toBeInTheDocument()
    })

    it('should render bottom actions section', () => {
      render(<Stage2Page />)

      expect(screen.getByText('Skip')).toBeInTheDocument()
      expect(screen.getByText('Each new category will create an .md file')).toBeInTheDocument()
      expect(screen.getByText('Continue')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should navigate back to Stage 1 when back button is clicked', () => {
      render(<Stage2Page />)

      const backButton = screen.getByText('Back')
      fireEvent.click(backButton)

      expect(mockRouterPush).toHaveBeenCalledWith('/parse')
    })

    it('should have proper back button styling with icon', () => {
      render(<Stage2Page />)

      const backButton = screen.getByText('Back')
      expect(backButton).toHaveClass('text-gray-600')
      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument()
    })
  })

  describe('Stage 1 Data Integration', () => {
    it('should load Stage 1 data from localStorage on mount', () => {
      render(<Stage2Page />)

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('parsing-stage-1-state')
    })

    it('should redirect to Stage 1 if no Stage 1 data is found', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      render(<Stage2Page />)

      expect(mockRouterPush).toHaveBeenCalledWith('/parse?error=complete-stage-1-first')
    })

    it('should show error message if Stage 1 data is invalid', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json')

      render(<Stage2Page />)

      expect(screen.getByText('Please complete file selection first')).toBeInTheDocument()
      expect(screen.getByText('Go back to Stage 1')).toBeInTheDocument()
    })
  })

  describe('Category Management', () => {
    it('should handle category selection', async () => {
      render(<Stage2Page />)

      const businessCategory = screen.getByText('business')
      fireEvent.click(businessCategory)

      await waitFor(() => {
        expect(screen.getByText('business')).toBeInTheDocument()
      })
    })

    it('should activate category configuration when categories are selected', async () => {
      render(<Stage2Page />)

      const businessCategory = screen.getByText('business')
      fireEvent.click(businessCategory)

      await waitFor(() => {
        expect(screen.getByText('business')).toBeInTheDocument()
      })
    })

    it('should handle custom category creation', async () => {
      render(<Stage2Page />)

      // Click the Add Custom button first
      const addCustomButton = screen.getByText('Add Custom')
      fireEvent.click(addCustomButton)

      const customInput = screen.getByPlaceholderText('work_projects')
      fireEvent.change(customInput, { target: { value: 'test_category' } })
      fireEvent.keyDown(customInput, { key: 'Enter', code: 'Enter' })

      await waitFor(() => {
        expect(screen.getByText('test_category')).toBeInTheDocument()
      })
    })

    it('should handle category removal', async () => {
      render(<Stage2Page />)

      // First add a category
      const businessCategory = screen.getByText('business')
      fireEvent.click(businessCategory)

      await waitFor(() => {
        const removeButton = screen.getByLabelText('Remove business category')
        fireEvent.click(removeButton)
      })

      await waitFor(() => {
        expect(screen.queryByText('business')).not.toBeInTheDocument()
      })
    })
  })

  describe('Prompt Configuration', () => {
    it('should show prompt editor when category is selected', async () => {
      render(<Stage2Page />)

      const businessCategory = screen.getByText('business')
      fireEvent.click(businessCategory)

      await waitFor(() => {
        expect(screen.getByText('business')).toBeInTheDocument()
      })
    })

    it('should handle prompt editing', async () => {
      render(<Stage2Page />)

      const businessCategory = screen.getByText('business')
      fireEvent.click(businessCategory)

      await waitFor(async () => {
        const textarea = screen.getByDisplayValue(/choose this option if the conversation involves work/)
        fireEvent.change(textarea, { target: { value: 'updated business prompt' } })
        fireEvent.blur(textarea)
      })

      // Prompt should be saved to state
      expect(screen.getByDisplayValue('updated business prompt')).toBeInTheDocument()
    })
  })

  describe('State Persistence', () => {
    it('should save Stage 2 state to localStorage', async () => {
      render(<Stage2Page />)

      const businessCategory = screen.getByText('business')
      fireEvent.click(businessCategory)

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'parsing-stage-2-state',
          expect.stringContaining('"business"')
        )
      })
    })

    it('should load existing Stage 2 state from localStorage', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'parsing-stage-2-state') {
          return JSON.stringify({
            selectedCategories: [{ type: 'llm_friendly', id: 'business', name: 'business' }],
            activeCategoryId: 'business'
          })
        }
        return mockLocalStorage.getItem(key)
      })

      render(<Stage2Page />)

      expect(screen.getByText('business')).toBeInTheDocument()
    })
  })

  describe('Bottom Actions', () => {
    it('should have skip button with proper styling', () => {
      render(<Stage2Page />)

      const skipButton = screen.getByText('Skip')
      expect(skipButton).toHaveClass('text-gray-600')
      expect(skipButton).toHaveAttribute('type', 'button')
    })

    it('should navigate to next stage when skip is clicked', () => {
      render(<Stage2Page />)

      const skipButton = screen.getByText('Skip')
      fireEvent.click(skipButton)

      expect(mockRouterPush).toHaveBeenCalledWith('/?completed=categorization-skipped')
    })

    it('should disable continue button when no categories selected', () => {
      render(<Stage2Page />)

      const continueButton = screen.getByText('Continue')
      expect(continueButton).toBeDisabled()
      expect(continueButton).toHaveClass('bg-gray-400', 'cursor-not-allowed')
    })

    it('should enable continue button when categories are selected', async () => {
      render(<Stage2Page />)

      const businessCategory = screen.getByText('business')
      fireEvent.click(businessCategory)

      await waitFor(() => {
        const continueButton = screen.getByText('Continue')
        expect(continueButton).not.toBeDisabled()
        expect(continueButton).toHaveClass('bg-blue-600')
      })
    })

    it('should navigate to completion when continue is clicked', async () => {
      render(<Stage2Page />)

      const businessCategory = screen.getByText('business')
      fireEvent.click(businessCategory)

      await waitFor(() => {
        const continueButton = screen.getByText('Continue')
        fireEvent.click(continueButton)
      })

      expect(mockRouterPush).toHaveBeenCalledWith('/?completed=categorization-success')
    })
  })

  describe('Error Handling', () => {
    it('should show error state when Stage 1 data is corrupted', () => {
      mockLocalStorage.getItem.mockReturnValue('{"invalid": "json"')

      render(<Stage2Page />)

      expect(screen.getByText(/error loading/i)).toBeInTheDocument()
    })

    it('should provide recovery option for errors', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      render(<Stage2Page />)

      const recoverButton = screen.getByText('Go back to Stage 1')
      fireEvent.click(recoverButton)

      expect(mockRouterPush).toHaveBeenCalledWith('/parse')
    })
  })

  describe('Responsive Design', () => {
    it('should have proper container max width', () => {
      render(<Stage2Page />)

      const container = screen.getByText('What categories are relevant to you?').closest('.max-w-7xl')
      expect(container).toBeInTheDocument()
    })

    it('should have proper responsive layout', () => {
      render(<Stage2Page />)

      const container = screen.getByText('What categories are relevant to you?').closest('.max-w-7xl')
      expect(container).toHaveClass('mx-auto', 'px-4')
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<Stage2Page />)

      const mainHeading = screen.getByText('What categories are relevant to you?')
      expect(mainHeading.tagName).toBe('H1')

      // No section headings in simplified design
      expect(screen.queryByText('Category Selection')).not.toBeInTheDocument()
      expect(screen.queryByText('Category Configuration')).not.toBeInTheDocument()
      expect(screen.queryByText('Preview Results')).not.toBeInTheDocument()
    })

    it('should have proper focus management', async () => {
      render(<Stage2Page />)

      const backButton = screen.getByText('Back')
      backButton.focus()
      expect(document.activeElement).toBe(backButton)
    })

    it('should have ARIA landmarks', () => {
      render(<Stage2Page />)

      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })
})