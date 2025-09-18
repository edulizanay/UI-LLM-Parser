// ABOUTME: JSON structure preview component with field filtering and categorization colors
// ABOUTME: Implements syntax highlighting, collapse states, and dynamic field filtering

'use client'

import { useMemo } from 'react'

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

interface FilePreviewProps {
  fileData: FileData
  selectedFields: string[]
  isMessagesCollapsed?: boolean
}

export function FilePreview({ fileData, selectedFields, isMessagesCollapsed = false }: FilePreviewProps) {
  const filteredExamples = useMemo(() => {
    if (!fileData.content || fileData.content.length === 0) {
      return []
    }

    // Take first 2 examples and filter by selected fields
    const examples = fileData.content.slice(0, 2)

    return examples.map(item => {
      const filtered: any = {}

      selectedFields.forEach(fieldName => {
        if (item.hasOwnProperty(fieldName)) {
          let value = item[fieldName]

          // Handle messages field collapse
          if (fieldName === 'messages' && Array.isArray(value) && isMessagesCollapsed) {
            value = value.map(msg => {
              if (msg.role && msg.content) {
                return `"${msg.role}": "${msg.content}"`
              }
              return msg
            })
          }

          filtered[fieldName] = value
        }
      })

      return filtered
    })
  }, [fileData.content, selectedFields, isMessagesCollapsed])

  const getFieldTypeClass = (fieldName: string) => {
    const field = fileData.detectedStructure.find(f => f.name === fieldName)
    if (!field) return 'text-text-secondary'

    if (field.type === 'computer_friendly') {
      return 'text-field-computer-friendly'
    } else {
      return 'text-field-llm-friendly'
    }
  }

  const formatJsonValue = (value: any, fieldName: string): string => {
    try {
      if (typeof value === 'string') {
        return `"${value}"`
      } else if (Array.isArray(value)) {
        // Special handling for collapsed messages
        if (fieldName === 'messages' && isMessagesCollapsed) {
          return `[\n    ${value.join(',\n    ')}\n  ]`
        }
        return JSON.stringify(value, null, 2).replace(/^/gm, '  ')
      } else if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value, null, 2).replace(/^/gm, '  ')
      } else {
        return JSON.stringify(value)
      }
    } catch (e) {
      return '"[Invalid JSON]"'
    }
  }

  const formatExample = (example: any, index: number): string => {
    try {
      if (Object.keys(example).length === 0) {
        return '{}'
      }

      const entries = Object.entries(example).map(([key, value]) => {
        const formattedValue = formatJsonValue(value, key)
        return `  "${key}": ${formattedValue}`
      })

      return `{\n${entries.join(',\n')}\n}`
    } catch (e) {
      return '{ "error": "Error displaying preview" }'
    }
  }

  if (!fileData.content || fileData.content.length === 0) {
    return (
      <div className="bg-surface-white rounded-ds-lg p-ds-medium">
        <h2 className="text-ds-subheading font-medium mb-ds-medium">Data Preview</h2>
        <div className="text-center py-ds-large">
          <p className="text-text-secondary">No data available for preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-white rounded-ds-lg p-ds-medium">
      <h2 className="text-ds-subheading font-medium mb-ds-medium">
        Data Preview
      </h2>

      <div className="space-y-ds-medium">
        {filteredExamples.map((example, index) => (
          <div key={index}>
            <h3 className="text-ds-small font-medium text-text-secondary mb-ds-small">
              Example {index + 1} of 2
            </h3>

            <div
              data-testid={`json-preview-${index + 1}`}
              className="bg-gray-50 rounded-ds-sm p-ds-small font-mono text-ds-code overflow-x-auto"
            >
              <pre className="whitespace-pre-wrap">
                <code>
                  {formatExample(example, index).split('\n').map((line, lineIndex) => {
                    // Extract field name from lines that contain field definitions
                    const fieldMatch = line.match(/^\s*"([^"]+)":\s/)
                    if (fieldMatch) {
                      const fieldName = fieldMatch[1]
                      const fieldClass = getFieldTypeClass(fieldName)
                      const beforeColon = line.substring(0, line.indexOf(':'))
                      const afterColon = line.substring(line.indexOf(':'))

                      return (
                        <div key={lineIndex}>
                          <span data-testid={`field-name-${fieldName}`} className={fieldClass}>
                            {beforeColon}
                          </span>
                          <span className="text-text-secondary">:</span>
                          <span
                            data-testid={`field-value-${example[fieldName]}`}
                            className="text-text-secondary"
                          >
                            {afterColon.substring(1)}
                          </span>
                        </div>
                      )
                    }

                    return (
                      <div key={lineIndex} className="text-text-secondary">
                        {line}
                      </div>
                    )
                  })}
                </code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Collapse/Expand Status Indicator */}
      {selectedFields.includes('messages') && (
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