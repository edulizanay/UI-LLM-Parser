# Multi-Agent Development Workflow

## Initial Setup (Planning Agent Instructions)
**BEFORE STARTING:** 
1. [ ] Read `/requirements.md` file completely 
2. [ ] Read and understand this workflow file
3. [ ] Confirm you have access to all mock data files in `/mock-data/`
4. [ ] Verify access to existing `/prompt_tester/` code files
5. [ ] Create `shared_project_context.md` in root directory using provided template **(NEW)**

**Progress Tracking:** Check off each box `[ ]` → `[x]` as phases are completed and validated.

## Overview
Planning Agent orchestrates development and handles all code implementation. Yuki Design specialist handles all UI/UX design decisions. Shared context ensures consistency while maintaining clear responsibility separation.

---

## Phase 0: Design System Foundation
**Objective:** Establish visual design system from existing codebase

- [x] **Phase 0 Started**

### Planning Agent Actions:
1. [x] Direct Yuki to analyze existing `/prompt_tester/` files (app.js, index.html, styles.css)
2. [x] Pass Yuki the main @requirements.md document for context
3. [x] Request design documentation

### Yuki Prompt Template:
```
Analyze the existing @prompt_tester/ code and create a design system foundation. Extract:
- Color palette and usage patterns
- Typography hierarchy
- Spacing/layout patterns  
- Component styles and interactions
- Overall visual aesthetic

Then review @requirements.md and adapt/extend this design system for the conversation parser platform.

**REQUIRED DOCUMENTATION:** Update @shared_project_context.md with: 
- Visual Design System section
- Decision Log entry: "Yuki - Established design foundation from prompt_tester analysis"

You are only setting up design foundations - do not start designing specific interfaces yet.
```

### Expected Output:
- [x] Visual Design System section in @shared_project_context.md
- [x] Decision Log entry documenting foundation decisions succintly

### **USER VALIDATION CHECKPOINT** ⚠️
- [x] **User has reviewed and approved design system**

**Planning Agent:** After user approval, update @shared_project_context.md Decision Log with completion entry.

- [x] **Phase 0 Complete**

---

## Phase 1: Project Structure & Development Planning
**Objective:** Define project architecture and implementation roadmap

- [x] **Phase 1 Started**

### Planning Agent Actions:
1. [x] Based on approved design system and requirements.md, design the Next.js project structure
2. [x] Explain where each component/page should live and why in a summary, plus a small comment at the top of each file
3. [x] Define what logic each file should contain
4. [x] Create development roadmap with clear Yuki handoff points
5. [x] Define testing strategy and test file structure
6. [x] Set up Jest, Testing Library, and testing utilities

### Planning Agent Output Format:
```
## Proposed Next.js Project Structure

/src
  /app - Next.js app directory
  /components - Reusable UI components  
  /lib - Utility functions and data handling
  /types - TypeScript definitions
  
Explain reasoning for each directory and major files.
Define handoff points where Yuki will provide design specifications.
```

**REQUIRED DOCUMENTATION:** Update @shared_project_context.md with: 
- Complete Architecture Decisions section 
- Project structure and reasoning 
- State management approach 
- Decision Log entry: for example, "Planning Agent - Defined Next.js project structure" 

### **USER VALIDATION CHECKPOINT** ⚠️
- [x] **User has reviewed and approved project structure**

### Expected Output:
- [x] Approved project structure
- [x] Implementation sequence plan
- [x] Clear Yuki handoff specifications for each stage

- [x] **Phase 1 Complete**

---

## Phase 2: Main Dashboard Development
**Objective:** Implement entry point with navigation and project management

- [ ] **Phase 2 Started**

### Step 2.1: Design Phase
### Planning Agent → Yuki Handoff:
```
Design the Main Dashboard interface based on these requirements:

**Requirements:** [Extract Main Dashboard section from @requirements.md]

**Context:** Use established design system from @shared_project_context.md

**Focus Areas:**
- Entry point UX and visual hierarchy
- Project management interface layout
- Prominent "Parse new data" CTA placement
- Navigation to Prompt Refiner integration
- Summary cards for parsed projects and processing status

**Mock Data:** Reference for realistic content examples

 - Create @dashboard-design.md file with your design guidelines for the planning-agent to implement.

**REQUIRED DOCUMENTATION:** Update @shared_project_context.md with:
- New Component Patterns established for dashboard 
- Decision Log entry: "Yuki - Designed main dashboard interface"
- Any updates to Visual Design System and location of file created. 
- Integration Requirements for Prompt Refiner connection 
```

