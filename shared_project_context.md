# Shared Project Context

*This file is maintained by both Planning Agent and Yuki Design. Update after each phase completion.*

## Project Overview
- **Platform Purpose:** Conversation parser for LLM processing
- **Tech Stack:** Next.js with TypeScript, shadcn components (using shadcn MCP), Lucide icons
- **Development Approach:** UI/UX testing focus, not production application

---

## Visual Design System
**🎯 SINGLE SOURCE OF TRUTH:** All design values are defined in TypeScript files

### Design Token Files
- **Primary Source:** `/src/lib/designTokens.ts` - All colors, typography, spacing, components
- **Field Utilities:** `/src/lib/fieldUtils.ts` - Field categorization helpers and styling utilities
- **Tailwind Integration:** `tailwind.config.js` - Makes tokens available as utility classes
- **CSS Variables:** `/src/app/globals.css` - CSS custom properties and base styles

### Key Design Principles
*Based on prompt_tester analysis and adapted for conversation parser platform*

- **Clean Minimalist Aesthetic:** Functional design prioritizing clarity over decoration
- **Field Categorization:** Blue for computer-friendly data, warm red for LLM-friendly content
- **Consistent Spacing:** 4px-based grid system for harmonious layouts
- **Type-Safe Design:** All values accessible via TypeScript imports with autocomplete

### Usage Guidelines

**Import design tokens:**
```typescript
import { colors, spacing, typography } from '@/lib/designTokens'
import { getFieldClasses, getPanelClasses } from '@/lib/fieldUtils'
```

**Use Tailwind utilities:**
```typescript
// Field categorization
className="text-field-computer-friendly"
className="text-field-llm-friendly"

// Surface and spacing
className="bg-surface-white p-ds-panel rounded-ds-lg"

// Typography
className="text-ds-heading font-system"
```

**Field categorization helpers:**
```typescript
// Get appropriate styling for field types
const styling = getFieldStyling('computer_friendly', isSelected, isDimmed)
const classes = getFieldClasses('llm_friendly', true, false, true)
```

### Enforcement Rules
❌ **NEVER use hardcoded hex values** (`#3b82f6`)
✅ **ALWAYS use design tokens** (`colors.primary.blue` or `bg-primary-blue`)

❌ **NEVER duplicate spacing values** (`padding: '16px'`)
✅ **ALWAYS use spacing tokens** (`spacing.medium` or `p-ds-medium`)

This architecture prevents hardcoded values and ensures consistency across all components.

### Component Patterns
- **Panels:** White background, 8px border-radius, `0 1px 3px rgba(0,0,0,0.1)` shadow
- **Buttons:** 8-12px padding, 6px border-radius, 500 font-weight, blue primary
- **Inputs:** 1px border `#e2e8f0`, 6px border-radius, blue focus ring
- **Cards:** Panel styling with 16px padding
- **Code blocks:** `#fafafa` background, monospace font, preserved whitespace
- **Status indicators:** 4-8px padding, 12px border-radius, small font
- **Interactive feedback:** 0.2s transitions, hover state changes

### Stage 1 Upload Interface Patterns
- **Upload Zones:** 280px height, dashed borders (gray-300 default, blue active), 12px border-radius
- **Field Categories:** Blue badges for computer-friendly, warm red for LLM-friendly, slate for messages
- **Field Selection:** Checkboxes with real-time visual feedback, 40% opacity when unselected
- **Messages Field Special:** Distinct slate background with hover states for collapse functionality
- **Smart Placeholders:** Italic, 60% opacity, context-aware text generation
- **Data Examples:** Monospace code blocks, 13px font, categorized field colors
- **Processing Stats:** 3-column grid, large numbers (24px bold), small labels (12px uppercase)
- **Context Panel:** Sticky positioning, 120px textarea, auto-generating placeholders

### Special Categorization Colors
- **Computer-friendly fields:** Blue spectrum (`#1e40af` to `#3b82f6`)
- **LLM-friendly fields:** Warm spectrum (`#dc2626` to `#f87171`)
- **Messages field (collapsible):** Distinct background `#f1f5f9` with hover `#e2e8f0`
- **Raw data:** Neutral gray text `#64748b`
- **Selected state:** Primary blue with reduced opacity
- **Dimmed/unselected:** 40% opacity with gray treatment

---

## Architecture Decisions

### Project Structure
**Complete Next.js App Directory Structure:**

