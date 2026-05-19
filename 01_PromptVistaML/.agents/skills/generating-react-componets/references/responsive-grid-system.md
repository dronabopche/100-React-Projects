# Responsive Grid System

## Standard Breakpoints
- **Mobile First**: Default layout should be single-column (`grid-cols-1`).
- **Tablet**: Use `sm:` (640px) or `md:` (768px) to switch to two columns (`sm:grid-cols-2`).
- **Desktop**: Use `lg:` (1024px) to switch to three columns (`lg:grid-cols-3`).

## Gaps
- Use consistent spacing between grid items.
- Standard gaps are `gap-5` or `gap-6`.
- Example: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`.

## Containers
- Grids should typically be wrapped in a container that restricts maximum width and provides horizontal padding.
- Standard wrapper: `max-w-7xl mx-auto px-4`.
