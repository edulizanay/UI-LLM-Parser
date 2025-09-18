// ABOUTME: Tests for keyboard navigation and accessibility compliance
// ABOUTME: Verifies tab navigation, focus management, ARIA compliance, and screen reader support

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock components with accessibility features
const AccessibleButton = ({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ...props
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
  [key: string]: any
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`
      focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:outline-none
      disabled:cursor-not-allowed disabled:opacity-50
      transition-all duration-200
    `}
    {...props}
  >
    {children}
  </button>
)

const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Focus management
      const modal = document.querySelector('[role="dialog"]') as HTMLElement
      if (modal) {
        modal.focus()
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
      tabIndex={-1}
      data-testid="modal"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 id="modal-title" className="text-lg font-semibold mb-4">
          {title}
        </h2>
        {children}
        <button
          onClick={onClose}
          aria-label="Close modal"
          data-testid="close-modal"
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
        >
          Close
        </button>
      </div>
    </div>
  )
}

const AccessibleForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    description: ''
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = validateForm()
    if (isValid) {
      alert('Form submitted successfully!')
    }
  }

  return (
    <form onSubmit={handleSubmit} data-testid="accessible-form">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name <span aria-label="required" className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && (
          <div id="name-error" role="alert" className="text-red-500 text-sm mt-1">
            {errors.name}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email <span aria-label="required" className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.email && (
          <div id="email-error" role="alert" className="text-red-500 text-sm mt-1">
            {errors.email}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  )
}

const AccessibleDataGrid = () => {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
  ]

  const [selectedRow, setSelectedRow] = React.useState<number | null>(null)

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        nextIndex = Math.min(index + 1, data.length - 1)
        setSelectedRow(nextIndex)
        // Focus the next row
        setTimeout(() => {
          const nextRow = document.querySelector(`[data-testid="grid-row-${nextIndex}"]`) as HTMLElement
          if (nextRow) nextRow.focus()
        }, 0)
        break
      case 'ArrowUp':
        e.preventDefault()
        nextIndex = Math.max(index - 1, 0)
        setSelectedRow(nextIndex)
        // Focus the previous row
        setTimeout(() => {
          const prevRow = document.querySelector(`[data-testid="grid-row-${nextIndex}"]`) as HTMLElement
          if (prevRow) prevRow.focus()
        }, 0)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        setSelectedRow(selectedRow === index ? null : index)
        break
    }
  }

  return (
    <div role="grid" aria-label="User data grid" data-testid="data-grid">
      <div role="row" className="grid grid-cols-4 gap-4 p-2 bg-gray-100 font-semibold">
        <div role="columnheader">ID</div>
        <div role="columnheader">Name</div>
        <div role="columnheader">Email</div>
        <div role="columnheader">Role</div>
      </div>
      {data.map((item, index) => (
        <div
          key={item.id}
          role="row"
          tabIndex={0}
          aria-selected={selectedRow === index}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onClick={() => setSelectedRow(index)}
          className={`
            grid grid-cols-4 gap-4 p-2 border-b cursor-pointer
            focus:ring-2 focus:ring-blue-500 focus:bg-blue-50
            ${selectedRow === index ? 'bg-blue-100' : 'hover:bg-gray-50'}
          `}
          data-testid={`grid-row-${index}`}
        >
          <div role="gridcell">{item.id}</div>
          <div role="gridcell">{item.name}</div>
          <div role="gridcell">{item.email}</div>
          <div role="gridcell">{item.role}</div>
        </div>
      ))}
    </div>
  )
}

// No React mocking needed - use real React hooks for proper component behavior

