# Proyecto 26 Website Redesign Documentation

> Comprehensive design documentation for the award-worthy Proyecto 26 website redesign.

## Project Overview

**Organization**: Proyecto 26
**Motto**: "Changing the world with small contributions"
**Location**: Colombia
**Focus**: Open Source tools for Web, Mobile, and Game Development

### Key Projects
| Project | Stars | Technology |
|---------|-------|------------|
| react-native-inappbrowser | 1.4k+ | React Native |
| RestClient | 1.3k+ | Unity/C# |
| animatable-component | 258+ | Web Components/TypeScript |
| ion-phaser | 252+ | Phaser/Ionic |

### Founder
**Juan David Nicholls** - 8+ years experience in web, mobile, and game development

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [Design System](./design-system.md) | Colors, typography, spacing, shadows, and design tokens |
| [Components](./components.md) | UI component specifications and variants |
| [Animations](./animations.md) | GSAP animations, scroll effects, and micro-interactions |
| [Pages](./pages.md) | Page layouts, sections, and content structure |
| [Dragon Easter Egg](./dragon-easter-egg.md) | Logo click animation specification |
| [Technical Stack](./technical-stack.md) | Astro, Tailwind, GSAP configuration |

---

## Design Decisions Summary

### Technology Stack
- **Framework**: Astro with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: GSAP with ScrollTrigger plugin
- **3D Effects**: vanilla-tilt.js for card interactions
- **Deployment**: GitHub Pages with GitHub Actions

### Visual Theme
- **Theme**: Dark + Vibrant (game-inspired)
- **Primary Background**: Deep black (#0a0a0b)
- **Accents**: Coral (#f2385a), Teal (#4ad9d9), Orange (#f5a503)
- **Typography**: Inter (headings & body), JetBrains Mono (code)

### Animation Philosophy
- **Level**: Award-worthy rich animations (Awwwards-inspired)
- **Approach**: Scroll-triggered reveals, parallax, magnetic cursors
- **Dragon**: Converted to Easter egg (click logo to trigger)

### Reference Websites
- [Anthropic](https://www.anthropic.com/) - Dark theme, sophisticated animations
- [Arc.dev](https://arc.dev/) - Professional cards, blue accents
- [Awwwards](https://www.awwwards.com/) - Award-winning design patterns

---

## Quick Start for Future Sessions

When continuing this project, reference these key decisions:

1. **Theme**: Dark background with vibrant game-inspired accents
2. **Animations**: Use GSAP ScrollTrigger for all scroll-based animations
3. **Cards**: 3D tilt effect with vanilla-tilt, glow borders on hover
4. **Cursor**: Custom cursor with magnetic effect on interactive elements
5. **Dragon**: Easter egg triggered by clicking the logo
6. **Games**: Preserve existing Phaser games in `/public/games/`
7. **Stats**: Fetch GitHub stars dynamically via API

---

## File Structure

```
proyecto26-website/
├── docs/                          # This documentation
├── src/
│   ├── components/                # Astro components
│   ├── layouts/                   # Page layouts
│   ├── pages/                     # Route pages
│   ├── styles/                    # Global CSS & tokens
│   └── scripts/                   # TypeScript animations
├── public/
│   ├── games/                     # Phaser games (preserved)
│   ├── img/                       # Optimized images
│   └── fonts/                     # Self-hosted fonts
└── astro.config.mjs
```

---

*Last updated: January 2025*
*Design by: Claude + Juan David Nicholls*
