// ABOUTME: Category selection component for Stage 2 categorization interface
// ABOUTME: Handles computer-friendly, LLM, and custom category proposals with selection UI

'use client'

import { useState } from 'react'
import { Database, Brain, X } from 'lucide-react'

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

  const isSelected = (type: string, id: string) => {
    return selectedCategories.some(cat => cat.type === type && cat.id === id)
  }

  const handleCustomSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customInput.trim()) {
      onCustomCategoryAdd(customInput.trim())
      setCustomInput('')
    }
  }

  const getCategoryPillColor = (type: string) => {
    switch (type) {
      case 'computer_friendly':
        return 'bg-blue-100 text-blue-800'
      case 'llm_friendly':
        return 'bg-red-100 text-red-800'
      case 'custom':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-5">
      {/* Computer-Friendly Categories Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Database data-testid="database-icon" className="w-4 h-4 text-blue-700" />
          <h3 className="text-base font-semibold text-blue-700">From Your Data</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Categories based on your file structure</p>

        <div className="space-y-2">
          {computerCategories.map((category) => {
            const categoryId = category.field_name
            const categoryName = `${category.field_name.charAt(0).toUpperCase() + category.field_name.slice(1)}-based`
            const selected = isSelected('computer_friendly', categoryId)

            return (
              <button
                key={categoryId}
                onClick={() => onCategorySelect({
                  type: 'computer_friendly',
                  id: categoryId,
                  name: categoryName,
                  field_name: category.field_name,
                  categories: category.categories
                })}
                className={`w-full p-3 text-left border rounded-md transition-all duration-200 ${
                  selected
                    ? 'bg-blue-100 border-blue-400 text-blue-800'
                    : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300'
                }`}
                aria-label={`Add ${categoryName} category`}
              >
                <div className="font-medium">{categoryName}</div>
                <div className="text-sm opacity-75">{category.distinct_count} time periods</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* LLM Categories Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Brain data-testid="brain-icon" className="w-4 h-4 text-red-700" />
          <h3 className="text-base font-semibold text-red-700">Content Categories</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">AI will analyze conversation content</p>

        <div className="space-y-2">
          {llmCategories.map((category) => {
            const selected = isSelected('llm_friendly', category.category_name)

            return (
              <button
                key={category.category_name}
                onClick={() => onCategorySelect({
                  type: 'llm_friendly',
                  id: category.category_name,
                  name: category.category_name,
                  editable_prompt: category.editable_prompt
                })}
                className={`w-full p-3 text-left border rounded-md transition-all duration-200 ${
                  selected
                    ? 'bg-red-100 border-red-400 text-red-800'
                    : 'bg-white border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300'
                }`}
                aria-label={`Add ${category.category_name} category`}
              >
                <div className="font-medium">{category.category_name}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom Category Section */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-700 mb-3">Custom Categories</h3>
        <div>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyPress={handleCustomSubmit}
            placeholder="e.g., work_projects, family_discussions"
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-2">Press Enter to add category</p>
        </div>
      </div>

      {/* Selected Categories Summary */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Selected Categories</h4>
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <div
              key={`${category.type}-${category.id}`}
              data-category-id={category.id}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getCategoryPillColor(category.type)}`}
            >
              <span>{category.name}</span>
              <button
                onClick={() => onCategoryRemove(category)}
                className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                aria-label={`Remove ${category.name} category`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {selectedCategories.length === 0 && (
            <p className="text-sm text-gray-500 italic">No categories selected yet</p>
          )}
        </div>
      </div>
    </div>
  )
}