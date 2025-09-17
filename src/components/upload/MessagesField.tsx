// ABOUTME: Messages field with collapse/expand and merge functionality
// ABOUTME: Transforms between individual message objects and simplified merged strings

'use client'

interface Message {
  role: string
  content: string
  timestamp: string
  original_id?: string
}

interface MessagesFieldProps {
  messages: Message[]
  isCollapsed: boolean
  onToggle: () => void
  isHovered: boolean
}

export function MessagesField({
  messages,
  isCollapsed,
  onToggle,
  isHovered
}: MessagesFieldProps) {
  const truncateContent = (content: string, maxLength: number = 60): string => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const renderCollapsedMessages = () => {
    // Merge messages into simplified format
    const mergedMessages = messages.slice(0, 2).map(msg =>
      `"${msg.role}": "${truncateContent(msg.content)}"`
    )

    return (
      <div className="text-text-secondary font-mono text-xs">
        <span>[</span>
        <div className="ml-4">
          {mergedMessages.map((merged, index) => (
            <div key={index}>
              <span>{merged}</span>
              {index < mergedMessages.length - 1 && <span>,</span>}
            </div>
          ))}
          {messages.length > 2 && (
            <div className="text-text-muted italic">
              ...and {messages.length - 2} more messages
            </div>
          )}
        </div>
        <span>]</span>
      </div>
    )
  }

  const renderExpandedMessages = () => {
    // Show first 2 full message objects
    const displayMessages = messages.slice(0, 2)

    return (
      <div className="text-text-secondary font-mono text-xs">
        <span>[</span>
        <div className="ml-4">
          {displayMessages.map((message, index) => (
            <div key={index} className="my-2">
              <span>{'{'}</span>
              <div className="ml-4">
                <div>
                  <span className="text-field-llm-friendly">"role"</span>
                  <span>: </span>
                  <span>"{message.role}"</span>
                  <span>,</span>
                </div>
                <div>
                  <span className="text-field-llm-friendly">"content"</span>
                  <span>: </span>
                  <span>"{truncateContent(message.content, 80)}"</span>
                  <span>,</span>
                </div>
                <div>
                  <span className="text-field-computer-friendly">"timestamp"</span>
                  <span>: </span>
                  <span>"{message.timestamp}"</span>
                </div>
                {message.original_id && (
                  <div>
                    <span>,</span>
                    <br />
                    <span className="text-field-computer-friendly">"original_id"</span>
                    <span>: </span>
                    <span>"{message.original_id}"</span>
                  </div>
                )}
              </div>
              <span>{'}'}</span>
              {index < displayMessages.length - 1 && <span>,</span>}
            </div>
          ))}
          {messages.length > 2 && (
            <div className="text-text-muted italic my-2">
              ...and {messages.length - 2} more message objects
            </div>
          )}
        </div>
        <span>]</span>
      </div>
    )
  }

  const getContainerClasses = () => {
    const baseClasses = 'p-2 rounded-ds-sm cursor-pointer transition-all duration-200'

    if (isHovered) {
      return `${baseClasses} bg-slate-200`
    }

    return `${baseClasses} bg-slate-100`
  }

  return (
    <div
      className={getContainerClasses()}
      onClick={onToggle}
      title={isCollapsed ? 'Click to expand messages' : 'Click to collapse messages'}
    >
      {isCollapsed ? renderCollapsedMessages() : renderExpandedMessages()}
    </div>
  )
}