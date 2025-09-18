// ABOUTME: Test suite for ClickableField component
// ABOUTME: Tests color coding, hover states, and click interactions

import { render, screen, fireEvent } from '@testing-library/react'
import { ClickableField } from '@/components/upload/ClickableField'

const defaultProps = {
  fieldName: 'testField',
  fieldType: 'computer_friendly' as const,
  isMessages: false,
  isHovered: false,
  isSelected: true,
  onClick: jest.fn(),
  onMouseEnter: jest.fn(),
  onMouseLeave: jest.fn()
}

describe('ClickableField Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render field name with quotes', () => {
      render(<ClickableField {...defaultProps} />)
      expect(screen.getByText('"testField"')).toBeInTheDocument()
    })

    it('should render as a button element', () => {
      render(<ClickableField {...defaultProps} />)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('"testField"')
    })
  })

  describe('Field Type Styling', () => {
    it('should apply computer-friendly styling when selected', () => {
      const props = { ...defaultProps, fieldType: 'computer_friendly' as const }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-100', 'border-blue-200', 'text-blue-800')
    })

    it('should apply LLM-friendly styling when selected', () => {
      const props = { ...defaultProps, fieldType: 'llm_friendly' as const }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-100', 'border-red-200', 'text-red-800')
    })

    it('should apply messages field styling when isMessages is true', () => {
      const props = { ...defaultProps, isMessages: true }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-slate-100', 'border-slate-200', 'text-slate-700')
    })
  })

  describe('Selection State', () => {
    it('should apply selected styling when isSelected is true', () => {
      const props = { ...defaultProps, isSelected: true }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      expect(button).not.toHaveClass('opacity-40')
      expect(button).toHaveClass('bg-blue-100') // Computer-friendly selected color
    })

    it('should apply unselected (dimmed) styling when isSelected is false', () => {
      const props = { ...defaultProps, isSelected: false }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('opacity-40', 'bg-gray-100', 'border-gray-200', 'text-gray-500')
    })
  })

  describe('Hover State', () => {
    it('should apply hover styling when isHovered is true and selected', () => {
      const props = { ...defaultProps, isHovered: true, isSelected: true, fieldType: 'computer_friendly' as const }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-200', 'border-blue-300', 'text-blue-900')
    })

    it('should apply hover styling when isHovered is true and unselected', () => {
      const props = { ...defaultProps, isHovered: true, isSelected: false }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gray-200', 'border-gray-300', 'text-gray-600', 'opacity-60')
    })

    it('should apply messages field hover styling', () => {
      const props = { ...defaultProps, isMessages: true, isHovered: true, isSelected: true }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-slate-200', 'border-slate-300', 'text-slate-800')
    })

    it('should apply LLM-friendly hover styling', () => {
      const props = { ...defaultProps, fieldType: 'llm_friendly' as const, isHovered: true, isSelected: true }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-200', 'border-red-300', 'text-red-900')
    })
  })

  describe('Event Handlers', () => {
    it('should call onClick when button is clicked', () => {
      const mockClick = jest.fn()
      const props = { ...defaultProps, onClick: mockClick }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockClick).toHaveBeenCalledTimes(1)
    })

    it('should call onMouseEnter when mouse enters button', () => {
      const mockMouseEnter = jest.fn()
      const props = { ...defaultProps, onMouseEnter: mockMouseEnter }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)

      expect(mockMouseEnter).toHaveBeenCalledTimes(1)
    })

    it('should call onMouseLeave when mouse leaves button', () => {
      const mockMouseLeave = jest.fn()
      const props = { ...defaultProps, onMouseLeave: mockMouseLeave }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      fireEvent.mouseLeave(button)

      expect(mockMouseLeave).toHaveBeenCalledTimes(1)
    })
  })

  describe('Tooltip/Title Attribute', () => {
    it('should show toggle tooltip for regular fields', () => {
      render(<ClickableField {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title', 'Click to toggle testField field')
    })

    it('should show messages-specific tooltip when isMessages is true and hovered', () => {
      const props = { ...defaultProps, isMessages: true, isHovered: true }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title', 'Click to collapse/expand messages')
    })

    it('should show empty tooltip for messages field when not hovered', () => {
      const props = { ...defaultProps, isMessages: true, isHovered: false }
      render(<ClickableField {...props} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title', '')
    })
  })

  describe('Base Classes and Structure', () => {
    it('should have consistent base classes', () => {
      render(<ClickableField {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'px-2', 'py-1', 'rounded-ds-sm', 'font-mono', 'text-xs',
        'cursor-pointer', 'transition-all', 'duration-200', 'border'
      )
    })

    it('should maintain structure across different states', () => {
      const { rerender } = render(<ClickableField {...defaultProps} />)
      let button = screen.getByRole('button')
      expect(button.textContent).toBe('"testField"')

      // Test different field types
      rerender(<ClickableField {...defaultProps} fieldType="llm_friendly" />)
      button = screen.getByRole('button')
      expect(button.textContent).toBe('"testField"')

      // Test messages field
      rerender(<ClickableField {...defaultProps} isMessages={true} />)
      button = screen.getByRole('button')
      expect(button.textContent).toBe('"testField"')
    })
  })

  describe('Accessibility', () => {
    it('should be focusable and keyboard accessible', () => {
      render(<ClickableField {...defaultProps} />)

      const button = screen.getByRole('button')
      button.focus()
      expect(document.activeElement).toBe(button)
    })

    it('should have meaningful button text', () => {
      render(<ClickableField {...defaultProps} fieldName="user_id" />)

      expect(screen.getByRole('button', { name: '"user_id"' })).toBeInTheDocument()
    })
  })
})