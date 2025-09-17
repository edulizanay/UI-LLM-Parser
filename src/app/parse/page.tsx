// ABOUTME: Stage 1 file upload and interactive JSON field selection - CORRECT IMPLEMENTATION
// ABOUTME: Single conversation display with clickable fields and messages collapse/merge

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { DropZone } from '@/components/upload/DropZone'
import { InteractiveJSON } from '@/components/upload/InteractiveJSON'
import { ContextPanel } from '@/components/upload/ContextPanel'

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
  const [conversationData, setConversationData] = useState<ConversationData | null>(null)
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [contextDescription, setContextDescription] = useState('')
  const [isMessagesCollapsed, setIsMessagesCollapsed] = useState(false)
  const [processingStats, setProcessingStats] = useState<ProcessingStats>({
    conversationCount: 0,
    interactionCount: 0,
    tokenCount: 0
  })
  const [error, setError] = useState<string | null>(null)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('parsing-stage-1-state')
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        if (state.conversationData) setConversationData(state.conversationData)
        if (state.selectedFields) setSelectedFields(state.selectedFields)
        if (state.contextDescription) setContextDescription(state.contextDescription)
        if (state.isMessagesCollapsed) setIsMessagesCollapsed(state.isMessagesCollapsed)
      } catch (e) {
        console.warn('Failed to restore Stage 1 state:', e)
      }
    }
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    if (conversationData) {
      const state = {
        conversationData,
        selectedFields,
        contextDescription,
        isMessagesCollapsed
      }
      localStorage.setItem('parsing-stage-1-state', JSON.stringify(state))
    }
  }, [conversationData, selectedFields, contextDescription, isMessagesCollapsed])

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

      setConversationData(firstConversation)

      // Initialize with all fields selected
      const allFields = Object.keys(firstConversation)
      setSelectedFields(allFields)

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
      conversationData.messages.forEach(message => {
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
      <main className="max-w-7xl mx-auto p-ds-medium" data-testid="stage1-main">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-ds-large">

          {/* Left Column - Upload or Interactive JSON (2/3 width) */}
          <div className="lg:col-span-2">
            {!conversationData ? (
              <DropZone onFileUpload={handleFileUpload} error={error} />
            ) : (
              <InteractiveJSON
                conversation={conversationData}
                selectedFields={selectedFields}
                onFieldToggle={handleFieldToggle}
                isMessagesCollapsed={isMessagesCollapsed}
                onMessagesToggle={handleMessagesToggle}
              />
            )}
          </div>

          {/* Right Column - Context Panel (1/3 width) */}
          <div>
            <ContextPanel
              fileData={conversationData ? {
                name: 'conversation.json',
                content: [conversationData],
                detectedStructure: []
              } : null}
              onContextChange={handleContextChange}
              initialValue={contextDescription}
            />
          </div>
        </div>

        {/* Bottom Section - Processing Statistics and Navigation */}
        {conversationData && (
          <div className="mt-ds-large pt-ds-medium border-t border-border-default">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-ds-medium">

              {/* Processing Statistics */}
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

              {/* Continue Button */}
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
            </div>
          </div>
        )}
      </main>
    </div>
  )
}