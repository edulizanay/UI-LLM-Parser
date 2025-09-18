# Codebase Refactoring Assessment

## Executive Summary

This assessment analyzes 28 TypeScript files across the conversation parser platform for refactoring opportunities. The codebase shows good architectural foundations with the design token system and clear component separation. Key opportunities focus on reducing state management complexity through custom hooks and consolidating overlapping functionality.

**Primary Focus Areas:**
- State management consolidation (4 custom hooks identified)
- Component over-granularity (3 merge opportunities)
- Mock data centralization (scattered hardcoded data)
- Type system deduplication (interface consolidation)
- Utility function consolidation (styling logic scattered)

---

## File-by-File Analysis

### App Directory (`/src/app/`)

## src/app/layout.tsx
**Purpose:** Root layout component providing base HTML structure, global styles, and metadata for the conversation parser platform.
**Refactoring Opportunities:**
- Component is minimal and appropriately focused - no refactoring needed
- Consider adding font loading optimization if custom fonts are used
- Could benefit from adding error boundary wrapper at root level

## src/app/page.tsx
**Purpose:** Main dashboard page implementing three-zone layout with project management, processing status, and navigation to parsing flows.
**Refactoring Opportunities:**
- Good separation of concerns with individual dashboard components
- Mock data loading could be abstracted into a custom hook (useDashboardData)
- Grid layout logic could be extracted into a reusable Layout component

## src/app/parse/categorize/page.tsx
**Purpose:** Stage 2 categorization page with category selection, prompt configuration, and LLM processing setup.
**Refactoring Opportunities:**
- Large file (283 lines) with complex state management - extract custom hook (useCategorization)
- Mock data (computerCategories, llmCategories) should be moved to mockData.ts
- localStorage persistence logic duplicated across stages - create usePersistedState hook

## src/app/parse/page.tsx
**Purpose:** Stage 1 file upload and interactive JSON field selection with statistics calculation and state persistence.
**Refactoring Opportunities:**
- Statistics calculation logic is complex - extract into useProcessingStats hook
- File upload handling scattered - create useFileUpload custom hook
- ConversationData interface duplicated - move to shared types

## src/app/prompt-refiner/page.tsx
**Purpose:** Integrated LLM prompt testing interface with provider selection, model configuration, and result validation.
**Refactoring Opportunities:**
- Large component (390 lines) handling multiple concerns - split into PromptForm, ResultsPanel, and TemplateEditor
- Mock sample generation logic should be externalized to mockData.ts
- Provider/model configuration hardcoded - move to configuration file

### Components Directory (`/src/components/`)

## src/components/categorization/CategoryBuilder.tsx
**Purpose:** Horizontal category selection interface with pill-based selection for computer-friendly, LLM, and custom categories.
**Refactoring Opportunities:**
- getCategoryPillColor function has color logic duplication - create utility function in fieldUtils.ts
- Category selection logic complex - could extract useCategorySelection hook
- Custom category input could be its own component (CustomCategoryInput)

## src/components/categorization/PromptEditor.tsx
**Purpose:** Two-column prompt configuration interface with category list and editable prompts plus model selection.
**Refactoring Opportunities:**
- Default prompt logic (getDefaultPrompt) should be moved to mockData.ts or configuration
- Model selection with cost/time estimates could be separate ModelSelector component
- Editing state management complex - extract usePromptEditing hook

## src/components/dashboard/DragDropOverlay.tsx
**Purpose:** Global drag-and-drop overlay for file uploads with visual feedback and navigation integration.
**Refactoring Opportunities:**
- Event handlers could be extracted into useDragDrop custom hook for reusability
- File handling logic minimal but could integrate with centralized file upload system
- Component is focused and well-structured

## src/components/dashboard/HeroSection.tsx
**Purpose:** Primary call-to-action hero section with navigation to parsing flow.
**Refactoring Opportunities:**
- Component is minimal and focused - no refactoring needed
- Consider making CTA text configurable via props for reusability
- Icon could be configurable for different action types

## src/components/dashboard/ProcessingStatus.tsx
**Purpose:** Processing status display showing active parsing operations with progress bars and time estimates.
**Refactoring Opportunities:**
- Progress bar rendering could be extracted to reusable ProgressBar component
- Time formatting logic already abstracted to dashboardData.ts (good)
- Component structure is clean and focused

## src/components/dashboard/ProjectGrid.tsx
**Purpose:** Recent projects grid displaying project summaries with status indicators and date formatting.
**Refactoring Opportunities:**
- ProjectCard could be extracted as separate component for individual project items
- Empty state could be its own component (EmptyProjectsState)
- Status dot styling logic could be centralized in fieldUtils.ts

