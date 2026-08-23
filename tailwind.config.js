/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05070d',
          900: '#080b14',
          850: '#0b0f1b',
          800: '#101627',
          700: '#18203a',
          600: '#222c4c',
        },
        gold: {
          400: '#f2cf7a',
          500: '#e3b447',
          600: '#c2942f',
        },
        azure: {
          300: '#8fbcff',
          400: '#5c93f0',
          500: '#3d6fd0',
        },
        parchment: '#f4f1ea',
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', 'Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 7vw, 5.25rem)', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2rem, 4.5vw, 3.25rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.125rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(227,180,71,0.18), 0 18px 48px -24px rgba(227,180,71,0.28)',
        lift: '0 24px 60px -32px rgba(0,0,0,0.85)',
      },
      backgroundImage: {
        'gold-sheen': 'linear-gradient(120deg, #f6e2ab 0%, #e3b447 45%, #b8862a 100%)',
        'hairline': 'linear-gradient(90deg, transparent, rgba(244,241,234,0.16), transparent)',
      },
      keyframes: {
        'pulse-node': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(227,180,71,0.45)' },
          '50%': { boxShadow: '0 0 0 10px rgba(227,180,71,0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-node': 'pulse-node 3.2s ease-out infinite',
        float: 'float 7s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
