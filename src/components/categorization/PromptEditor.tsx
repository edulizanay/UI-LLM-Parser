// ABOUTME: Clean two-column prompt configuration interface
// ABOUTME: Category list on left (bold), editable prompts on right (dimmed text)

'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

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
  const [editingStates, setEditingStates] = useState<Record<string, string>>({})
  const [selectedModel, setSelectedModel] = useState('llama-3.1-8b')

  const handlePromptChange = (categoryId: string, value: string) => {
    setEditingStates(prev => ({
      ...prev,
      [categoryId]: value
    }))
  }

  const handlePromptSave = (categoryId: string) => {
    const newPrompt = editingStates[categoryId]
    if (newPrompt !== undefined) {
      onPromptEdit(categoryId, newPrompt)
      setEditingStates(prev => {
        const updated = { ...prev }
        delete updated[categoryId]
        return updated
      })
    }
  }

  const handleKeyPress = (categoryId: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handlePromptSave(categoryId)
    }
  }

  const getPromptValue = (category: SelectedCategory) => {
    if (editingStates[category.id] !== undefined) {
      return editingStates[category.id]
    }
    return category.editable_prompt || ''
  }

  const getDefaultPrompt = (category: SelectedCategory) => {
    if (category.type === 'computer_friendly') {
      return `Categories will be created based on: ${category.field_name}. No prompt needed.`
    }

    // Default prompts for different categories
    const defaultPrompts: Record<string, string> = {
      'business': 'Choose this option when conversations are around work, professional matters, or business decisions',
      'personal_growth': 'Choose this option when conversations involve learning new skills, self-improvement, or educational content',
      'design': 'Choose this option when conversations are about visual design, user experience, or creative work',
      'coding': 'Choose this option when conversations involve programming, software development, or technical implementation',
    }

    return defaultPrompts[category.id] || 'Choose this option when conversations match this category'
  }

  const modelOptions = [
    {
      id: 'llama-3.1-8b',
      name: 'Llama 3.1 8B',
      cost: '$0.12',
      time: '~2 minutes'
    },
    {
      id: 'llama-3.1-70b',
      name: 'Llama 3.1 70B',
      cost: '$0.85',
      time: '~5 minutes'
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      cost: '$0.28',
      time: '~1 minute'
    }
  ]

  const getModelEstimates = (modelId: string) => {
    const model = modelOptions.find(m => m.id === modelId)
    return model ? { cost: model.cost, time: model.time } : { cost: '$0.00', time: '~0 minutes' }
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
      <div className="space-y-3">
        {/* Show all selected categories with their prompts */}
        {selectedCategories.map((category) => {
          const isEditing = editingStates[category.id] !== undefined
          const promptValue = isEditing ? editingStates[category.id] : (category.editable_prompt || getDefaultPrompt(category))

          return (
            <div key={category.id} className="flex gap-4 items-center">
              {/* Left Column - Category Name (28% width - reduced by 30% from 40%) */}
              <div className="w-[28%]">
                <button
                  onClick={() => onCategorySelect(category.id)}
                  aria-label={`${category.name} category`}
                  className={`w-full px-3 py-2 text-left rounded-md transition-all duration-200 ${
                    activeCategoryId === category.id
                      ? 'bg-blue-50 text-blue-900 font-semibold'
                      : 'text-gray-900 font-semibold hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              </div>

              {/* Right Column - Editable Prompt (72% width) */}
              <div className="flex-1">
                {category.type === 'computer_friendly' ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                    <p className="text-sm text-gray-600">
                      {getDefaultPrompt(category)}
                    </p>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={promptValue}
                    onChange={(e) => handlePromptChange(category.id, e.target.value)}
                    onFocus={() => {
                      if (editingStates[category.id] === undefined) {
                        setEditingStates(prev => ({
                          ...prev,
                          [category.id]: promptValue
                        }))
                      }
                    }}
                    onKeyPress={(e) => handleKeyPress(category.id, e)}
                    onBlur={() => handlePromptSave(category.id)}
                    placeholder={category.type === 'custom' ? 'Choose this option when conversations match this category' : ''}
                    aria-label={`Edit prompt for ${category.name} category`}
                    className={`w-full px-3 py-2 border border-gray-200 rounded-md text-sm transition-all duration-200 ${
                      isEditing
                        ? 'text-gray-900 bg-white border-blue-300 ring-2 ring-blue-200'
                        : 'text-gray-600 bg-gray-50 hover:bg-white cursor-text'
                    }`}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Model Selection Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-6">
          {/* Model Dropdown */}
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              {modelOptions.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Cost and Time Estimates */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              Cost: <span className="font-semibold text-gray-900">{getModelEstimates(selectedModel).cost}</span>
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
              Time: <span className="font-semibold text-gray-900">{getModelEstimates(selectedModel).time}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}