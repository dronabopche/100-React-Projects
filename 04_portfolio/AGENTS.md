# Agent Instructions & Guidelines

## 1. Do Not Run Build or Lint Commands
- **Never** execute `npm run build`, `npm run lint`, or equivalent build/lint commands automatically.
- Only run build/lint commands if the user explicitly asks for it.

## 2. No Browser Automation or Screenshot Taking
- **Never** invoke the browser subagent (`browser_subagent`) or any browser tool to open URLs, inspect pages, take screenshots, or record browser sessions.
- Do not attempt automated visual verification in the browser; the user handles all browser previews and manual verification directly.
