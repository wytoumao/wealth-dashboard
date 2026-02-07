/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0e1a',
          card: '#131825',
          border: '#1f2937',
        },
        light: {
          bg: '#f5f7fa',
          card: '#ffffff',
          border: '#e5e7eb',
        }
      }
    },
  },
  plugins: [],
}
