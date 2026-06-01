/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0d0d14', card: '#13131f', sidebar: '#0f0f1a', border: '#1e1e30' },
        cyan: { DEFAULT: '#00d4d4', dim: '#00d4d420', hover: '#00bcbc' },
        violet: { DEFAULT: '#7c5cfc', dim: '#7c5cfc20' },
        green: { DEFAULT: '#00e676', dim: '#00e67620' },
        amber: { DEFAULT: '#ffab40', dim: '#ffab4020' },
        red: { DEFAULT: '#ff5252', dim: '#ff525220' },
        muted: '#4a4a6a',
        subtle: '#2a2a3f',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace'],
      },
      animation: {
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.25s ease-out',
        'spin-slow': 'spin 1.8s linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        pulseDot: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
        fadeUp: { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
