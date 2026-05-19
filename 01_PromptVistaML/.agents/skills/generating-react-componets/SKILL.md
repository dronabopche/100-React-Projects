---
name: generating-react-components
description: Guidelines and patterns for generating React components in the PromptVista ML project.
---

# Generating React Components Skill

When generating or modifying React components, strictly adhere to these architectural patterns and style rules derived from `index.css`. For full details, see the documentation in the `references/` directory.

### Navbar Pattern (`references/navbar-pattern.md`)
- **Structure**: Use `sticky top-0 z-50` or `fixed top-0 w-full`.
- **Aesthetic**: High-contrast background (white/`#0b0b0f`) with a `border-b` using `--border`.

### Search Bar Pattern (`references/searchbar-pattern.md`)
- **Structure**: Wrapped in `max-w-2xl mx-auto` with a `relative` container for the icon.
- **Aesthetic**: Standard `.input-field` with `pl-10` padding for the search icon.

### Home Page Pattern (`references/home-pattern.md`)
- **Structure**: Vertical stacks (`space-y-16`) with distinct sections. Hero section uses `min-h-[calc(100vh-80px)]`.
- **Aesthetic**: Utilize `.pv-grid` background and Intersection Observer (`useReveal`) for `.pv-up` animations.

### Card Layout Guides (`references/card-layout-guides.md`)
- **Tokens**: Favor `.boxy-card` for functional UIs and `.pv-card` for premium marketing/hero sections.

### Responsive Grid System (`references/responsive-grid-system.md`)
- **Layout**: Use standard `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` pattern.

### Tailwind Spacing Rules (`references/tailwind-spacing-rules.md`)
- **Sections**: Use `py-16` or `py-20` to separate major content areas.

### Modal Behavior Rules (`references/modal-behavior-rules.md`)
- **Overlay**: `bg-black/50 backdrop-blur-sm`.

### UI Design Standards (`references/ui.md`)
- **Colors**: Brand Black (#0b0b0f), Brand Purple (#6d28d9), Brand Yellow (#facc15).

### Hooks and Animations (`references/hooks-and-animations.md`)
- **Intersection Observer**: Use the custom `useReveal` hook for scroll-triggered `.pv-up` animations.
- **Counters**: Use the `Counter` component for animated numbers.

### Application Layout (`references/app-layout.md`)
- **Shell**: Use `BrowserRouter`, `Navbar`, and `Footer` surrounding `main` content area.
- **Theme**: Always wrap `App` in `min-h-screen bg-white dark:bg-[#0b0b0f] transition-colors duration-200`.

### Interactive Elements (`references/interactive-elements.md`)
- **Accordions**: Use the `.pv-faq-grid` and `.pv-faq-inner` CSS grid transition trick.
- **Badges**: Use `text-[10px] tracking-widest uppercase` for status and category tags.

### Page Templates (`references/page-templates.md`)
- **Structure**: Always follow the standard Hero -> Features/Bento -> Social Proof -> FAQ structure.
