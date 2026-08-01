/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          bg: '#0B0F19', // Very dark blue/black background
          panel: '#151B2B', // Slightly lighter panel background
          border: '#232D42', // Border color
          accent: '#6366F1', // Primary purple/indigo accent
          'accent-hover': '#4F46E5', // Hover state
          success: '#10B981', // Green for high scores
          warning: '#EF4444', // Red for low scores
          text: '#F8FAFC', // Primary text
          'text-muted': '#94A3B8' // Secondary text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