```
/src
├── /app                          # Next.js 13+ App Directory
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Main Dashboard (Phase 2)
│   ├── /parse                   # Parsing flow pages
│   │   ├── page.tsx            # Stage 1: File Upload & Selection
│   │   └── /categorize         # Stage 2: Data Categorization
│   │       └── page.tsx
│   ├── /prompt-refiner         # Integrated Prompt Refiner
│   │   └── page.tsx           # Converted from /prompt_tester/
│   └── globals.css            # Global styles + design tokens
│
├── /components                  # Reusable UI Components
│   ├── /ui                     # shadcn/ui base components
│   ├── /dashboard              # Dashboard-specific components
│   │   ├── ProjectCard.tsx     # Project summary cards
│   │   ├── ProcessingStatus.tsx # Batch processing displays
│   │   └── QuickActions.tsx    # Upload CTAs
│   ├── /upload                 # Stage 1 components
│   │   ├── DropZone.tsx        # Drag & drop file interface
│   │   ├── FilePreview.tsx     # JSON structure display
│   │   ├── FieldSelector.tsx   # Field selection interface
│   │   └── ContextPanel.tsx    # Right-side context input
│   ├── /categorization         # Stage 2 components
│   │   ├── CategoryBuilder.tsx  # Category creation interface
│   │   ├── PreviewPanel.tsx    # LLM categorization preview
│   │   └── PromptEditor.tsx    # Editable category prompts
│   ├── /navigation             # Navigation components
│   │   ├── TopNavigation.tsx   # Main navigation bar
│   │   └── BackButton.tsx      # Stage navigation
│   └── /common                 # Shared utility components
│       ├── LoadingState.tsx    # Loading indicators
│       ├── ErrorBoundary.tsx   # Error handling
│       └── StatusIndicator.tsx # Processing states
│
├── /lib                        # Utility Functions & Data
│   ├── designTokens.ts         # ✅ Design system tokens
│   ├── fieldUtils.ts          # ✅ Field categorization helpers
│   ├── mockData.ts            # ✅ Mock data integration
│   ├── fileProcessing.ts      # File upload & parsing logic
│   ├── fieldAnalysis.ts       # Smart field categorization
│   ├── contextGeneration.ts   # Placeholder text generation
│   └── stateManagement.ts     # Local state persistence
│
├── /types                     # TypeScript Definitions
│   ├── index.ts              # Main type exports
│   ├── parsing.ts            # File parsing & field types
│   ├── categorization.ts     # Category & prompt types
│   ├── dashboard.ts          # Project & status types
│   └── navigation.ts         # Routing & state types
│
└── /hooks                     # Custom React Hooks
    ├── useFileUpload.ts      # File handling logic
    ├── useFieldSelection.ts  # Field selection state
    ├── useCategorization.ts  # Category management
    └── useLocalStorage.ts    # State persistence
```

**Reasoning:**
- **App Directory**: Next.js 13+ routing with nested layouts for each stage
- **Component Organization**: Grouped by feature (dashboard, upload, categorization) for maintainability
- **Lib Utilities**: Centralized business logic separate from UI components
- **Type Safety**: Comprehensive TypeScript definitions for all data structures
- **Custom Hooks**: Reusable state logic separated from UI concerns

### State Management Approach
**Local State with Persistence Strategy:**

1. **No External Store**: Using React built-in state management (useState, useContext)
2. **Local Storage Persistence**: Key parsing state persisted between page refreshes
3. **URL State**: Stage progression and selections reflected in URL params
4. **Component-Level State**: UI interactions handled locally within components

**Data Flow Pattern:**
```
Dashboard → Parse Flow → Categorization
     ↓         ↓              ↓
Local Storage ← → URL Params ← → Context API
```

**State Persistence Points:**
- File upload and field selections (Stage 1 → Stage 2)
- Category definitions and prompts (Stage 2 completion)
- Project summaries (Dashboard display)

### Component Architecture
**Reusable Component Guidelines:**

1. **File Naming**: PascalCase for components, camelCase for utilities
2. **Props Interfaces**: All props typed with descriptive interface names
3. **Design Token Usage**: All styling through design tokens, no hardcoded values
4. **Error Boundaries**: Each major section wrapped in error handling
5. **Loading States**: Consistent loading patterns across all async operations

**Props Interface Patterns:**
```typescript
interface ComponentProps {
  // Data props first
  data: DataType
  // Event handlers with 'on' prefix
  onAction: (param: Type) => void
  // UI state props
  isLoading?: boolean
  error?: string
  // Design system props
  variant?: 'primary' | 'secondary'
  className?: string
}
```

---

## Cross-Stage Dependencies

