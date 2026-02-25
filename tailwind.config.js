/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        journal: {
          bg: '#F5F5F0', // Slightly deeper warm parchment
          card: 'rgba(255, 255, 255, 0.85)',
          border: 'rgba(232, 230, 225, 0.6)',
        },
        ink: {
          main: '#1C1B1A',
          muted: '#6E6C68',
          faint: '#A6A49F',
        },
        crust: {
          light: '#DE9E63',
          DEFAULT: '#C17A3D', // Sourdough crust accent
          hover: '#A96831',
        },
        sage: {
          light: '#EBECE9',
          DEFAULT: '#899E8B', // Soft natural green
          dark: '#5C6C5E',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 8px 30px rgba(0,0,0,0.03)',
        'float': '0 20px 40px -10px rgba(0,0,0,0.08)',
        'toast': '0 10px 40px -5px rgba(0,0,0,0.12)',
        'fab': '0 12px 30px -4px rgba(193, 122, 61, 0.3)', // Glow for the + button
      },
      animation: {
        'blob': 'blob 15s infinite alternate',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
