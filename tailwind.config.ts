import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#040711',
          900: '#070c1a',
          850: '#0b1326',
          800: '#111b33',
          700: '#1a2747',
          600: '#26375f',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          900: '#164e63',
        },
        thermal: {
          low: '#10b981',      // Emerald
          moderate: '#3b82f6', // Blue
          high: '#f59e0b',     // Amber
          extreme: '#ef4444',  // Red
          critical: '#d946ef', // Magenta / Purple
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-violet': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glow-orange': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glass-edge': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, rgba(34,211,238,0.07) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(99,102,241,0.1) 50%, rgba(15,23,42,0.8) 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        float: 'float 6s infinite ease-in-out',
        slideLeft: 'slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        slideLeft: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
