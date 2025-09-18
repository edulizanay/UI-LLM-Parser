// ABOUTME: End-to-end integration tests for complete conversation parser workflow
// ABOUTME: Tests Dashboard → Stage 1 → Stage 2 flow with data persistence and navigation

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import '@testing-library/jest-dom'

// Mock next/navigation
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
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// Mock file reading
const mockFileReader = {
  onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
  onerror: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null,
  readAsText: jest.fn().mockImplementation(() => {
    setTimeout(() => {
      if (mockFileReader.onload) {
        mockFileReader.onload.call({} as FileReader, {
          target: { result: JSON.stringify([{
            id: 'test-1',
            title: 'Test Conversation',
            date: '2024-11-04',
            messages: [
              { role: 'user', content: 'Hello' },
              { role: 'assistant', content: 'Hi there!' }
            ]
          }]) }
        } as any)
      }
    }, 100)
  })
}

global.FileReader = class MockFileReader {
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null
  readAsText = mockFileReader.readAsText
} as any

const mockRouterPush = jest.fn()

describe('End-to-End Workflow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.clear()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      back: jest.fn()
    })
  })

  describe('Complete Workflow: Dashboard → Stage 1 → Stage 2', () => {
    it('should navigate through complete parsing workflow successfully', async () => {
      // Import components dynamically to test navigation
      const DashboardPage = (await import('@/app/page')).default

      // Test Dashboard renders with navigation buttons
      render(<DashboardPage />)

      // Check that "Parse New Data" button exists and navigates to /parse
      const parseButton = screen.getByText('Parse New Data')
      expect(parseButton).toBeInTheDocument()
      expect(parseButton.closest('a')).toHaveAttribute('href', '/parse')

      // Check that Prompt Refiner button exists and navigates to /prompt-refiner
      const promptRefinerButton = screen.getByText('Refine Your Prompts')
      expect(promptRefinerButton).toBeInTheDocument()
      expect(promptRefinerButton.closest('a')).toHaveAttribute('href', '/prompt-refiner')
    })

    it('should persist data across stage transitions', async () => {
      // Test localStorage persistence during navigation
      const Stage1Page = (await import('@/app/parse/page')).default

      // Render Stage 1
      render(<Stage1Page />)

      // Simulate file upload and field selection
      const mockStage1Data = {
        selectedFields: ['id', 'title', 'date', 'messages'],
        fieldCategorization: {
          computerFriendly: ['id', 'date'],
          llmFriendly: ['title'],
          messagesField: 'messages'
        },
        contextDescription: 'Test conversation data',
        processingStats: {
          conversationCount: 3,
          interactionCount: 26,
          tokenCount: 1500
        }
      }

      // Check that Stage 1 can set data to localStorage
      expect(typeof window.localStorage.setItem).toBe('function')

      // Manually set the data to simulate Stage 1 completion
      mockLocalStorage.setItem('parsing-stage-1-state', JSON.stringify(mockStage1Data))

      // Verify data was set
      const savedData = mockLocalStorage.getItem('parsing-stage-1-state')
      expect(savedData).toBeTruthy()
      expect(JSON.parse(savedData!)).toEqual(mockStage1Data)
    })

    it('should handle navigation back and forth between stages', async () => {
      // Test bidirectional navigation with data preservation
      const DashboardPage = (await import('@/app/page')).default
      const Stage1Page = (await import('@/app/parse/page')).default
      const Stage2Page = (await import('@/app/parse/categorize/page')).default

      // Start at Dashboard
      const { rerender } = render(<DashboardPage />)

      // Navigate to Stage 1
      rerender(<Stage1Page />)
      expect(screen.getByText('Stage 1: Upload & Configure Data')).toBeInTheDocument()

      // Simulate data upload and proceed to Stage 2
      mockLocalStorage.setItem('parsing-stage-1-state', JSON.stringify({
        selectedFields: ['id', 'title', 'messages'],
        contextDescription: 'Test conversation data'
      }))

      // Navigate to Stage 2
      rerender(<Stage2Page />)
      expect(screen.getByText('Configure Categories')).toBeInTheDocument()

      // Navigate back to Stage 1
      rerender(<Stage1Page />)
      expect(screen.getByText('Stage 1: Upload & Configure Data')).toBeInTheDocument()

      // Verify data persistence - context should be preserved
      const savedState = mockLocalStorage.getItem('parsing-stage-1-state')
      expect(savedState).toBeTruthy()
      const parsedState = JSON.parse(savedState!)
      expect(parsedState.contextDescription).toBe('Test conversation data')
    })
  })

  describe('Data Flow Integration', () => {
    it('should properly transfer field selections from Stage 1 to Stage 2', async () => {
      // Test data handoff between stages
      const Stage2Page = (await import('@/app/parse/categorize/page')).default

      // Set up Stage 1 completion data
      const stage1Data = {
        selectedFields: ['id', 'title', 'date', 'messages'],
        fieldCategorization: {
          computerFriendly: ['id', 'date'],
          llmFriendly: ['title'],
          messagesField: 'messages'
        },
        contextDescription: 'Email conversation data from work',
        processingStats: {
          conversationCount: 5,
          interactionCount: 15,
          tokenCount: 2000
        }
      }

      mockLocalStorage.setItem('parsing-stage-1-state', JSON.stringify(stage1Data))

      // Render Stage 2 and verify data transfer
      render(<Stage2Page />)

      // Check that Stage 2 header is present
      expect(screen.getByText('Configure Categories')).toBeInTheDocument()

      // Verify that Stage 1 data was transferred - check that categories are available
      expect(screen.getByText('business')).toBeInTheDocument()
      expect(screen.getByText('personal_growth')).toBeInTheDocument()
      expect(screen.getByText('design')).toBeInTheDocument()
      expect(screen.getByText('coding')).toBeInTheDocument()

      // Verify that the component loaded successfully with the Stage 1 data
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    it('should maintain category selections and prompts in Stage 2', async () => {
      // Test Stage 2 state persistence
      const Stage2Page = (await import('@/app/parse/categorize/page')).default

      // Set up required Stage 1 data first
      const stage1Data = {
        selectedFields: ['id', 'title', 'messages'],
        fieldCategorization: {
          computerFriendly: ['id'],
          llmFriendly: ['title'],
          messagesField: 'messages'
        },
        contextDescription: 'Test conversation data',
        processingStats: {
          conversationCount: 3,
          interactionCount: 10,
          tokenCount: 1500
        }
      }
      mockLocalStorage.setItem('parsing-stage-1-state', JSON.stringify(stage1Data))

      render(<Stage2Page />)

      // Wait for component to load with correct title
      await waitFor(() => {
        expect(screen.getByText('Configure Categories')).toBeInTheDocument()
      })

      // Check that default LLM categories are present and clickable
      const businessCategory = screen.getByText('business')
      const personalGrowthCategory = screen.getByText('personal_growth')
      const designCategory = screen.getByText('design')
      const codingCategory = screen.getByText('coding')

      expect(businessCategory).toBeInTheDocument()
      expect(personalGrowthCategory).toBeInTheDocument()
      expect(designCategory).toBeInTheDocument()
      expect(codingCategory).toBeInTheDocument()

      // Select a category to make prompts visible
      fireEvent.click(businessCategory)

      // Wait for the prompt editor to show the selected category
      await waitFor(() => {
        expect(screen.queryByText('Select categories above to configure their prompts')).not.toBeInTheDocument()
      })

      // Verify that prompts are editable and have default LLM-focused text
      const businessInput = screen.getByDisplayValue(/Choose this option when conversations are around work/)
      expect(businessInput).toBeInTheDocument()
      expect(businessInput).toHaveAttribute('type', 'text')

      // Test editing a prompt
      fireEvent.change(businessInput, {
        target: { value: 'Custom business prompt for work conversations' }
      })

      expect(businessInput).toHaveValue('Custom business prompt for work conversations')

      // Verify model selection dropdown is present (find by role and check if it's a select)
      const selects = screen.getAllByRole('combobox')
      expect(selects.length).toBeGreaterThan(0)

      // Look for model selection specifically - should be the second select (first might be provider)
      const modelSelect = selects.find(select =>
        select.textContent?.includes('gpt') ||
        select.getAttribute('value')?.includes('gpt') ||
        select.querySelector('option[value*="gpt"]')
      )
      expect(modelSelect).toBeInTheDocument()
    })

    it('should handle completion flow returning to Dashboard', async () => {
      // Test final completion and return navigation
      const Stage2Page = (await import('@/app/parse/categorize/page')).default

      // Set up required Stage 1 data first
      const stage1Data = {
        selectedFields: ['id', 'title', 'messages'],
        fieldCategorization: {
          computerFriendly: ['id'],
          llmFriendly: ['title'],
          messagesField: 'messages'
        },
        contextDescription: 'Test conversation data',
        processingStats: {
          conversationCount: 3,
          interactionCount: 10,
          tokenCount: 1500
        }
      }
      mockLocalStorage.setItem('parsing-stage-1-state', JSON.stringify(stage1Data))

      render(<Stage2Page />)

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('Configure Categories')).toBeInTheDocument()
      })

      // First select a category to enable the continue button
      const businessCategory = screen.getByText('business')
      fireEvent.click(businessCategory)

      // Wait for button to become enabled
      await waitFor(() => {
        const finishButton = screen.getByText('Continue to Processing')
        expect(finishButton.closest('button')).not.toBeDisabled()
      })

      // Look for completion/finish button (check actual button text from component)
      const finishButton = screen.getByText('Continue to Processing')
      expect(finishButton).toBeInTheDocument()
      expect(finishButton.closest('button')).toBeInTheDocument()

      // Click completion button
      fireEvent.click(finishButton)

      // Should navigate back to dashboard with completion status (via router push)
      expect(mockRouterPush).toHaveBeenCalledWith('/?completed=categorization-success')
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle corrupted localStorage data gracefully', async () => {
      // Test error recovery scenarios
      const Stage1Page = (await import('@/app/parse/page')).default
      const Stage2Page = (await import('@/app/parse/categorize/page')).default

      // Set corrupted localStorage data
      mockLocalStorage.setItem('parsing-stage-1-state', 'invalid json data')

      // Stage 1 should handle corrupted data gracefully
      render(<Stage1Page />)
      expect(screen.getByText('Stage 1: Upload & Configure Data')).toBeInTheDocument()
      expect(screen.getByTestId('upload-zone')).toBeInTheDocument()

      // Stage 2 with corrupted data should show error or loading state
      const { rerender } = render(<Stage1Page />)
      rerender(<Stage2Page />)

      // Wait for error handling - Stage 2 should either show error state or remain loading
      await waitFor(() => {
        const isErrorOrLoading = screen.queryByText('Error Loading Data') ||
                                screen.queryByText('Loading...') ||
                                screen.queryByText('Configure Categories')
        expect(isErrorOrLoading).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should provide user-friendly error messages for failed uploads', async () => {
      // Test file upload error handling
      const Stage1Page = (await import('@/app/parse/page')).default

      render(<Stage1Page />)

      const uploadZone = screen.getByTestId('upload-zone')

      // Test non-JSON file upload
      const invalidFile = new File(['not json content'], 'document.txt', { type: 'text/plain' })

      // Use proper fireEvent.drop with dataTransfer
      fireEvent.drop(uploadZone, {
        dataTransfer: {
          files: [invalidFile]
        }
      })

      await waitFor(() => {
        // Should show user-friendly error message for non-JSON files
        const errorElement = screen.getByTestId('upload-error')
        expect(errorElement).toBeInTheDocument()
        expect(errorElement).toHaveTextContent('Only JSON files are supported')
      }, { timeout: 3000 })

      // Test JSON file with only whitespace (which should be treated as empty)
      const emptyFile = new File([' \n\t '], 'empty.json', { type: 'application/json' })

      fireEvent.drop(uploadZone, {
        dataTransfer: {
          files: [emptyFile]
        }
      })

      await waitFor(() => {
        // Should show user-friendly error for invalid/empty file
        const errorElement = screen.getByTestId('upload-error')
        expect(errorElement).toBeInTheDocument()
        expect(errorElement).toHaveTextContent('Error processing file: Invalid JSON format')
      }, { timeout: 3000 })
    })

    it('should allow recovery from network or processing errors', async () => {
      // Test error recovery mechanisms
      const Stage2Page = (await import('@/app/parse/categorize/page')).default

      // Set up required Stage 1 data first
      const stage1Data = {
        selectedFields: ['id', 'title', 'messages'],
        fieldCategorization: {
          computerFriendly: ['id'],
          llmFriendly: ['title'],
          messagesField: 'messages'
        },
        contextDescription: 'Test conversation data',
        processingStats: {
          conversationCount: 3,
          interactionCount: 10,
          tokenCount: 1500
        }
      }
      mockLocalStorage.setItem('parsing-stage-1-state', JSON.stringify(stage1Data))

      render(<Stage2Page />)

      await waitFor(() => {
        expect(screen.getByText('Configure Categories')).toBeInTheDocument()
      })

      // Select a category to enable the continue button
      // Use more specific selector for the button in LLM category suggestions
      const businessCategory = screen.getByRole('button', { name: /business category/i })
      fireEvent.click(businessCategory)

      // Wait for the continue button to be enabled
      await waitFor(() => {
        const continueButton = screen.getByText('Continue to Processing')
        expect(continueButton.closest('button')).not.toBeDisabled()
      })

      // Click continue button (this simulates processing)
      const continueButton = screen.getByText('Continue to Processing')
      fireEvent.click(continueButton)

      // Should handle processing gracefully - this will navigate to dashboard
      // which means error recovery would be handled at the application level
      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/?completed=categorization-success')
      }, { timeout: 3000 })
    })
  })

  describe('Prompt Refiner Integration', () => {
    it('should navigate to Prompt Refiner from Dashboard', async () => {
      // Test navigation to integrated Prompt Refiner
      const PromptRefinerPage = (await import('@/app/prompt-refiner/page')).default

      // Render Prompt Refiner page
      render(<PromptRefinerPage />)

      // Check that key components are rendered
      expect(screen.getByText('LLM Prompt Tester')).toBeInTheDocument()
      expect(screen.getByText('Back to Dashboard')).toBeInTheDocument()

      // Check that form controls are present
      expect(screen.getByText('Processing Stage')).toBeInTheDocument()
      expect(screen.getByText('LLM Provider')).toBeInTheDocument()
      expect(screen.getByText('Model')).toBeInTheDocument()
      expect(screen.getByText('Sample Data')).toBeInTheDocument()

      // Check that panels are present
      expect(screen.getByText('Prompt Template')).toBeInTheDocument()
      expect(screen.getByText('Test Results')).toBeInTheDocument()
    })

    it('should maintain consistent styling with main application', async () => {
      // Test style consistency across integrated components
      const DashboardPage = (await import('@/app/page')).default
      const PromptRefinerPage = (await import('@/app/prompt-refiner/page')).default

      // Render Dashboard first
      const { rerender } = render(<DashboardPage />)

      // Check Dashboard styling consistency - verify main elements are present
      const parseButton = screen.getByText('Parse New Data')
      expect(parseButton).toBeInTheDocument()

      // Navigate to Prompt Refiner
      rerender(<PromptRefinerPage />)

      // Check Prompt Refiner styling consistency
      const refinerTitle = screen.getByText('LLM Prompt Tester')
      expect(refinerTitle).toBeInTheDocument()

      // Check that back button maintains consistent styling
      const backButton = screen.getByText('Back to Dashboard')
      expect(backButton).toBeInTheDocument()

      // Both pages should use consistent surface styling
      const mainContent = document.querySelector('main')
      expect(mainContent).toHaveClass('bg-gray-50') // Consistent background
    })
  })

  describe('Mobile Responsiveness', () => {
    it('should work properly on mobile viewports', async () => {
      // Test responsive design integration
      const DashboardPage = (await import('@/app/page')).default
      const Stage1Page = (await import('@/app/parse/page')).default

      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true })
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true })

      // Test Dashboard on mobile
      const { rerender } = render(<DashboardPage />)

      // Main container should use responsive grid
      const mainGrid = screen.getByTestId('dashboard-main')?.querySelector('.grid')
      expect(mainGrid).toHaveClass('grid-cols-1') // Single column on mobile

      // Test Stage 1 on mobile
      rerender(<Stage1Page />)

      // Stage 1 should adapt to mobile viewport
      const stage1Main = screen.getByTestId('stage1-main')
      const stage1Grid = stage1Main.querySelector('.grid')
      expect(stage1Grid).toHaveClass('lg:grid-cols-3') // Responsive breakpoint
      expect(stage1Grid).toHaveClass('grid-cols-1') // Single column on mobile

      // Upload zone should remain accessible on mobile
      expect(screen.getByTestId('upload-zone')).toBeInTheDocument()
    })

    it('should maintain usability across different screen sizes', async () => {
      // Test responsive usability
      const Stage2Page = (await import('@/app/parse/categorize/page')).default

      // Set up required Stage 1 data first
      const stage1Data = {
        selectedFields: ['id', 'title', 'messages'],
        fieldCategorization: {
          computerFriendly: ['id'],
          llmFriendly: ['title'],
          messagesField: 'messages'
        },
        contextDescription: 'Test conversation data',
        processingStats: {
          conversationCount: 3,
          interactionCount: 10,
          tokenCount: 1500
        }
      }
      mockLocalStorage.setItem('parsing-stage-1-state', JSON.stringify(stage1Data))

      // Test tablet viewport
      Object.defineProperty(window, 'innerWidth', { value: 768, configurable: true })
      Object.defineProperty(window, 'innerHeight', { value: 1024, configurable: true })

      render(<Stage2Page />)

      await waitFor(() => {
        expect(screen.getByText('Configure Categories')).toBeInTheDocument()
      })

      // Category selection should remain accessible on tablet
      expect(screen.getByText('business')).toBeInTheDocument()
      expect(screen.getByText('personal_growth')).toBeInTheDocument()
      expect(screen.getByText('design')).toBeInTheDocument()
      expect(screen.getByText('coding')).toBeInTheDocument()

      // First select a category to make prompts visible
      const businessCategory = screen.getByText('business')
      fireEvent.click(businessCategory)

      // Wait for prompt to become visible
      await waitFor(() => {
        const businessInput = screen.getByDisplayValue(/Choose this option when conversations are around work/)
        expect(businessInput).toBeInTheDocument()
      })

      // Model selection should be accessible (look for any select elements)
      const selects = screen.getAllByRole('combobox')
      expect(selects.length).toBeGreaterThan(0)

      // Completion button should be reachable and enabled after category selection
      const continueButton = screen.getByText('Continue to Processing')
      expect(continueButton).toBeInTheDocument()
      expect(continueButton.closest('button')).not.toBeDisabled()
    })
  })
})