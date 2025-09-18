// ABOUTME: Integrated Prompt Refiner page converted from original /prompt_tester/ HTML/CSS/JS
// ABOUTME: LLM prompt testing interface with provider selection, model configuration and result validation

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Layers, Cpu, Brain, Database, Play, Edit3, BarChart3, Loader2, PlayCircle, CheckCircle, XCircle } from 'lucide-react'

interface Sample {
  id: string
  filename: string
  metadata: {
    title: string
    messageCount: number
    complexity: string
  }
  data: {
    messages?: Array<{ role: string; content: string }>
    title?: string
    tags?: string[]
  }
}

interface TestResult {
  success: boolean
  response?: string
  error?: string
  timing: number
  timestamp: string
  stage: string
  provider: string
  model: string
}

export default function PromptRefinerPage() {
  const router = useRouter()

  // Form state
  const [stage, setStage] = useState('')
  const [provider, setProvider] = useState('')
  const [model, setModel] = useState('')
  const [sampleId, setSampleId] = useState('')
  const [prompt, setPrompt] = useState('')

  // Data state
  const [samples, setSamples] = useState<Sample[]>([])
  const [currentSample, setCurrentSample] = useState<Sample | null>(null)
  const [results, setResults] = useState<TestResult[]>([])
  const [variables, setVariables] = useState<string[]>([])

  // UI state
  const [isLoading, setIsLoading] = useState(false)

  // Providers and models configuration
  const providers = {
    gemini: { models: ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash'] },
    openai: { models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'] },
    groq: { models: ['llama-3.1-70b', 'llama-3.1-8b', 'mixtral-8x7b'] },
    cerebras: { models: ['llama-3.1-70b', 'llama-3.1-8b'] }
  }

  // Stage templates
  const stageTemplates = {
    tagger: `You are a conversation categorizer. Analyze the following conversation and assign appropriate categories.

Categories available: {categories}

Conversation:
{conversation_text}

Return only the most relevant categories as a comma-separated list.`,
    parser: `Extract structured data from this conversation:

{conversation_text}

Extract:
- Key topics discussed
- Action items
- Decisions made
- Important dates/deadlines

Return as JSON format.`,
    reconciler: `Validate this parsed data against the knowledge base:

Parsed Data:
{parsed_data}

Knowledge Base Context:
{knowledge_base}

Identify any inconsistencies or missing information.`
  }

  // Load stage template
  useEffect(() => {
    if (stage && stageTemplates[stage as keyof typeof stageTemplates]) {
      setPrompt(stageTemplates[stage as keyof typeof stageTemplates])
    }
  }, [stage])

  // Load samples for stage
  useEffect(() => {
    if (stage) {
      // Mock samples based on stage
      const mockSamples: Sample[] = [
        {
          id: 'business-sample',
          filename: 'business-conversation.json',
          metadata: { title: 'Business Strategy Discussion', messageCount: 4, complexity: 'medium' },
          data: {
            messages: [
              { role: 'user', content: 'I need help planning my startup strategy for next quarter' },
              { role: 'assistant', content: 'I can help you develop a comprehensive business plan. What specific areas would you like to focus on?' },
              { role: 'user', content: 'Mainly marketing and product development timelines' },
              { role: 'assistant', content: 'For marketing, I recommend starting with customer research and persona development. For product development, let\'s create milestone-based timelines.' }
            ],
            tags: ['business', 'planning']
          }
        },
        {
          id: 'learning-sample',
          filename: 'learning-conversation.json',
          metadata: { title: 'Python Learning Session', messageCount: 3, complexity: 'simple' },
          data: {
            messages: [
              { role: 'user', content: 'Can you help me understand Python dictionaries?' },
              { role: 'assistant', content: 'Of course! Python dictionaries are key-value data structures. Here\'s how they work...' },
              { role: 'user', content: 'That makes sense! Can you show me some practical examples?' }
            ],
            tags: ['personal_growth', 'coding']
          }
        }
      ]
      setSamples(mockSamples)
      setSampleId(mockSamples[0]?.id || '')
    }
  }, [stage])

  // Update current sample
  useEffect(() => {
    const sample = samples.find(s => s.id === sampleId)
    setCurrentSample(sample || null)
  }, [sampleId, samples])

  // Extract and update variables
  useEffect(() => {
    const matches = prompt.match(/\{([^}]+)\}/g)
    const vars = matches ? matches.map(match => match.slice(1, -1)) : []
    setVariables(vars)
  }, [prompt])

  // Check if test button should be enabled
  const canTest = stage && provider && model && currentSample && prompt.trim()

  // Get variable preview value
  const getVariablePreview = (variable: string, sample: Sample) => {
    switch (variable) {
      case 'conversation_text':
        if (sample.data.messages) {
          return sample.data.messages.map(msg => `${msg.role}: ${msg.content.substring(0, 40)}...`).join('\n')
        }
        return sample.data.title || 'Sample conversation text'
      case 'categories':
        return 'business, personal_growth, design, coding'
      case 'parsed_data':
        return JSON.stringify(sample.data, null, 2).substring(0, 80) + '...'
      case 'knowledge_base':
        return 'Knowledge base context would be provided here'
      default:
        return `[${variable} value]`
    }
  }

  // Handle test prompt
  const handleTestPrompt = async () => {
    if (!canTest) return

    setIsLoading(true)

    // Simulate API call with mock response
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% success rate for demo
      const result: TestResult = {
        success,
        response: success ? 'business, planning, strategy' : undefined,
        error: success ? undefined : 'Failed to connect to LLM provider',
        timing: Math.floor(Math.random() * 2000) + 500,
        timestamp: new Date().toLocaleTimeString(),
        stage,
        provider,
        model
      }

      setResults(prev => [result, ...prev])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <div className="w-px h-6 bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">LLM Prompt Tester</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-[280px_1fr_1fr] gap-4 p-4 overflow-hidden">
          {/* Controls Panel */}
          <div className="bg-white rounded-lg shadow-sm border p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Layers className="w-3.5 h-3.5" />
                Processing Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select stage...</option>
                <option value="tagger">Tagger - Categorize conversations</option>
                <option value="parser">Parser - Extract structured data</option>
                <option value="reconciler">Reconciler - Validate with knowledge base</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Cpu className="w-3.5 h-3.5" />
                LLM Provider
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select provider...</option>
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="groq">Groq</option>
                <option value="cerebras">Cerebras</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Brain className="w-3.5 h-3.5" />
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!provider}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Select model...</option>
                {provider && providers[provider as keyof typeof providers]?.models.map(modelName => (
                  <option key={modelName} value={modelName}>{modelName}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Database className="w-3.5 h-3.5" />
                Sample Data
              </label>
              <select
                value={sampleId}
                onChange={(e) => setSampleId(e.target.value)}
                disabled={!stage}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Select sample...</option>
                {samples.map(sample => (
                  <option key={sample.id} value={sample.id}>
                    {sample.metadata.title} ({sample.metadata.messageCount} msgs)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleTestPrompt}
              disabled={!canTest || isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 mt-2"
            >
              <Play className="w-4 h-4" />
              Test Prompt
            </button>
          </div>

          {/* Template Panel */}
          <div className="bg-white rounded-lg shadow-sm border flex flex-col">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 rounded-t-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Edit3 className="w-4 h-4" />
                Prompt Template
              </div>
            </div>
            <div className="flex-1 p-4 flex flex-col overflow-hidden">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Select a stage to load the default prompt template..."
                className="flex-1 w-full border border-gray-300 rounded-md p-3 font-mono text-xs leading-relaxed resize-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              {variables.length > 0 && currentSample && (
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-md p-3 max-h-32 overflow-y-auto">
                  <div className="text-xs font-medium text-gray-700 mb-2">Variables will be substituted:</div>
                  {variables.map(variable => (
                    <div key={variable} className="text-xs text-gray-600 mb-1">
                      <span className="text-blue-600 font-medium">{`{${variable}}:`}</span> {getVariablePreview(variable, currentSample)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-lg shadow-sm border flex flex-col">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 rounded-t-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <BarChart3 className="w-4 h-4" />
                Test Results
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mb-3" />
                  <div>Testing prompt with LLM...</div>
                </div>
              )}

              {!isLoading && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <PlayCircle className="w-12 h-12 mb-3 text-gray-300" />
                  <div className="text-center italic">Configure settings and click "Test Prompt" to see results</div>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                      <div className="flex items-center justify-between mb-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {result.success ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {result.success ? 'Success' : 'Error'}
                          </span>
                          <span className="text-gray-500">
                            {result.timestamp} • {result.stage} • {result.provider}/{result.model}
                          </span>
                        </div>
                        <span className="text-gray-500">{result.timing}ms</span>
                      </div>
                      <div className="bg-white p-3 rounded border-l-4 border-blue-500 font-mono text-xs whitespace-pre-wrap">
                        {result.success ? result.response : result.error}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}