# Navbar Pattern

## Structure
- Uses `sticky top-0 z-50` to stay fixed at the top of the viewport.
- Contains a container `max-w-7xl mx-auto px-4 py-4`.
- Uses flexbox (`flex items-center justify-between`) to separate the logo/brand from the navigation links and action buttons.

## Aesthetic
- Background should be semi-transparent with a blur effect: `bg-white/80 dark:bg-gray-900/80 backdrop-blur-md`.
- Border at the bottom to distinguish from content: `border-b border-purple-400 dark:border-purple-800`.
- The logo uses an image and text next to it. Text should optionally use `.pv-grad-text` for the brand name, but currently uses standard bold text.

## Interaction
- Navigation links use `transition-colors duration-200`.
- Inactive links are `text-gray-700 dark:text-gray-400` and hover to `text-gray-900 dark:text-white`.
- Active links use the brand color: `text-purple-600 dark:text-purple-400`.
- The primary call to action (e.g., "Explore Models") uses the `.btn-primary` class.
