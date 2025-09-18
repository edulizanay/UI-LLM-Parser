// ABOUTME: Interactive JSON display with clickable field names and messages collapse/merge
// ABOUTME: Core component for Stage 1 showing single conversation with field selection

'use client'

import { useState } from 'react'
import { ClickableField } from './ClickableField'
import { MessagesField } from './MessagesField'
import { getTruncationClasses } from '@/lib/designTokens'

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

  const truncateArray = (arr: any[], maxItems: number = 2): { items: any[], truncated: boolean, totalCount: number } => {
    return {
      items: arr.slice(0, maxItems),
      truncated: arr.length > maxItems,
      totalCount: arr.length
    }
  }

  const formatValue = (value: any, fieldName: string): string => {
    if (typeof value === 'string') {
      // Don't truncate strings here - let CSS handle it
      return `"${value}"`
    }
    if (typeof value === 'number') {
      return value.toString()
    }
    if (Array.isArray(value) && fieldName !== 'messages') {
      const { items, truncated, totalCount } = truncateArray(value)
      const formattedItems = items.map(item =>
        typeof item === 'string' ? `"${truncateText(item, 40)}"` : JSON.stringify(item)
      ).join(', ')
      return `[${formattedItems}${truncated ? `, ... ${totalCount - items.length} more` : ''}]`
    }
    if (typeof value === 'object' && value !== null && fieldName !== 'messages') {
      const jsonString = JSON.stringify(value, null, 2)
      return truncateText(jsonString)
    }
    const stringified = JSON.stringify(value)
    return truncateText(stringified)
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

  const shouldUseCSStruncation = (value: any, fieldName: string): boolean => {
    // Use CSS truncation for strings that are likely to be long content
    if (typeof value === 'string') {
      // Use for LLM-friendly fields or long strings
      const fieldType = getFieldType(fieldName)
      return fieldType === 'llm_friendly' || value.length > 30
    }
    return false
  }

  const renderField = (fieldName: string, value: any, isLast: boolean = false) => {
    const isSelected = selectedFields.includes(fieldName)
    const fieldType = getFieldType(fieldName)
    const isMessages = fieldName === 'messages'

    return (
      <div key={fieldName} className="flex items-start gap-2">
        <div className="flex items-start gap-1">
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
          <span className="text-text-secondary leading-none mt-[5px]">:</span>
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
              <span className={`text-text-secondary font-mono text-xs leading-none mt-[5px] ${
                shouldUseCSStruncation(value, fieldName) ? getTruncationClasses('fieldValue') : ''
              }`}>
                {formatValue(value, fieldName)}{!isLast && ','}
              </span>
            )
          ) : (
            <span className="text-text-muted font-mono text-xs italic leading-none mt-[5px]">
              // field unselected{!isLast && ','}
            </span>
          )}
        </div>
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
          <p
            className="text-ds-small text-blue-700 cursor-pointer hover:text-blue-900 transition-colors duration-200"
            onClick={onMessagesToggle}
          >
            {isMessagesCollapsed
              ? 'Entire conversations will be tagged'
              : 'Each message will receive a tag - click here to tag entire conversations instead'
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