### Stage 1 → Stage 2 Data Flow
**Field Selection Data Structure:**
```typescript
interface FieldSelectionState {
  uploadedFile: {
    name: string
    content: any[]
    detectedStructure: FieldDefinition[]
  }
  selectedFields: string[]
  contextDescription: string
  fieldCategorization: {
    computerFriendly: string[]
    llmFriendly: string[]
    messagesField?: string
  }
  processingStats: {
    conversationCount: number
    interactionCount: number
    tokenCount: number
  }
}
```

**State Persistence Strategy:**
- LocalStorage key: `parsing-stage-1-state`
- URL params: `/parse?file=${fileName}&fields=${selectedFieldsCSV}`
- Context API: `ParsingFlowContext` for cross-component state

### Stage 1 Component Integration Requirements

**DropZone.tsx Dependencies:**
- File validation for JSON format
- Drag/drop state management with visual feedback
- Error handling for invalid files
- Integration with file analysis system

**FieldSelector.tsx Dependencies:**
- Field categorization from `claude_stage1.json` mock data
- Real-time statistics updates from `claude_stage1_statistics_scenarios.json`
- Messages field collapse/expand functionality
- Visual distinction for computer-friendly vs LLM-friendly fields

**FilePreview.tsx Dependencies:**
- JSON structure display with syntax highlighting
- Field selection state management
- Dynamic example filtering based on selected fields
- Integration with field categorization colors

**ContextPanel.tsx Dependencies:**
- Smart placeholder generation from `context_placeholders.json`
- File type detection and contextual suggestions
- User input preservation and editing capabilities
- Integration with Stage 2 data handoff

### Integration Touchpoints

**Dashboard → Stage Flow:**
- Navigation: Dashboard "Parse New Data" CTA → `/parse`
- Return navigation: `/parse` back button → Dashboard
- Project creation: Stage 2 completion → Dashboard project list update

**Stage Completion Handling:**
- Stage 1: Field selection complete → Navigate to `/parse/categorize`
- Stage 2: Categorization complete → Return to Dashboard with success state
- Prompt Refiner: Independent navigation from Dashboard → `/prompt-refiner`

**Navigation Patterns:**
```
Dashboard (/):
├── Parse New Data → /parse (Stage 1)
├── Prompt Refiner → /prompt-refiner
└── Project Cards → View/Edit (placeholder navigation)

Parse Flow:
/parse (Stage 1) → /parse/categorize (Stage 2) → / (Dashboard)
```

---

## Implementation Progress

### Development Roadmap & Yuki Handoff Points

**Phase 2: Dashboard Implementation** ✅
- [x] **Yuki Handoff**: Dashboard layout and component designs ✅
- [x] **Planning Agent**: Implement Dashboard components ✅
  - ProjectCard.tsx with mock project data ✅
  - ProcessingStatus.tsx with loading states ✅
  - QuickActions.tsx with upload CTAs ✅
  - Navigation to parse flow and prompt refiner ✅

**Phase 3: Stage 1 Implementation** ✅
- [x] **Yuki Handoff**: Upload interface and field selection designs ✅
- [x] **Planning Agent**: Core upload functionality ✅
  - DropZone.tsx with drag/drop support ✅
  - InteractiveJSON.tsx with unified field selection ✅
  - ClickableField.tsx with categorization colors ✅
  - MessagesField.tsx with collapse/merge functionality ✅
  - ContextPanel.tsx with smart placeholders ✅

**Phase 4: Stage 2 Implementation**
- [ ] **Yuki Handoff**: Categorization interface designs
- [ ] **Planning Agent**: Category management system
  - CategoryBuilder.tsx with computer/LLM suggestions
  - PreviewPanel.tsx with mock categorization results
  - PromptEditor.tsx with editable prompts

**Phase 5: Integration & Polish**
- [ ] **Both Agents**: Cross-stage navigation and state persistence
- [ ] **Planning Agent**: Error handling and loading states
- [ ] **Yuki Handoff**: Final polish and responsive design

### Testing Strategy

**Test Structure:**
```
/tests
├── /components        # Component unit tests
├── /integration      # Cross-component flow tests
├── /utils           # Utility function tests
└── setup.ts         # Test configuration
```

**Testing Approach:**
1. **Unit Tests**: All utility functions and isolated components
2. **Integration Tests**: Multi-component flows (upload → field selection → categorization)
3. **Mock Data Tests**: Verify mock data integration and field categorization logic
4. **Design Token Tests**: ✅ Already implemented - ensuring design system consistency

**Test Requirements:**
- 90%+ code coverage on business logic
- All user flows tested end-to-end
- Error boundary and loading state coverage
- Mock data integration verification

### Completed Components
**✅ Phase 0 (Foundation):**
- designTokens.ts: Complete design system with TypeScript enforcement
- fieldUtils.ts: Field categorization utilities and styling helpers
- mockData.ts: Mock data integration from JSON files
- Test suite: 23 passing tests for design token architecture

