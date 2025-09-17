# Conversation Parser Platform - Development Requirements

## Project Context
We are designing the UI of a platform where users can parse years of personal information for LLMs. We'll take on some guidelines from a document we've already designed. I want you to take these requirements and pass them to yuki-designer to create a plan to code them. As we are in a design mode, please create mock JSON data for testing. Keep all these files in the same folder /mock-data so we can remove it afterwards.

We are only focusing only on UI, you should not create any backend developments. 

## Technical Stack
- Use shadcn MCP for components
- Use lucide package for icons 
- Use framer motion if needed (but if a functionality is already contained within a component avoid overcomplicating it.)
- Set a Next.js project

The user will see: (1) a Main Dashboard, where they can manage their parsing projects, (2) Prompt Refiner where they test/refine their prompts, (3) Parsing flow: users upload files to be parsed, where they select fields and give instructions to an llm to parse.

**Note:** The Prompt Refiner has already been developed (see /prompt_tester/ files). The design can be referenced but the structure/logic may need adjustments for integration. Navigation from Main Dashboard to Prompt Refiner should be implemented.

Details:

## Main Dashboard
**Objective:** Entry point for users to manage their parsing projects

### Display Elements:
- **Summaries of previously parsed information:** Show recent projects with key metrics (file count, categories created, processing date) - **clickable but won't do anything else for now**
- **Processing status for ongoing API operations:** Batch processing status with percentage completion and estimated time remaining - **clickable but won't do anything else for now**
- **Parse new data button:** Primary CTA to start new data processing flow -- this should be more prominent, either by color or size, depending on yuki's guidelines.  

### Upload Methods:
- **Clickable upload button:** Primary CTA to start upload new data flow
- **Direct drag-and-drop:** Power user shortcut that goes directly to Stage 1. When hovered there's some visual feedback

## Stage 1: File Upload and Selection
**Objective:** User uploads data and selects relevant fields for processing. 

### Upload Interface:
- Drag and drop interface for file upload. When hovered there's some visual feedback
- Support JSON files (primary focus for now)
- Back navigation available at top left
- **Context input panel (right side):** Plain English text area where users describe their data. Once the user uploads a file, it automatically displays a contextual placeholder (italic text, opacity 0.6) based on file type detection using @context_placeholders.json. The system analyzes uploaded JSON structure against detection rules to show the appropriate placeholder text. Users can edit or replace this generated placeholder.


### File Preview and Field Selection:
Once the user uploads a file:
- **Smart field categorization:** Apply visual treatment based on field analysis from @claude_stage1.json - fields marked as computer_friendly get blue color, llm_friendly get warm color
- **File structure preview:** Show 2 examples of the uploaded data structure immediately after upload. the fields have the aformentioned colors, while the raw data have a simpler color to make the difference clear. 
- **Field selection interface:** Users can un-select fields for the processing pipeline, once they do, those fields are hidden from the examples to the right (raw data)
    -   When field is unselected, make it appear dimmed (opacity 0.4) in the left structure and hide corresponding data completely from right examples. Simple visual feedback without complex animations.



### JSON Parent-Child Aggregation:
**Collapse functionality:** For the `messages` field, make the field background a distinct color (different from other fields). On hover, change to a secondary color + tooltip shows 'Collapse' or 'Uncollapse'. When collapsed:
- Messages display as simplified format: `"user": "message content..."`, `"assistant": "response content..."` 
- Show indicator message: "Collapsed - entire conversation will be tagged as one unit"
- All conversation-level metadata remains visible

When uncollapsed:
- Messages display as individual objects with full metadata
- Show indicator message: "Expanded - individual messages available for separate processing"

The distinct field color immediately signals this field has special collapse behavior, and the hover interaction makes the action discoverable without cluttering the interface with additional buttons.

### Processing Statistics:

- Display at the bottom, updating in real-time as fields are selected/deselected: conversation count, interaction count, token count
- When messages field is collapsed: show "3 conversations" instead of individual interaction count to reflect conversation-level processing
- When messages field is uncollapsed: show actual interaction count (e.g., "26 interactions") to reflect message-level processing available
- Use mock data from @claude_stage1_statistics_scenarios.json for different selection scenarios

### Stage Navigation:
- **Continue button** to proceed to Stage 2
- **Error states:** aesthethic red and basic styling for now when something went wrong.

----------
## Stage 2: Data Categorization
**Objective:** Users will give context to the LLM on how to create the tags of their personal data. They can see proposals from their computer friendly categories or some LLM proposals they can select. Also they have a place where they can write and press enter to create new categories.

### Category Creation Interface:
- **Computer-friendly category proposals:** Click-to-select existing field-based categories depending on the file (contact names: mom, girlfriend, boss)
- **LLM category proposals:** Pre-suggested content-based categories (business, personal relationships, personal growth) with click-to-include functionality. Once clicked, they appear in the selected categories area.
- **Custom category creation:** Text input where users can write and press enter to create new categories. Placeholder: "e.g., work_projects, family_discussions"

### Category Configuration:
- **Two-column layout:** Category names on left (bold, not dimmed), editable prompts on right (dimmed text)
- **Editable prompts:** Each LLM category shows dimmed prompt text that will be used for tagging decisions. For example, "personal_growth" → "choose this option if I'm learning something new". Users can click and edit this field.
- **Prompt editing interaction:** 
  - Hover makes text darker and shows it's clickable
  - Click to edit the prompt
  - Clicking outside or pressing enter saves the editing

### Preview Functionality:
- **LLM category preview:** When users select a category, preview updates immediately showing 1-2 conversations with their resulting tags (pre-processed mock data)
- **Mock processing results:** Show examples like "conversation: 'Hey claude I want to learn more about linting' → tags: 'Coding', 'personal_growth'" using @claude_stage2.json

### Additional Options:
- Skip categorization button - proceeds directly to next stage
- Bottom message in italic: "Each new category will create an .md file"

This keeps the layout and interaction patterns clear for the coding agent while maintaining the flexibility you want for testing the UX flow.
## Mock Data Requirements
- Create sample JSON conversation files
- Include variety of field types (computer-friendly and LLM-friendly)
- Sample categorization results for preview functionality
- Store all mock data in /mock-data folder for easy removal
