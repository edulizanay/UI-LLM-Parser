// ABOUTME: Compact collapsible context panel with expandable overlay functionality
// ABOUTME: Replaces fixed right sidebar with space-efficient toggle interface

'use client'

import { useState } from 'react'
import { MessageSquareText, Save, X } from 'lucide-react'

interface CompactContextPanelProps {
  initialValue?: string
  onContextChange: (context: string) => void
  fileData: any | null
}

export function CompactContextPanel({
  initialValue = '',
  onContextChange,
  fileData
}: CompactContextPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [tempValue, setTempValue] = useState(initialValue)
  const [savedValue, setSavedValue] = useState(initialValue)

  const hasContent = savedValue.trim().length > 0

  const handleSave = () => {
    setSavedValue(tempValue)
    onContextChange(tempValue)
    setIsExpanded(false)
  }

  const handleCancel = () => {
    setTempValue(savedValue)
    setIsExpanded(false)
  }

  const handleExpand = () => {
    setTempValue(savedValue)
    setIsExpanded(true)
  }

  // Generate placeholder based on file data (similar to existing logic)
  const getPlaceholder = () => {
    if (!fileData) {
      return 'Describe your data in plain English...'
    }
    return 'Claude conversations about various topics. Describe the context and purpose of these conversations.'
  }

  if (isExpanded) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCancel}>
        <div
          className="bg-surface-white rounded-ds-lg p-ds-large w-full max-w-2xl mx-4 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-ds-medium">
            <h3 className="text-ds-heading font-medium text-text-primary">
              Describe Your Data
            </h3>
            <button
              onClick={handleCancel}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full h-32 p-ds-small border border-border-default rounded-ds-sm
                     resize-none transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent
                     placeholder:italic placeholder:opacity-60"
            autoFocus
          />

          <p className="text-ds-micro text-text-muted mt-ds-small mb-ds-medium">
            The tagger will use this context
          </p>

          <div className="flex justify-end gap-ds-small">
            <button
              onClick={handleCancel}
              className="px-ds-medium py-ds-small text-text-secondary hover:text-text-primary
                       transition-colors rounded-ds-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-ds-medium py-ds-small bg-primary-blue text-white rounded-ds-sm
                       hover:bg-primary-blue-hover transition-colors font-medium
                       flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleExpand}
      className={`fixed top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-200
                 hover:shadow-xl hover:scale-105 z-40 ${
        hasContent
          ? 'bg-primary-blue text-white hover:bg-primary-blue-hover'
          : 'bg-surface-white text-text-secondary hover:text-text-primary border border-border-default'
      }`}
      title={hasContent ? "Edit data description" : "Describe your data"}
    >
      <MessageSquareText className="w-5 h-5" />
      {hasContent && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </button>
  )
}