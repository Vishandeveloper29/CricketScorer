/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f8f9fa',
          muted: '#eef1f4',
          dark: '#0f1115',
          darksoft: '#171a20',
          darkmuted: '#21252d',
        },
        ink: {
          DEFAULT: '#202124',
          soft: '#5f6368',
          faint: '#80868b',
          dark: '#f1f3f4',
          darksoft: '#b9c1c9',
        },
        brand: {
          50: '#e8f0fe',
          100: '#d2e3fc',
          400: '#4a8df2',
          500: '#1a73e8',
          600: '#1967d2',
          700: '#174ea6',
        },
        success: {
          50: '#e6f4ea',
          400: '#4caf6f',
          500: '#188038',
          600: '#146c2e',
        },
        wicket: {
          50: '#fce8e6',
          400: '#ea5b56',
          500: '#d93025',
          600: '#b3261e',
        },
        warn: {
          50: '#fef7e0',
          400: '#f9ab00',
          500: '#e37400',
          600: '#b06000',
        },
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(32,33,36,0.08), 0 2px 8px rgba(32,33,36,0.06)',
        softer: '0 1px 3px rgba(32,33,36,0.1)',
        lift: '0 8px 24px -12px rgba(32,33,36,0.24)',
        glow: '0 0 0 1px rgba(26,115,232,0.22), 0 10px 22px -10px rgba(26,115,232,0.32)',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'sheet-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'flash-success': {
          '0%': { backgroundColor: 'rgba(39,158,86,0.18)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'flash-wicket': {
          '0%': { backgroundColor: 'rgba(224,50,46,0.18)' },
          '100%': { backgroundColor: 'transparent' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.18s cubic-bezier(0.16,1,0.3,1)',
        'slide-up': 'slide-up 0.24s cubic-bezier(0.16,1,0.3,1)',
        'sheet-up': 'sheet-up 0.28s cubic-bezier(0.16,1,0.3,1)',
        'flash-success': 'flash-success 0.6s ease-out',
        'flash-wicket': 'flash-wicket 0.6s ease-out',
        shimmer: 'shimmer 1.6s infinite linear',
      },
    },
  },
  plugins: [],
};