// ABOUTME: Horizontal category selection bar for Stage 2 categorization interface
// ABOUTME: Simplified pill-based selection with computer-friendly, LLM, and custom categories

'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'

interface ComputerCategory {
  field_name: string
  distinct_count: number
  categories: Array<{
    value: string
    conversation_count: number
    sample_titles: string[]
  }>
}

interface LLMCategory {
  category_name: string
  editable_prompt: string
}

interface SelectedCategory {
  type: 'computer_friendly' | 'llm_friendly' | 'custom'
  id: string
  name: string
  field_name?: string
  categories?: any[]
  editable_prompt?: string
}

interface CategoryBuilderProps {
  computerCategories: ComputerCategory[]
  llmCategories: LLMCategory[]
  selectedCategories: SelectedCategory[]
  onCategorySelect: (category: SelectedCategory) => void
  onCategoryRemove: (category: SelectedCategory) => void
  onCustomCategoryAdd: (categoryName: string) => void
}

export function CategoryBuilder({
  computerCategories,
  llmCategories,
  selectedCategories,
  onCategorySelect,
  onCategoryRemove,
  onCustomCategoryAdd
}: CategoryBuilderProps) {
  const [customInput, setCustomInput] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const isSelected = (type: string, id: string) => {
    return selectedCategories.some(cat => cat.type === type && cat.id === id)
  }

  const handleCustomSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customInput.trim()) {
      onCustomCategoryAdd(customInput.trim())
      setCustomInput('')
      setShowCustomInput(false)
    }
    if (e.key === 'Escape') {
      setCustomInput('')
      setShowCustomInput(false)
    }
  }

  const getCategoryPillColor = (type: string, isSelected: boolean = false) => {
    if (isSelected) {
      switch (type) {
        case 'computer_friendly':
          return 'bg-field-computer-friendly/20 text-field-computer-friendly border-field-computer-friendly/30'
        case 'llm_friendly':
          return 'bg-field-llm-friendly/20 text-field-llm-friendly border-field-llm-friendly/30'
        case 'custom':
          return 'bg-text-muted/20 text-text-primary border-text-muted/30'
        default:
          return 'bg-text-muted/20 text-text-primary border-text-muted/30'
      }
    } else {
      switch (type) {
        case 'computer_friendly':
          return 'bg-surface-white text-field-computer-friendly border-field-computer-friendly/20 hover:bg-field-computer-friendly/5'
        case 'llm_friendly':
          return 'bg-surface-white text-field-llm-friendly border-field-llm-friendly/20 hover:bg-field-llm-friendly/5'
        default:
          return 'bg-surface-white text-text-secondary border-border-default hover:bg-surface-background'
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Horizontal Category Selection */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Computer-friendly categories */}
        {computerCategories.map((category) => {
          const categoryId = category.field_name
          const categoryName = `${category.field_name.charAt(0).toUpperCase() + category.field_name.slice(1)}-based`
          const selected = isSelected('computer_friendly', categoryId)

          return (
            <button
              key={categoryId}
              onClick={() => {
                if (selected) {
                  onCategoryRemove({
                    type: 'computer_friendly',
                    id: categoryId,
                    name: categoryName
                  })
                } else {
                  onCategorySelect({
                    type: 'computer_friendly',
                    id: categoryId,
                    name: categoryName,
                    field_name: category.field_name,
                    categories: category.categories
                  })
                }
              }}
              className={`px-4 py-2 rounded-full border font-medium text-sm transition-all duration-200 ${getCategoryPillColor('computer_friendly', selected)}`}
              aria-label={selected ? `Remove ${categoryName} category` : `Add ${categoryName} category`}
            >
              {categoryName}
            </button>
          )
        })}

        {/* LLM categories */}
        {llmCategories.map((category) => {
          const selected = isSelected('llm_friendly', category.category_name)

          return (
            <button
              key={category.category_name}
              onClick={() => {
                if (selected) {
                  onCategoryRemove({
                    type: 'llm_friendly',
                    id: category.category_name,
                    name: category.category_name
                  })
                } else {
                  onCategorySelect({
                    type: 'llm_friendly',
                    id: category.category_name,
                    name: category.category_name,
                    editable_prompt: category.editable_prompt
                  })
                }
              }}
              className={`px-4 py-2 rounded-full border font-medium text-sm transition-all duration-200 ${getCategoryPillColor('llm_friendly', selected)}`}
              aria-label={selected ? `Remove ${category.category_name} category` : `Add ${category.category_name} category`}
            >
              {category.category_name}
            </button>
          )
        })}

        {/* Custom category input */}
        {showCustomInput ? (
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleCustomSubmit}
            onBlur={() => {
              if (!customInput.trim()) {
                setShowCustomInput(false)
              }
            }}
            placeholder="work_projects"
            className="px-3 py-2 border border-border-default rounded-full text-sm focus:border-border-focus focus:ring-2 focus:ring-border-focus/20 focus:outline-none min-w-32"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            className="px-4 py-2 rounded-full border border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 font-medium text-sm transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Custom
          </button>
        )}
      </div>

      {/* Selected Categories - only show if any are selected */}
      {selectedCategories.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <div
                key={`${category.type}-${category.id}`}
                data-category-id={category.id}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getCategoryPillColor(category.type, true)}`}
              >
                <span>{category.name}</span>
                <button
                  onClick={() => onCategoryRemove(category)}
                  className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors duration-150"
                  aria-label={`Remove ${category.name} category`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}