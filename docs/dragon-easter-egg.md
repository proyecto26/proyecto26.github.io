# Dragon Easter Egg Specification

> Detailed specification for the dragon animation Easter egg triggered by clicking the logo.

## Overview

The dragon animation is a signature element of Proyecto 26's identity. Instead of showing it as an intro splash screen (which delays content access), it's converted to an Easter egg that rewards curious users who click the logo.

---

## Trigger Behavior

### Activation

- **Trigger**: Click/tap on the P26 logo in the header
- **First Time**: Animation plays automatically, stores flag in `sessionStorage`
- **Subsequent**: Animation plays on every click (user chose to see it)

### Deactivation

- Click anywhere outside the animation
- Press Escape key
- Wait for animation to complete (~4 seconds)
- Click close button (X)

---

## Animation Sequence

### Timeline

```
0.0s  ─────────────────────────────────────────────────────────  4.0s
  │                                                                │
  ├─ Overlay fade in (0-0.3s)                                      │
  │                                                                │
  ├─ Dragon enters from left (0.2-1.5s)                            │
  │   └─ Rope physics simulation                                   │
  │                                                                │
  ├─ Dragon reaches center (1.5s)                                  │
  │   └─ Roar sound plays                                          │
  │   └─ Logo glows                                                │
  │                                                                │
  ├─ Dragon holds position (1.5-3.0s)                              │
  │   └─ Subtle idle animation                                     │
  │                                                                │
  ├─ Dragon exits right (3.0-3.8s)                                 │
  │                                                                │
  └─ Overlay fade out (3.5-4.0s)                                   │
```

### Phase Details

#### Phase 1: Overlay Entrance (0-0.3s)

```javascript
// Overlay fade in
gsap.to('.dragon-overlay', {
  opacity: 1,
  duration: 0.3,
  ease: 'power2.out',
});

// Background blur
gsap.to('body', {
  filter: 'blur(8px)',
  duration: 0.3,
});
```

**Overlay Styles:**
```css
.dragon-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 11, 0.9);
  backdrop-filter: blur(8px);
  z-index: var(--z-modal);
  opacity: 0;
  pointer-events: none;
}

.dragon-overlay.active {
  opacity: 1;
  pointer-events: auto;
}
```

#### Phase 2: Dragon Entrance (0.2-1.5s)

The dragon uses the existing Phaser-based animation from the current site.

**Dragon Configuration:**
```javascript
const dragonConfig = {
  sprite: '/img/dragon.png',
  startX: -200,
  startY: window.innerHeight / 2,
  endX: window.innerWidth / 2,
  endY: window.innerHeight / 2,
  ropeLength: 300,
  ropeSegments: 20,
  entranceDuration: 1300,
};
```

**Rope Physics:**
- Uses Phaser's rope physics for swinging motion
- 20 segments for smooth curve
- Gravity simulation for natural movement

#### Phase 3: Roar & Logo Glow (1.5s)

```javascript
// Play roar sound
const audio = new Audio('/audio/dragon.mp3');
audio.volume = 0.7;
audio.play();

// Logo glow effect
gsap.to('.header-logo', {
  filter: 'drop-shadow(0 0 20px var(--color-accent-coral))',
  scale: 1.1,
  duration: 0.5,
  yoyo: true,
  repeat: 2,
});
```

**Audio Formats:**
- Primary: `/audio/dragon.mp3`
- Fallback: `/audio/dragon.ogg`

#### Phase 4: Idle Animation (1.5-3.0s)

```javascript
// Subtle hovering motion
gsap.to('.dragon-sprite', {
  y: '+=10',
  duration: 0.8,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: 2,
});

// Wing flap (if animated sprite)
// Handled by Phaser sprite animation
```

#### Phase 5: Exit Animation (3.0-4.0s)

```javascript
// Dragon flies off screen
gsap.to('.dragon-container', {
  x: window.innerWidth + 200,
  duration: 0.8,
  ease: 'power2.in',
});

// Overlay fade out
gsap.to('.dragon-overlay', {
  opacity: 0,
  duration: 0.5,
  delay: 0.3,
  onComplete: () => {
    dragonOverlay.classList.remove('active');
  },
});
```

---

## Implementation Options

