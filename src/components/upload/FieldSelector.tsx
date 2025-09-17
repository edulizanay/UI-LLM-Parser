// ABOUTME: Field selection component with computer/LLM categorization and collapse functionality
// ABOUTME: Implements visual distinction, real-time statistics, and messages field special handling

'use client'

import { useState, useEffect } from 'react'
import { Check, Info } from 'lucide-react'

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

interface ProcessingStats {
  conversationCount: number
  interactionCount: number
  tokenCount: number
}

interface FieldSelectorProps {
  fileData: FileData
  selectedFields?: string[]
  onFieldSelectionChange: (selectedFields: string[]) => void
  onStatisticsUpdate: (stats: ProcessingStats) => void
  isMessagesCollapsed?: boolean
  onMessagesCollapseChange?: (collapsed: boolean) => void
}

export function FieldSelector({
  fileData,
  selectedFields = [],
  onFieldSelectionChange,
  onStatisticsUpdate,
  isMessagesCollapsed = false,
  onMessagesCollapseChange
}: FieldSelectorProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null)

  // Calculate statistics whenever selections change
  useEffect(() => {
    calculateStatistics()
  }, [selectedFields, isMessagesCollapsed, fileData])

  const calculateStatistics = () => {
    if (!fileData || selectedFields.length === 0) {
      onStatisticsUpdate({ conversationCount: 0, interactionCount: 0, tokenCount: 0 })
      return
    }

    const conversationCount = fileData.content.length
    let interactionCount = 0
    let tokenCount = 0

    // Calculate interactions based on messages field state
    if (selectedFields.includes('messages')) {
      if (isMessagesCollapsed) {
        interactionCount = conversationCount // One interaction per conversation when collapsed
      } else {
        // Count individual messages when expanded
        fileData.content.forEach(conversation => {
          if (conversation.messages && Array.isArray(conversation.messages)) {
            interactionCount += conversation.messages.length
          }
        })
      }
    }

    // Estimate token count (rough approximation)
    fileData.content.forEach(item => {
      selectedFields.forEach(fieldName => {
        const value = item[fieldName]
        if (typeof value === 'string') {
          tokenCount += Math.ceil(value.length / 4) // Rough token estimation
        } else if (Array.isArray(value)) {
          value.forEach(subItem => {
            if (typeof subItem === 'object' && subItem.content) {
              tokenCount += Math.ceil(subItem.content.length / 4)
            }
          })
        }
      })
    })

    onStatisticsUpdate({ conversationCount, interactionCount, tokenCount })
  }

  const handleFieldToggle = (fieldName: string) => {
    const newSelected = selectedFields.includes(fieldName)
      ? selectedFields.filter(f => f !== fieldName)
      : [...selectedFields, fieldName]

    onFieldSelectionChange(newSelected)
  }

  const handleMessagesFieldClick = (fieldName: string) => {
    const messagesField = fileData.detectedStructure.find(f => f.name === fieldName && f.collapsible)

    if (messagesField && onMessagesCollapseChange) {
      onMessagesCollapseChange(!isMessagesCollapsed)
    } else {
      handleFieldToggle(fieldName)
    }
  }

  const getFieldClasses = (field: any, isSelected: boolean) => {
    const baseClasses = 'flex items-center justify-between p-ds-small rounded-ds-sm transition-all duration-200'

    if (field.collapsible) {
      return `${baseClasses} ${
        isSelected
          ? isMessagesCollapsed
            ? 'bg-slate-200 hover:bg-slate-300'
            : 'bg-slate-100 hover:bg-slate-200'
          : 'bg-slate-50 hover:bg-slate-100 opacity-40'
      } cursor-pointer`
    }

    return `${baseClasses} ${
      isSelected
        ? 'bg-gray-50 hover:bg-gray-100'
        : 'bg-gray-25 hover:bg-gray-50 opacity-40'
    }`
  }

  const getFieldNameClasses = (field: any, isSelected: boolean) => {
    const opacity = isSelected ? '' : 'opacity-40'

    if (field.type === 'computer_friendly') {
      return `text-field-computer-friendly font-medium ${opacity}`
    } else {
      return `text-field-llm-friendly font-medium ${opacity}`
    }
  }

  const getBadgeClasses = (fieldType: string) => {
    if (fieldType === 'computer_friendly') {
      return 'bg-blue-100 text-blue-700 border border-blue-200'
    } else {
      return 'bg-red-100 text-red-700 border border-red-200'
    }
  }

  if (!fileData.detectedStructure || fileData.detectedStructure.length === 0) {
    return (
      <div className="bg-surface-white rounded-ds-lg p-ds-medium">
        <h2 className="text-ds-subheading font-medium mb-ds-medium">Field Selection</h2>
        <div className="text-center py-ds-large">
          <Info className="w-8 h-8 text-text-muted mx-auto mb-ds-small" />
          <p className="text-text-secondary">No fields detected in uploaded file</p>
        </div>
      </div>
    )
  }

  // Check for invalid field data
  const hasInvalidFields = fileData.detectedStructure.some(field => !field.name || !field.type)
  if (hasInvalidFields) {
    return (
      <div className="bg-surface-white rounded-ds-lg p-ds-medium">
        <h2 className="text-ds-subheading font-medium mb-ds-medium">Field Selection</h2>
        <div className="text-center py-ds-large">
          <Info className="w-8 h-8 text-red-400 mx-auto mb-ds-small" />
          <p className="text-red-600">Error processing field structure</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-white rounded-ds-lg p-ds-medium" data-testid="field-selector">
      <h2 className="text-ds-subheading font-medium mb-ds-medium">
        Select Fields to Process
      </h2>

      <div className="space-y-ds-small">
        {fileData.detectedStructure.map((field) => {
          const isSelected = selectedFields.includes(field.name)
          const isHovered = hoveredField === field.name

          return (
            <div
              key={field.name}
              data-testid={`field-${field.name}`}
              className={getFieldClasses(field, isSelected)}
              onMouseEnter={() => setHoveredField(field.name)}
              onMouseLeave={() => setHoveredField(null)}
              onClick={() => field.collapsible ? handleMessagesFieldClick(field.name) : handleFieldToggle(field.name)}
            >
              {/* Left side - Field info */}
              <div className="flex items-center gap-ds-small">
                {!field.collapsible && (
                  <button
                    data-testid={`checkbox-${field.name}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFieldToggle(field.name)
                    }}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-primary-blue border-primary-blue'
                        : 'border-border-default hover:border-border-hover'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                )}

                <div>
                  <div className="flex items-center gap-ds-small">
                    <span
                      data-testid={`field-name-${field.name}`}
                      className={getFieldNameClasses(field, isSelected)}
                    >
                      {field.name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-ds-micro font-medium ${getBadgeClasses(field.type)}`}>
                      {field.type === 'computer_friendly' ? 'computer-friendly' : 'llm-friendly'}
                    </span>
                  </div>
                  <div className="text-ds-small text-text-muted">{field.category}</div>
                </div>
              </div>

              {/* Right side - Collapse tooltip for messages field */}
              {field.collapsible && isHovered && (
                <div className="text-ds-small text-text-secondary">
                  {isMessagesCollapsed ? 'Click to uncollapse' : 'Click to collapse'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Messages field status indicator */}
      {fileData.detectedStructure.some(f => f.collapsible) && (
        <div className="mt-ds-medium p-ds-small bg-blue-50 rounded-ds-sm border border-blue-200">
          <p className="text-ds-small text-blue-700">
            {isMessagesCollapsed
              ? 'Collapsed - entire conversation will be tagged as one unit'
              : 'Expanded - individual messages available for separate processing'
            }
          </p>
        </div>
      )}
    </div>
  )
}