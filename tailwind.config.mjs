/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Background colors
        'bg-primary': '#0a0a0b',
        'bg-secondary': '#131316',
        'bg-card': '#16161a',
        'bg-hover': '#1f1f24',
        'bg-tertiary': '#1c1c21',

        // Text colors
        'text-primary': '#ffffff',
        'text-secondary': '#a1a1aa',
        'text-muted': '#71717a',

        // Border colors
        'border-default': '#2a2a2f',
        'border-subtle': '#1f1f24',
        'border-accent': 'rgba(242, 56, 90, 0.3)',

        // Accent colors
        'accent-coral': '#f2385a',
        'accent-teal': '#4ad9d9',
        'accent-orange': '#f5a503',
        'accent-blue': '#36b1bf',

        // Utility colors
        'stars-gold': '#fbbf24',
        'forks-blue': '#60a5fa',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'glow-coral': '0 0 20px rgba(242, 56, 90, 0.3)',
        'glow-teal': '0 0 20px rgba(74, 217, 217, 0.3)',
        'glow-card': '0 0 30px rgba(242, 56, 90, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(242, 56, 90, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(242, 56, 90, 0.5)' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      zIndex: {
        'cursor': '9999',
        'modal': '500',
        'header': '300',
        'overlay': '200',
      },
    },
  },
  plugins: [],
}