- [ ] **Yuki has provided complete Dashboard design specifications**

### Step 2.2: Implementation Phase
### Planning Agent Actions:
1. [ ] Write failing tests for Dashboard component requirements (TDD Red phase)
2. [ ] Implement Dashboard UI based on Yuki's specifications (TDD Green phase)
3. [ ] Integrate mock data for project summaries and processing status
4. [ ] Implement navigation structure
5. [ ] Add responsive behavior  
6. [ ] Refactor and optimize while keeping tests passing (TDD Refactor phase)

### Testing:
- [ ] Dashboard component functionality validation
- [ ] Navigation flow validation
- [ ] Mock data integration verification
- [ ] User interface interaction testing

**REQUIRED DOCUMENTATION:** Update @shared_project_context.md with: 
- Completed Components section entry for Dashboard 
- Implementation Progress updates 
- Decision Log entry: "Planning Agent - Implemented dashboard with navigation structure" 

### **USER VALIDATION CHECKPOINT** ⚠️
- [ ] **User has reviewed and approved Dashboard implementation**

- [x] **Phase 2 Complete**

---

## Phase 3: Stage 1 - File Upload & Selection
**Objective:** Implement upload interface and field selection UX

- [x] **Phase 3 Started**

### Step 3.1: Design Phase
### Planning Agent → Yuki Handoff:
```
Design the Stage 1 interface focusing on:

**Requirements:** [Extract Stage 1 section from requirements.md]

**Design System:** Current @shared_project_context.md

**Key Interactions to Design:**
- Drag-and-drop upload with visual feedback states
- Context input panel with smart placeholder behavior
- Field selection with computer/LLM-friendly visual distinction
- Collapse/uncollapse functionality for messages field
- Real-time processing statistics display

**Mock Data:** @claude_raw_data.json, @claude_stage1.json, @context_placeholders.json, @claude_stage1_statistics_scenarios.json

**REQUIRED DOCUMENTATION:** Update @shared_project_context.md with: 
- Component Patterns for upload interface and field selection 
- Decision Log entry: "Yuki - Designed Stage 1 upload and field selection interface"
- Cross-Stage Dependencies documentation for Stage 1 → Stage 2 data flow 
```

- [x] **Yuki has provided complete Stage 1 design specifications**

### Step 3.2: Implementation Phase
### Planning Agent Actions:
1. [x] Write failing tests for Stage 1 component requirements (TDD Red phase)
2. [x] Implement upload interface with drag-and-drop functionality
3. [x] Build field selection logic with visual categorization
4. [x] Create collapse/uncollapse behavior for messages field
5. [x] Implement real-time statistics calculation
6. [x] Integrate context placeholder system
7. [ ] Refactor and optimize while keeping tests passing (TDD Refactor phase)

**REQUIRED DOCUMENTATION:** Update @shared_project_context.md with: 
- Completed Components section entry for Stage 1 
- Established Patterns for upload and field selection 
- Mock Data Usage documentation 
- Decision Log entry: "Planning Agent - Implemented Stage 1 with field selection and statistics" 

### Testing Requirements:
- [ ] Upload flow component tests pass
- [ ] Field selection state management tests pass
- [ ] Statistics accuracy verification tests pass
- [ ] Collapse/uncollapse behavior tests pass
- [ ] Context placeholder integration tests pass

### Testing:
- [ ] Upload flow validation
- [ ] Field selection state management
- [ ] Statistics accuracy verification
- [ ] Collapse/uncollapse behavior testing


### **USER VALIDATION CHECKPOINT** ⚠️
- [ ] **User has reviewed and approved Stage 1 implementation**

- [x] **Phase 3 Complete**

---

## Phase 4: Stage 2 - Data Categorization
**Objective:** Implement categorization interface and preview functionality

- [x] **Phase 4 Started**

