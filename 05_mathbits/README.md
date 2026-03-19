# MathBits ∑

> A minimal dark-themed component showcase for mathematically generated UI —  
> inspired by ReactBits, built with Vite + React + Tailwind + Supabase.

---

## Features

- **Landing page** with animated canvas grid → routes to `/home`
- **Left sidebar** navigation (no top navbar)
- **4 categories**: Backgrounds · Color Checker · Text Animations · Animations
- **Live preview** via sandboxed `<iframe srcDoc>`
- **View & copy code** toggle per component
- **Supabase** integration with automatic mock-data fallback
- **⭐ Star on GitHub** button in top-right
- Fully dark, minimal, monospace-accented UI

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Run in mock mode (no Supabase needed)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Supabase Setup (optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase_schema.sql`
3. Update `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_USE_MOCK=false
   ```
4. Insert rows via Supabase Table Editor or SQL:
   ```sql
   INSERT INTO backgrounds (name, description, code, tags)
   VALUES ('My Component', 'Description here', '<html>...</html>', ARRAY['canvas','math']);
   ```

---

## Project Structure

```
src/
├── pages/
│   ├── Landing.jsx          # Hero page with canvas background
│   └── Home.jsx             # Main layout: sidebar + component grid
├── components/
│   ├── Sidebar.jsx          # Left nav with category links
│   ├── ComponentCard.jsx    # Preview iframe + code toggle + copy
│   └── SkeletonCard.jsx     # Loading skeleton
├── lib/
│   ├── supabase.js          # Supabase client + fetchComponents()
│   └── useComponents.js     # Hook: Supabase fetch with mock fallback
├── data/
│   └── mockData.js          # 12 built-in math components
├── App.jsx                  # Router (/ and /home)
├── main.jsx
└── index.css
supabase_schema.sql          # SQL to set up all 4 tables
.env.example                 # Environment variable template
```

---

## Adding Components

### Via mock data (`src/data/mockData.js`)
Add an entry to the relevant array:
```js
{
  id: 5,
  name: 'My Background',
  description: 'A cool math animation.',
  tags: ['canvas', 'math'],
  code: `<!DOCTYPE html>...<script>/* your self-contained code */</script>`,
}
```

### Via Supabase
Insert a row into the matching table (`backgrounds`, `color_checker`, `text_animations`, `animations`).  
The `code` field must be a **self-contained HTML string** — no external CDN required (or use CDN links inside the HTML).

---

## Component Code Format

Each component's `code` field is a **complete HTML document** that runs inside a sandboxed iframe:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    body { background: #080b10; width: 100vw; height: 100vh; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    // Your self-contained math animation
    const canvas = document.getElementById('c');
    // ...
  </script>
</body>
</html>
```

**Rules:**
- Must be fully self-contained (no imports from parent page)
- May use `<script src="https://cdnjs...">` for CDN libs
- Canvas size: use `window.innerWidth` / `window.innerHeight`
- Sandbox: `allow-scripts` only (no `allow-same-origin`)

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | — |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | — |
| `VITE_USE_MOCK` | Force mock data (`true`/`false`) | `true` |

---

## Tech Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- [Tailwind CSS v3](https://tailwindcss.com/)
- [React Router v6](https://reactrouter.com/)
- [Supabase JS v2](https://supabase.com/docs/reference/javascript)
- Fonts: [Syne](https://fonts.google.com/specimen/Syne) · [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) · [DM Sans](https://fonts.google.com/specimen/DM+Sans)

---

## License

MIT
