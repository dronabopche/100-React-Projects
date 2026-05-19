---
name: antigravity-design-system
description: Defines the core aesthetic and technical rules for the PromptVista "Antigravity" Design System. Use this to ensure all UI components follow the high-contrast, boxy, developer-centric aesthetic.
---

# Antigravity Design System Skill

This skill defines the visual identity and implementation patterns for the PromptVista ML platform.

## Core Aesthetic Principles (Boxy-UI)
1.  **Zero Rounding**: Absolutely no `border-radius`. All corners must be sharp. Use `border-radius: 0 !important` to override legacy Tailwind classes.
2.  **High Contrast Borders**: Use consistent 1px or 2px solid borders.
    - Light Mode: `border-gray-200` or `brand-black`.
    - Dark Mode: `border-gray-800` or `brand-purple`.
3.  **Monochromatic Base**: Primary background and text should favor whites, grays, and `brand-black` (#0b0b0f).
4.  **Strategic Accents**:
    - **Brand Purple** (#6d28d9): Primary actions, active states, and technical highlights.
    - **Brand Yellow** (#facc15): Status indicators and secondary accents.
5.  **Technical Textures**: Use the `.pv-grid` (40px square grid) or `.pv-grid-dots` utilities for background depth on cards and headers.

## Centralized CSS Architecture
All design tokens and common components are centralized in `src/index.css`. Avoid inline Tailwind classes for structural design; use these semantic utilities instead:

### Component Classes
- `.boxy-card`: Standard sharp-bordered container with subtle hover lift and glow.
- `.boxy-button`: High-contrast button with monochromatic hover states.
- `.boxy-input`: Sharp-edged input fields with high-contrast focus rings.

### Documentation Components (`.pv-docs-*`)
- `.pv-docs-page`: Main documentation layout container.
- `.pv-docs-sidebar`: Sticky sidebar with active state markers.
- `.pv-docs-badge`: High-contrast, monochromatic badges for metadata.
- `.pv-docs-endpoint`: Terminal-style API endpoint container.
- `.pv-docs-table`: Standardized documentation tables with sharp borders and header highlights.


## Constraints & Rules
- **NEVER** use `rounded-*` classes in the documentation or model detail sections.
- **NEVER** use soft shadows; favor solid 1px/2px borders or glow effects.
- **STAY IN CSS**: Favor centralized classes in `index.css` over ad-hoc Tailwind strings for component logic.
