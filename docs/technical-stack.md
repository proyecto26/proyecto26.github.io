# Technical Stack Specification

> Complete technical documentation for the Proyecto 26 website implementation.

## Table of Contents
- [Technology Choices](#technology-choices)
- [Project Setup](#project-setup)
- [Astro Configuration](#astro-configuration)
- [Tailwind Configuration](#tailwind-configuration)
- [GSAP Setup](#gsap-setup)
- [GitHub Actions Deployment](#github-actions-deployment)
- [Development Workflow](#development-workflow)
- [Performance Targets](#performance-targets)

---

## Technology Choices

### Core Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Astro** | ^4.0.0 | Static site generator with component islands |
| **TypeScript** | ^5.0.0 | Type safety and better DX |
| **Tailwind CSS** | ^3.4.0 | Utility-first CSS framework |
| **GSAP** | ^3.12.0 | Animation library with ScrollTrigger |

### Supporting Libraries

| Library | Purpose |
|---------|---------|
| `vanilla-tilt` | 3D tilt effect on project cards |
| `@fontsource/inter` | Self-hosted Inter font |
| `@fontsource/jetbrains-mono` | Self-hosted JetBrains Mono font |

### Why Astro?

1. **Zero JavaScript by Default**: Ships only the JS you need
2. **Island Architecture**: Interactive components load independently
3. **Web Component Friendly**: Can use existing `animatable-component`
4. **Static Output**: Perfect for GitHub Pages hosting
5. **Framework Agnostic**: Can mix React, Vue, or vanilla JS
6. **Built-in Optimizations**: Image optimization, CSS bundling
7. **View Transitions**: Native page transition support

### Why NOT Next.js/React?

- Overkill for a portfolio/showcase site
- Larger bundle size
- More complex deployment
- No server-side features needed

---

## Project Setup

### Initial Setup Commands

```bash
# Create new Astro project
npm create astro@latest proyecto26-website

# Navigate to project
cd proyecto26-website

# Install dependencies
npm install gsap @gsap/scrolltrigger vanilla-tilt
npm install @fontsource/inter @fontsource/jetbrains-mono

# Install Tailwind
npx astro add tailwind

# Install TypeScript (if not selected during setup)
npx astro add typescript
```

### Final Package.json

```json
{
  "name": "proyecto26-website",
  "type": "module",
  "version": "2.0.0",
  "description": "Proyecto 26 - Changing the world with small contributions",
  "author": "Juan David Nicholls <jdnichollsc@gmail.com>",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "lint": "eslint src --ext .ts,.astro",
    "format": "prettier --write src"
  },
  "dependencies": {
    "@astrojs/tailwind": "^5.0.0",
    "astro": "^4.0.0",
    "gsap": "^3.12.0",
    "tailwindcss": "^3.4.0",
    "vanilla-tilt": "^1.8.0"
  },
  "devDependencies": {
    "@fontsource/inter": "^5.0.0",
    "@fontsource/jetbrains-mono": "^5.0.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.0.0",
    "eslint-plugin-astro": "^0.31.0",
    "prettier": "^3.0.0",
    "prettier-plugin-astro": "^0.12.0",
    "typescript": "^5.0.0"
  }
}
```

---

## Astro Configuration

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // Site URL for GitHub Pages
  site: 'https://proyecto26.com',

  // Base path (root for custom domain)
  base: '/',

  // Output mode - static for GitHub Pages
  output: 'static',

  // Integrations
  integrations: [
    tailwind({
      // Use custom config file
      configFile: './tailwind.config.mjs',
    }),
  ],

  // Build options
  build: {
    // Inline small assets
    inlineStylesheets: 'auto',
    // Generate sitemap
    format: 'directory',
  },

  // Enable view transitions
  experimental: {
    // View Transitions API
    viewTransitions: true,
  },

  // Vite configuration
  vite: {
    build: {
      // Code splitting
      cssCodeSplit: true,
      // Minification
      minify: 'esbuild',
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['gsap', 'vanilla-tilt'],
    },
  },
});
```

### tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@styles/*": ["src/styles/*"],
      "@scripts/*": ["src/scripts/*"]
    },
    "types": ["astro/client"]
  },
  "include": ["src/**/*", "env.d.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### env.d.ts

```typescript
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GITHUB_TOKEN?: string;
  readonly PUBLIC_GA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## Tailwind Configuration

### tailwind.config.mjs

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom colors from design system
      colors: {
        bg: {
          primary: '#0a0a0b',
          secondary: '#131316',
          tertiary: '#1a1a1f',
          card: '#16161a',
          hover: '#1f1f24',
        },
        border: {
          default: '#2a2a2f',
          subtle: '#1f1f24',
          accent: '#3a3a40',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a1a1aa',
          muted: '#71717a',
        },
        accent: {
          coral: {
            DEFAULT: '#f2385a',
            light: '#ff5c7c',
            dark: '#d00e31',
          },
          teal: {
            DEFAULT: '#4ad9d9',
            light: '#6eeaea',
            dark: '#25b1b1',
          },
          orange: {
            DEFAULT: '#f5a503',
            light: '#ffbb33',
            dark: '#c38302',
          },
          blue: {
            DEFAULT: '#36b1bf',
            light: '#5ac8d4',
            dark: '#257a83',
          },
        },
      },

      // Custom fonts
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },

      // Font sizes with fluid typography
      fontSize: {
        xs: ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.5' }],
        sm: ['clamp(0.875rem, 0.8rem + 0.35vw, 1rem)', { lineHeight: '1.5' }],
        base: ['clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', { lineHeight: '1.6' }],
        lg: ['clamp(1.125rem, 1rem + 0.6vw, 1.25rem)', { lineHeight: '1.5' }],
        xl: ['clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', { lineHeight: '1.4' }],
        '2xl': ['clamp(1.5rem, 1.2rem + 1.5vw, 2rem)', { lineHeight: '1.3' }],
        '3xl': ['clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)', { lineHeight: '1.2' }],
        '4xl': ['clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem)', { lineHeight: '1.1' }],
        '5xl': ['clamp(3rem, 2rem + 5vw, 5rem)', { lineHeight: '1' }],
        '6xl': ['clamp(3.75rem, 2.5rem + 6.25vw, 6rem)', { lineHeight: '1' }],
      },

      // Custom shadows
      boxShadow: {
        'glow-coral': '0 0 20px rgba(242, 56, 90, 0.4), 0 0 40px rgba(242, 56, 90, 0.2)',
        'glow-teal': '0 0 20px rgba(74, 217, 217, 0.4), 0 0 40px rgba(74, 217, 217, 0.2)',
        'glow-card': '0 0 30px rgba(242, 56, 90, 0.15), 0 20px 40px rgba(0, 0, 0, 0.3)',
      },

      // Border radius
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },

      // Animation durations
      transitionDuration: {
        fast: '100ms',
        normal: '200ms',
        slow: '300ms',
        slower: '500ms',
      },

      // Custom animations
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient': 'gradient 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(242, 56, 90, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(242, 56, 90, 0.6)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },

      // Z-index scale
      zIndex: {
        behind: '-1',
        raised: '10',
        dropdown: '100',
        sticky: '200',
        header: '300',
        overlay: '400',
        modal: '500',
        popover: '600',
        toast: '700',
        cursor: '9999',
      },
    },
  },
  plugins: [],
};
```

### src/styles/global.css

```css
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';
@import '@fontsource/inter/800.css';
@import '@fontsource/inter/900.css';
@import '@fontsource/jetbrains-mono/400.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Root variables for JS access */
  :root {
    --color-accent-coral: #f2385a;
    --color-accent-teal: #4ad9d9;
    --color-accent-orange: #f5a503;
    --color-accent-blue: #36b1bf;
  }

  /* Base styles */
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-bg-primary text-text-primary font-sans antialiased;
  }

  /* Focus styles */
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-accent-coral;
  }

  /* Selection */
  ::selection {
    @apply bg-accent-coral/30 text-white;
  }
}

