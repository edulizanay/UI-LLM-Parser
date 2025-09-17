// ABOUTME: Drag and drop overlay component for file uploads from anywhere on dashboard
// ABOUTME: Implements drag-drop overlay functionality from @dashboard-design.md specifications

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileUp } from 'lucide-react'

export function DragDropOverlay() {
  const [isDragging, setIsDragging] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true)
      }
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      // Only hide overlay if leaving the viewport
      if (e.clientX === 0 && e.clientY === 0) {
        setIsDragging(false)
      }
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        // Navigate to parse page with file data
        // In a real implementation, we'd pass the file data along
        router.push('/parse')
      }
    }

    document.addEventListener('dragenter', handleDragEnter)
    document.addEventListener('dragleave', handleDragLeave)
    document.addEventListener('dragover', handleDragOver)
    document.addEventListener('drop', handleDrop)

    return () => {
      document.removeEventListener('dragenter', handleDragEnter)
      document.removeEventListener('dragleave', handleDragLeave)
      document.removeEventListener('dragover', handleDragOver)
      document.removeEventListener('drop', handleDrop)
    }
  }, [router])

  if (!isDragging) return null

  return (
    <div
      data-testid="drag-drop-overlay"
      className="fixed inset-0 z-50 pointer-events-none"
    >
      {/* Dimmed background */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />

      {/* Drag drop area */}
      <div className="absolute inset-4 border-2 border-dashed border-primary-blue rounded-xl
                    bg-white bg-opacity-90 flex flex-col items-center justify-center">
        <FileUp className="w-12 h-12 text-primary-blue mb-ds-medium animate-pulse" />
        <p className="text-ds-heading text-primary-blue">
          Drop files here to start parsing
        </p>
      </div>
    </div>
  )
}