# Search Bar Pattern

## Structure
- Wrapped in a container to limit width: `w-full max-w-2xl mx-auto`.
- Uses a relative container to position the search icon absolutely within the input field.

## Input Field
- Uses the standard `.input-field` class for base styling.
- Additional padding to accommodate the icon: `pl-10 pr-4 py-3`.
- Icon is positioned absolutely on the left: `absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`.

## Interaction
- Uses an SVG icon for visual cues.
- Should implement debouncing (e.g., 300ms) to avoid excessive API calls or state updates while the user is typing.
- Clear button (optional) can be positioned absolutely on the right if needed.
