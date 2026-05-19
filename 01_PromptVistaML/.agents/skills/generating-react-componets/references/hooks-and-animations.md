# Hooks and Animations

## 1. Intersection Observer (`useReveal`)
This project heavily relies on scroll-triggered animations. An agent should always generate a `useReveal` hook for pages with long content.
```javascript
import { useEffect, useState, useRef } from 'react'

export function useReveal(threshold = 0.05) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}
```
**Usage**: Apply `opacity: visible ? 1 : 0` and `animation: visible ? 'pv-up .85s ease forwards' : 'none'` to the element.

## 2. Animated Counter
Used for stats sections.
```javascript
export function Counter({ target, suffix = '', duration = 1600 }) {
  const [val, setVal] = useState(0)
  const [ref, visible] = useReveal(0.3)
  useEffect(() => {
    if (!visible) return
    const n = parseInt(target)
    if (isNaN(n)) { setVal(target); return }
    let cur = 0
    const step = Math.max(1, Math.ceil(n / (duration / 16)))
    const t = setInterval(() => {
      cur = Math.min(cur + step, n)
      setVal(cur)
      if (cur >= n) clearInterval(t)
    }, 16)
    return () => clearInterval(t)
  }, [visible, target, duration])
  return <span ref={ref}>{typeof val === 'number' ? val + suffix : val}</span>
}
```

## 3. CSS Animations (from index.css)
Always utilize these pre-defined animations instead of inline Tailwind arbitrary values:
- `.pv-up`: Slide up and fade in.
- `.pv-f1` & `.pv-f2`: Floating animations for background/decorative elements.
- `.pv-glow`: Pulsing glow effect for decorative orbs.
- `.pv-ticker`: Infinite horizontal scrolling (requires `.pv-ticker-wrap` parent with `overflow: hidden`).
- `.pv-grad-text`: Animated gradient text (Purple -> Yellow -> Light Purple).
