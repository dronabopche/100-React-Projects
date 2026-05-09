---
name: animations-css
description: Helps with creating smooth animations and transitions using CSS @keyframes and React hooks.
---

# Animations (CSS & Hooks) Skill

Detailed instructions for the agent regarding the animation system in PromptVista ML, derived from `index.css` and component implementation.

## When to use this skill

- Use this when adding micro-interactions, page transitions, or scroll-triggered effects.
- This is helpful for maintaining the premium "PromptVista" aesthetic characterized by fluid, meaningful motion.

## How to use it

### Global Keyframes (defined in index.css)
- **`pv-up`**: The primary entrance animation. Slides an element up by 32px and fades it in. 
  - Usage: `animation: pv-up .85s cubic-bezier(.22,1,.36,1) forwards`.
- **`pv-grad`**: Animates the background position of gradients. Used for "living" borders and text.
  - Usage: Apply to elements with linear-gradients to create a shifting color effect.
- **`pulse`**: A standard opacity oscillation (1 to 0.5) for loading states and badges.
- **`gradientFlow`**: Used specifically for `gradient-flow-text` to create a continuous shimmer effect.

### Interactive Patterns
- **Lift-on-Hover**: Standard for `.card` and `.btn-primary`. Combines `transform: translateY(-5px)` with an increased `box-shadow` and `border-color` transition.
- **Glow Effects**: Use the `.pv-glow` class with radial gradients and `animation: pv-glow` (as seen in `Home.jsx`) to create ambient background depth.
- **Ticker Animation**: Use `pv-tick` for horizontal scrolling banners (e.g., the "Workflow" ticker).
- **Living Borders**: Many cards use a `::after` pseudo-element with a `pv-grad` animated gradient that becomes visible (`opacity: 1`) on hover.

### Animation Implementation
- **Intersection Observer**: Use the `useReveal` hook to apply animations only when elements enter the viewport.
- **Timeline Staggering**: Stagger animations for lists by adding an `animationDelay` based on the element index (e.g., `delay: idx * 0.05s`).
- **Performance**: Stick to `opacity` and `transform` for animations to ensure 60fps performance across devices.
- **Hover Disabling**: Be aware that `index.css` disables hover transforms on touch devices (`@media (hover: none)`) to prevent "stuck" hover states.

### Specific Animation Classes
- `.gradient-flow-text`: Shimmering gradient text.
- `.products-title-gradient`: Shifting gradient specifically for product headlines.
- `.pv-cursor`: Blinking block cursor for terminal simulations.
- `.pv-up`: General slide-up utility.
