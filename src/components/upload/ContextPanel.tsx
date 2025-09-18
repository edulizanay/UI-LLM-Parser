// ABOUTME: Smart context input panel with auto-generating placeholders
// ABOUTME: Implements file type detection, contextual suggestions, and user input preservation

'use client'

import { useState, useEffect, useCallback } from 'react'

interface FileData {
  name: string
  content: any[]
  detectedStructure: Array<{
    name: string
    type: 'computer_friendly' | 'llm_friendly'
    category: string
    collapsible?: boolean
  }>
}

interface ContextPanelProps {
  fileData: FileData | null
  onContextChange: (context: string) => void
  initialValue?: string
}

export function ContextPanel({ fileData, onContextChange, initialValue = '' }: ContextPanelProps) {
  const [value, setValue] = useState(initialValue)
  const [placeholder, setPlaceholder] = useState('Describe your data in plain English...')

  // Update value when initialValue changes
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // Generate contextual placeholder based on file data
  const generatePlaceholder = useCallback((fileData: FileData | null) => {
    if (!fileData) {
      return 'Describe your data in plain English...'
    }

    try {
      const { name, content, detectedStructure } = fileData

      // Analyze file name for context clues
      const fileName = name.toLowerCase()
      let context = ''

      if (fileName.includes('claude') || fileName.includes('conversation') || fileName.includes('chat')) {
        context = 'Claude conversations about various topics'
      } else if (fileName.includes('export') || fileName.includes('data')) {
        context = 'exported data with user activity and interactions'
      } else if (fileName.includes('message') || fileName.includes('dialog')) {
        context = 'message history and dialogue data'
      } else {
        context = 'conversation data'
      }

      // Analyze structure for additional context
      const hasMessages = detectedStructure.some(field => field.name === 'messages')
      const hasTimestamp = detectedStructure.some(field =>
        field.name.includes('timestamp') || field.name.includes('date') || field.name.includes('time')
      )
      const hasParticipants = detectedStructure.some(field =>
        field.name.includes('participant') || field.name.includes('user') || field.name.includes('role')
      )

      let details = []
      if (hasMessages) details.push('with detailed message exchanges')
      if (hasTimestamp) details.push('including timestamps')
      if (hasParticipants) details.push('between multiple participants')

      const detailsText = details.length > 0 ? ` ${details.join(', ')}` : ''

      // Estimate data scope
      const recordCount = content.length
      let scope = ''
      if (recordCount > 100) {
        scope = ` spanning ${recordCount} conversations`
      } else if (recordCount > 10) {
        scope = ` from ${recordCount} sessions`
      } else if (recordCount > 1) {
        scope = ` across ${recordCount} interactions`
      }

      return `${context}${detailsText}${scope}. Describe the context and purpose of these conversations.`
    } catch (e) {
      return 'Describe your data in plain English...'
    }
  }, [])

  // Debounced placeholder generation
  useEffect(() => {
    const timer = setTimeout(() => {
      const newPlaceholder = generatePlaceholder(fileData)
      setPlaceholder(newPlaceholder)
    }, 300) // Debounce to avoid rapid changes

    return () => clearTimeout(timer)
  }, [fileData, generatePlaceholder])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onContextChange(newValue)
  }

  return (
    <div
      className="bg-surface-white rounded-ds-lg p-ds-medium sticky top-ds-medium"
      data-testid="context-panel"
    >
      <h2 className="text-ds-subheading font-medium mb-ds-medium">
        Describe Your Data
      </h2>

      <textarea
        data-testid="context-textarea"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Describe your data context"
        className="w-full h-[120px] p-ds-small border border-border-default rounded-ds-sm
                 resize-none transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent
                 placeholder:italic placeholder:opacity-60"
      />

      <p className="text-ds-micro text-text-muted mt-ds-small">
        The tagger will use this context
      </p>
    </div>
  )
}