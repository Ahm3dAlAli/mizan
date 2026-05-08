import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a0e1a',
          2: '#131824',
          3: '#1c212e',
        },
        ivory: {
          DEFAULT: '#f8f8f6',
          2: '#d4d4d0',
          3: '#a8a8a0',
        },
        lime: {
          DEFAULT: '#e8ff4a',
          dim: '#c4dc3e',
        },
        forest: {
          DEFAULT: '#0a4d3c',
          dim: '#08352a',
        },
        sand: {
          DEFAULT: '#f6f4ef',
          dim: '#ebe9e0',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'spotlight': 'spotlight 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spotlight: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
