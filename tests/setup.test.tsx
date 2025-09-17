// ABOUTME: Basic setup test to verify testing infrastructure is working
// ABOUTME: Tests that React components can be rendered and Jest configuration is correct

import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Setup Tests', () => {
  it('should render the home page without crashing', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /conversation parser platform/i,
    })

    expect(heading).toBeInTheDocument()
  })

  it('should show phase 0 complete message', () => {
    render(<Home />)

    const message = screen.getByText(/phase 0 complete - design tokens architecture implemented/i)

    expect(message).toBeInTheDocument()
  })
})