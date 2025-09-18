// ABOUTME: Test suite for DropZone component - drag/drop file upload functionality
// ABOUTME: Tests file validation, visual feedback states, and drag/drop event handling

import { render, screen, fireEvent } from '@testing-library/react'
import { DropZone } from '@/components/upload/DropZone'

describe('DropZone Component', () => {
  const mockOnFileUpload = jest.fn()

  beforeEach(() => {
    mockOnFileUpload.mockClear()
  })

  describe('Initial State', () => {
    it('should render upload zone with correct styling', () => {
      render(<DropZone onFileUpload={mockOnFileUpload} />)

      const uploadZone = screen.getByTestId('upload-zone')
      expect(uploadZone).toBeInTheDocument()
      expect(uploadZone).toHaveClass('h-[280px]', 'border-dashed', 'rounded-ds-lg')
    })

    it('should display upload instructions', () => {
      render(<DropZone onFileUpload={mockOnFileUpload} />)

      expect(screen.getByText(/drag and drop json files here/i)).toBeInTheDocument()
      expect(screen.getByText(/or click to browse/i)).toBeInTheDocument()
    })

    it('should show upload icon', () => {
      render(<DropZone onFileUpload={mockOnFileUpload} />)

      expect(screen.getByTestId('upload-icon')).toBeInTheDocument()
    })
  })

  describe('Drag and Drop Functionality', () => {
    it('should change visual state on drag enter', () => {
      render(<DropZone onFileUpload={mockOnFileUpload} />)

      const uploadZone = screen.getByTestId('upload-zone')

      fireEvent.dragEnter(uploadZone, {
        dataTransfer: { items: [{ kind: 'file' }] }
      })

      expect(uploadZone).toHaveClass('border-primary-blue', 'bg-primary-blue/5')
    })

    it('should reset visual state on drag leave', () => {
      render(<DropZone onFileUpload={mockOnFileUpload} />)

      const uploadZone = screen.getByTestId('upload-zone')

      fireEvent.dragEnter(uploadZone, {
        dataTransfer: { items: [{ kind: 'file' }] }
      })
      fireEvent.dragLeave(uploadZone)

      expect(uploadZone).toHaveClass('border-border-default')
      expect(uploadZone).not.toHaveClass('border-primary-blue', 'bg-primary-blue/5')
    })

    it('should handle valid JSON file drop', () => {
      render(<DropZone onFileUpload={mockOnFileUpload} />)

      const uploadZone = screen.getByTestId('upload-zone')
      const jsonFile = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' })

      fireEvent.drop(uploadZone, {
        dataTransfer: { files: [jsonFile] }
      })

      expect(mockOnFileUpload).toHaveBeenCalledWith(jsonFile)
    })

    it('should reject non-JSON files', () => {
      render(<DropZone onFileUpload={mockOnFileUpload} />)

      const uploadZone = screen.getByTestId('upload-zone')
      const txtFile = new File(['test content'], 'test.txt', { type: 'text/plain' })

      fireEvent.drop(uploadZone, {
        dataTransfer: { files: [txtFile] }
      })

      expect(mockOnFileUpload).not.toHaveBeenCalled()
      expect(screen.getByText(/only json files are supported/i)).toBeInTheDocument()
    })
  })

  describe('File Selection via Click', () => {
    it('should trigger file input on click', () => {
      render(<DropZone onFileUpload={mockOnFileUpload} />)

      const uploadZone = screen.getByTestId('upload-zone')
      const fileInput = screen.getByTestId('file-input')

      const clickSpy = jest.spyOn(fileInput, 'click')

      fireEvent.click(uploadZone)

      expect(clickSpy).toHaveBeenCalled()
    })

    it('should handle file selection from input', () => {
      render(<DropZone onFileUpload={mockOnFileUpload} />)

      const fileInput = screen.getByTestId('file-input') as HTMLInputElement
      const jsonFile = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' })

      Object.defineProperty(fileInput, 'files', {
        value: [jsonFile],
        writable: false,
      })

      fireEvent.change(fileInput)

      expect(mockOnFileUpload).toHaveBeenCalledWith(jsonFile)
    })
  })

  describe('Error States', () => {
    it('should display error for invalid file size', () => {
      render(<DropZone onFileUpload={mockOnFileUpload} maxFileSize={1} />)

      const uploadZone = screen.getByTestId('upload-zone')
      const largeFile = new File(['{"test": "data"}'], 'large.json', { type: 'application/json' })

      Object.defineProperty(largeFile, 'size', { value: 2000000 }) // 2MB

      fireEvent.drop(uploadZone, {
        dataTransfer: { files: [largeFile] }
      })

      expect(screen.getByText(/file size exceeds limit/i)).toBeInTheDocument()
    })

    it('should clear error states after successful upload', () => {
      render(<DropZone onFileUpload={mockOnFileUpload} />)

      const uploadZone = screen.getByTestId('upload-zone')

      // First, trigger an error
      const txtFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      fireEvent.drop(uploadZone, { dataTransfer: { files: [txtFile] } })

      expect(screen.getByText(/only json files are supported/i)).toBeInTheDocument()

      // Then upload a valid file
      const jsonFile = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' })
      fireEvent.drop(uploadZone, { dataTransfer: { files: [jsonFile] } })

      expect(screen.queryByText(/only json files are supported/i)).not.toBeInTheDocument()
    })
  })
})