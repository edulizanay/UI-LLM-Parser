// ABOUTME: Stage 2 categorization page implementing three-column layout design
// ABOUTME: Category selection, prompt configuration, and real-time preview with Stage 1 integration

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { CategoryBuilder } from '@/components/categorization/CategoryBuilder'
import { PromptEditor } from '@/components/categorization/PromptEditor'
import { useStage2State } from '@/hooks/usePersistedState'

interface SelectedCategory {
  type: 'computer_friendly' | 'llm_friendly' | 'custom'
  id: string
  name: string
  field_name?: string
  categories?: any[]
  editable_prompt?: string
}

interface Stage1Data {
  selectedFields: string[]
  fieldCategorization: {
    computerFriendly: string[]
    llmFriendly: string[]
    messagesField?: string
  }
  contextDescription: string
  processingStats: {
    conversationCount: number
    interactionCount: number
    tokenCount: number
  }
}

// Main categorization page component
export default function Stage2Page() {
  const router = useRouter()
  const [stage1Data, setStage1Data] = useState<Stage1Data | null>(null)
  const { state, setters, updateState } = useStage2State()
  const { selectedCategories, activeCategoryId } = state
  const { selectedCategories: setSelectedCategories, activeCategoryId: setActiveCategoryId } = setters
  const [error, setError] = useState<string | null>(null)

  // Mock data from claude_stage2.json
  const computerCategories = [
    {
      field_name: 'date',
      distinct_count: 3,
      categories: [
        {
          value: '2024-11-04',
          conversation_count: 1,
          sample_titles: ['Inquiring About Pricing Difference and Discount']
        },
        {
          value: '2024-09-24',
          conversation_count: 1,
          sample_titles: ['Learning Python Data Structures']
        },
        {
          value: '2024-10-15',
          conversation_count: 1,
          sample_titles: ['Design System Color Theory']
        }
      ]
    }
  ]

  const llmCategories = [
    {
      category_name: 'business',
      editable_prompt: 'Choose this option when conversations are around work, professional matters, or business decisions'
    },
    {
      category_name: 'personal_growth',
      editable_prompt: 'Choose this option when conversations involve learning new skills, self-improvement, or educational content'
    },
    {
      category_name: 'design',
      editable_prompt: 'Choose this option when conversations are about visual design, user experience, or creative work'
    },
    {
      category_name: 'coding',
      editable_prompt: 'Choose this option when conversations involve programming, software development, or technical implementation'
    }
  ]


  // Load Stage 1 data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('parsing-stage-1-state')
      if (!savedData) {
        router.push('/parse?error=complete-stage-1-first')
        return
      }

      const parsedData = JSON.parse(savedData)
      setStage1Data(parsedData)
    } catch (error) {
      console.error('Error loading Stage 1 data:', error)
      setError('Error loading previous stage data')
    }
  }, [router])

  const handleCategorySelect = (category: SelectedCategory) => {
    const isAlreadySelected = selectedCategories.some(
      cat => cat.type === category.type && cat.id === category.id
    )

    if (!isAlreadySelected) {
      const newCategories = [...selectedCategories, category]
      // Use updateState to set both fields atomically
      updateState({
        selectedCategories: newCategories,
        activeCategoryId: category.id
      })
    }
  }

  const handleCategoryRemove = (categoryToRemove: SelectedCategory) => {
    const newCategories = selectedCategories.filter(
      cat => !(cat.type === categoryToRemove.type && cat.id === categoryToRemove.id)
    )

    const newActiveCategoryId = activeCategoryId === categoryToRemove.id
      ? (newCategories.length > 0 ? newCategories[0].id : null)
      : activeCategoryId

    // Use updateState to set both fields atomically
    updateState({
      selectedCategories: newCategories,
      activeCategoryId: newActiveCategoryId
    })
  }

  const handleCustomCategoryAdd = (categoryName: string) => {
    const customCategory: SelectedCategory = {
      type: 'custom',
      id: categoryName,
      name: categoryName,
      editable_prompt: 'Choose this option when conversations match this category'
    }
    const newCategories = [...selectedCategories, customCategory]

    // Use updateState to set both fields atomically
    updateState({
      selectedCategories: newCategories,
      activeCategoryId: customCategory.id
    })
  }

  const handlePromptEdit = (categoryId: string, prompt: string) => {
    setSelectedCategories(categories =>
      categories.map(cat =>
        cat.id === categoryId ? { ...cat, editable_prompt: prompt } : cat
      )
    )
  }

  const handleContinue = () => {
    // Save final state and navigate to completion
    localStorage.setItem('parsing-stage-2-complete', JSON.stringify({
      selectedCategories,
      completedAt: new Date().toISOString()
    }))
    router.push('/?completed=categorization-success')
  }

  const handleSkip = () => {
    router.push('/?completed=categorization-skipped')
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">Please complete file selection first</p>
          <button
            onClick={() => router.push('/parse')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go back to Stage 1
          </button>
        </div>
      </div>
    )
  }

  if (!stage1Data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main role="main" className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <nav role="navigation" className="mb-8">
          <button
            onClick={() => router.push('/parse')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
          >
            <ArrowLeft data-testid="arrow-left-icon" className="w-5 h-5" />
            Back
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">What categories are relevant to you?</h1>
          </div>
        </nav>

        {/* Top Section - Category Selection */}
        <div className="mb-8">
          <CategoryBuilder
            computerCategories={computerCategories}
            llmCategories={llmCategories}
            selectedCategories={selectedCategories}
            onCategorySelect={handleCategorySelect}
            onCategoryRemove={handleCategoryRemove}
            onCustomCategoryAdd={handleCustomCategoryAdd}
          />
        </div>

        {/* Main Section - Category Configuration */}
        <div className="mb-12">
          <PromptEditor
            selectedCategories={selectedCategories}
            activeCategoryId={activeCategoryId}
            onCategorySelect={setActiveCategoryId}
            onPromptEdit={handlePromptEdit}
            onCategoryRemove={handleCategoryRemove}
          />
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSkip}
                className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors duration-200"
              >
                Skip
              </button>
              <p className="text-xs text-gray-500 italic">
                Each new category will create an .md file
              </p>
            </div>

            <button
              onClick={handleContinue}
              disabled={selectedCategories.length === 0}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                selectedCategories.length === 0
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

// Export named component for testing
export { Stage2Page }