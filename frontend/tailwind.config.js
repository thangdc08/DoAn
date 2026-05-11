/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          green:      '#00A651',
          'green-dark': '#007A3D',
          'green-light': '#E6F7EF',
          blue:       '#005BAC',
          'blue-dark': '#003F7D',
          lime:       '#B6E900',
          orange:     '#FF7A00',
        },
        app: {
          bg:       '#F7FAFC',
          surface:  '#FFFFFF',
          text:     '#0F172A',
          muted:    '#64748B',
          border:   '#E2E8F0',
        },
        status: {
          success:  '#22C55E',
          warning:  '#F59E0B',
          error:    '#EF4444',
          info:     '#3B82F6',
          pending:  '#A855F7',
        },
      },
      borderRadius: {
        app: '14px',
      },
      boxShadow: {
        app: '0 8px 24px rgba(15, 23, 42, 0.08)',
        'app-sm': '0 2px 8px rgba(15, 23, 42, 0.06)',
        'app-lg': '0 16px 40px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        'sport-gradient': 'linear-gradient(135deg, #007A3D 0%, #00A651 40%, #005BAC 100%)',
        'sport-gradient-light': 'linear-gradient(135deg, #E6F7EF 0%, #EEF4FF 100%)',
        'hero-gradient': 'linear-gradient(to bottom right, #0F2D1E, #14532D, #1E3A5F)',
      },
    },
  },
  plugins: [],
};
