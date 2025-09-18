// ABOUTME: Stage 1 file upload and interactive JSON field selection - CORRECT IMPLEMENTATION
// ABOUTME: Single conversation display with clickable fields and messages collapse/merge

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { DropZone } from '@/components/upload/DropZone'
import { InteractiveJSON } from '@/components/upload/InteractiveJSON'
import { InlineContextPanel } from '@/components/upload/InlineContextPanel'
import { useStage1State } from '@/hooks/usePersistedState'

interface ConversationData {
  id: string
  title: string
  date: string
  source?: string
  message_count?: number
  duration_minutes?: number
  messages: Array<{
    role: string
    content: string
    timestamp: string
    original_id?: string
  }>
  metadata?: any
}

interface ProcessingStats {
  conversationCount: number
  interactionCount: number
  tokenCount: number
}

export default function Stage1Page() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const { state, setters, updateState } = useStage1State()
  const { conversationData, selectedFields, contextDescription, isMessagesCollapsed } = state
  const {
    conversationData: setConversationData,
    selectedFields: setSelectedFields,
    contextDescription: setContextDescription,
    isMessagesCollapsed: setIsMessagesCollapsed
  } = setters

  const [processingStats, setProcessingStats] = useState<ProcessingStats>({
    conversationCount: 0,
    interactionCount: 0,
    tokenCount: 0
  })
  const [error, setError] = useState<string | null>(null)

  // Ensure client-side rendering for localStorage-dependent content
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calculate statistics whenever selections change
  useEffect(() => {
    calculateStatistics()
  }, [selectedFields, isMessagesCollapsed, conversationData])

  const handleFileUpload = async (file: File) => {
    setError(null)

    try {
      const text = await file.text()
      if (!text.trim()) {
        setError('File appears to be empty')
        return
      }

      const parsed = JSON.parse(text)

      // Handle both flat array and nested conversations structure
      let conversations: any[]
      if (Array.isArray(parsed)) {
        conversations = parsed
      } else if (parsed.conversations && Array.isArray(parsed.conversations)) {
        conversations = parsed.conversations
      } else {
        setError('File must contain conversations data')
        return
      }

      if (conversations.length === 0) {
        setError('No conversations found in file')
        return
      }

      // Use first conversation for display
      const firstConversation: ConversationData = conversations[0]

      // Initialize with all fields selected
      const allFields = Object.keys(firstConversation)

      // Update state in a single call to avoid race conditions
      updateState({
        conversationData: firstConversation,
        selectedFields: allFields
      })

    } catch (e) {
      setError('Error processing file: Invalid JSON format')
    }
  }

  const calculateStatistics = () => {
    if (!conversationData || selectedFields.length === 0) {
      setProcessingStats({ conversationCount: 0, interactionCount: 0, tokenCount: 0 })
      return
    }

    const conversationCount = 1 // Single conversation display
    let interactionCount = 0
    let tokenCount = 0

    // Calculate interactions based on messages field state
    if (selectedFields.includes('messages') && conversationData.messages) {
      if (isMessagesCollapsed) {
        interactionCount = 1 // One interaction when collapsed (entire conversation)
      } else {
        interactionCount = conversationData.messages.length // Individual messages when expanded
      }

      // Estimate token count from message content
      conversationData.messages.forEach((message: { content: string }) => {
        if (selectedFields.includes('messages')) {
          tokenCount += Math.ceil(message.content.length / 4) // Rough token estimation
        }
      })
    }

    // Add tokens from other selected fields
    selectedFields.forEach(fieldName => {
      if (fieldName !== 'messages') {
        const value = conversationData[fieldName as keyof ConversationData]
        if (typeof value === 'string') {
          tokenCount += Math.ceil(value.length / 4)
        }
      }
    })

    setProcessingStats({ conversationCount, interactionCount, tokenCount })
  }

  const handleFieldToggle = (fieldName: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldName)
        ? prev.filter(f => f !== fieldName)
        : [...prev, fieldName]
    )
  }

  const handleMessagesToggle = () => {
    setIsMessagesCollapsed(prev => !prev)
  }

  const handleContextChange = (context: string) => {
    setContextDescription(context)
  }

  const handleContinue = () => {
    if (conversationData && selectedFields.length > 0) {
      router.push('/parse/categorize')
    }
  }

  const canContinue = conversationData && selectedFields.length > 0

  return (
    <div className="min-h-screen bg-surface-background" data-testid="stage1-page">
      {/* Navigation Bar */}
      <div className="p-ds-medium border-b border-border-default">
        <div className="max-w-7xl mx-auto flex items-center gap-ds-medium">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary
                     transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-ds-heading font-medium text-text-primary">
            Stage 1: Upload & Configure Data
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-ds-medium" data-testid="stage1-main">
        <div className="flex justify-center">
          {/* Centered Main Content */}
          <div className="w-full max-w-4xl">
            {!isClient ? (
              // Show DropZone on server and before hydration to avoid mismatch
              <DropZone onFileUpload={handleFileUpload} error={error} />
            ) : !conversationData ? (
              // Show DropZone after hydration if no data
              <DropZone onFileUpload={handleFileUpload} error={error} />
            ) : (
              // Show InteractiveJSON after hydration if data exists
              <InteractiveJSON
                conversation={conversationData}
                selectedFields={selectedFields}
                onFieldToggle={handleFieldToggle}
                isMessagesCollapsed={isMessagesCollapsed}
                onMessagesToggle={handleMessagesToggle}
              />
            )}
          </div>
        </div>

        {/* Bottom Section - Processing Statistics and Navigation */}
        <div className="mt-ds-large pt-ds-medium border-t border-border-default">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-ds-medium">

            {/* Processing Statistics - only show when file is uploaded and client is hydrated */}
            {isClient && conversationData && (
              <div
                className="grid grid-cols-3 gap-ds-medium text-center"
                data-testid="processing-stats"
              >
                <div>
                  <div className="text-ds-heading font-bold text-text-primary">
                    {processingStats.conversationCount}
                  </div>
                  <div className="text-ds-micro uppercase text-text-secondary tracking-wide">
                    Conversation
                  </div>
                </div>
                <div>
                  <div className="text-ds-heading font-bold text-text-primary">
                    {processingStats.interactionCount}
                  </div>
                  <div className="text-ds-micro uppercase text-text-secondary tracking-wide">
                    {isMessagesCollapsed ? 'Unit' : 'Messages'}
                  </div>
                </div>
                <div>
                  <div className="text-ds-heading font-bold text-text-primary">
                    {processingStats.tokenCount}
                  </div>
                  <div className="text-ds-micro uppercase text-text-secondary tracking-wide">
                    Tokens
                  </div>
                </div>
              </div>
            )}

            {/* Continue Button - only show after client hydration to avoid SSR mismatch */}
            {isClient && (
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                data-testid="continue-button"
                className={`px-ds-large py-ds-medium rounded-ds-sm font-medium transition-all duration-200 ${
                  canContinue
                    ? 'bg-primary-blue text-white hover:bg-primary-blue-hover focus:ring-2 focus:ring-primary-blue focus:ring-offset-2'
                    : 'bg-border-default text-text-muted cursor-not-allowed'
                }`}
              >
                Continue to Categorization
              </button>
            )}
          </div>
        </div>

        {/* Inline Context Panel - only show after client hydration */}
        {isClient && (
          <InlineContextPanel
            fileData={conversationData}
            onContextChange={handleContextChange}
            initialValue={contextDescription}
          />
        )}
      </main>
    </div>
  )
}