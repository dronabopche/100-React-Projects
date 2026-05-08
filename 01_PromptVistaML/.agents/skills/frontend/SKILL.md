---
name: frontend-development
description: Helps with frontend React development tasks. Use when you need to build or modify React components.
---

# Frontend Development Skill

Detailed instructions for the agent regarding frontend development in the PromptVista ML project.

## When to use this skill

- Use this when building new React components in `src/components`.
- Use this when adding or modifying pages in `src/pages`.
- This is helpful for implementing UI logic, managing state, and handling routing with `react-router-dom`.

## How to use it

### Design Patterns
- **Functional Components**: Use functional components with standard React hooks (`useState`, `useEffect`, `useRef`).
- **Custom Hooks**:
  - `useReveal(threshold)`: Uses `IntersectionObserver` to trigger entrance animations.
  - `useTheme()`: Manages light/dark mode persistence and body class toggling.
- **Section-Based Architecture**: Pages like `Home.jsx` are structured into logical sections (Hero, Features, Workflow, etc.) wrapped in `<section>` tags.
- **Loading States**: Use skeleton screens (e.g., in `Models.jsx` or `Home.jsx`) to improve perceived performance.
- **Conditional Rendering**: Handle empty states (e.g., "No models found") with specific empty-state components or blocks.

### Conventions
- **Routing**: Define all routes in `src/App.jsx` using `react-router-dom`.
- **Imports**: Organize imports with React first, followed by third-party libs, then local components/services.
- **Props**: Use descriptive prop names and consider default values where appropriate.
- **Data Fetching**: Fetch data inside `useEffect` and handle loading/error states explicitly.
