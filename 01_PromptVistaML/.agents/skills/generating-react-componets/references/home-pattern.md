# Home Page Pattern

## Structure
- Built with distinct, full-width sections stacked vertically.
- Container padding is usually managed within the sections or a master wrapper.
- Uses `space-y-16 sm:space-y-20` to separate major sections.

## Hero Section
- Minimum height to fill viewport `min-h-[calc(100vh-80px)]`.
- Uses `.pv-grid` background for the technical aesthetic.
- Includes ambient orbs or `.pv-glow` effects in the background.
- Typography: Large, bold headings (`text-5xl md:text-7xl`), often utilizing `.pv-grad-text` for key phrases.
- Call to Actions (CTAs): Stacked on mobile, side-by-side on larger screens, using `.btn-primary` and `.btn-secondary`.

## Content Sections
- Include headers with a specific pattern:
  - Eyebrow text: `text-xs font-semibold tracking-widest text-brand-purple uppercase mb-3`.
  - Main Title: `text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--text)]`.
  - Subtitle: `text-[color:var(--muted-text)]`.
- Use the `.pv-card` or bordered panels (`border border-[color:var(--border)] bg-[color:var(--panel)]`) for section content.

## Animations
- Heavily relies on Intersection Observer (`useReveal` hook) to trigger animations when scrolling into view.
- Elements slide up and fade in using the `.pv-up` animation class or inline equivalents.
