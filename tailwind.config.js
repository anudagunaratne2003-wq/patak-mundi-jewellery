/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/views/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#fdfcf9',
          100: '#faf8f2',
          200: '#f5f1e8',
          300: '#ede7d6',
          400: '#e0d8c0',
          500: '#cdbf9e',
        },
        champagne: {
          50: '#fbf8f1',
          100: '#f6efe0',
          200: '#ecdcbe',
          300: '#ddc491',
          400: '#c9a862',
          500: '#b8913f',
          600: '#a07a33',
          700: '#82622b',
          800: '#6b5128',
          900: '#5a4525',
        },
        charcoal: {
          50: '#f6f6f7',
          100: '#e2e3e5',
          200: '#c6c8cb',
          300: '#9fa2a8',
          400: '#6f737b',
          500: '#52565e',
          600: '#3f434a',
          700: '#33363c',
          800: '#1d1f23',
          900: '#0d0e11',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Jost"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        ultra: '0.4em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-down': 'fadeDown 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.22, 1, 0.0, 1) both',
        'marquee': 'marquee 30s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
