/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0C1826',
          800: '#13273B',
          700: '#1C3850',
        },
        cyan: {
          DEFAULT: '#15A6CC',
          bright:  '#24C5E8',
          dark:    '#0C7A96',
          50:      '#E6F8FD',
        },
        lime: {
          DEFAULT: '#86E05A',
          dark:    '#1C9742',
          50:      '#F0FDE0',
        },
        green: {
          DEFAULT: '#2FBE57',
          dark:    '#1C9742',
        },
        violet: {
          DEFAULT: '#6B5BE6',
          dark:    '#4F3FCB',
        },
        red: {
          50:  '#fff0ef',
          100: '#ffdad7',
          200: '#ffb3ae',
          300: '#ff8880',
          400: '#f05040',
          500: '#c20a00',
          600: '#a00800',
          700: '#870700',
          800: '#6e0500',
          900: '#3d0300',
        },
        // Legacy aliases for existing code
        blue:   { 50:'#E6F8FD', 200:'#A0DFEF', 400:'#24C5E8', 600:'#0C7A96', 800:'#0A4D65' },
        gray:   { 50:'#F4F7F9', 200:'#E4EBF1', 400:'#8597A6', 600:'#637789', 900:'#0E1C2B' },
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}