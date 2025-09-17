// ABOUTME: Drag and drop file upload component with visual feedback states
// ABOUTME: Implements file validation, error handling, and click-to-browse functionality

'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Upload, AlertCircle } from 'lucide-react'

interface DropZoneProps {
  onFileUpload: (file: File) => void
  error?: string | null
  maxFileSize?: number // in MB, default 10MB
}

export function DropZone({ onFileUpload, error, maxFileSize = 10 }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [internalError, setInternalError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayError = error || internalError

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // Only hide overlay if actually leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    setInternalError(null)

    // Validate file type
    if (!file.type.includes('application/json') && !file.name.endsWith('.json')) {
      setInternalError('Only JSON files are supported')
      return
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxFileSize) {
      setInternalError(`File size exceeds limit of ${maxFileSize}MB`)
      return
    }

    // Clear errors and upload
    setInternalError(null)
    onFileUpload(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-ds-small">
      {/* Upload Zone */}
      <div
        data-testid="upload-zone"
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          h-[280px] border-2 border-dashed rounded-ds-lg
          flex flex-col items-center justify-center
          cursor-pointer transition-all duration-200
          ${isDragging
            ? 'border-primary-blue bg-blue-50'
            : displayError
            ? 'border-red-300 bg-red-50'
            : 'border-border-default bg-surface-white hover:border-border-hover hover:bg-gray-50'
          }
        `}
      >
        {/* Upload Icon */}
        <Upload
          data-testid="upload-icon"
          className={`w-12 h-12 mb-ds-medium ${
            isDragging
              ? 'text-primary-blue animate-pulse'
              : displayError
              ? 'text-red-400'
              : 'text-text-muted'
          }`}
        />

        {/* Upload Text */}
        <div className="text-center">
          <p className={`text-ds-body mb-ds-micro ${
            isDragging
              ? 'text-primary-blue font-medium'
              : displayError
              ? 'text-red-600'
              : 'text-text-secondary'
          }`}>
            {isDragging
              ? 'Drop JSON files here'
              : 'Drag and drop JSON files here'
            }
          </p>
          <p className="text-ds-small text-text-muted">
            or click to browse
          </p>
        </div>

        {/* File size hint */}
        <p className="text-ds-micro text-text-muted mt-ds-small">
          Maximum file size: {maxFileSize}MB
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        data-testid="file-input"
        type="file"
        accept=".json,application/json"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Error Display */}
      {displayError && (
        <div className="flex items-center gap-ds-small p-ds-small rounded-ds-sm bg-red-50 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-ds-small text-red-700">{displayError}</p>
        </div>
      )}
    </div>
  )
}