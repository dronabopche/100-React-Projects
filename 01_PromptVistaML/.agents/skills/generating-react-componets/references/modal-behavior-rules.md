# Modal Behavior Rules

## Overlay
- Background should obscure the main content to focus user attention.
- Standard style: `bg-black/50 backdrop-blur-sm`.
- Should be fixed, covering the entire viewport (`fixed inset-0 z-50`).

## Modal Container
- Follows the Boxy-UI aesthetic.
- Must have sharp corners: `rounded-none`.
- Uses high-contrast borders and shadows: `border 2px solid var(--border-color)` and `box-shadow: var(--shadow-xl)`.
- Should be centered within the overlay (e.g., using flexbox on the overlay wrapper).

## Interaction
- Close actions must be clearly visible, often a high-contrast 'X' button in the top right.
- Close buttons should have hover states, typically turning red (`#ef4444`) or using the brand purple.
- Modal entry should be animated, e.g., a quick `slideUp` or `fadeIn` animation (`animation: slideUp 0.3s ease`).
