// ABOUTME: Clickable field name button with proper color coding and hover states
// ABOUTME: Handles computer-friendly (blue), LLM-friendly (warm), and messages (slate) styling

'use client'

import { getFieldClasses as getUtilFieldClasses } from '@/lib/fieldUtils'

interface ClickableFieldProps {
  fieldName: string
  fieldType: 'computer_friendly' | 'llm_friendly'
  isMessages: boolean
  isHovered: boolean
  isSelected: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function ClickableField({
  fieldName,
  fieldType,
  isMessages,
  isHovered,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave
}: ClickableFieldProps) {
  const getFieldClasses = () => {
    const baseClasses = 'px-2 py-1 rounded-ds-sm font-mono text-xs cursor-pointer transition-all duration-200 border'

    // Dimmed styling when unselected
    if (!isSelected) {
      return `${baseClasses} ${
        isHovered
          ? 'bg-text-muted/20 border-text-muted text-text-muted opacity-60'
          : 'border-text-muted/30 text-text-muted opacity-40'
      }`
    }

    if (isMessages) {
      // Special styling for messages field using design tokens
      return `${baseClasses} ${
        isHovered
          ? 'bg-surface-messages-hover border-border-default text-text-primary'
          : 'border-border-default text-text-primary'
      }`
    }

    // Use design token utilities for field categorization - no background unless hovered
    const utilClasses = getUtilFieldClasses(fieldType, isSelected, !isSelected, isHovered)
    return `${baseClasses} ${utilClasses} ${
      isHovered ? '' : 'border-transparent'
    }`
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={getFieldClasses()}
      title={isMessages ? (isHovered ? 'Click to collapse/expand messages' : '') : `Click to toggle ${fieldName} field`}
    >
      "{fieldName}"
    </button>
  )
}