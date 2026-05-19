# Page Templates

When generating an entire page, follow this structural template.

## 1. Hero Section
- Must be the first section.
- Use `min-h-[calc(100vh-80px)]` to take up the screen.
- Include background textures (`.pv-grid`) and decorative elements (floating orbs `.pv-glow`, floating code snippets `.pv-f1`).
- Title uses `text-5xl sm:text-7xl font-bold` with parts wrapped in `.pv-grad-text`.
- Primary and secondary CTAs below the description.
- Tech stack badges or a stats grid (`grid-cols-2 sm:grid-cols-4`) directly underneath.

## 2. Features / Bento Grid
- Use the `useReveal` hook to animate cards in sequentially.
- Structure cards using CSS Grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).
- Cards must use the `.pv-card` or `.boxy-card` tokens from `index.css`.
- Each card should have an SVG icon, a bold title, and muted description text.

## 3. Workflow / Steps
- Display a logical progression (e.g., How it works).
- Often uses a horizontal connecting line on desktop (`.pv-step-line` from CSS).
- Step numbers should be highly visible (e.g., `text-brand-purple`).

## 4. Testimonials or Social Proof
- Three-column grid using `.pv-card`.
- Include a large quote mark (`"`) with low opacity in the background.
- Include user avatars (or SVG icons if avatars aren't available).

## 5. FAQ Section
- Use the Accordion pattern defined in `interactive-elements.md`.
- Keep the width constrained to `max-w-3xl mx-auto` for readability.

## 6. Footer CTA (Optional)
- A final push before the actual footer.
- Distinct background gradient or heavy borders to stand out from the rest of the page.
- Large button `btn-primary`.
