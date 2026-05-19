# Application Layout and Routing

## App Shell
The main `App.jsx` should provide the routing context and theme context.
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
// Import pages...

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-[#0b0b0f] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Additional routes */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
export default App
```

## Dark Mode Strategy
- Use Tailwind's `dark:` variant everywhere.
- The root `div` must have `min-h-screen`, `bg-white dark:bg-[#0b0b0f]`, and `text-gray-900 dark:text-gray-100`.
- The `transition-colors duration-200` ensures smooth theme switching.
- Always implement a `ThemeToggle` component in the `Navbar`.

## Container Wrapping
All page content should be wrapped in standard containers unless it is a full-bleed background section (like a Hero).
- Standard Wrapper: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Narrow Wrapper (for articles/docs): `max-w-4xl mx-auto px-4`.