### Option A: Port Existing Phaser Animation (Recommended)

Use the existing Phaser.js implementation from the current site.

**Pros:**
- Already tested and working
- Complex rope physics included
- Minimal new development

**Cons:**
- Requires loading Phaser.js
- Larger bundle size

**Files to port:**
- `scripts/dragon.js` - Dragon animation logic
- `img/dragon.png` - Dragon sprite
- `audio/dragon.mp3` / `dragon.ogg` - Roar sound

**Integration:**
```astro
<!-- DragonEasterEgg.astro -->
---
// Only load Phaser when needed
---

<div id="dragon-overlay" class="dragon-overlay">
  <button class="dragon-close" aria-label="Close">×</button>
  <div id="dragon-container"></div>
</div>

<script>
  // Lazy load Phaser only when Easter egg is triggered
  let phaserLoaded = false;

  document.querySelector('.header-logo').addEventListener('click', async (e) => {
    e.preventDefault();

    if (!phaserLoaded) {
      await import('phaser');
      await import('./dragon.js');
      phaserLoaded = true;
    }

    window.playDragonAnimation();
  });
</script>
```

### Option B: Pure CSS/GSAP Animation

Recreate the animation without Phaser using CSS and GSAP.

**Simplified Dragon Animation:**
```javascript
// GSAP-based dragon animation
function playDragonAnimation() {
  const overlay = document.getElementById('dragon-overlay');
  const dragon = document.getElementById('dragon-sprite');

  overlay.classList.add('active');

  const tl = gsap.timeline({
    onComplete: () => {
      overlay.classList.remove('active');
    }
  });

  tl.from(dragon, {
    x: -300,
    duration: 1.5,
    ease: 'power2.out',
  })
  .to(dragon, {
    y: '-=20',
    duration: 0.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: 3,
  }, '-=0.5')
  .add(() => {
    // Play sound
    new Audio('/audio/dragon.mp3').play();
  }, 1.5)
  .to('.header-logo', {
    scale: 1.1,
    filter: 'drop-shadow(0 0 30px #f2385a)',
    duration: 0.3,
    yoyo: true,
    repeat: 2,
  }, 1.5)
  .to(dragon, {
    x: window.innerWidth + 300,
    duration: 0.8,
    ease: 'power2.in',
  }, '+=0.5');
}
```

**Pros:**
- Smaller bundle (no Phaser)
- Simpler maintenance

**Cons:**
- No rope physics
- Less impressive animation

---

## Component Structure

### Astro Component

```astro
<!-- src/components/DragonEasterEgg.astro -->
---
export interface Props {
  audioSrc?: string;
  spriteSrc?: string;
}

const {
  audioSrc = '/audio/dragon.mp3',
  spriteSrc = '/img/dragon.png'
} = Astro.props;
---

<div
  id="dragon-overlay"
  class="dragon-overlay"
  role="dialog"
  aria-label="Dragon animation"
  aria-hidden="true"
>
  <button
    class="dragon-close"
    aria-label="Close animation"
  >
    <svg><!-- X icon --></svg>
  </button>

  <div id="dragon-container">
    <img
      id="dragon-sprite"
      src={spriteSrc}
      alt="Dragon mascot"
      class="dragon-sprite"
    />
  </div>

  <audio id="dragon-audio" preload="none">
    <source src={audioSrc} type="audio/mpeg" />
    <source src={audioSrc.replace('.mp3', '.ogg')} type="audio/ogg" />
  </audio>
</div>

<style>
  .dragon-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 10, 11, 0.9);
    backdrop-filter: blur(8px);
    z-index: 500;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dragon-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .dragon-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    background: transparent;
    border: 1px solid var(--color-border-default);
    border-radius: 50%;
    color: var(--color-text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .dragon-close:hover {
    background: var(--color-bg-hover);
    border-color: var(--color-accent-coral);
  }

  .dragon-sprite {
    width: 200px;
    height: auto;
    transform: translateX(-100vw);
  }
</style>

<script>
  import { dragonAnimation } from '../scripts/dragon';

  // Initialize when component loads
  document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.header-logo');
    const overlay = document.getElementById('dragon-overlay');
    const closeBtn = overlay?.querySelector('.dragon-close');

    // Trigger animation on logo click
    logo?.addEventListener('click', (e) => {
      e.preventDefault();
      dragonAnimation.play();
    });

    // Close handlers
    closeBtn?.addEventListener('click', () => dragonAnimation.stop());
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) dragonAnimation.stop();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') dragonAnimation.stop();
    });
  });
</script>
```

