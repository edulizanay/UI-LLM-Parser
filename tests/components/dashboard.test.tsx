// ABOUTME: Tests for main dashboard components following TDD principles
// ABOUTME: Tests dashboard layout, hero section, project cards, and processing status

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import DashboardPage from '@/app/page'
import { HeroSection } from '@/components/dashboard/HeroSection'
import { ProjectGrid } from '@/components/dashboard/ProjectGrid'
import { ProcessingStatus } from '@/components/dashboard/ProcessingStatus'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockPush = jest.fn()
const mockBack = jest.fn()

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
    back: mockBack,
  })
  mockPush.mockClear()
  mockBack.mockClear()
})

describe('Dashboard Page', () => {
  it('should render the main dashboard with three zones', () => {
    render(<DashboardPage />)

    // Zone 1: Hero Section
    expect(screen.getByText('Parse Your Conversations')).toBeInTheDocument()
    expect(screen.getByText(/Upload and categorize years of personal data/i)).toBeInTheDocument()

    // Primary CTA
    const parseButton = screen.getByRole('button', { name: /parse new data/i })
    expect(parseButton).toBeInTheDocument()
    expect(parseButton).toHaveClass('bg-primary-blue')

    // Secondary link to Prompt Refiner
    expect(screen.getByText(/or test prompts in prompt refiner/i)).toBeInTheDocument()

    // Zone 3: Recent Projects (or empty state)
    expect(screen.getByText('Recent Projects')).toBeInTheDocument()
  })

  it('should navigate to parse flow when primary CTA is clicked', async () => {
    const user = userEvent.setup()
    const mockPush = jest.fn()

    // Mock Next.js router
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush })
    }))

    render(<DashboardPage />)
    const parseButton = screen.getByRole('button', { name: /parse new data/i })

    await user.click(parseButton)
    expect(mockPush).toHaveBeenCalledWith('/parse')
  })
})

describe('Hero Section', () => {
  it('should render with proper styling and content', () => {
    render(<HeroSection />)

    const heading = screen.getByRole('heading', { name: /parse your conversations/i })
    expect(heading).toHaveClass('text-ds-display')

    const ctaButton = screen.getByRole('button', { name: /parse new data/i })
    expect(ctaButton).toHaveStyle({ padding: '16px 32px' })

    // Check for upload icon
    expect(screen.getByTestId('upload-icon')).toBeInTheDocument()
  })

  it('should show Prompt Refiner link with hover effect', async () => {
    const user = userEvent.setup()
    render(<HeroSection />)

    const promptLink = screen.getByText(/or test prompts in prompt refiner/i)
    expect(promptLink).toHaveClass('text-primary-blue')

    await user.hover(promptLink)
    expect(promptLink).toHaveClass('underline')
  })
})

describe('Project Grid', () => {
  const mockProjects = [
    {
      id: '1',
      name: 'Family Conversations 2023',
      status: 'completed' as const,
      createdAt: new Date('2024-01-01'),
      lastModified: new Date('2024-01-03'),
      fileCount: 3,
      categoriesCreated: 5,
      conversationsProcessed: 150,
      outputFiles: ['family_2023.md', 'categories.json'],
      processedDate: '3 days ago'
    },
    {
      id: '2',
      name: 'Work Projects',
      status: 'processing' as const,
      createdAt: new Date('2024-01-10'),
      lastModified: new Date(),
      fileCount: 1,
      categoriesCreated: 2,
      conversationsProcessed: 75,
      outputFiles: ['work_partial.md'],
      processedDate: 'In progress'
    }
  ]

  it('should render project cards in a grid layout', () => {
    render(<ProjectGrid projects={mockProjects} />)

    expect(screen.getByText('Family Conversations 2023')).toBeInTheDocument()
    expect(screen.getByText('Work Projects')).toBeInTheDocument()

    // Check metadata display
    expect(screen.getByText(/3 files/)).toBeInTheDocument()
    expect(screen.getByText(/5 categories/)).toBeInTheDocument()
  })

  it('should show empty state when no projects exist', () => {
    render(<ProjectGrid projects={[]} />)

    expect(screen.getByText('No projects yet')).toBeInTheDocument()
    expect(screen.getByText(/Your parsed conversations will appear here/i)).toBeInTheDocument()
  })

  it('should apply hover effect to project cards', async () => {
    const user = userEvent.setup()
    render(<ProjectGrid projects={mockProjects} />)

    const projectCard = screen.getByText('Family Conversations 2023').closest('div')

    await user.hover(projectCard!)
    expect(projectCard).toHaveStyle({ transform: 'translateY(-2px)' })
  })
})

