/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#f5f3ff',
          500: '#9b1af1',
          600: '#5d148e',
        },
        yellow: {
          500: '#fff52e',
        }
      }
    },
  },
  plugins: [],
}