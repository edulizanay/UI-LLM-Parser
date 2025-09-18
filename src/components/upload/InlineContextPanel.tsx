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

  const handleSaveAndClose = () => {
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.shiftKey && event.key === 'Enter') {
      event.preventDefault()
      handleSaveAndClose()
    }
  }

  // Generate placeholder based on file data
  const getPlaceholder = () => {
    if (!fileData) {
      return 'e.g., Work emails with my team'
    }
    return 'e.g., Conversations between me and my mom'
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 shadow-lg
                   transition-all duration-200 ${
          hasContent && !isExpanded
            ? 'px-3 py-3' // Compact when has content AND not expanded
            : 'px-4 py-3' // Full padding when empty OR expanded
        } ${
          isExpanded
            ? 'rounded-t-2xl rounded-b-none'
            : hasContent && !isExpanded
              ? 'rounded-full' // Circular when compact
              : 'rounded-2xl' // Extra rounded when full
        } ${
          hasContent
            ? 'bg-primary-blue text-white hover:bg-primary-blue-hover'
            : 'bg-surface-white text-text-secondary hover:text-text-primary border border-border-default hover:border-border-focus'
        }`}
        title={hasContent ? "Edit data description" : "Describe your data"}
      >
        <MessageSquareText className="w-5 h-5" />
        {(!hasContent || isExpanded) && (
          <span className="text-sm font-medium whitespace-nowrap">
            Give context about your data
          </span>
        )}
      </button>

      {/* Expanding Text Area */}
      <div
        className={`bg-surface-white border border-border-default rounded-t-none rounded-b-2xl shadow-lg
                   transition-all duration-300 ease-out overflow-hidden ${
          isExpanded ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ width: '100%' }}
      >
        <div className="p-4">
          <div className="relative group">
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder()}
              className="w-full h-24 p-2 border border-border-default rounded-ds-sm
                       resize-none transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent
                       placeholder:italic placeholder:opacity-60 text-sm
                       scrollbar-hidden"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              autoFocus={isExpanded}
            />

            {/* Floating keyboard hint inside textarea */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs
                          opacity-0 transition-opacity duration-200 pointer-events-none
                          group-focus-within:opacity-100">
              <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-xs">⇧</span>
              <span className="text-gray-400">+</span>
              <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-xs">⏎</span>
              <span className="text-text-muted ml-1">to save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}