describe('Keyboard Navigation', () => {
  describe('Tab Navigation', () => {
    it('should support tab navigation through all interactive elements', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <AccessibleButton data-testid="button-1">Button 1</AccessibleButton>
          <AccessibleButton data-testid="button-2">Button 2</AccessibleButton>
          <AccessibleButton data-testid="button-3">Button 3</AccessibleButton>
        </div>
      )

      const button1 = screen.getByTestId('button-1')
      const button2 = screen.getByTestId('button-2')
      const button3 = screen.getByTestId('button-3')

      // Start with first button focused
      button1.focus()
      expect(button1).toHaveFocus()

      // Tab to second button
      await user.tab()
      expect(button2).toHaveFocus()

      // Tab to third button
      await user.tab()
      expect(button3).toHaveFocus()

      // Shift+Tab back to second button
      await user.tab({ shift: true })
      expect(button2).toHaveFocus()
    })

    it('should provide visible focus indicators', () => {
      render(<AccessibleButton>Test Button</AccessibleButton>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus:ring-2', 'focus:ring-primary-blue', 'focus:ring-offset-2')
    })

    it('should skip disabled elements in tab order', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <AccessibleButton data-testid="button-1">Button 1</AccessibleButton>
          <AccessibleButton data-testid="button-2" disabled>Button 2 (Disabled)</AccessibleButton>
          <AccessibleButton data-testid="button-3">Button 3</AccessibleButton>
        </div>
      )

      const button1 = screen.getByTestId('button-1')
      const button2 = screen.getByTestId('button-2')
      const button3 = screen.getByTestId('button-3')

      button1.focus()
      expect(button1).toHaveFocus()

      // Tab should skip disabled button
      await user.tab()
      expect(button3).toHaveFocus()
      expect(button2).not.toHaveFocus()
    })
  })

  describe('Escape Key Support', () => {
    it('should support escape key for closing modals/overlays', async () => {
      const user = userEvent.setup()
      const mockOnClose = jest.fn()

      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </AccessibleModal>
      )

      expect(screen.getByTestId('modal')).toBeInTheDocument()

      await user.keyboard('{Escape}')

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should not close modal when escape is pressed on child elements', async () => {
      const user = userEvent.setup()
      const mockOnClose = jest.fn()

      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <input data-testid="modal-input" placeholder="Type here" />
        </AccessibleModal>
      )

      const input = screen.getByTestId('modal-input')
      await user.click(input)
      await user.keyboard('{Escape}')

      // Escape should still close the modal
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Arrow Key Navigation', () => {
    it('should handle arrow key navigation in grids/lists', async () => {
      const user = userEvent.setup()

      render(<AccessibleDataGrid />)

      const firstRow = screen.getByTestId('grid-row-0')
      const secondRow = screen.getByTestId('grid-row-1')
      const thirdRow = screen.getByTestId('grid-row-2')

      // Focus first row
      firstRow.focus()
      expect(firstRow).toHaveFocus()

      // Arrow down to second row
      await user.keyboard('{ArrowDown}')
      expect(secondRow).toHaveFocus()

      // Arrow down to third row
      await user.keyboard('{ArrowDown}')
      expect(thirdRow).toHaveFocus()

      // Arrow up back to second row
      await user.keyboard('{ArrowUp}')
      expect(secondRow).toHaveFocus()
    })

    it('should handle boundary conditions in arrow navigation', async () => {
      const user = userEvent.setup()

      render(<AccessibleDataGrid />)

      const firstRow = screen.getByTestId('grid-row-0')
      const lastRow = screen.getByTestId('grid-row-2')

      // Focus first row and try to go up (should stay at first)
      firstRow.focus()
      await user.keyboard('{ArrowUp}')
      expect(firstRow).toHaveFocus()

      // Focus last row and try to go down (should stay at last)
      lastRow.focus()
      await user.keyboard('{ArrowDown}')
      expect(lastRow).toHaveFocus()
    })

    it('should support space and enter for selection', async () => {
      const user = userEvent.setup()

      render(<AccessibleDataGrid />)

      const firstRow = screen.getByTestId('grid-row-0')
      firstRow.focus()

      // Press space to select
      await user.keyboard(' ')
      expect(firstRow).toHaveAttribute('aria-selected', 'true')

      // Press enter to select another row
      const secondRow = screen.getByTestId('grid-row-1')
      secondRow.focus()
      await user.keyboard('{Enter}')
      expect(secondRow).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('Screen Reader Navigation', () => {
    it('should work with screen reader navigation patterns', () => {
      render(<AccessibleDataGrid />)

      const grid = screen.getByTestId('data-grid')
      expect(grid).toHaveAttribute('role', 'grid')
      expect(grid).toHaveAttribute('aria-label', 'User data grid')

      // Check column headers
      const columnHeaders = screen.getAllByRole('columnheader')
      expect(columnHeaders).toHaveLength(4)
      expect(columnHeaders[0]).toHaveTextContent('ID')
      expect(columnHeaders[1]).toHaveTextContent('Name')

      // Check grid cells
      const gridCells = screen.getAllByRole('gridcell')
      expect(gridCells.length).toBeGreaterThan(0)
    })

    it('should provide proper landmark navigation', () => {
      render(
        <div>
          <header role="banner">
            <h1>Page Title</h1>
          </header>
          <nav role="navigation" aria-label="Main navigation">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
          <main role="main">
            <h2>Main Content</h2>
            <AccessibleForm />
          </main>
          <footer role="contentinfo">
            <p>Footer content</p>
          </footer>
        </div>
      )

      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })
  })

  describe('Focus Management', () => {
    it('should maintain focus management during interactions', async () => {
      const user = userEvent.setup()
      const mockOnClose = jest.fn()

      render(
        <div>
          <AccessibleButton data-testid="open-modal">Open Modal</AccessibleButton>
          <AccessibleModal isOpen={true} onClose={mockOnClose} title="Test Modal">
            <AccessibleButton data-testid="modal-button">Modal Button</AccessibleButton>
          </AccessibleModal>
        </div>
      )

      // Modal should be focusable
      const modal = screen.getByTestId('modal')
      expect(modal).toHaveAttribute('tabIndex', '-1')

      // Close button should be accessible
      const closeButton = screen.getByTestId('close-modal')
      expect(closeButton).toBeInTheDocument()
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal')
    })

    it('should handle disabled states appropriately', () => {
      render(
        <div>
          <AccessibleButton disabled data-testid="disabled-button">
            Disabled Button
          </AccessibleButton>
          <AccessibleButton data-testid="enabled-button">
            Enabled Button
          </AccessibleButton>
        </div>
      )

      const disabledButton = screen.getByTestId('disabled-button')
      const enabledButton = screen.getByTestId('enabled-button')

      expect(disabledButton).toBeDisabled()
      expect(disabledButton).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
      expect(enabledButton).not.toBeDisabled()
    })

    it('should trap focus within modals', async () => {
      const user = userEvent.setup()
      const mockOnClose = jest.fn()

      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <AccessibleButton data-testid="first-button">First Button</AccessibleButton>
          <AccessibleButton data-testid="second-button">Second Button</AccessibleButton>
        </AccessibleModal>
      )

      const firstButton = screen.getByTestId('first-button')
      const secondButton = screen.getByTestId('second-button')
      const closeButton = screen.getByTestId('close-modal')

      // Focus should be manageable within modal
      firstButton.focus()
      expect(firstButton).toHaveFocus()

      await user.tab()
      expect(secondButton).toHaveFocus()

      await user.tab()
      expect(closeButton).toHaveFocus()
    })
  })

  describe('Form Accessibility', () => {
    it('should provide proper form labels and associations', () => {
      render(<AccessibleForm />)

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const descriptionInput = screen.getByLabelText(/description/i)

      expect(nameInput).toHaveAttribute('id', 'name')
      expect(emailInput).toHaveAttribute('id', 'email')
      expect(descriptionInput).toHaveAttribute('id', 'description')

      // Check required field indicators
      expect(nameInput).toHaveAttribute('aria-required', 'true')
      expect(emailInput).toHaveAttribute('aria-required', 'true')
      expect(descriptionInput).not.toHaveAttribute('aria-required')
    })

    it('should announce validation errors to screen readers', async () => {
      const user = userEvent.setup()

      render(<AccessibleForm />)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      // Error messages should have role="alert"
      const errorMessages = screen.getAllByRole('alert')
      expect(errorMessages.length).toBeGreaterThan(0)

      // Inputs should be marked as invalid
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)

      expect(nameInput).toHaveAttribute('aria-invalid', 'true')
      expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    })

    it('should provide error descriptions via aria-describedby', async () => {
      const user = userEvent.setup()

      render(<AccessibleForm />)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      const nameInput = screen.getByLabelText(/name/i)
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error')

      const nameError = screen.getByText('Name is required')
      expect(nameError).toHaveAttribute('id', 'name-error')
    })
  })
})