## src/components/dashboard/PromptRefinerSection.tsx
**Purpose:** Navigation section for prompt refiner access.
**Refactoring Opportunities:**
- Should be reviewed for consistency with HeroSection pattern
- May benefit from shared ActionButton component abstraction
- Integration with routing logic could be centralized

## src/components/upload/ClickableField.tsx
**Purpose:** Interactive field name buttons with categorization colors and hover states for field selection.
**Refactoring Opportunities:**
- Color styling logic has significant duplication - consolidate with fieldUtils.ts helpers
- CSS class generation is complex - could use design token utilities more effectively
- Tooltip logic could be enhanced and made more accessible

## src/components/upload/ContextPanel.tsx
**Purpose:** Context input panel with smart placeholder generation.
**Refactoring Opportunities:**
- Placeholder generation logic should integrate with mockData.ts context system
- Text area component could be abstracted for reuse
- File type detection could be centralized utility

## src/components/upload/DropZone.tsx
**Purpose:** Drag-and-drop file upload interface with validation.
**Refactoring Opportunities:**
- File validation logic should be centralized with DragDropOverlay
- Upload state management could use shared useFileUpload hook
- Error handling patterns should be consistent across upload components

## src/components/upload/FieldSelector.tsx
**Purpose:** Field selection interface component.
**Refactoring Opportunities:**
- Likely overlaps with InteractiveJSON functionality - consolidate if redundant
- Field selection state should use shared selection management logic
- May be candidate for removal if functionality merged into InteractiveJSON

## src/components/upload/FilePreview.tsx
**Purpose:** File structure preview component.
**Refactoring Opportunities:**
- JSON rendering logic could overlap with InteractiveJSON - consolidate display utilities
- Preview formatting should use shared JSON display utilities
- Component may be redundant if InteractiveJSON handles all preview needs

## src/components/upload/InteractiveJSON.tsx
**Purpose:** Core interactive JSON display with clickable fields, messages collapse/merge, and real-time field selection.
**Refactoring Opportunities:**
- Field type determination logic (getFieldType) should use fieldUtils.ts for consistency
- JSON rendering and truncation logic could be abstracted to reusable utilities
- Messages handling is complex - MessagesField integration is good but could be simplified

## src/components/upload/MessagesField.tsx
**Purpose:** Specialized component for messages field collapse/expand functionality.
**Refactoring Opportunities:**
- Collapse state management should integrate with broader field selection state
- Rendering logic should use shared JSON display utilities
- Tooltip and interaction patterns should be consistent with ClickableField

### Library Directory (`/src/lib/`)

## src/lib/dashboardData.ts
**Purpose:** Dashboard mock data loading and formatting utilities with date/time processing.
**Refactoring Opportunities:**
- Well-structured utility file - no major refactoring needed
- Date formatting functions could be moved to shared utilities if used elsewhere
- Type transformations are clean and focused

## src/lib/designTokens.ts
**Purpose:** Comprehensive design system tokens providing type-safe, enforceable design values.
**Refactoring Opportunities:**
- Excellent architecture as single source of truth - no refactoring needed
- CSS custom properties generation could be expanded for more dynamic usage
- Consider splitting into separate files if it grows beyond 300 lines

## src/lib/fieldUtils.ts
**Purpose:** Field categorization and styling utilities with type-safe helpers for computer-friendly vs LLM-friendly handling.
**Refactoring Opportunities:**
- Some utility functions overlap with component-specific styling - consolidate usage patterns
- analyzeFieldType function could be enhanced with machine learning for better categorization
- Error/success/loading state utilities could be moved to separate UI utilities file

## src/lib/mockData.ts
**Purpose:** Centralized mock data loading and management with type-safe accessors for JSON files.
**Refactoring Opportunities:**
- Well-structured utility file - good abstraction of mock data access
- Helper functions are focused and reusable
- Could benefit from caching layer for larger mock datasets

### Types Directory (`/src/types/`)

## src/types/categorization.ts
**Purpose:** TypeScript definitions for categorization and LLM processing.
**Refactoring Opportunities:**
- Should be reviewed for overlap with parsing.ts types
- Category-related types could be consolidated across Stage 1 and Stage 2
- LLM processing types should align with prompt-refiner component needs

## src/types/dashboard.ts
**Purpose:** Dashboard and project management type definitions.
**Refactoring Opportunities:**
- Should integrate with parsing and categorization types for end-to-end consistency
- Processing status types should be aligned across all stages
- Project lifecycle types could be more granular for better state management

