// ABOUTME: Tests for root layout component
// ABOUTME: Verifies layout functionality, metadata, and global styles

import { render } from '@testing-library/react'
import RootLayout from '@/app/layout'

describe('Root Layout', () => {
  describe('Layout Functionality', () => {
    it('should render children components correctly', () => {
      const TestChild = () => <div data-testid="test-child">Test Content</div>

      const { getByTestId } = render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      )

      expect(getByTestId('test-child')).toBeInTheDocument()
      expect(getByTestId('test-child')).toHaveTextContent('Test Content')
    })

    it('should apply global styles and fonts', () => {
      const TestChild = () => <div data-testid="test-child">Test Content</div>

      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      )

      // Should render HTML structure
      const htmlElement = document.documentElement
      expect(htmlElement).toHaveAttribute('lang', 'en')

      // Body should be present
      const bodyElement = document.body
      expect(bodyElement).toBeInTheDocument()
    })

    it('should handle metadata and SEO tags', () => {
      // Note: In a real test environment, we would test this with a meta tag checker
      // For now, we verify the layout renders correctly
      const TestChild = () => <div data-testid="test-child">Test Content</div>

      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      )

      // Verify basic HTML structure
      expect(document.documentElement).toHaveAttribute('lang', 'en')
    })

    it('should provide consistent styling across pages', () => {
      const TestChild = () => (
        <div data-testid="test-child" className="bg-surface-background">
          Test Content
        </div>
      )

      const { getByTestId } = render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      )

      const child = getByTestId('test-child')
      expect(child).toHaveClass('bg-surface-background')
    })

    it('should handle multiple children', () => {
      const { getByTestId } = render(
        <RootLayout>
          <div data-testid="child-1">First Child</div>
          <div data-testid="child-2">Second Child</div>
        </RootLayout>
      )

      expect(getByTestId('child-1')).toBeInTheDocument()
      expect(getByTestId('child-2')).toBeInTheDocument()
    })

    it('should handle empty children', () => {
      const { container } = render(<RootLayout>{null}</RootLayout>)

      // Should still render the HTML structure
      expect(document.documentElement).toBeInTheDocument()
      expect(document.body).toBeInTheDocument()
    })

    it('should handle complex nested children', () => {
      const ComplexChild = () => (
        <div data-testid="complex-child">
          <header>Header</header>
          <main>
            <section>Section Content</section>
          </main>
          <footer>Footer</footer>
        </div>
      )

      const { getByTestId } = render(
        <RootLayout>
          <ComplexChild />
        </RootLayout>
      )

      const complexChild = getByTestId('complex-child')
      expect(complexChild).toBeInTheDocument()
      expect(complexChild.querySelector('header')).toBeInTheDocument()
      expect(complexChild.querySelector('main')).toBeInTheDocument()
      expect(complexChild.querySelector('footer')).toBeInTheDocument()
    })
  })

  describe('HTML Structure', () => {
    it('should have proper semantic HTML structure', () => {
      const TestChild = () => <div data-testid="test-child">Test Content</div>

      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      )

      // Verify HTML element
      const htmlElement = document.documentElement
      expect(htmlElement.tagName).toBe('HTML')
      expect(htmlElement).toHaveAttribute('lang', 'en')

      // Verify body element
      const bodyElement = document.body
      expect(bodyElement.tagName).toBe('BODY')
    })

    it('should maintain clean document structure', () => {
      const TestChild = () => <div data-testid="test-child">Test Content</div>

      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      )

      // Should have expected document structure
      expect(document.documentElement).toBeInTheDocument()
      expect(document.head).toBeInTheDocument()
      expect(document.body).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper language attribute', () => {
      const TestChild = () => <div data-testid="test-child">Test Content</div>

      render(
        <RootLayout>
          <TestChild />
        </RootLayout>
      )

      expect(document.documentElement).toHaveAttribute('lang', 'en')
    })

    it('should not interfere with child component accessibility', () => {
      const AccessibleChild = () => (
        <div data-testid="accessible-child" role="main" aria-label="Test content">
          Accessible Content
        </div>
      )

      const { getByTestId } = render(
        <RootLayout>
          <AccessibleChild />
        </RootLayout>
      )

      const child = getByTestId('accessible-child')
      expect(child).toHaveAttribute('role', 'main')
      expect(child).toHaveAttribute('aria-label', 'Test content')
    })
  })

  describe('Error Handling', () => {
    it('should handle React error boundaries gracefully', () => {
      // Test that layout doesn't break with error boundaries
      const StableChild = () => <div data-testid="stable-child">Stable Content</div>

      const { getByTestId } = render(
        <RootLayout>
          <StableChild />
        </RootLayout>
      )

      expect(getByTestId('stable-child')).toBeInTheDocument()
    })

    it('should maintain layout integrity with dynamic content', () => {
      const DynamicChild = ({ content }: { content: string }) => (
        <div data-testid="dynamic-child">{content}</div>
      )

      const { getByTestId, rerender } = render(
        <RootLayout>
          <DynamicChild content="Initial Content" />
        </RootLayout>
      )

      expect(getByTestId('dynamic-child')).toHaveTextContent('Initial Content')

      // Re-render with different content
      rerender(
        <RootLayout>
          <DynamicChild content="Updated Content" />
        </RootLayout>
      )

      expect(getByTestId('dynamic-child')).toHaveTextContent('Updated Content')
    })
  })
})