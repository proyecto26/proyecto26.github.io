# Component Specifications

> Detailed specifications for all UI components in the Proyecto 26 website.

## Table of Contents
- [Button](#button)
- [Card](#card)
- [Project Card](#project-card)
- [Game Card](#game-card)
- [Navigation](#navigation)
- [Footer](#footer)
- [Stats Counter](#stats-counter)
- [Service Card](#service-card)
- [Team Member](#team-member)
- [Custom Cursor](#custom-cursor)

---

## Button

### Variants

#### Primary Button
Used for main CTAs and important actions.

```
┌─────────────────────────┐
│    Explore Projects     │
└─────────────────────────┘
```

**Specifications:**
- Background: `--color-accent-coral` (#f2385a)
- Text: White (#ffffff)
- Font: Inter, 16px, semibold (600)
- Padding: 16px 32px
- Border Radius: 12px (`--radius-lg`)
- Min Width: 160px

**States:**
| State | Style |
|-------|-------|
| Default | Solid coral background |
| Hover | Lighten 10%, scale(1.02), glow effect |
| Active | Darken 10%, scale(0.98) |
| Focus | 2px coral outline, 2px offset |
| Disabled | 50% opacity, no pointer events |

**Magnetic Effect:**
- On hover, button slightly moves toward cursor
- Movement range: 8px max
- Easing: `--ease-smooth`

#### Secondary Button
Used for secondary actions.

```
┌─────────────────────────┐
│      View on GitHub     │
└─────────────────────────┘
```

**Specifications:**
- Background: Transparent
- Border: 1px solid `--color-border-accent`
- Text: `--color-text-primary`
- Hover: Background `--color-bg-hover`, border `--color-accent-teal`

#### Ghost Button
Used for tertiary actions.

**Specifications:**
- Background: Transparent
- Border: None
- Text: `--color-text-secondary`
- Hover: Text `--color-text-primary`, underline

#### Icon Button
Used for icon-only actions (theme toggle, social links).

```
┌─────┐
│  ☀  │
└─────┘
```

**Specifications:**
- Size: 44px × 44px (touch target)
- Border Radius: 50%
- Background: `--color-bg-secondary`
- Hover: Background `--color-bg-hover`, scale(1.1)

---

## Card

### Base Card

```
┌────────────────────────────────────┐
│                                    │
│  Card content goes here            │
│                                    │
└────────────────────────────────────┘
```

**Specifications:**
- Background: `--color-bg-card` (#16161a)
- Border: 1px solid `--color-border-default`
- Border Radius: 16px (`--radius-xl`)
- Padding: 24px
- Shadow: `--shadow-sm`

**Hover State:**
- Border color transitions to `rgba(242, 56, 90, 0.3)`
- Shadow: `--glow-card`
- Transform: translateY(-4px)
- Transition: 300ms `--ease-smooth`

---

## Project Card

Displays open source projects with GitHub stats.

```
┌────────────────────────────────────────────┐
│                                            │
│  ┌──────┐                                  │
│  │ Icon │  react-native-inappbrowser       │
│  └──────┘                                  │
│                                            │
│  InAppBrowser for React Native with        │
│  support for Chrome Custom Tabs.           │
│                                            │
│  ┌────────┐ ┌────────┐ ┌────────┐         │
│  │ RN     │ │ iOS    │ │ Android│         │
│  └────────┘ └────────┘ └────────┘         │
│                                            │
│  ⭐ 1,423    🍴 234                         │
│                                            │
│  [View Project]          [GitHub →]        │
│                                            │
└────────────────────────────────────────────┘
```

**Specifications:**
- Base: Inherits from Card
- Width: 100% (responsive grid)
- Min Height: 280px
- Gap between elements: 16px

**Elements:**
| Element | Style |
|---------|-------|
| Icon | 48px × 48px, rounded, from project |
| Title | `--text-xl`, semibold, white |
| Description | `--text-base`, `--color-text-secondary`, 2-line clamp |
| Tech Tags | Pill badges, `--radius-full`, `--color-bg-tertiary` |
| Stars | `--color-stars` (#fbbf24), fetched via GitHub API |
| Forks | `--color-forks` (#60a5fa) |

**3D Tilt Effect (vanilla-tilt):**
```javascript
{
  max: 8,              // Max tilt rotation (degrees)
  speed: 400,          // Speed of enter/exit transition
  glare: true,         // Enable glare effect
  "max-glare": 0.15,   // Max glare opacity
  perspective: 1000,   // Transform perspective
}
```

**Grid Layout:**
- Desktop (≥1024px): 3 columns
- Tablet (≥768px): 2 columns
- Mobile: 1 column
- Gap: 24px

---

## Game Card

Displays playable games with preview.

```
┌────────────────────────────────────────────┐
│ ┌────────────────────────────────────────┐ │
│ │                                        │ │
│ │         [Game Preview GIF]             │ │
│ │                                        │ │
│ │                        ▶ PLAY          │ │
│ └────────────────────────────────────────┘ │
│                                            │
│  NinjaDev                                  │
│  A side-scrolling platformer built with    │
│  Phaser to showcase game development.      │
│                                            │
│  ┌────────┐ ┌────────┐                     │
│  │ Phaser │ │ 2D     │                     │
│  └────────┘ └────────┘                     │
│                                            │
└────────────────────────────────────────────┘
```

**Specifications:**
- Preview: 16:9 aspect ratio, contains GIF/video
- Overlay: Gradient from transparent to black (bottom)
- Play button: Centered, circular, coral accent

**Hover Effects:**
- Preview scales to 1.05
- Scanline overlay appears (retro effect)
- Glitch animation on title (subtle)

**Scanline CSS:**
```css
.game-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1) 0px,
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.game-card:hover::after {
  opacity: 1;
}
```

---

## Navigation

### Desktop Navigation

```
┌──────────────────────────────────────────────────────────────────┐
│  [P26 Logo]     Projects   Games   About   Contact    [☀] [GH]  │
└──────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Position: Fixed, top
- Height: 72px
- Background: `--color-bg-primary` with backdrop-blur
- Border Bottom: 1px solid `--color-border-subtle`
- Z-Index: `--z-header` (300)
- Padding: 0 `--container-padding-x`

**Logo:**
- Size: 40px height
- Click: Triggers dragon Easter egg
- Hover: Subtle glow

**Nav Links:**
- Font: `--text-base`, medium (500)
- Color: `--color-text-secondary`
- Hover: `--color-text-primary`, underline offset
- Active: `--color-accent-coral`
- Spacing: 32px between links

**Scroll Behavior:**
- On scroll down (>100px): Add background blur
- On scroll up: Show header if hidden

### Mobile Navigation

```
┌─────────────────────────────┐
│  [P26 Logo]        [☀] [≡] │
└─────────────────────────────┘

Expanded:
┌─────────────────────────────┐
│  [P26 Logo]        [☀] [✕] │
├─────────────────────────────┤
│                             │
│    Projects                 │
│    Games                    │
│    About                    │
│    Contact                  │
│                             │
│    ─────────────────        │
│                             │
│    [GitHub →]               │
│                             │
└─────────────────────────────┘
```

**Hamburger Menu:**
- Size: 44px × 44px
- Three lines → X animation on open
- Transition: 300ms

**Mobile Drawer:**
- Slide from right
- Full height viewport
- Background: `--color-bg-secondary`
- Overlay: 50% black opacity

---

## Footer

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  [P26 Logo]                                                      │
│                                                                  │
│  Changing the world with small contributions.                    │
│                                                                  │
│  ────────────────────────────────────────────────────────────    │
│                                                                  │
│  Projects           Resources         Connect                    │
│  InAppBrowser       Documentation     GitHub                     │
│  RestClient         Changelog         Twitter                    │
│  IonPhaser          License           LinkedIn                   │
│  Animatable                           Email                      │
│                                                                  │
│  ────────────────────────────────────────────────────────────    │
│                                                                  │
│  © 2024 Proyecto 26. Made with ❤️ in Colombia.                   │
│                                                                  │
│                    [𝕏] [GitHub] [LinkedIn] [YouTube]             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: `--color-bg-secondary`
- Border Top: 1px solid `--color-border-default`
- Padding: 64px vertical, container horizontal
- Max Width: `--container-max`

**Logo Section:**
- Logo: 32px height
- Tagline: `--text-lg`, `--color-text-secondary`

**Link Columns:**
- Desktop: 3 columns
- Mobile: Stack vertically
- Column Title: `--text-sm`, uppercase, `--color-text-muted`
- Links: `--text-base`, `--color-text-secondary`
- Link Hover: `--color-text-primary`

**Social Icons:**
- Size: 24px
- Color: `--color-text-muted`
- Hover: `--color-accent-teal`, scale(1.1)
- Spacing: 16px between icons

---

## Stats Counter

Displays organization statistics with animated counters.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│              │  │              │  │              │
│    2,923     │  │      5+      │  │     50+      │
│    Stars     │  │   Projects   │  │ Contributors │
│              │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Specifications:**
- Layout: Flex row, space-evenly
- Number: `--text-4xl`, extrabold, gradient text
- Label: `--text-sm`, `--color-text-muted`, uppercase

**Counter Animation:**
```javascript
// GSAP counter animation
gsap.to(".stat-number", {
  scrollTrigger: {
    trigger: ".stats-section",
    start: "top 80%",
  },
  textContent: (i, el) => el.dataset.value,
  duration: 2,
  ease: "power2.out",
  snap: { textContent: 1 },
  stagger: 0.2,
});
```

---

## Service Card

Displays service/capability areas.

```
┌─────────────────────────┐
│                         │
│         [Icon]          │
│                         │
│    Mobile Development   │
│                         │
│  React Native,          │
│  NativeScript, Ionic    │
│                         │
└─────────────────────────┘
```

**Specifications:**
- Width: Equal columns (3 on desktop)
- Text Align: Center
- Icon: 64px, stroke style, `--color-accent-teal`
- Title: `--text-xl`, semibold
- Description: `--text-base`, `--color-text-secondary`

**Icon Animation:**
- On scroll reveal: Icon draws/animates in
- On hover: Icon bounces subtly

---

## Team Member

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ┌──────────────┐                                    │
│  │              │   Juan David Nicholls              │
│  │    Photo     │   Founder & Lead Developer         │
│  │              │                                    │
│  └──────────────┘   Developer with 8+ years of       │
│                     experience building interactive  │
│                     experiences across web, mobile,  │
│                     and game development.            │
│                                                      │
│                     Based in Colombia 🇨🇴             │
│                                                      │
│                     [LinkedIn] [GitHub] [Twitter]    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Specifications:**
- Layout: Flex row (desktop), stack (mobile)
- Photo: 200px × 200px, rounded, border
- Photo Border: 2px solid gradient (coral → teal)
- Name: `--text-3xl`, bold
- Role: `--text-lg`, `--color-accent-coral`
- Bio: `--text-base`, `--color-text-secondary`

**Photo Animation:**
- Mask reveal on scroll
- Subtle float animation (up/down)
- Border gradient rotation on hover

---

## Custom Cursor

Custom cursor that responds to interactive elements.

**Default State:**
```
    ●
```
- Size: 8px diameter
- Color: `--color-accent-coral`
- Mix-blend-mode: difference

**Hover State (on links/buttons):**
```
   ╭───╮
   │   │
   ╰───╯
```
- Size: 40px diameter
- Border: 2px solid `--color-accent-coral`
- Background: Transparent
- Transition: 200ms scale

**Magnetic Effect:**
- When cursor approaches interactive elements
- Element moves slightly toward cursor
- Max movement: 8px
- Smooth return on mouse leave

**Implementation:**
```javascript
// Custom cursor setup
const cursor = {
  dot: document.querySelector('.cursor-dot'),
  outline: document.querySelector('.cursor-outline'),

  init() {
    document.addEventListener('mousemove', this.move.bind(this));
    this.addHoverListeners();
  },

  move(e) {
    // Smooth follow with slight delay
    gsap.to(this.dot, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
    });
    gsap.to(this.outline, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.3,
    });
  },

  addHoverListeners() {
    const interactives = document.querySelectorAll('a, button, [data-cursor]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => this.expand());
      el.addEventListener('mouseleave', () => this.shrink());
    });
  },

  expand() {
    gsap.to(this.outline, { scale: 2.5, opacity: 1, duration: 0.3 });
    gsap.to(this.dot, { scale: 0.5, duration: 0.3 });
  },

  shrink() {
    gsap.to(this.outline, { scale: 1, opacity: 0.5, duration: 0.3 });
    gsap.to(this.dot, { scale: 1, duration: 0.3 });
  }
};
```

**CSS:**
```css
.cursor-dot,
.cursor-outline {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: var(--z-cursor);
  transform: translate(-50%, -50%);
}

.cursor-dot {
  width: 8px;
  height: 8px;
  background: var(--color-accent-coral);
  border-radius: 50%;
}

.cursor-outline {
  width: 40px;
  height: 40px;
  border: 2px solid var(--color-accent-coral);
  border-radius: 50%;
  opacity: 0.5;
}

/* Hide on touch devices */
@media (hover: none) {
  .cursor-dot,
  .cursor-outline {
    display: none;
  }
}
```

---

## Component Accessibility

All components must follow these accessibility guidelines:

| Requirement | Implementation |
|-------------|----------------|
| Focus visible | 2px outline with offset |
| Keyboard navigation | Tab order, Enter/Space activation |
| ARIA labels | Descriptive labels for screen readers |
| Reduced motion | Respect `prefers-reduced-motion` |
| Color contrast | WCAG AA minimum (4.5:1 for text) |
| Touch targets | Minimum 44px × 44px |

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

*Each component is designed for reusability and consistency across the website.*
