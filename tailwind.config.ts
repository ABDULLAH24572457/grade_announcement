import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#07111f',
        surface: '#0d1b2e',
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63'
        },
        accent: '#f2c94c'
      },
      fontFamily: {
        sans: ['Tahoma', 'Arial', 'sans-serif']
      },
      boxShadow: {
        glow: '0 20px 70px -30px rgba(34, 211, 238, 0.45)'
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(circle at top, rgba(34, 211, 238, 0.11), transparent 42%)'
      }
    }
  },
  plugins: []
} satisfies Config