### Step 4.1: Design Phase  
### Planning Agent → Yuki Handoff:
```
Design the Stage 2 categorization interface:

**Requirements:** [Extract Stage 2 section from requirements.md]

**Design Context:** @shared_project_context.md + established Stage 1 patterns 

**Key Interactions to Design:**
- Computer-friendly category proposal display
- LLM category selection and custom creation interface
- Two-column layout: category names + editable prompts
- Real-time preview functionality layout
- Category management system

**Mock Data:** @claude_stage2.json

**Dependencies:** Field selections from Stage 1

**REQUIRED DOCUMENTATION:** Update @shared_project_context.md with: 
- Component Patterns for categorization interface 
- Decision Log entry: "Yuki - Designed Stage 2 categorization and preview interface" 
- Integration Touchpoints with Stage 1 
```

- [x] **Yuki has provided complete Stage 2 design specifications**

### Step 4.2: Implementation Phase
### Planning Agent Actions:
1. [x] Write failing tests for Stage 2 component requirements (TDD Red phase)
2. [x] Build category creation and selection interface
3. [x] Implement two-column layout with editable prompts
4. [x] Create real-time preview functionality
5. [x] Integrate with Stage 1 field selection data
6. [x] Add custom category creation system
7. [x] Refactor and optimize while keeping tests passing (TDD Refactor phase)

**REQUIRED DOCUMENTATION:** Update @shared_project_context.md with:
- Completed Components section entry for Stage 2 
- Cross-Stage Dependencies final documentation 
- Decision Log entry: "Planning Agent - Implemented Stage 2 with categorization and preview" 

### Testing:
- [x] Category selection flow validation
- [x] Preview accuracy verification
- [x] Stage 1-2 data integration testing
- [x] Prompt editing functionality testing

### **USER VALIDATION CHECKPOINT** ⚠️
- [x] **User has reviewed and approved Stage 2 implementation**

- [x] **Phase 4 Complete**

---

## Phase 5: Integration & Final Testing
**Objective:** Connect all components and validate complete workflow

- [x] **Phase 5 Started**

### Planning Agent Actions:
1. [ ] Write failing tests for integration requirements (TDD Red phase)
2. [ ] Integrate all stages into complete user flow
3. [ ] Connect to existing Prompt Refiner (reference /prompt_tester/ for integration)
4. [ ] Comprehensive cross-stage testing
5. [ ] Final polish and optimization
6. [ ] Refactor and optimize while keeping tests passing (TDD Refactor phase)

**REQUIRED DOCUMENTATION:** Update @shared_project_context.md with:
- Final Integration Requirements documentation
- Quality Standards verification
- Decision Log entry: "Planning Agent - Completed full system integration and testing"

### Testing:
- [ ] End-to-end workflow validation
- [ ] Cross-stage data flow verification
- [ ] Performance optimization
- [ ] Integration test suite passes

### **USER VALIDATION CHECKPOINT** ⚠️
- [ ] **User has reviewed complete system and approved final delivery**

- [ ] **Phase 5 Complete**
- [ ] **PROJECT COMPLETE**

---

## Responsibility Separation

### Planning Agent (Code Implementation):
- Project structure and architecture decisions
- All code implementation and logic
- Data integration and state management
- Testing and technical validation
- Integration between components

### Yuki Design (UI/UX Specifications):
- All visual design decisions
- User interaction patterns
- Layout and spacing specifications
- Component behavior definitions
- Design system maintenance

### Shared Context: 
- `@shared_project_context.md` - maintained by both agents, updated after each phase 
- `@requirements.md` - source requirements document
- Mock data files in `/mock-data/` folder - consistent references using @filename format

---

## Handoff Quality Checklist

### For each Yuki handoff, Planning Agent must provide:
- [ ] Specific requirements extracted from main document
- [ ] Current design system context from @shared_project_context.md 
- [ ] Relevant mock data file references
- [ ] Clear deliverable expectations
- [ ] Dependencies from previous stages

### For each Yuki delivery, Planning Agent must verify:
- [ ] All required interactions have design specs
- [ ] Visual specifications are implementation-ready
- [ ] Design system updates are documented in @shared_project_context.md 
- [ ] Cross-stage consistency is maintained
- [ ] Decision Log entries are complete 

### Documentation Requirements for Both Agents: 
- [ ] Always update @shared_project_context.md after completing work 
- [ ] Add Decision Log entries with agent name and brief decision description 
- [ ] Update relevant definition sections when establishing new patterns 
- [ ] Mark Outstanding Decisions as resolved when completed 