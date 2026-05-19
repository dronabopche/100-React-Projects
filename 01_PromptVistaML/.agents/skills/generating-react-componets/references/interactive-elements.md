# Interactive Elements

## Accordions / FAQ
Do not use generic unstyled divs. Use the "Boxy" aesthetic.
- **State**: Use a numerical or string index to track the open item (`const [openFaq, setOpenFaq] = useState(null)`).
- **Trigger**: A button that fills the width `w-full flex items-center justify-between py-5`.
- **Icon**: Use a plus icon (`Icon.plus`) that rotates 45 degrees when open: `transform: open ? 'rotate(45deg)' : 'rotate(0deg)'`.
- **Body Animation**: Use CSS grid transitions for smooth height animation.
  ```css
  .pv-faq-grid { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s cubic-bezier(.22,1,.36,1); }
  .pv-faq-grid.open { grid-template-rows: 1fr; }
  .pv-faq-inner { overflow: hidden; }
  ```

## Tab Interfaces
Used for API Docs or Code snippet switchers.
- **Triggers**: Flex row with `border-b` container. Active tab has `border-brand-purple` and `text-brand-purple`. Inactive tabs have transparent borders and `text-muted`.
- **Content**: Mount/Unmount or use hidden classes based on the active tab state.

## Badges and Tags
Used for categories, statuses, or model parameters.
- **Style**: Use small text (`text-[10px]` or `text-xs`), uppercase, wide tracking (`tracking-widest`), and bold fonts.
- **Colors**:
  - Purple/Primary: `bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200`
  - Yellow/Warning: `bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200`
  - Neutral/Mono: `font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700`
