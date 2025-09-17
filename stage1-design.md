# Stage 1 Design Specifications: File Upload and Field Selection

## Overview
Stage 1 transforms file upload from a simple utility into an intelligent data preparation interface. Users upload JSON conversation files and configure them for LLM processing through visual field categorization and contextual understanding.

## Layout Architecture

### Page Structure
```
/parse - Stage 1 Interface

┌─────────────────────────────────────────────────────────┐
│ [← Back] Stage 1: Upload & Configure Data              │ ← Navigation Bar
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────┐  ┌─────────────────────────────┐│
│ │                     │  │                             ││
│ │   Upload Zone       │  │     Context Panel           ││ ← Main Content
│ │   File Preview      │  │     (Smart Placeholders)    ││
│ │   Field Selection   │  │                             ││
│ │                     │  │                             ││
│ └─────────────────────┘  └─────────────────────────────┘│
│                                                         │
├─────────────────────────────────────────────────────────┤
│              Processing Statistics                      │ ← Bottom Stats
│              [Continue to Stage 2]                     │ ← Action Button
└─────────────────────────────────────────────────────────┘
```

**Layout Specifications:**
- **Container:** 1200px max width, centered, 32px padding desktop / 16px mobile
- **Two-column layout:** 60% left panel / 40% right panel on desktop
- **Mobile:** Stacked layout, context panel below file operations
- **Spacing:** 24px gap between main columns, 16px internal component spacing

## Component Specifications

### 1. Navigation Bar
```yaml
back_button:
  icon: "Lucide ArrowLeft, 20px"
  text: "Back"
  style: "Ghost button with navy text"
  position: "Top-left, 16px from edges"
  hover: "gray-100 background"

stage_indicator:
  text: "Stage 1: Upload & Configure Data"
  typography: "18px, font-medium, text-gray-900"
  position: "Centered in navigation bar"
```

### 2. Upload Zone Component

#### Empty State (Initial)
```yaml
container:
  height: "280px"
  border: "2px dashed border-gray-300"
  background: "bg-gray-50"
  border_radius: "12px"
  padding: "48px 24px"

content:
  icon: "Lucide Upload, 64px, text-gray-400"
  primary_text: "Drop your JSON file here"
  typography: "20px, font-medium, text-gray-700"
  secondary_text: "or click to browse"
  typography: "14px, text-gray-500"
  layout: "Vertical center stack, 12px gaps"

drag_active_state:
  border: "2px solid field-computer-friendly (blue)"
  background: "blue/5 opacity"
  icon_color: "field-computer-friendly"
  animation: "200ms ease-in-out"

hover_state:
  border: "2px dashed field-computer-friendly"
  cursor: "pointer"
```

#### File Uploaded State
```yaml
file_header:
  layout: "Horizontal, 12px gap, 16px padding"

  file_info:
    icon: "Lucide FileText, 24px, field-computer-friendly"
    name: "16px, font-medium, text-gray-900"
    size: "14px, text-gray-500"

  actions:
    remove_button:
      icon: "Lucide X, 20px, text-gray-400"
      hover: "text-red-500"
      position: "Right-aligned"
```

### 3. File Preview and Field Selection

#### Field Structure Display
```yaml
structure_panel:
  background: "bg-white"
  border: "1px solid border-gray-200"
  border_radius: "8px"
  padding: "16px"
  margin_top: "16px"

field_item:
  layout: "Horizontal, justify-between, 8px padding vertical"

  field_name:
    computer_friendly:
      color: "text-field-computer-friendly"
      background: "bg-field-computer-friendly/10"
      border_radius: "4px"
      padding: "2px 6px"

    llm_friendly:
      color: "text-field-llm-friendly"
      background: "bg-field-llm-friendly/10"
      border_radius: "4px"
      padding: "2px 6px"

    messages_field:
      background: "bg-slate-100"
      border: "1px solid slate-200"
      hover_background: "bg-slate-200"
      padding: "4px 8px"
      border_radius: "6px"
      cursor: "pointer"

  selection_checkbox:
    size: "16px"
    color: "field-computer-friendly when checked"

  unselected_state:
    opacity: "0.4"
    color: "text-gray-400"

messages_field_special:
  collapse_tooltip:
    text: "Click to collapse/expand messages"
    trigger: "hover on messages field"
    style: "Dark tooltip, 8px padding"

  collapsed_indicator:
    text: "Collapsed - entire conversation will be tagged as one unit"
    style: "12px, italic, text-gray-600, 8px margin-top"

  expanded_indicator:
    text: "Expanded - individual messages available for separate processing"
    style: "12px, italic, text-gray-600, 8px margin-top"
```

#### Data Examples Panel
```yaml
examples_container:
  background: "bg-gray-50"
  border_radius: "8px"
  padding: "16px"
  margin_top: "16px"

header:
  text: "Data Preview (2 examples)"
  typography: "14px, font-medium, text-gray-700"
  margin_bottom: "12px"

example_item:
  background: "bg-white"
  border: "1px solid border-gray-200"
  border_radius: "6px"
  padding: "12px"
  margin_bottom: "8px"
  font_family: "monospace"
  font_size: "13px"

  field_values:
    computer_friendly: "text-field-computer-friendly"
    llm_friendly: "text-field-llm-friendly"
    raw_data: "text-gray-600"

  hidden_fields:
    behavior: "Completely hidden when field unselected"
    animation: "None (immediate hide/show)"
```

