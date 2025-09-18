// ABOUTME: Custom hook for handling file upload, validation, and processing logic
// ABOUTME: Consolidates conversation data extraction with error handling and field initialization

import { useState } from 'react'

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

interface UseFileUploadReturn {
  conversationData: ConversationData | null
  selectedFields: string[]
  error: string | null
  uploadFile: (file: File) => Promise<void>
  setSelectedFields: (fields: string[] | ((prev: string[]) => string[])) => void
  clearError: () => void
  reset: () => void
}

export function useFileUpload(): UseFileUploadReturn {
  const [conversationData, setConversationData] = useState<ConversationData | null>(null)
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const uploadFile = async (file: File) => {
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

  const clearError = () => setError(null)

  const reset = () => {
    setConversationData(null)
    setSelectedFields([])
    setError(null)
  }

  return {
    conversationData,
    selectedFields,
    error,
    uploadFile,
    setSelectedFields,
    clearError,
    reset
  }
}