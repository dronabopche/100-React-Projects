# Card Layout Guides

## Standard Cards (`.boxy-card`)
- Used for standard UI elements and functional containers.
- **Structure**: `border: 1px solid var(--border)`, `background: white` (or dark equivalent).
- **Shadow**: `box-shadow: 4px 4px 0px var(--border)`.
- **Hover**: Transforms slightly `translate(-2px, -2px)` and changes shadow color `box-shadow: 8px 8px 0px var(--brand-purple)`.
- **Padding**: Usually `p-6`.

## Premium Cards (`.pv-card`)
- Used for hero sections, featured items, and the main model catalog.
- **Structure**: `border: 1px solid var(--border)`, `background: var(--card-bg)`.
- **Hover Lift**: `transform: translateY(-5px)`.
- **Hover Glow**: Uses a subtle purple glow `box-shadow: 0 18px 36px rgba(139,92,246,.1)` and changes border color.
- **Animated Border Effect**: Uses an `::after` pseudo-element with `animation: pv-grad` to create a glowing border effect on hover.

## Content Layout
- Use flexbox or grid to align content inside.
- Headers are usually `text-lg font-semibold`.
- Descriptions should use line clamping if they can be long: `line-clamp-3`.
- Include subtle interaction cues like arrows that appear or move on hover.