### 4. Context Panel (Right Side)

#### Structure
```yaml
container:
  background: "bg-white"
  border: "1px solid border-gray-200"
  border_radius: "12px"
  padding: "24px"
  height: "fit-content"
  sticky: "top-24px" # Stays in view on scroll

header:
  text: "Describe Your Data"
  typography: "18px, font-semibold, text-gray-900"
  margin_bottom: "12px"

description:
  text: "Help the LLM understand your data context"
  typography: "14px, text-gray-600"
  margin_bottom: "16px"
```

#### Smart Placeholder System
```yaml
textarea:
  height: "120px"
  border: "1px solid border-gray-300"
  border_radius: "8px"
  padding: "12px"
  focus_border: "field-computer-friendly"
  focus_ring: "2px field-computer-friendly/20"

placeholder_states:
  initial:
    text: "e.g., Personal conversations, work emails, learning sessions..."
    style: "italic, opacity-60, text-gray-500"

  smart_detected:
    example: "e.g., Claude conversations about various topics and learning sessions"
    style: "italic, opacity-60, text-gray-500"
    behavior: "Auto-filled based on file analysis"
    editable: "User can modify or replace entirely"

  user_typing:
    behavior: "Placeholder disappears, normal text input"

transition: "200ms fade between placeholder states"
```

### 5. Processing Statistics Panel

#### Layout and Content
```yaml
container:
  background: "bg-gray-50"
  border: "1px solid border-gray-200"
  border_radius: "8px"
  padding: "16px"
  margin_top: "24px"

stats_grid:
  layout: "3-column grid on desktop, 1-column on mobile"
  gap: "16px"

stat_item:
  text_alignment: "center"

  value:
    typography: "24px, font-bold, text-gray-900"

  label:
    typography: "12px, font-medium, text-gray-600, uppercase"
    letter_spacing: "0.5px"

dynamic_updates:
  trigger: "Field selection changes"
  animation: "Number counts up to new value, 300ms duration"

  messages_collapsed:
    conversation_display: "3 conversations"
    interaction_display: "hidden"

  messages_expanded:
    conversation_display: "3 conversations"
    interaction_display: "26 interactions"

  no_messages_selected:
    conversation_display: "metadata only"
    interaction_display: "hidden"
```

### 6. Continue Button

#### Specifications
```yaml
container:
  margin_top: "32px"
  text_alignment: "center"

button:
  style: "Primary button (field-computer-friendly background)"
  text: "Continue to Stage 2"
  padding: "12px 32px"
  border_radius: "8px"
  typography: "16px, font-medium, white text"

  enabled_state:
    condition: "At least one field selected"
    hover: "Darker blue background"

  disabled_state:
    condition: "No fields selected"
    opacity: "0.5"
    cursor: "not-allowed"
    tooltip: "Select at least one field to continue"

icon:
  name: "Lucide ArrowRight"
  size: "20px"
  position: "Right side of text"
  margin_left: "8px"
```

## Interaction Patterns

### File Upload Flow
```yaml
drag_and_drop:
  drag_enter:
    border: "field-computer-friendly solid"
    background: "field-computer-friendly/5"

  drag_leave:
    border: "gray-300 dashed"
    background: "gray-50"

  drop_success:
    animation: "Brief green flash, 200ms"
    immediate: "Show loading state"

file_validation:
  accepted: ".json files only"

  error_states:
    wrong_format:
      message: "Please upload a JSON file"
      color: "text-red-600"
      position: "Below upload zone"

    corrupted_file:
      message: "This file appears to be corrupted"
      color: "text-red-600"

    too_large:
      message: "File size must be under 10MB"
      color: "text-red-600"
```

### Field Selection Behavior
```yaml
checkbox_interaction:
  click: "Toggle field selection"
  visual_feedback: "Immediate opacity change"
  data_impact: "Real-time statistics update"

messages_field_special:
  click_behavior: "Toggle collapse/expand state"

  visual_changes:
    background: "slate-100 → slate-200 on hover"
    cursor: "pointer"

  data_display:
    collapsed: "Simplified message format in examples"
    expanded: "Full message objects in examples"

  statistics_impact:
    collapsed: "Show conversation count only"
    expanded: "Show both conversation and interaction counts"
```

### Smart Placeholder Generation
```yaml
detection_process:
  trigger: "Successful file upload and analysis"
  analysis: "Check field names against detection_rules"

  matching_logic:
    claude: "Look for 'source', 'title', 'messages' fields"
    whatsapp: "Look for 'contact_name', 'phone_number' fields"
    email: "Look for 'subject', 'from', 'to' fields"

  fallback: "Generic placeholder if no pattern matches"

placeholder_update:
  timing: "500ms after file analysis complete"
  animation: "Fade out old → fade in new, 200ms each"
  user_preservation: "Don't override if user has typed content"
```

## Error States and Loading

