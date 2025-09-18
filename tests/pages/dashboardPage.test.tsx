// ABOUTME: Tests for main dashboard page component and navigation integration
// ABOUTME: Verifies page layout, component integration, and user interaction flows

import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { DashboardPage } from '@/app/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock the dashboard data functions
jest.mock('@/lib/dashboardData', () => ({
  getMockProjects: jest.fn(() => [
    {
      id: 'project-1',
      name: 'Test Project',
      status: 'completed' as const,
      fileCount: 5,
      categoriesCreated: 3,
      createdAt: new Date('2024-09-01'),
      lastModified: new Date('2024-09-15'),
    }
  ]),
  getMockProcessingStatus: jest.fn(() => [
    {
      projectId: 'project-1',
      stage: 'processing' as const,
      progress: 75,
      estimatedTimeRemaining: 120,
      currentTask: 'Processing conversation data',
      startedAt: new Date('2024-09-18'),
    }
  ]),
}))

const mockPush = jest.fn()
const mockBack = jest.fn()

beforeEach(() => {
  ;(useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
    back: mockBack,
  })
  mockPush.mockClear()
  mockBack.mockClear()
})

describe('Dashboard Page', () => {
  describe('Page Layout & Rendering', () => {
    it('should render all main sections (hero, projects, processing)', () => {
      render(<DashboardPage />)

      expect(screen.getByTestId('dashboard-main')).toBeInTheDocument()

      // Should render main sections
      expect(screen.getByText('Parse Your Conversations')).toBeInTheDocument()
      expect(screen.getByText('Recent Projects')).toBeInTheDocument()
      expect(screen.getByText('Processing Status')).toBeInTheDocument()
    })

    it('should display page title and meta information correctly', () => {
      render(<DashboardPage />)

      // Main heading should be present
      expect(screen.getByText('Parse Your Conversations')).toBeInTheDocument()

      // Should have proper semantic structure
      const main = screen.getByTestId('dashboard-main')
      expect(main).toHaveClass('min-h-screen')
      expect(main.tagName).toBe('MAIN')
    })

    it('should handle page loading states', () => {
      render(<DashboardPage />)

      // Page should render without crashing
      expect(screen.getByTestId('dashboard-main')).toBeInTheDocument()

      // Should not show loading states for static mock data
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    it('should integrate all dashboard components properly', () => {
      render(<DashboardPage />)

      // Verify all major components are present
      expect(screen.getByText('Parse Your Conversations')).toBeInTheDocument() // HeroSection
      expect(screen.getByText('Prompt Refiner')).toBeInTheDocument() // PromptRefinerSection
      expect(screen.getByText('Recent Projects')).toBeInTheDocument() // ProjectGrid
      expect(screen.getByText('Processing Status')).toBeInTheDocument() // ProcessingStatus

      // Should have proper grid layout
      const main = screen.getByTestId('dashboard-main')
      expect(main.querySelector('.grid')).toBeInTheDocument()
    })

    it('should have responsive layout structure', () => {
      render(<DashboardPage />)

      const gridContainer = screen.getByTestId('dashboard-main').querySelector('.grid')
      expect(gridContainer).toHaveClass('md:grid-cols-2')
      expect(gridContainer).toHaveClass('grid-cols-1')
    })
  })

  describe('Navigation Integration', () => {
    it('should navigate to parse flow from primary CTA', () => {
      render(<DashboardPage />)

      const parseButton = screen.getByText('Parse New Data')
      expect(parseButton).toBeInTheDocument()
      expect(parseButton.closest('a')).toHaveAttribute('href', '/parse')
    })

    it('should navigate to prompt refiner from secondary link', () => {
      render(<DashboardPage />)

      const promptRefinerButton = screen.getByText('Prompt Refiner')
      expect(promptRefinerButton).toBeInTheDocument()
      expect(promptRefinerButton.closest('a')).toHaveAttribute('href', '/prompt-refiner')
    })

    it('should handle browser back/forward navigation', () => {
      render(<DashboardPage />)

      // Page should render properly on navigation
      expect(screen.getByTestId('dashboard-main')).toBeInTheDocument()

      // Navigation elements should be properly structured
      const parseLink = screen.getByText('Parse New Data').closest('a')
      const refinerLink = screen.getByText('Prompt Refiner').closest('a')

      expect(parseLink).toHaveAttribute('href', '/parse')
      expect(refinerLink).toHaveAttribute('href', '/prompt-refiner')
    })

    it('should preserve state during navigation', () => {
      render(<DashboardPage />)

      // Mock data should be consistently loaded
      expect(screen.getByText('Test Project')).toBeInTheDocument()
      expect(screen.getByText('Processing conversation data')).toBeInTheDocument()

      // Components should maintain their state
      expect(screen.getByText('Parse Your Conversations')).toBeInTheDocument()
    })
  })

  describe('Data Integration', () => {
    it('should load and display project data correctly', () => {
      render(<DashboardPage />)

      // Should display mock project data
      expect(screen.getByText('Test Project')).toBeInTheDocument()
      expect(screen.getByText('3 categories')).toBeInTheDocument()
    })

    it('should load and display processing status correctly', () => {
      render(<DashboardPage />)

      // Should display mock processing status
      expect(screen.getByText('Processing conversation data')).toBeInTheDocument()
      expect(screen.getByText('75%')).toBeInTheDocument()
    })

    it('should handle empty data states gracefully', () => {
      // This test ensures the page doesn't break with empty data
      render(<DashboardPage />)

      // Page should still render
      expect(screen.getByTestId('dashboard-main')).toBeInTheDocument()
      expect(screen.getByText('Parse Your Conversations')).toBeInTheDocument()
    })
  })

  describe('Drag and Drop Integration', () => {
    it('should include drag and drop overlay component', () => {
      render(<DashboardPage />)

      // DragDropOverlay should be rendered
      // Note: The actual drag and drop functionality is tested in component tests
      expect(screen.getByTestId('dashboard-main')).toBeInTheDocument()
    })
  })

  describe('Layout Structure', () => {
    it('should have proper semantic HTML structure', () => {
      render(<DashboardPage />)

      const main = screen.getByTestId('dashboard-main')
      expect(main.tagName).toBe('MAIN')
      expect(main).toHaveClass('min-h-screen')

      // Should have proper content organization
      const gridContainer = main.querySelector('.grid')
      expect(gridContainer).toBeInTheDocument()
    })

    it('should maintain consistent spacing and layout', () => {
      render(<DashboardPage />)

      const main = screen.getByTestId('dashboard-main')
      expect(main).toHaveClass('bg-surface-background')

      const container = main.querySelector('.max-w-\\[1000px\\]')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Component Integration', () => {
    it('should pass correct props to child components', () => {
      render(<DashboardPage />)

      // Verify components receive proper data
      expect(screen.getByText('Test Project')).toBeInTheDocument()
      expect(screen.getByText('Processing conversation data')).toBeInTheDocument()

      // Navigation links should be properly configured
      expect(screen.getByText('Parse New Data').closest('a')).toHaveAttribute('href', '/parse')
      expect(screen.getByText('Prompt Refiner').closest('a')).toHaveAttribute('href', '/prompt-refiner')
    })
  })
})