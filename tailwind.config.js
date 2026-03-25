/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy:   { 950:'#041820', 900:'#062433', 800:'#0A3347' },
        blue:   { 50:'#E6F8FD', 200:'#A0DFEF', 400:'#28B6E8', 600:'#1580A8', 800:'#0A4D65' },
        lime:   { 50:'#F0FDE0', 200:'#BDEF7A', 400:'#6DDF1A', 600:'#47A00F', 800:'#265807' },
        gray:   { 50:'#F4F7F9', 200:'#D0DDE3', 400:'#9EB3BE', 600:'#3D5A67', 900:'#1A2E37' },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}