## src/types/index.ts
**Purpose:** Central type export point with common utility interfaces for the entire application.
**Refactoring Opportunities:**
- Good central export pattern - no refactoring needed
- LoadingState and ApiResponse types are well-designed for reuse
- Consider adding more shared utility types as patterns emerge

## src/types/navigation.ts
**Purpose:** Navigation and routing type definitions.
**Refactoring Opportunities:**
- Should align with actual Next.js routing patterns used
- Breadcrumb types should integrate with stage progression logic
- Route parameter types should be type-safe with actual URL patterns

## src/types/parsing.ts
**Purpose:** Stage 1 file parsing and field selection type definitions with comprehensive data structures.
**Refactoring Opportunities:**
- FieldType enum could be consolidated with design token FieldType for consistency
- FileProcessingOptions could be moved to configuration rather than types
- ContextPlaceholder interface should align with mockData context system

---

## Cross-Cutting Improvement Opportunities

### 1. State Management Hooks (HIGH PRIORITY)
**Create shared custom hooks:**
- `useFileUpload` - Centralize file handling across DropZone and DragDropOverlay
- `useFieldSelection` - Share field selection logic between Stage 1 components
- `useCategorization` - Extract Stage 2 category management complexity
- `usePersistedState` - Replace duplicated localStorage logic across stages

**Impact:** Reduces 200+ lines of duplicated state logic across 6 files

### 2. Component Consolidation (MEDIUM PRIORITY)
**Merge over-granular components:**
- Consider merging FieldSelector into InteractiveJSON if functionality overlaps
- FilePreview could be absorbed into InteractiveJSON if redundant
- ProjectCard extraction from ProjectGrid for better modularity
- Split prompt-refiner page into 3 focused components

**Impact:** Reduces component count by 3-4 files, improves maintainability

### 3. Utility Consolidation (MEDIUM PRIORITY)
**Centralize styling and formatting:**
- Color styling logic scattered across ClickableField and CategoryBuilder - consolidate in fieldUtils.ts
- JSON display and truncation logic should be shared utilities
- Error/success/loading states should use consistent utility patterns

**Impact:** Reduces duplicated styling logic by ~150 lines

### 4. Mock Data Integration (LOW PRIORITY)
**Move hardcoded data to centralized system:**
- Stage 2 computerCategories and llmCategories to mockData.ts
- Prompt refiner provider/model configurations to configuration files
- Default prompts and templates to mockData system

**Impact:** Better data organization, easier testing and configuration

### 5. Type System Improvements (LOW PRIORITY)
**Reduce type duplication:**
- ConversationData interface duplicated across files
- FieldType definitions should be unified between design tokens and parsing types
- Category-related types should be consolidated across Stage 1 and Stage 2

**Impact:** Better type safety, reduced maintenance overhead

---

## Prioritized Refactoring Roadmap

### Phase 1: State Management (Est. 4-6 hours)
1. **Create `usePersistedState` hook** - Replace localStorage duplication across stages
2. **Create `useFileUpload` hook** - Centralize file handling logic
3. **Create `useCategorization` hook** - Extract Stage 2 complexity
4. **Create `useFieldSelection` hook** - Share Stage 1 field selection

### Phase 2: Component Optimization (Est. 3-4 hours)
1. **Split prompt-refiner page** - Extract PromptForm, ResultsPanel, TemplateEditor
2. **Evaluate upload component overlap** - Consolidate FieldSelector/FilePreview into InteractiveJSON if redundant
3. **Extract ProjectCard component** - Improve ProjectGrid modularity

### Phase 3: Utility Consolidation (Est. 2-3 hours)
1. **Consolidate styling utilities** - Move scattered color logic to fieldUtils.ts
2. **Create shared JSON utilities** - Abstract display and truncation logic
3. **Standardize UI state patterns** - Error/success/loading state utilities

### Phase 4: Data & Type Cleanup (Est. 2-3 hours)
1. **Move hardcoded data to mockData.ts** - Centralize Stage 2 categories and configurations
2. **Consolidate type definitions** - Remove duplicated interfaces
3. **Align field type systems** - Unify design tokens and parsing types

---

## Estimated Impact

- **Lines of Code Reduction:** ~400-500 lines
- **File Count Reduction:** 3-4 files
- **Maintainability:** Significantly improved through centralized state management
- **Developer Experience:** Better through shared hooks and utilities
- **Test Coverage:** Maintained (no test modifications needed)

## Risk Assessment

- **LOW RISK:** All refactoring preserves existing functionality
- **GUARDRAILS:** Existing test suite ensures no regressions
- **INCREMENTAL:** Can be done in phases with testing between each
- **REVERSIBLE:** Git history allows rollback of any changes