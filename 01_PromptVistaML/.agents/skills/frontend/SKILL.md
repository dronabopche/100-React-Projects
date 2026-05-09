---
name: frontend-development
description: Helps with frontend React development tasks. Use when you need to build or modify React components.
---

# Frontend Development Skill

Detailed instructions for the agent regarding frontend development in the PromptVista ML project, focusing on styling integration and component architecture.

## When to use this skill

- Use this when building new React components in `src/components`.
- Use this when adding or modifying pages in `src/pages`.
- This is helpful for ensuring components adhere to the global design system defined in `index.css`.

## How to use it

### Styling & Component Patterns (from index.css)
- **Standard UI Components**: Always use the following classes instead of raw Tailwind whenever possible:
  - `btn-primary`: The main action button (variable-driven background, shadow-sm, hover effects).
  - `btn-secondary`: The ghost/outline button variant.
  - `card`: Standard container with lift-on-hover effect, custom borders, and shadows.
  - `input-field`: Standardized form input styling.
- **Boxy Mode**: For technical or architectural sections (like `ApiDocs` or `Architecture`), use the "Boxy" variants which remove rounding:
  - `boxy-card`, `boxy-button`, `boxy-input`.
- **Responsive Typography**: Use the `clamp()` utility in Tailwind to ensure headers scale smoothly (e.g., `text-[clamp(1.5rem,5vw,3rem)]`).
- **Brand Identity**: Use brand text and background helpers:
  - `.text-brand-purple`, `.text-brand-yellow`, `.text-brand-light-purple`, `.text-brand-black`.
  - `.bg-brand-purple`, `.bg-brand-yellow`, etc.

### Core Architecture
- **Hook Integration**: Use `useReveal` for entrance animations on sections.
- **Theme Awareness**: Ensure components respect the `dark` class which updates CSS variables for backgrounds, text, and borders.
- **Loading UI**: Implement skeleton loaders using the `var(--skeleton)` variable and the `animate-pulse` utility.
- **Boxy Reset**: Be aware that in `ApiDocs` sections, rounding is often forced to `0 !important` via the `#root .max-w-7xl *` selector in `index.css`.

### Conventions
- **SVG Icons**: Prefer inline SVG icons with consistent `strokeWidth` (usually 1.5 or 2).
- **Conditional Styling**: Use the `.disabled` class for product cards or buttons that lack active links.
- **Grid Backgrounds**: Use `.pv-grid` for section backgrounds to add technical depth.