describe('Processing Status', () => {
  const mockProcessing = [
    {
      projectId: '1',
      fileName: 'conversation_export_2023.json',
      status: 'Analyzing fields and content...',
      progress: 67,
      timeRemaining: '~3 min remaining'
    }
  ]

  it('should display processing status when active', () => {
    render(<ProcessingStatus processing={mockProcessing} />)

    expect(screen.getByText('Currently Processing')).toBeInTheDocument()
    expect(screen.getByText('conversation_export_2023.json')).toBeInTheDocument()
    expect(screen.getByText('67%')).toBeInTheDocument()
    expect(screen.getByText('~3 min remaining')).toBeInTheDocument()
  })

  it('should not render when no processing is active', () => {
    render(<ProcessingStatus processing={[]} />)

    expect(screen.queryByText('Currently Processing')).not.toBeInTheDocument()
  })

  it('should show progress bar with correct fill', () => {
    render(<ProcessingStatus processing={mockProcessing} />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '67')
    expect(progressBar).toHaveStyle({ width: '67%' })
  })
})

describe('Drag and Drop Overlay', () => {
  it('should show overlay when files are dragged over dashboard', async () => {
    render(<DashboardPage />)

    // Simulate drag enter
    const dragEvent = new DragEvent('dragenter', {
      dataTransfer: new DataTransfer()
    })
    document.dispatchEvent(dragEvent)

    await waitFor(() => {
      expect(screen.getByText(/drop files here to start parsing/i)).toBeInTheDocument()
    })

    const overlay = screen.getByTestId('drag-drop-overlay')
    expect(overlay).toHaveClass('fixed')
    expect(overlay).toHaveStyle({ backgroundColor: 'rgba(59, 130, 246, 0.08)' })
  })

  it('should hide overlay when drag leaves viewport', async () => {
    render(<DashboardPage />)

    // Show overlay
    const dragEnterEvent = new DragEvent('dragenter', {
      dataTransfer: new DataTransfer()
    })
    document.dispatchEvent(dragEnterEvent)

    await waitFor(() => {
      expect(screen.getByTestId('drag-drop-overlay')).toBeInTheDocument()
    })

    // Hide overlay
    const dragLeaveEvent = new DragEvent('dragleave')
    document.dispatchEvent(dragLeaveEvent)

    await waitFor(() => {
      expect(screen.queryByTestId('drag-drop-overlay')).not.toBeInTheDocument()
    })
  })

  it('should navigate to parse page when files are dropped', async () => {
    const mockPush = jest.fn()
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush })
    }))

    render(<DashboardPage />)

    const file = new File(['test content'], 'test.json', { type: 'application/json' })
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    const dropEvent = new DragEvent('drop', {
      dataTransfer
    })

    document.dispatchEvent(dropEvent)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/parse')
    })
  })
})

describe('Responsive Behavior', () => {
  it('should stack hero section on mobile', () => {
    // Mock mobile viewport
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(max-width: 768px)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }))

    render(<HeroSection />)

    const heroContainer = screen.getByTestId('hero-container')
    expect(heroContainer).toHaveClass('flex-col')
  })

  it('should show single column project grid on mobile', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(max-width: 768px)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }))

    render(<ProjectGrid projects={[]} />)

    const grid = screen.getByTestId('projects-grid')
    expect(grid).toHaveClass('grid-cols-1')
  })
})