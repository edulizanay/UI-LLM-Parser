// ABOUTME: Inline expanding context input that slides down from button
// ABOUTME: Compact dropdown-style interaction for data description

'use client'

import { useState } from 'react'
import { MessageSquareText, Save, X } from 'lucide-react'

interface InlineContextPanelProps {
  initialValue?: string
  onContextChange: (context: string) => void
  fileData: any | null
}

export function InlineContextPanel({
  initialValue = '',
  onContextChange,
  fileData
}: InlineContextPanelProps) {
  const [tempValue, setTempValue] = useState(initialValue)
  const [savedValue, setSavedValue] = useState(initialValue)
  const [isExpanded, setIsExpanded] = useState(false)

  const hasContent = savedValue.trim().length > 0

  const handleSave = () => {
    setSavedValue(tempValue)
    onContextChange(tempValue)
    setIsExpanded(false)
  }

  const handleClickOutside = () => {
    setTempValue(savedValue)
    setIsExpanded(false)
  }

  const handleToggle = () => {
    if (!isExpanded) {
      setTempValue(savedValue)
    }
    setIsExpanded(!isExpanded)
  }

  // Generate placeholder based on file data
  const getPlaceholder = () => {
    if (!fileData) {
      return 'Describe your data in plain English...'
    }
    return 'Claude conversations about various topics. Describe the context and purpose of these conversations.'
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg
                   transition-all duration-200 hover:shadow-xl hover:scale-105 ${
          hasContent
            ? 'bg-primary-blue text-white hover:bg-primary-blue-hover'
            : 'bg-surface-white text-text-secondary hover:text-text-primary border border-border-default hover:border-border-focus'
        }`}
        title={hasContent ? "Edit data description" : "Describe your data"}
      >
        <MessageSquareText className="w-5 h-5" />
        <span className="text-sm font-medium whitespace-nowrap">
          Give context about your data
        </span>
        {hasContent && (
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        )}
      </button>

      {/* Expanding Text Area */}
      <div
        className={`mt-2 bg-surface-white border border-border-default rounded-lg shadow-lg
                   transition-all duration-300 ease-out overflow-hidden ${
          isExpanded ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ width: '100%' }}
      >
        <div className="p-4">
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full h-24 p-2 border border-border-default rounded-ds-sm
                     resize-none transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent
                     placeholder:italic placeholder:opacity-60 text-sm"
            autoFocus={isExpanded}
          />

          <div className="flex justify-end mt-3">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-text-secondary hover:text-primary-blue
                       transition-colors rounded-ds-sm text-sm font-medium
                       flex items-center gap-1.5"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}