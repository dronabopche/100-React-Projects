# UI Design Standards

## Color Palette
- **Brand Black**: `#0b0b0f` - Primary dark background.
- **Brand Purple**: `#6d28d9` - Primary action color, hover states, gradients.
- **Brand Light Purple**: `#c4b5fd` - Dark mode accent equivalent.
- **Brand Yellow**: `#facc15` - Secondary accent, often used in gradients with purple.

## Typography
- Primary fonts are standard sans-serif.
- Functional elements (IDs, metadata, technical labels) should use monospace (`font-mono`).
- Heavy use of muted text (`--muted-text`) to establish visual hierarchy against primary text (`--text`).

## Components
- **Buttons**:
  - Primary: Solid background (black in light mode, purple in dark mode), sharp borders.
  - Secondary: Transparent background, bordered, changes border color on hover.
- **Inputs**: Sharp edges (`.boxy-input`), distinct focus rings in brand colors.

## The "Boxy" Aesthetic
- Zero `border-radius`. Everything is a rectangle.
- Defined by explicit 1px or 2px borders rather than soft drop shadows.
- Uses grid backgrounds (`.pv-grid`, `.pv-grid-dots`) to reinforce the technical/developer tool identity.
