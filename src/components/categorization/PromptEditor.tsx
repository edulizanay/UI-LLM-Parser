// ABOUTME: Clean two-column prompt configuration interface
// ABOUTME: Category list on left (bold), editable prompts on right (dimmed text)

'use client'

import { useState } from 'react'

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
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-12 text-gray-500">
          <p>Select categories above to configure their prompts</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex gap-8">
        {/* Left Column - Category Names (Bold) */}
        <div className="w-2/5">
          <div className="space-y-1">
            {selectedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                aria-label={`Select ${category.name} category for editing`}
                className={`w-full p-3 text-left rounded-md transition-all duration-200 ${
                  activeCategoryId === category.id
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'text-gray-900 font-semibold hover:bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Editable Prompts (Dimmed) */}
        <div className="w-3/5">
          {activeCategory ? (
            <div>
              {activeCategory.type === 'computer_friendly' ? (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <p className="text-sm text-gray-600">
                    Categories will be created based on: {activeCategory.field_name}. No prompt needed.
                  </p>
                </div>
              ) : (
                <textarea
                  value={isEditing ? editingPrompt : (activeCategory.editable_prompt || '')}
                  onChange={(e) => setEditingPrompt(e.target.value)}
                  onClick={handlePromptClick}
                  onKeyPress={handleKeyPress}
                  onBlur={handleBlur}
                  placeholder={getPromptPlaceholder(activeCategory.type)}
                  aria-label={`Edit prompt for ${activeCategory.name} category`}
                  className={`w-full p-3 border border-gray-200 rounded-md resize-vertical min-h-[100px] text-sm leading-relaxed transition-all duration-200 ${
                    isEditing
                      ? 'opacity-100 text-gray-900 bg-white border-blue-300 ring-2 ring-blue-200'
                      : 'opacity-60 text-gray-600 bg-gray-50 hover:opacity-80 hover:bg-white cursor-text'
                  }`}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>Click a category name to edit its prompt</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}