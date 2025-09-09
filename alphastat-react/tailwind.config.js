/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#3B82F6',
        'neutral-dark': '#4B5563',
        'neutral-light': '#E5E7EB',
        'accent-green': '#10B981',
        'accent-red': '#EF4444',
        // Garder les couleurs par défaut de Tailwind
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          // ... autres nuances de gray
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
