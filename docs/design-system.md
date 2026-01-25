# Design System

> Complete design tokens and visual specifications for Proyecto 26 website.

## Table of Contents
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing](#spacing)
- [Shadows](#shadows)
- [Border Radius](#border-radius)
- [Breakpoints](#breakpoints)
- [Z-Index Scale](#z-index-scale)
- [Transitions](#transitions)

---

## Color Palette

### Theme: Dark + Vibrant

The design uses a dark foundation with vibrant, game-inspired accent colors that reflect Proyecto 26's playful yet professional identity.

### Base Colors (Dark Theme)

```css
:root {
  /* Backgrounds */
  --color-bg-primary: #0a0a0b;      /* Main background - near black */
  --color-bg-secondary: #131316;    /* Card backgrounds */
  --color-bg-tertiary: #1a1a1f;     /* Elevated surfaces */
  --color-bg-card: #16161a;         /* Card surface */
  --color-bg-hover: #1f1f24;        /* Hover states */
  --color-bg-overlay: rgba(10, 10, 11, 0.8); /* Modal overlays */

  /* Borders */
  --color-border-default: #2a2a2f;  /* Default borders */
  --color-border-subtle: #1f1f24;   /* Subtle borders */
  --color-border-accent: #3a3a40;   /* Emphasized borders */
}
```

### Text Colors

```css
:root {
  --color-text-primary: #ffffff;    /* Main text - pure white */
  --color-text-secondary: #a1a1aa;  /* Secondary text - muted */
  --color-text-muted: #71717a;      /* Tertiary text - very muted */
  --color-text-disabled: #52525b;   /* Disabled state */
  --color-text-inverse: #0a0a0b;    /* Text on light backgrounds */
}
```

### Accent Colors (Game-Inspired)

These colors are derived from the existing games section and represent Proyecto 26's vibrant identity.

```css
:root {
  /* Coral/Pink - Primary Accent */
  --color-accent-coral: #f2385a;
  --color-accent-coral-light: #ff5c7c;
  --color-accent-coral-dark: #d00e31;

  /* Teal/Cyan - Secondary Accent */
  --color-accent-teal: #4ad9d9;
  --color-accent-teal-light: #6eeaea;
  --color-accent-teal-dark: #25b1b1;

  /* Orange/Gold - Tertiary Accent */
  --color-accent-orange: #f5a503;
  --color-accent-orange-light: #ffbb33;
  --color-accent-orange-dark: #c38302;

  /* Blue - Quaternary Accent */
  --color-accent-blue: #36b1bf;
  --color-accent-blue-light: #5ac8d4;
  --color-accent-blue-dark: #257a83;
}
```

### Semantic Colors

```css
:root {
  /* Status Colors */
  --color-success: #4ade80;
  --color-success-bg: rgba(74, 222, 128, 0.1);

  --color-warning: #fbbf24;
  --color-warning-bg: rgba(251, 191, 36, 0.1);

  --color-error: #ef4444;
  --color-error-bg: rgba(239, 68, 68, 0.1);

  --color-info: #60a5fa;
  --color-info-bg: rgba(96, 165, 250, 0.1);

  /* GitHub Stats */
  --color-stars: #fbbf24;           /* Star count - gold */
  --color-forks: #60a5fa;           /* Fork count - blue */
  --color-contributors: #4ade80;    /* Contributors - green */
}
```

### Gradients

```css
:root {
  /* Hero gradient - diagonal coral to teal */
  --gradient-hero: linear-gradient(135deg, #f2385a 0%, #36b1bf 100%);

  /* Card hover glow */
  --gradient-card-glow: linear-gradient(
    180deg,
    rgba(242, 56, 90, 0.15) 0%,
    transparent 100%
  );

  /* Text gradient for headlines */
  --gradient-text: linear-gradient(90deg, #f2385a 0%, #4ad9d9 50%, #f5a503 100%);

  /* Button gradient */
  --gradient-button: linear-gradient(135deg, #f2385a 0%, #ff5c7c 100%);

  /* Background ambient gradient */
  --gradient-ambient: radial-gradient(
    ellipse 80% 50% at 50% -20%,
    rgba(242, 56, 90, 0.15) 0%,
    transparent 50%
  );
}
```

### Color Usage Guidelines

| Use Case | Color Token |
|----------|-------------|
| Page background | `--color-bg-primary` |
| Card background | `--color-bg-card` |
| Primary text | `--color-text-primary` |
| Secondary text | `--color-text-secondary` |
| Primary buttons | `--color-accent-coral` |
| Links | `--color-accent-teal` |
| Highlights | `--color-accent-orange` |
| Card borders (hover) | `--color-accent-coral` with opacity |

---

## Typography

### Font Families

```css
:root {
  /* Primary font - headings and body */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
               'Helvetica Neue', Arial, sans-serif;

  /* Monospace - code and technical content */
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', monospace;
}
```

### Font Weights

```css
:root {
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;
}
```

### Font Sizes (Fluid Typography)

Using `clamp()` for responsive scaling without breakpoints.

```css
:root {
  /* Base scale */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);     /* 12-14px */
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);        /* 14-16px */
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);       /* 16-18px */
  --text-lg: clamp(1.125rem, 1rem + 0.6vw, 1.25rem);        /* 18-20px */
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);       /* 20-24px */

  /* Heading scale */
  --text-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);          /* 24-32px */
  --text-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);    /* 30-40px */
  --text-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem);      /* 36-56px */
  --text-5xl: clamp(3rem, 2rem + 5vw, 5rem);                /* 48-80px */
  --text-6xl: clamp(3.75rem, 2.5rem + 6.25vw, 6rem);        /* 60-96px */
}
```

### Line Heights

```css
:root {
  --leading-none: 1;
  --leading-tight: 1.15;
  --leading-snug: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### Letter Spacing

```css
:root {
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}
```

### Typography Presets

```css
/* Hero Title */
.hero-title {
  font-family: var(--font-sans);
  font-size: var(--text-6xl);
  font-weight: var(--font-weight-black);
  line-height: var(--leading-none);
  letter-spacing: var(--tracking-tight);
}

/* Section Title */
.section-title {
  font-family: var(--font-sans);
  font-size: var(--text-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

/* Card Title */
.card-title {
  font-family: var(--font-sans);
  font-size: var(--text-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--leading-snug);
}

/* Body Text */
.body-text {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--leading-relaxed);
}

/* Code */
.code-text {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-normal);
}
```

---

## Spacing

### Spacing Scale

Based on a 4px base unit with a harmonious scale.

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
  --space-40: 10rem;    /* 160px */
  --space-48: 12rem;    /* 192px */
}
```

### Section Spacing

```css
:root {
  /* Vertical section padding */
  --section-padding-y: clamp(4rem, 8vw, 8rem);

  /* Container max width */
  --container-max: 1280px;

  /* Container padding (horizontal) */
  --container-padding-x: clamp(1rem, 5vw, 2rem);

  /* Grid gap */
  --grid-gap: clamp(1rem, 3vw, 2rem);
}
```

---

## Shadows

### Shadow Scale

```css
:root {
  /* Subtle shadow - cards at rest */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);

  /* Default shadow */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4),
               0 2px 4px -2px rgba(0, 0, 0, 0.3);

  /* Elevated shadow - hover states */
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5),
               0 4px 6px -4px rgba(0, 0, 0, 0.4);

  /* High elevation - modals, dropdowns */
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5),
               0 8px 10px -6px rgba(0, 0, 0, 0.4);

  /* Maximum elevation */
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
}
```

### Glow Effects

```css
:root {
  /* Coral glow - primary buttons, important elements */
  --glow-coral: 0 0 20px rgba(242, 56, 90, 0.4),
                0 0 40px rgba(242, 56, 90, 0.2);

  /* Teal glow - links, secondary elements */
  --glow-teal: 0 0 20px rgba(74, 217, 217, 0.4),
               0 0 40px rgba(74, 217, 217, 0.2);

  /* Card hover glow */
  --glow-card: 0 0 30px rgba(242, 56, 90, 0.15),
               0 0 60px rgba(242, 56, 90, 0.1);
}
```

---

## Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;   /* Pill shape */
}
```

### Usage Guidelines

| Element | Radius |
|---------|--------|
| Buttons | `--radius-lg` |
| Cards | `--radius-xl` |
| Input fields | `--radius-md` |
| Tags/Badges | `--radius-full` |
| Images | `--radius-lg` |
| Modals | `--radius-2xl` |

---

## Breakpoints

```css
:root {
  --breakpoint-sm: 640px;    /* Mobile landscape */
  --breakpoint-md: 768px;    /* Tablet */
  --breakpoint-lg: 1024px;   /* Desktop */
  --breakpoint-xl: 1280px;   /* Large desktop */
  --breakpoint-2xl: 1536px;  /* Extra large */
}
```

### Media Query Mixins (Tailwind)

```css
/* Mobile first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## Z-Index Scale

```css
:root {
  --z-behind: -1;
  --z-default: 0;
  --z-raised: 10;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-header: 300;
  --z-overlay: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-toast: 700;
  --z-cursor: 9999;
}
```

---

## Transitions

### Duration Scale

```css
:root {
  --duration-instant: 0ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
  --duration-slowest: 800ms;
}
```

### Easing Functions

```css
:root {
  /* Standard easings */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Custom easings - more expressive */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-smooth: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-snappy: cubic-bezier(0.17, 0.67, 0.83, 0.67);

  /* GSAP-style power easings */
  --ease-power2-out: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-power3-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-power4-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Transition Presets

```css
/* Quick interactions - buttons, links */
.transition-fast {
  transition: all var(--duration-fast) var(--ease-out);
}

/* Standard transitions - cards, panels */
.transition-normal {
  transition: all var(--duration-normal) var(--ease-out);
}

/* Smooth animations - page elements */
.transition-smooth {
  transition: all var(--duration-slow) var(--ease-smooth);
}

/* Transform-specific */
.transition-transform {
  transition: transform var(--duration-normal) var(--ease-power3-out);
}
```

---

## Tailwind Configuration

```javascript
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0b',
          secondary: '#131316',
          tertiary: '#1a1a1f',
          card: '#16161a',
        },
        accent: {
          coral: '#f2385a',
          teal: '#4ad9d9',
          orange: '#f5a503',
          blue: '#36b1bf',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-coral': '0 0 20px rgba(242, 56, 90, 0.4)',
        'glow-teal': '0 0 20px rgba(74, 217, 217, 0.4)',
      },
    },
  },
}
```

---

*This design system ensures consistency across all components and pages while maintaining the vibrant, award-worthy aesthetic.*
