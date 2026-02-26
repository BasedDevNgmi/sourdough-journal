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
        journal: {
          bg: 'rgb(var(--color-journal-bg) / <alpha-value>)',
          card: 'rgb(var(--color-journal-card) / <alpha-value>)',
          border: 'rgb(var(--color-journal-border) / <alpha-value>)',
        },
        ink: {
          main: 'rgb(var(--color-ink-main) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
          faint: 'rgb(var(--color-ink-faint) / <alpha-value>)',
        },
        crust: {
          light: 'rgb(var(--color-crust-light) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-crust) / <alpha-value>)',
          hover: 'rgb(var(--color-crust-hover) / <alpha-value>)',
        },
        sage: {
          light: 'rgb(var(--color-sage-light) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-sage) / <alpha-value>)',
          dark: 'rgb(var(--color-sage-dark) / <alpha-value>)',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'], // Elegant serifs
        sans: ['"SF Pro Display"', '"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px rgba(0,0,0,0.03)',
        'float': '0 10px 40px -10px rgba(0,0,0,0.06)',
        'toast': '0 10px 30px -5px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
}