### Animation Script

```typescript
// src/scripts/dragon.ts
import gsap from 'gsap';

class DragonAnimation {
  private overlay: HTMLElement | null;
  private sprite: HTMLElement | null;
  private audio: HTMLAudioElement | null;
  private timeline: gsap.core.Timeline | null = null;
  private isPlaying = false;

  constructor() {
    this.overlay = document.getElementById('dragon-overlay');
    this.sprite = document.getElementById('dragon-sprite');
    this.audio = document.getElementById('dragon-audio') as HTMLAudioElement;
  }

  play() {
    if (this.isPlaying || !this.overlay || !this.sprite) return;

    this.isPlaying = true;
    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');

    // Preload audio
    this.audio?.load();

    this.timeline = gsap.timeline({
      onComplete: () => this.stop(),
    });

    const centerX = window.innerWidth / 2 - 100;

    this.timeline
      // Dragon enters
      .to(this.sprite, {
        x: centerX,
        duration: 1.5,
        ease: 'power3.out',
      })
      // Play roar at center
      .add(() => {
        this.audio?.play().catch(() => {
          // Audio play failed (user interaction required)
        });
      })
      // Logo glow
      .to('.header-logo', {
        scale: 1.15,
        filter: 'drop-shadow(0 0 30px #f2385a)',
        duration: 0.4,
        yoyo: true,
        repeat: 2,
      }, '<')
      // Idle hover
      .to(this.sprite, {
        y: -15,
        duration: 0.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 2,
      }, '<0.2')
      // Dragon exits
      .to(this.sprite, {
        x: window.innerWidth + 200,
        duration: 0.8,
        ease: 'power2.in',
      }, '+=0.3');
  }

  stop() {
    if (!this.isPlaying) return;

    this.timeline?.kill();
    this.audio?.pause();
    if (this.audio) this.audio.currentTime = 0;

    gsap.to(this.overlay, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        this.overlay?.classList.remove('active');
        this.overlay?.setAttribute('aria-hidden', 'true');
        // Reset dragon position
        gsap.set(this.sprite, { x: '-100vw', y: 0 });
        gsap.set('.header-logo', { scale: 1, filter: 'none' });
        this.isPlaying = false;
      },
    });
  }
}

export const dragonAnimation = new DragonAnimation();
```

---

## Accessibility Considerations

### Keyboard Navigation

- **Escape**: Close animation
- **Tab**: Focus close button when overlay is open
- Focus trap within overlay when active

### Screen Readers

```html
<div
  role="dialog"
  aria-label="Dragon animation Easter egg"
  aria-hidden="true"
>
  <button aria-label="Close animation">×</button>
</div>
```

### Reduced Motion

```javascript
// Check user preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Show static dragon image instead
  this.sprite.style.transform = `translateX(${centerX}px)`;
  this.overlay.classList.add('active');

  // Auto-close after 2 seconds
  setTimeout(() => this.stop(), 2000);
}
```

---

## Assets Required

| Asset | Path | Format | Size |
|-------|------|--------|------|
| Dragon sprite | `/img/dragon.png` | PNG | ~50KB |
| Roar audio (MP3) | `/audio/dragon.mp3` | MP3 | ~30KB |
| Roar audio (OGG) | `/audio/dragon.ogg` | OGG | ~25KB |

---

## Testing Checklist

- [ ] Logo click triggers animation
- [ ] Dragon enters smoothly from left
- [ ] Audio plays at correct timing
- [ ] Logo glows during roar
- [ ] Dragon exits to right
- [ ] Overlay closes after animation
- [ ] Escape key closes animation
- [ ] Click outside closes animation
- [ ] Close button works
- [ ] Reduced motion respected
- [ ] Mobile/touch devices work
- [ ] Audio works with user interaction requirement

---

*The dragon Easter egg adds delight and personality while respecting user experience by not delaying content access.*