@layer components {
  /* Container */
  .container {
    @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
  }

  /* Section spacing */
  .section {
    @apply py-16 md:py-24 lg:py-32;
  }

  /* Gradient text */
  .gradient-text {
    @apply bg-gradient-to-r from-accent-coral via-accent-teal to-accent-orange;
    @apply bg-clip-text text-transparent;
    background-size: 200% auto;
  }

  /* Card base */
  .card {
    @apply bg-bg-card border border-border-default rounded-xl;
    @apply transition-all duration-300;
  }

  .card:hover {
    @apply border-accent-coral/30 shadow-glow-card -translate-y-1;
  }
}

@layer utilities {
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

---

## GSAP Setup

### src/scripts/animations.ts

```typescript
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register plugins
gsap.registerPlugin(ScrollTrigger);

// Global defaults
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

// ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
  start: 'top 80%',
});

// Check reduced motion preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/**
 * Initialize all scroll-based animations
 */
export function initScrollAnimations() {
  if (prefersReducedMotion) {
    // Show all elements without animation
    gsap.set('[data-animate]', { opacity: 1, y: 0 });
    return;
  }

  // Fade up animations
  gsap.utils.toArray<HTMLElement>('[data-animate="fade-up"]').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el },
      opacity: 0,
      y: 60,
    });
  });

  // Stagger animations for grids
  gsap.utils.toArray<HTMLElement>('[data-animate="stagger"]').forEach((container) => {
    const items = container.querySelectorAll('[data-animate-item]');
    gsap.from(items, {
      scrollTrigger: { trigger: container },
      opacity: 0,
      y: 40,
      stagger: 0.15,
    });
  });
}

/**
 * Split text into words for animation
 */
export function splitText(element: HTMLElement): HTMLElement[] {
  const text = element.textContent || '';
  const words = text.split(' ');

  element.innerHTML = words
    .map((word) => `<span class="word inline-block overflow-hidden"><span class="word-inner inline-block">${word}</span></span>`)
    .join(' ');

  return Array.from(element.querySelectorAll('.word-inner'));
}

/**
 * Animate hero text reveal
 */
export function animateHeroText(selector: string) {
  if (prefersReducedMotion) return;

  const element = document.querySelector<HTMLElement>(selector);
  if (!element) return;

  const words = splitText(element);

  gsap.from(words, {
    y: '100%',
    opacity: 0,
    rotationX: -90,
    stagger: 0.05,
    duration: 0.8,
    ease: 'back.out(1.7)',
  });
}

/**
 * Counter animation for stats
 */
export function animateCounter(selector: string) {
  if (prefersReducedMotion) return;

  gsap.utils.toArray<HTMLElement>(selector).forEach((counter) => {
    const target = parseInt(counter.dataset.value || '0', 10);

    gsap.from(counter, {
      scrollTrigger: { trigger: counter, start: 'top 90%' },
      textContent: 0,
      duration: 2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      onUpdate: function () {
        const current = Math.ceil(Number(this.targets()[0].textContent));
        counter.textContent = current.toLocaleString();
      },
    });
  });
}

/**
 * Refresh ScrollTrigger (call after route changes)
 */
export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
  document.addEventListener('astro:page-load', () => {
    refreshScrollTrigger();
    initScrollAnimations();
  });
}
```

---

## GitHub Actions Deployment

### .github/workflows/deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### GitHub Pages Settings

1. Go to repository **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Custom domain: `proyecto26.com`
4. Enforce HTTPS: ✓

### CNAME File

Create `public/CNAME`:
```
proyecto26.com
```

---

## Development Workflow

### Local Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Lint code
npm run lint

# Format code
npm run format
```

### File Structure

```
proyecto26-website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── docs/                       # Design documentation (this folder)
├── public/
│   ├── games/                  # Phaser games (copied from current site)
│   │   ├── ninja/
│   │   ├── ninjadev/
│   │   └── zombies/
│   ├── img/                    # Static images
│   ├── audio/                  # Audio files
│   ├── fonts/                  # Self-hosted fonts (if not using npm)
│   ├── favicon.ico
│   ├── CNAME                   # Custom domain
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   ├── DragonEasterEgg.astro
│   │   ├── Footer.astro
│   │   ├── GameCard.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── ProjectCard.astro
│   │   ├── ServiceCard.astro
│   │   ├── StatsCounter.astro
│   │   └── TeamMember.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro         # Homepage
│   │   └── games/
│   │       └── index.astro     # Games listing
│   ├── scripts/
│   │   ├── animations.ts       # GSAP animations
│   │   ├── cursor.ts           # Custom cursor
│   │   ├── dragon.ts           # Easter egg
│   │   └── tilt.ts             # 3D card tilt
│   └── styles/
│       └── global.css          # Global styles
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
└── tsconfig.json
```

---

## Performance Targets

### Lighthouse Goals

| Metric | Target |
|--------|--------|
| Performance | > 90 |
| Accessibility | > 95 |
| Best Practices | > 95 |
| SEO | > 95 |

### Core Web Vitals

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |

### Optimization Strategies

1. **Images**: Use Astro's `<Image>` component for automatic optimization
2. **Fonts**: Self-host with `font-display: swap`
3. **JavaScript**: Minimal, lazy-loaded where possible
4. **CSS**: Tailwind's purge removes unused styles
5. **Caching**: Proper cache headers via GitHub Pages
6. **Games**: Load Phaser only on games pages

### Bundle Size Targets

| Asset | Target |
|-------|--------|
| HTML | < 50KB |
| CSS | < 30KB |
| JS (main) | < 50KB |
| GSAP | ~60KB (lazy loaded) |

---

## Migration Checklist

### From Current Site

- [x] Copy `games/` folder to `public/games/`
- [x] Copy `img/` folder to `public/img/`
- [x] Copy `audio/` folder to `public/audio/`
- [x] Extract content from `index.html`
- [x] Port dragon animation logic
- [ ] Update internal links
- [ ] Test all games work
- [ ] Verify PWA functionality
- [ ] Update analytics

### New Implementation

- [ ] Set up Astro project
- [ ] Configure Tailwind with design tokens
- [ ] Build all components
- [ ] Implement GSAP animations
- [ ] Add custom cursor
- [ ] Create dragon Easter egg
- [ ] Build all pages
- [ ] Set up GitHub Actions
- [ ] Deploy and test
- [ ] Performance audit

---

*This technical specification provides everything needed to implement the Proyecto 26 website redesign.*
