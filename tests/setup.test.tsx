// ABOUTME: Basic setup test to verify testing infrastructure is working
// ABOUTME: Tests that React components can be rendered and Jest configuration is correct

import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Home from '@/app/page'

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
})

describe('Setup Tests', () => {
  it('should render the home page without crashing', () => {
    render(<Home />)

    // Check that the main dashboard element renders
    const main = screen.getByTestId('dashboard-main')
    expect(main).toBeInTheDocument()
  })

  it('should show primary navigation elements', () => {
    render(<Home />)

    // Check for the main CTA button
    const parseButton = screen.getByRole('link', { name: /parse new data/i })
    expect(parseButton).toBeInTheDocument()

    // Check for the prompt refiner link
    const promptRefinerLink = screen.getByRole('link', { name: /refine your prompts/i })
    expect(promptRefinerLink).toBeInTheDocument()
  })
})