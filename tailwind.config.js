/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Kanso Light Theme
        kanso: {
          bg: '#F9F8F6',
          surface: '#EFECE5',
          text: '#34302D',
          muted: '#898481',
          border: 'rgba(52, 48, 45, 0.08)',
        },
        // Kanso Dark Theme
        kansoDark: {
          bg: '#0F0F0F',
          surface: '#1A1A1A',
          text: '#EDEDED',
          muted: '#888888',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        // Clay/Terracotta Accent
        clay: {
          400: '#D98661',
          500: '#CC6E43',
          600: '#B85A32',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
      },
      fontFamily: {
        sans: ['Prompt', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 20px 40px -12px rgba(60, 50, 40, 0.1)',
        'soft-dark': '0 20px 40px -12px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}

