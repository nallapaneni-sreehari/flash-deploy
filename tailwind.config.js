/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        surface: 'var(--surface-ground)',
        card: 'var(--surface-card)',
        text: 'var(--text-color)',
        border: 'var(--surface-border)',
      }
    },
  },
  darkMode: 'class', // or 'media' if you prefer
  plugins: [],
}
