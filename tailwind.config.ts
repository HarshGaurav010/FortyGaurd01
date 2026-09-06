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
        /* ── Legacy dark scale (kept for backward compat) ── */
        dark: {
          950: '#040711',
          900: '#0c1220',
          850: '#0f1929',
          800: '#141e2e',
          700: '#1c2b40',
          600: '#243652',
        },

        /* ── Brand Orange ── */
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },

        /* ── Semantic tokens mapped to CSS variables ── */
        semantic: {
          bg:           'var(--bg-primary)',
          'bg-subtle':  'var(--bg-secondary)',
          surface:      'var(--surface)',
          card:         'var(--bg-card)',
          'card-hover': 'var(--bg-card-hover)',
          border:       'var(--card-border)',
          fg:           'var(--foreground)',
          muted:        'var(--foreground-muted)',
          accent:       'var(--accent)',
          brand:        'var(--brand)',
          success:      'var(--success)',
          warning:      'var(--warning)',
          danger:       'var(--danger)',
          thermal:      'var(--thermal-critical)',
          solar:        'var(--solar)',
          eco:          'var(--eco)',
          retrofit:     'var(--retrofit)',
          glass:        'var(--glass-surface)',
        },

        /* ── Thermal color scale ── */
        thermal: {
          low:      '#10b981',
          moderate: '#3b82f6',
          high:     '#f59e0b',
          extreme:  '#ef4444',
          critical: '#f43f5e',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      borderRadius: {
        '2.5xl': '1.25rem',  /* 20px */
        '3xl':   '1.5rem',   /* 24px */
        '4xl':   '2rem',     /* 32px */
      },

      boxShadow: {
        /* Card shadows */
        card:    '0 1px 4px rgba(0,0,0,0.05), 0 8px 20px -4px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px -4px rgba(0,0,0,0.10)',
        elevated:'0 20px 40px -8px rgba(0,0,0,0.12)',

        /* Brand glow — orange */
        glow:    '0 0 28px -6px rgba(249, 115, 22, 0.30)',
        'glow-sm':'0 0 14px -4px rgba(249, 115, 22, 0.25)',

        /* Legacy cyan glow (kept for 3D viewer badges) */
        'glow-cyan':   '0 0 25px -5px rgba(34, 211, 238, 0.30)',
        'glow-violet': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glow-green':  '0 0 25px -5px rgba(16, 185, 129, 0.30)',

        /* Glass edge highlight */
        'glass-edge': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.10)',

        /* Navbar floating shadow */
        navbar: '0 4px 20px -4px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
      },

      backgroundImage: {
        /* Warm orange ambient */
        'brand-gradient': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        'brand-soft':     'linear-gradient(135deg, rgba(249,115,22,0.10) 0%, rgba(234,88,12,0.05) 100%)',

        /* Grid */
        'dot-pattern':  'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
        'dark-dot':     'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },

      animation: {
        'card-in':    'cardEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-dot':  'pulseDot 2s ease-in-out infinite',
        'slide-left': 'slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        float:        'float 6s infinite ease-in-out',
      },

      keyframes: {
        cardEntrance: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.85)' },
        },
        slideLeft: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
