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
          soft: '#f3f7fb',
          muted: '#e8eef5',
          dark: '#0e1726',
          darksoft: '#152033',
          darkmuted: '#1c2b40',
        },
        ink: {
          DEFAULT: '#0f2237',
          soft: '#425a73',
          faint: '#68839d',
          dark: '#f4f8fd',
          darksoft: '#a2b7cd',
        },
        brand: {
          50: '#eaf6ff',
          100: '#d3edff',
          400: '#37a0ed',
          500: '#0f86de',
          600: '#0a69b0',
          700: '#0a4f83',
        },
        success: {
          50: '#e9f8ec',
          400: '#41b86c',
          500: '#1f9b55',
          600: '#15773f',
        },
        wicket: {
          50: '#fcebec',
          400: '#ef5a58',
          500: '#d93a37',
          600: '#ad2927',
        },
        warn: {
          50: '#fff4e6',
          400: '#f2aa3d',
          500: '#dd8d1e',
          600: '#b86e11',
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