import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mizan color palette
        ink: {
          DEFAULT: '#0A0E1A',
          2: '#131824',
          3: '#1C212E',
          deep: '#060A14',
        },
        ivory: {
          DEFAULT: '#F8F8F6',
          2: '#D4D4D0',
          3: '#A8A8A0',
        },
        lime: {
          DEFAULT: '#E8FF4A',
          dim: '#C4DC3E',
          glow: 'rgba(232, 255, 74, 0.12)',
        },
        // Agent colors
        agent: {
          supervisor: '#E8FF4A',
          classifier: '#4AAFFF',
          treasurer: '#FF4AE8',
          payables: '#4AFFA0',
          gatekeeper: '#FFAA4A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
