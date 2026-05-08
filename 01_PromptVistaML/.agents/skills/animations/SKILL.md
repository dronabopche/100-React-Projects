---
name: animations-css
description: Helps with creating smooth animations and transitions using CSS @keyframes and React hooks.
---

# Animations (CSS & Hooks) Skill

Detailed instructions for the agent regarding animations and micro-interactions in PromptVista ML.

## When to use this skill

- Use this when adding page transitions, hover effects, or scroll-triggered animations.
- This is helpful for creating the premium, fluid motion feel of the platform without external heavy libraries.

## How to use it

### Design Patterns
- **CSS @keyframes**: Define custom animations in a `<style>` tag within the component or in `index.css`. Standard animations include:
  - `pv-up`: Slide up and fade in.
  - `pv-glow`: Pulsing background glow.
  - `pv-tick`: Horizontal scrolling for the ticker.
  - `pv-grad`: Animating gradients on text or cards.
- **Scroll-Triggered Animations**: Use the `useReveal` hook to detect when an element enters the viewport and apply the animation class (e.g., `pv-up`).
- **Animated Counters**: Use the `Counter` component for incrementing numbers (stats) when they become visible.
- **Hover Transitions**: Apply `transition-all duration-200` to buttons and cards. Use `transform: translateY(-5px)` and `box-shadow` changes for the "lift" effect.

### Conventions
- **PV Prefix**: Prefix all custom animation classes and keyframes with `pv-` (e.g., `.pv-card`, `@keyframes pv-up`).
- **Ambient Effects**: Use "Ambient Orbs" (radial gradients with `pv-glow`) to add depth to the background of hero sections.
- **Terminal Animation**: Use the `.pv-cursor` class for a blinking block cursor effect in technical walkthroughs.
- **Performance**: Use `will-change` or `transform/opacity` properties primarily to ensure 60fps animations. Avoid animating layout-breaking properties like `width` or `height` where possible.
