/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand — Deep Indigo
        primary: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
        },
        // AI accent — Electric Teal
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
        // Sidebar background
        sidebar: '#1E293B',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
}