### Loading States
```yaml
file_analysis:
  trigger: "After successful file upload"

  upload_zone:
    state: "Shows file info with loading spinner"
    text: "Analyzing file structure..."

  field_preview:
    state: "Loading skeleton for field list"
    duration: "Minimum 800ms for perceived thoroughness"

  statistics:
    state: "Show placeholder values with subtle pulse"

context_placeholder:
  state: "Loading... generating context suggestion"
  animation: "Subtle pulse on textarea border"
```

### Error Handling
```yaml
upload_errors:
  style: "Red text, 14px, margin-top 8px"
  icon: "Lucide XCircle, 16px, text-red-500"

  invalid_json:
    message: "Invalid JSON format. Please check your file."
    suggestion: "Validate JSON syntax and try again"

  analysis_failed:
    message: "Could not analyze file structure"
    suggestion: "File may be in an unexpected format"
    recovery: "Allow manual field selection"

field_selection_errors:
  no_fields_selected:
    button_state: "Disabled with tooltip"
    message: "Select at least one field to proceed"

  processing_estimation_failed:
    statistics_panel: "Show 'Unable to estimate' text"
    color: "text-gray-500"
```

## Responsive Behavior

### Desktop (1024px+)
- Two-column layout: 60/40 split
- Context panel sticky positioning
- Full field preview with examples
- Horizontal statistics grid

### Tablet (768px - 1023px)
- Two-column layout: 55/45 split
- Reduced padding and margins
- Context panel scrolls with content
- 2-column statistics grid

### Mobile (< 768px)
```yaml
layout_changes:
  columns: "Single column stack"
  order: "Upload → Field Selection → Context → Statistics"
  padding: "16px instead of 24-32px"

upload_zone:
  height: "240px instead of 280px"

field_preview:
  examples: "1 example instead of 2"
  font_size: "12px for code blocks"

context_panel:
  margin_top: "24px"
  padding: "20px instead of 24px"

statistics:
  grid: "Single column"
  font_sizes: "Slightly smaller"

continue_button:
  width: "100%"
  margin_top: "24px"
```

## Accessibility Standards

### Keyboard Navigation
- Tab order: Upload → Field checkboxes → Context textarea → Continue button
- Upload zone: Space/Enter to trigger file browser
- Field selection: Space to toggle checkboxes
- Messages field: Enter to toggle collapse state

### Screen Reader Support
- Upload zone: "Drop zone for JSON file upload, or activate to browse"
- Field items: "Checkbox, [field name], [computer/LLM-friendly], [selected/unselected]"
- Messages field: "Collapsible messages field, currently [collapsed/expanded]"
- Statistics: Live region announces changes

### Color Accessibility
- All field categorization colors meet WCAG AA contrast (4.5:1 minimum)
- Error states use icons + color (not color alone)
- Focus indicators: 2px solid blue outline with 2px offset

## Visual Hierarchy

### Typography Scale
1. **Page Header (18px):** Stage navigation text
2. **Section Headers (16px):** "Data Preview", "Describe Your Data"
3. **Field Names (14px):** Primary field text
4. **Body Text (14px):** Descriptions and labels
5. **Small Text (12px):** Statistics labels, helper text
6. **Code Text (13px):** JSON preview examples

### Color Emphasis Priority
1. **Primary Blue:** Selected states, continue button
2. **Field Categories:** Computer-friendly (blue), LLM-friendly (warm red)
3. **Messages Special:** Distinct slate background for collapsible field
4. **Gray Neutrals:** Raw data, unselected states
5. **Red Accents:** Error states only

### Spacing Rhythm
- **4px:** Fine details (badge padding, icon gaps)
- **8px:** Related element spacing
- **12px:** Component internal spacing
- **16px:** Section spacing
- **24px:** Major section separation
- **32px:** Page-level spacing

## Component Integration Notes

### State Management Requirements
```typescript
interface Stage1State {
  uploadedFile: {
    name: string
    size: number
    content: any[]
    analysisComplete: boolean
  }
  selectedFields: string[]
  messagesCollapsed: boolean
  contextDescription: string
  processingStats: {
    conversationCount: number
    interactionCount: number
    tokenCount: number
  }
  errors: string[]
}
```

### Planning Agent Integration Points
1. **File Upload Handler:** Process JSON, validate structure
2. **Field Analysis:** Categorize fields as computer/LLM-friendly
3. **Statistics Calculator:** Real-time updates based on selections
4. **Context Generator:** Smart placeholder text based on file type
5. **State Persistence:** LocalStorage for stage progression

### Stage 2 Handoff Data
```typescript
interface Stage1Output {
  selectedFields: string[]
  fieldCategorization: {
    computerFriendly: string[]
    llmFriendly: string[]
    messagesField?: string
  }
  contextDescription: string
  processingConfiguration: {
    messagesCollapsed: boolean
    estimatedTokens: number
    conversationCount: number
  }
}
```

This design creates an intuitive, powerful interface that transforms simple file upload into intelligent data preparation. The visual field categorization, smart context generation, and real-time statistics give users confidence in their data preparation decisions while maintaining the clean, minimalist aesthetic of the design system.