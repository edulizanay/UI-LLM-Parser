// ABOUTME: Preview panel component for Stage 2 categorization interface
// ABOUTME: Shows real-time categorization results and conversation examples with predicted tags

'use client'

import { Eye } from 'lucide-react'

interface PreviewExample {
  conversation_id: string
  conversation_title: string
  sample_content: string
  predicted_tags: string[]
}

interface Statistics {
  conversations: number
  categories: number
  avg_tags: number
  coverage: number
}

interface SelectedCategory {
  type: 'computer_friendly' | 'llm_friendly' | 'custom'
  id: string
  name: string
}

interface PreviewPanelProps {
  selectedCategories: SelectedCategory[]
  previewData: PreviewExample[]
  statistics: Statistics
}

export function PreviewPanel({
  selectedCategories,
  previewData,
  statistics
}: PreviewPanelProps) {
  const hasCategories = selectedCategories.length > 0
  const maxExamples = 2

  const truncateContent = (content: string, maxLength = 120) => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength) + '...'
  }

  const getTagColor = (tagName: string) => {
    const category = selectedCategories.find(cat => cat.name === tagName)
    if (!category) return 'bg-gray-100 text-gray-700'

    switch (category.type) {
      case 'computer_friendly':
        return 'bg-blue-100 text-blue-800'
      case 'llm_friendly':
        return 'bg-red-100 text-red-800'
      case 'custom':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const generateConfidenceScore = () => {
    // Mock confidence score between 75-95%
    return Math.floor(Math.random() * 21) + 75
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-5">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Preview Results</h3>
        <p className="text-sm text-gray-600">See how your categories will be applied</p>
      </div>

      {!hasCategories ? (
        // Empty State
        <div className="text-center py-12">
          <Eye data-testid="eye-icon" className="w-8 h-8 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Select categories to see preview</p>
        </div>
      ) : (
        <>
          {/* Conversation Examples */}
          <div className="space-y-4 mb-6">
            {previewData.slice(0, maxExamples).map((example, index) => (
              <div
                key={example.conversation_id}
                data-testid="conversation-card"
                role="article"
                className="bg-gray-50 border border-gray-200 rounded-md p-4"
              >
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  {example.conversation_title}
                </h4>

                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {truncateContent(example.sample_content)}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {example.predicted_tags.map((tag) => (
                    <span
                      key={tag}
                      role="button"
                      aria-label={`${tag} category tag`}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-gray-500">
                  {generateConfidenceScore()}% confidence
                </p>
              </div>
            ))}
          </div>

          {/* Statistics Summary */}
          <div className="pt-5 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {statistics.conversations}
                </div>
                <div className="text-xs text-gray-500">conversations</div>
              </div>

              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {statistics.categories}
                </div>
                <div className="text-xs text-gray-500">categories</div>
              </div>

              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {statistics.avg_tags}
                </div>
                <div className="text-xs text-gray-500">avg tags</div>
              </div>

              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {statistics.coverage}%
                </div>
                <div className="text-xs text-gray-500">coverage</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}