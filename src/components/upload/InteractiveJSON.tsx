// ABOUTME: Interactive JSON display with clickable field names and messages collapse/merge
// ABOUTME: Core component for Stage 1 showing single conversation with field selection

'use client'

import { useState } from 'react'
import { ClickableField } from './ClickableField'
import { MessagesField } from './MessagesField'

interface ConversationData {
  id: string
  title: string
  date: string
  source?: string
  message_count?: number
  duration_minutes?: number
  messages: Array<{
    role: string
    content: string
    timestamp: string
    original_id?: string
  }>
  metadata?: any
}

interface InteractiveJSONProps {
  conversation: ConversationData
  selectedFields: string[]
  onFieldToggle: (fieldName: string) => void
  isMessagesCollapsed: boolean
  onMessagesToggle: () => void
}

export function InteractiveJSON({
  conversation,
  selectedFields,
  onFieldToggle,
  isMessagesCollapsed,
  onMessagesToggle
}: InteractiveJSONProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null)

  const truncateText = (text: string, maxLength: number = 80): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const formatValue = (value: any, fieldName: string): string => {
    if (typeof value === 'string') {
      return `"${truncateText(value)}"`
    }
    if (typeof value === 'number') {
      return value.toString()
    }
    if (typeof value === 'object' && value !== null && fieldName !== 'messages') {
      return JSON.stringify(value, null, 2)
    }
    return JSON.stringify(value)
  }

  const getFieldType = (fieldName: string): 'computer_friendly' | 'llm_friendly' => {
    const computerFriendlyFields = ['id', 'date', 'message_count', 'duration_minutes', 'metadata']
    const llmFriendlyFields = ['title', 'source', 'messages']

    if (computerFriendlyFields.includes(fieldName)) return 'computer_friendly'
    if (llmFriendlyFields.includes(fieldName)) return 'llm_friendly'

    // Default based on content for unknown fields
    const value = conversation[fieldName as keyof ConversationData]
    if (typeof value === 'string' && value.length > 50) return 'llm_friendly'
    return 'computer_friendly'
  }

  const renderField = (fieldName: string, value: any, isLast: boolean = false) => {
    const isSelected = selectedFields.includes(fieldName)
    const fieldType = getFieldType(fieldName)
    const isMessages = fieldName === 'messages'

    return (
      <div key={fieldName} className="flex items-start gap-2">
        <div className="flex items-center gap-1">
          <ClickableField
            fieldName={fieldName}
            fieldType={fieldType}
            isMessages={isMessages}
            isHovered={hoveredField === fieldName}
            isSelected={isSelected}
            onClick={() => onFieldToggle(fieldName)}
            onMouseEnter={() => setHoveredField(fieldName)}
            onMouseLeave={() => setHoveredField(null)}
          />
          <span className="text-text-secondary">:</span>
        </div>
        <div className="flex-1">
          {isSelected ? (
            isMessages ? (
              <MessagesField
                messages={value}
                isCollapsed={isMessagesCollapsed}
                onToggle={onMessagesToggle}
                isHovered={hoveredField === fieldName}
              />
            ) : (
              <span className="text-text-secondary font-mono text-xs">
                {formatValue(value, fieldName)}
              </span>
            )
          ) : (
            <span className="text-text-muted font-mono text-xs italic">
              // field unselected
            </span>
          )}
        </div>
        {!isLast && <span className="text-text-secondary">,</span>}
      </div>
    )
  }

  const allFields = Object.keys(conversation)

  return (
    <div className="bg-surface-white rounded-ds-lg p-ds-medium">
      <div className="mb-ds-small">
        <h3 className="text-ds-subheading font-medium text-text-primary">
          Conversation Structure
        </h3>
        <p className="text-ds-small text-text-secondary">
          Click field names to select/deselect for processing
        </p>
      </div>

      <div className="bg-gray-50 rounded-ds-sm p-ds-medium font-mono text-xs overflow-hidden">
        <div className="text-text-secondary">{'{'}</div>
        <div className="ml-4 space-y-1">
          {allFields.map((fieldName, index) => {
            const value = conversation[fieldName as keyof ConversationData]
            const isLast = index === allFields.length - 1
            return renderField(fieldName, value, isLast)
          })}
        </div>
        <div className="text-text-secondary">{'}'}</div>
      </div>

      {/* Collapse State Indicator */}
      {selectedFields.includes('messages') && (
        <div className="mt-ds-small p-ds-small bg-blue-50 rounded-ds-sm border border-blue-200">
          <p className="text-ds-small text-blue-700">
            {isMessagesCollapsed
              ? 'Messages collapsed - entire conversation will be tagged as one unit'
              : 'Messages expanded - individual messages available for separate processing'
            }
          </p>
        </div>
      )}

      {/* Empty State */}
      {selectedFields.length === 0 && (
        <div className="text-center py-ds-large">
          <p className="text-text-secondary">
            No fields selected. Click field names above to include them in processing.
          </p>
        </div>
      )}
    </div>
  )
}