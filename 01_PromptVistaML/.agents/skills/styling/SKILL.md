---
name: styling-tailwind
description: Helps with UI styling using Tailwind CSS. Use when you need to style components or create responsive layouts.
---

# Styling (Tailwind CSS) Skill

Detailed instructions for the agent regarding styling with Tailwind CSS and CSS Variables in PromptVista ML.

## When to use this skill

- Use this when applying styles, colors, and layouts to components.
- This is helpful for responsive design and maintaining the "PromptVista" minimalist yet premium aesthetic.

## How to use it

### Design Patterns
- **Utility-First with Tailwind**: Use Tailwind utility classes for layout, spacing, and responsive modifiers (e.g., `sm:`, `lg:`).
- **CSS Variable Theming**: All colors are driven by CSS variables defined in `index.css` (`:root` and `.dark`). Always use `var(--text)`, `var(--bg)`, etc., instead of hardcoding hex codes.
- **Global Component Classes**: Use predefined classes from `index.css`:
  - `.btn-primary`, `.btn-secondary`
  - `.card` (standard card with lift on hover)
  - `.input-field`
  - `.boxy-card`, `.boxy-button`, `.boxy-input` (for the "Architecture" and "ApiDocs" sections)
- **Fluid Typography**: Use `clamp()` for headlines to ensure they scale perfectly across all screen sizes (e.g., `text-[clamp(2rem,5vw,5rem)]`).
- **Brand Colors**:
  - Purple: `--brand-purple` (#6d28d9)
  - Yellow: `--brand-yellow` (#facc15)
  - Black: `--brand-black` (#0b0b0f)

### Conventions
- **Light/Dark Mode**: Always test styles in both modes. Dark mode is triggered by the `.dark` class on the `<html>` or `<body>` element.
- **Grid Backgrounds**: Use the `.pv-grid` class for the subtle dot/line background pattern.
- **Responsive Design**: Prioritize mobile-first layouts, ensuring all sections are readable on small screens.
- **No Rounding Reset**: For sections like `ApiDocs`, use specific selectors to reset border-radius (e.g., `#root .max-w-7xl * { border-radius: 0 !important; }`).
