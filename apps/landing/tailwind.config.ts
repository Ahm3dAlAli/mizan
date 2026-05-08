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
        bg: '#FAFAF7',
        'bg-2': '#F5F4EE',
        'bg-elev': '#FFFFFF',
        'bg-dark': '#0E1410',
        text: '#0A0F0C',
        'text-2': '#4A554F',
        'text-3': '#7E867F',
        'text-faint': '#B0B5AE',
        'text-on-dark': '#F5F4EE',
        'text-on-dark-2': '#9AA39C',
        green: '#0A4D3C',
        'green-2': '#0E6650',
        'green-tint': '#E8F0EC',
        warn: '#B58410',
        neg: '#B0463A',
        line: 'rgba(10, 15, 12, 0.08)',
        'line-2': 'rgba(10, 15, 12, 0.14)',
        'line-on-dark': 'rgba(245, 244, 238, 0.12)',
      },
      fontFamily: {
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'h1': ['96px', { lineHeight: '100px', letterSpacing: '-0.035em', fontWeight: '500' }],
        'h2': ['56px', { lineHeight: '60px', letterSpacing: '-0.025em', fontWeight: '500' }],
        'h3': ['32px', { lineHeight: '38px', letterSpacing: '-0.015em', fontWeight: '500' }],
        'h4': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-l': ['19px', { lineHeight: '30px', letterSpacing: '-0.005em' }],
        'body-s': ['13px', { lineHeight: '20px' }],
        'eyebrow': ['12px', { lineHeight: '16px', letterSpacing: '0.04em', fontWeight: '500' }],
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(10,15,12,0.04)',
        'DEFAULT': '0 1px 2px rgba(10,15,12,0.04), 0 8px 24px -8px rgba(10,15,12,0.06)',
        'lg': '0 1px 2px rgba(10,15,12,0.04), 0 16px 40px -12px rgba(10,15,12,0.10), 0 0 0 1px rgba(10,15,12,0.04)',
        'card': '0 0 0 1px rgba(10,15,12,0.06), 0 1px 2px rgba(10,15,12,0.05), 0 24px 48px -16px rgba(10,15,12,0.08)',
        'hero': '0 0 0 1px rgba(10,15,12,0.06), 0 2px 4px rgba(10,15,12,0.04), 0 40px 80px -24px rgba(10,15,12,0.18), 0 16px 32px -16px rgba(10,15,12,0.10)',
      },
      maxWidth: {
        'container': '1200px',
      },
      screens: {
        'mobile': {'max': '880px'},
      },
    },
  },
  plugins: [],
};

export default config;