**✅ Phase 3 (Stage 1 Design & Implementation):**
- Stage 1 complete design specifications with all component patterns
- Upload interface patterns with drag/drop states
- Field categorization system with computer/LLM-friendly visual distinction
- Smart placeholder system for context generation
- Processing statistics with real-time updates
- Cross-stage data flow interface definitions
- Complete Stage 1 implementation with TDD test coverage:
  - DropZone.tsx: File upload with drag/drop and validation
  - FieldSelector.tsx: Visual field categorization and selection
  - FilePreview.tsx: JSON structure display with filtering
  - ContextPanel.tsx: Smart placeholder generation and input
  - Stage1Page: Complete workflow integration

### Established Patterns
**Design Token Usage:**
- All colors, spacing, typography through TypeScript imports
- Tailwind utility classes generated from design tokens
- No hardcoded values allowed in components

**Component Architecture:**
- Feature-based directory organization
- Props interfaces with clear naming conventions
- Error boundaries and loading states for all async operations

### Outstanding Decisions
**Planning Agent - Phase 2 Implementation Priority:**
- Should Dashboard be implemented first, or Stage 1 upload flow?
- Decision needed by user validation checkpoint

**Yuki Design - Component Visual Specifications:**
- Dashboard layout: Card grid vs. list view for projects
- Upload interface: Side-by-side vs. tabbed layout for file preview ✅ (Decided: Side-by-side)
- Stage navigation: Breadcrumbs vs. progress indicators

---

## Integration Requirements

### Prompt Refiner Connection
*[Planning Agent defines integration approach]*
- Navigation handling
- Shared component usage
- Style consistency requirements

### Mock Data Usage
*[Both agents document data integration patterns]*
- Loading strategies
- Data transformation needs
- Error state handling

---

## Quality Standards

### Code Consistency
*[Planning Agent establishes patterns]*
- TypeScript usage guidelines
- Component structure standards
- Testing approach

### Design Consistency
*[Yuki establishes design quality gates]*
- Visual hierarchy through typography scale (24px → 18px → 14px → 13px → 11px)
- Consistent spacing using 4px base unit multiples
- Color usage: Blue for computer-friendly, warm red for LLM-friendly elements
- Panel styling: White surface, 8px radius, subtle shadows
- Interactive states: 0.2s transitions, blue focus rings, hover feedback
- Responsive behavior: Mobile-first with fluid grid layouts

---

## Decision Log

*Brief entries tracking key decisions made by each agent. Format: Date - Agent - Decision*

Logs:
- 2025-09-17 - Yuki: Established design foundation from prompt_tester analysis
- 2025-09-17 - Yuki: Defined color coding system for field categorization (blue=computer-friendly, warm=LLM-friendly)
- 2025-09-17 - Yuki: Set typography scale prioritizing readability with system fonts
- 2025-09-17 - Yuki: Established spacing system based on 4px grid for consistent layouts
- 2025-09-17 - Planning Agent: Implemented design tokens architecture with TypeScript source of truth
- 2025-09-17 - Planning Agent: Created enforceable design system preventing hardcoded values
- 2025-09-17 - Planning Agent: Integrated design tokens with Tailwind config and CSS variables
- 2025-09-17 - Planning Agent: Defined complete Next.js project structure with feature-based organization
- 2025-09-17 - Planning Agent: Established state management approach using local state + persistence
- 2025-09-17 - Planning Agent: Created development roadmap with clear Yuki handoff points for Phases 2-5
- 2025-09-17 - Planning Agent: Completed Phase 2 Dashboard implementation with all components (HeroSection, ProcessingStatus, ProjectGrid, PromptRefinerSection, DragDropOverlay)
- 2025-09-17 - Yuki: Designed Stage 1 upload and field selection interface with complete specifications
- 2025-09-17 - Yuki: Established upload zone patterns with drag/drop states and visual feedback
- 2025-09-17 - Yuki: Created field categorization system with blue/warm color coding and messages field special handling
- 2025-09-17 - Yuki: Designed smart placeholder system for context panel with auto-generation capabilities
- 2025-09-17 - Yuki: Specified processing statistics panel with real-time updates and collapse/expand behavior
- 2025-09-17 - Yuki: Defined Stage 1 → Stage 2 data flow interface and integration requirements
- 2025-09-17 - Planning Agent: Completed Stage 1 implementation with full TDD coverage (InteractiveJSON, ClickableField, MessagesField, DropZone, ContextPanel)

*[Add entries chronologically]*