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
          soft: '#f6f7f9',
          muted: '#eef0f3',
          dark: '#0f1115',
          darksoft: '#171a20',
          darkmuted: '#1f232b',
        },
        ink: {
          DEFAULT: '#12151a',
          soft: '#5b6270',
          faint: '#8b93a1',
          dark: '#f3f4f6',
          darksoft: '#a3aab8',
        },
        brand: {
          50: '#eef4ff',
          100: '#dbe7ff',
          400: '#5b8def',
          500: '#3567e8',
          600: '#2650c9',
          700: '#1f3fa0',
        },
        success: {
          50: '#e9f9ee',
          400: '#3fbf6f',
          500: '#279e56',
          600: '#1e7d44',
        },
        wicket: {
          50: '#fdecec',
          400: '#ef5350',
          500: '#e0322e',
          600: '#b8221f',
        },
        warn: {
          50: '#fff4e5',
          400: '#f5a623',
          500: '#e08e0b',
          600: '#b8710a',
        },
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(18,21,26,0.04), 0 8px 24px -8px rgba(18,21,26,0.08)',
        softer: '0 1px 1px rgba(18,21,26,0.03), 0 4px 12px -4px rgba(18,21,26,0.06)',
        lift: '0 12px 32px -12px rgba(18,21,26,0.18)',
        glow: '0 0 0 1px rgba(53,103,232,0.12), 0 8px 24px -8px rgba(53,103,232,0.25)',
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