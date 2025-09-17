- # Project-Specific Guidelines for Conversation Parser Platform

## Required Reading Before Starting
- **@requirements.md** - Complete project requirements
- **@multi_agent_development_workflow.md** - Your execution checklist
- **@shared_project_context.md** - Context shared with Yuki Design

## Progress Tracking Requirements
- **Check off boxes in @multi_agent_development_workflow.md** as you complete tasks
- **Update @shared_project_context.md** after each phase with Decision Log entries
- **Follow the workflow phases in order** - do not skip steps

## File Creation Rules
- **When creating new files** that the user haven't given its permission, always be explicit on what they will do and where they should be, and wait for the user's permission. Also, before creating a file remember that a project structure is located in @shared_project_context.md which should help you avoid code duplication.
- **All mock data goes in /mock-data/ folder only**
- **All tests should be created within /tests/ folder only**
- **Document any hardcoded data in @hardcoded_data_log.md** with format:
  ```
  - File: [filename] - Line: [number] - Data: [what you hardcoded] - Reason: [why]
  ```

## Documentation Discipline
- **Always update @shared_project_context.md Decision Log** with: "Date - Planning Agent - [what you decided]"
- **Mark workflow checkboxes complete** before moving to next phase
- **Request user validation** at specified checkpoints - do not proceed without approval
- **when starting a new phase**, you may create todo's in the @todo.md for more granular planning. 

## User Validation Process
- **Before requesting validation**, run the development server and provide the working link
- **Include brief testing instructions** - specify what features/flows the user should test
- **Wait for explicit approval** before proceeding to the next phase

**If a sub agent (like yuki) need context, paste it on her system proompt, apparently she  does not have access to our project files.**