// ABOUTME: Prompt editor component for Stage 2 categorization interface
// ABOUTME: Two-column layout for category selection and prompt editing with hover interactions

'use client'

import { useState } from 'react'
import { Settings } from 'lucide-react'

interface SelectedCategory {
  type: 'computer_friendly' | 'llm_friendly' | 'custom'
  id: string
  name: string
  field_name?: string
  editable_prompt?: string
}

interface PromptEditorProps {
  selectedCategories: SelectedCategory[]
  activeCategoryId: string | null
  onCategorySelect: (categoryId: string) => void
  onPromptEdit: (categoryId: string, prompt: string) => void
}

export function PromptEditor({
  selectedCategories,
  activeCategoryId,
  onCategorySelect,
  onPromptEdit
}: PromptEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState('')

  const activeCategory = selectedCategories.find(cat => cat.id === activeCategoryId)

  const getCategoryTypeLabel = (type: string) => {
    switch (type) {
      case 'computer_friendly':
        return 'Computer-friendly'
      case 'llm_friendly':
        return 'LLM category'
      case 'custom':
        return 'Custom'
      default:
        return 'Category'
    }
  }

  const handlePromptClick = () => {
    if (activeCategory && activeCategory.type !== 'computer_friendly') {
      setIsEditing(true)
      setEditingPrompt(activeCategory.editable_prompt || '')
    }
  }

  const handlePromptSave = () => {
    if (activeCategory && activeCategoryId) {
      onPromptEdit(activeCategoryId, editingPrompt)
      setIsEditing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handlePromptSave()
    }
  }

  const handleBlur = () => {
    handlePromptSave()
  }

  const getPromptPlaceholder = (type: string) => {
    switch (type) {
      case 'llm_friendly':
        return 'choose this option if the conversation involves...'
      case 'custom':
        return 'describe when conversations should receive this tag...'
      default:
        return ''
    }
  }

  if (selectedCategories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-5">
        <div className="text-center py-12">
          <Settings data-testid="settings-icon" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base font-medium text-gray-500 mb-2">Select categories to configure</h3>
          <p className="text-sm text-gray-400">Choose categories from the left to customize their prompts</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-5">
      <div className="flex gap-6">
        {/* Left Column - Categories List */}
        <div className="w-2/5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-3">
            {selectedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                aria-label={`Select ${category.name} category for editing`}
                className={`w-full p-3 text-left rounded-md border transition-all duration-200 ${
                  activeCategoryId === category.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-transparent border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-900">{category.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {getCategoryTypeLabel(category.type)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Prompt Configuration */}
        <div className="w-3/5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Prompt Configuration</h3>

          {activeCategory ? (
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-900 mb-2">
                  {activeCategory.name}
                </h4>
                <p className="text-sm text-gray-600">
                  This prompt guides the AI's categorization decisions
                </p>
              </div>

              {activeCategory.type === 'computer_friendly' ? (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <p className="text-sm text-gray-600">
                    Categories will be created based on: {activeCategory.field_name}. No prompt needed.
                  </p>
                </div>
              ) : (
                <div>
                  <textarea
                    value={isEditing ? editingPrompt : (activeCategory.editable_prompt || '')}
                    onChange={(e) => setEditingPrompt(e.target.value)}
                    onClick={handlePromptClick}
                    onKeyPress={handleKeyPress}
                    onBlur={handleBlur}
                    placeholder={getPromptPlaceholder(activeCategory.type)}
                    aria-label={`Edit prompt for ${activeCategory.name} category`}
                    className={`w-full p-3 border border-gray-200 rounded-md resize-vertical min-h-[80px] text-sm leading-relaxed transition-all duration-200 ${
                      isEditing
                        ? 'opacity-100 text-gray-900 bg-white border-blue-300 ring-2 ring-blue-200'
                        : 'opacity-60 text-gray-600 bg-gray-50 hover:opacity-80 hover:bg-white cursor-text'
                    }`}
                    style={{ minHeight: '80px' }}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Be specific about what triggers this category
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">Select a category to configure its prompt</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}