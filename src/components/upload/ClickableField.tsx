// ABOUTME: Clickable field name button with proper color coding and hover states
// ABOUTME: Handles computer-friendly (blue), LLM-friendly (warm), and messages (slate) styling

'use client'

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
          ? 'bg-gray-200 border-gray-300 text-gray-600 opacity-60'
          : 'bg-gray-100 border-gray-200 text-gray-500 opacity-40'
      }`
    }

    if (isMessages) {
      // Special slate styling for messages field
      return `${baseClasses} ${
        isHovered
          ? 'bg-slate-200 border-slate-300 text-slate-800'
          : 'bg-slate-100 border-slate-200 text-slate-700'
      }`
    }

    if (fieldType === 'computer_friendly') {
      // Blue styling for computer-friendly fields
      return `${baseClasses} ${
        isHovered
          ? 'bg-blue-200 border-blue-300 text-blue-900'
          : 'bg-blue-100 border-blue-200 text-blue-800'
      }`
    } else {
      // Warm red styling for LLM-friendly fields
      return `${baseClasses} ${
        isHovered
          ? 'bg-red-200 border-red-300 text-red-900'
          : 'bg-red-100 border-red-200 text-red-800'
      }`
    }
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