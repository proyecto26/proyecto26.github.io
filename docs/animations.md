# Animation Specifications

> Detailed animation specifications for award-worthy interactions on the Proyecto 26 website.

## Table of Contents
- [Animation Philosophy](#animation-philosophy)
- [GSAP Setup](#gsap-setup)
- [Page Load Animations](#page-load-animations)
- [Scroll Animations](#scroll-animations)
- [Hover Animations](#hover-animations)
- [Micro-interactions](#micro-interactions)
- [Page Transitions](#page-transitions)
- [Parallax Effects](#parallax-effects)
- [Text Animations](#text-animations)
- [Reduced Motion](#reduced-motion)

---

## Animation Philosophy

### Core Principles

1. **Purpose Over Decoration**
   - Every animation should serve a purpose (guide attention, provide feedback, enhance understanding)
   - Avoid animations that delay access to content

2. **Smooth & Natural**
   - Use easing functions that mimic natural motion
   - Prefer `ease-out` for entrances, `ease-in-out` for state changes

3. **Performant**
   - Animate only `transform` and `opacity` when possible
   - Use `will-change` sparingly
   - Target 60fps on all devices

4. **Respectful**
   - Honor `prefers-reduced-motion`
   - Provide skip options for long animations
   - Don't trap users in animations

### Animation Timing Guidelines

| Animation Type | Duration | Easing |
|---------------|----------|--------|
| Micro-interaction (button hover) | 100-200ms | ease-out |
| State change (toggle, tab) | 200-300ms | ease-in-out |
| Content reveal (scroll) | 400-600ms | power3.out |
| Page transition | 500-800ms | power4.inOut |
| Complex sequence | 800-1500ms | custom |

---

## GSAP Setup

### Installation

```javascript
// Install GSAP and plugins
npm install gsap @gsap/scrolltrigger
```

### Global Configuration

```javascript
// src/scripts/animations.ts
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
  markers: false, // Set true for debugging
});

// Refresh on route change (for Astro)
document.addEventListener('astro:page-load', () => {
  ScrollTrigger.refresh();
});
```

---

## Page Load Animations

### Hero Section Entrance

The hero section animates in a carefully orchestrated sequence.

```javascript
// Hero animation timeline
const heroTimeline = gsap.timeline({
  defaults: { ease: 'power4.out' }
});

heroTimeline
  // Logo fade in
  .from('.header-logo', {
    opacity: 0,
    y: -20,
    duration: 0.6,
  })
  // Navigation links stagger
  .from('.nav-link', {
    opacity: 0,
    y: -20,
    stagger: 0.1,
    duration: 0.4,
  }, '-=0.3')
  // Hero title - word by word reveal
  .from('.hero-title .word', {
    y: 100,
    opacity: 0,
    rotateX: -90,
    stagger: 0.08,
    duration: 0.8,
  }, '-=0.2')
  // Hero subtitle
  .from('.hero-subtitle', {
    opacity: 0,
    y: 30,
    duration: 0.6,
  }, '-=0.4')
  // CTA buttons
  .from('.hero-cta', {
    opacity: 0,
    y: 20,
    stagger: 0.15,
    duration: 0.5,
  }, '-=0.3')
  // Stats counter
  .from('.stat-item', {
    opacity: 0,
    y: 30,
    stagger: 0.1,
    duration: 0.5,
  }, '-=0.2');
```

### Background Ambient Animation

Subtle floating shapes/particles in hero background.

```javascript
// Floating shapes animation
gsap.to('.floating-shape', {
  y: 'random(-20, 20)',
  x: 'random(-10, 10)',
  rotation: 'random(-15, 15)',
  duration: 'random(3, 5)',
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true,
  stagger: {
    each: 0.5,
    from: 'random',
  },
});
```

---

## Scroll Animations

### Section Reveal

Each section fades and slides in as it enters the viewport.

```javascript
// Generic section reveal
gsap.utils.toArray('.section').forEach((section) => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
    },
    opacity: 0,
    y: 60,
    duration: 0.8,
  });
});
```

### Project Cards Stagger

Project cards appear with a staggered cascade effect.

```javascript
// Project cards reveal
gsap.from('.project-card', {
  scrollTrigger: {
    trigger: '.projects-section',
    start: 'top 75%',
  },
  opacity: 0,
  y: 80,
  scale: 0.95,
  stagger: {
    amount: 0.6,
    from: 'start',
  },
  duration: 0.7,
  ease: 'back.out(1.2)',
});
```

### Stats Counter Animation

Numbers count up when entering viewport.

```javascript
// Counter animation
gsap.utils.toArray('.stat-number').forEach((counter) => {
  const target = parseInt(counter.dataset.value, 10);

  gsap.from(counter, {
    scrollTrigger: {
      trigger: counter,
      start: 'top 85%',
    },
    textContent: 0,
    duration: 2,
    ease: 'power2.out',
    snap: { textContent: 1 },
    onUpdate: function() {
      counter.textContent = Math.ceil(this.targets()[0].textContent).toLocaleString();
    },
  });
});
```

### Scroll Progress Indicator

A progress bar at the top showing scroll position.

```javascript
// Scroll progress bar
gsap.to('.scroll-progress', {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3,
  },
});
```

---

## Hover Animations

### Button Hover

```javascript
// Magnetic button effect
const magneticButtons = document.querySelectorAll('.btn-magnetic');

magneticButtons.forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  });
});
```

### Card Hover Glow

```css
/* Card glow on hover */
.project-card {
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    var(--color-accent-coral),
    var(--color-accent-teal)
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover::before {
  opacity: 1;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow:
    0 0 30px rgba(242, 56, 90, 0.15),
    0 20px 40px rgba(0, 0, 0, 0.3);
}
```

### Link Underline Animation

```css
/* Animated underline */
.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-accent-coral);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.nav-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

---

## Micro-interactions

### Toggle Switch

```javascript
// Theme toggle animation
const themeToggle = document.querySelector('.theme-toggle');

themeToggle.addEventListener('click', () => {
  const icon = themeToggle.querySelector('.icon');

  gsap.to(icon, {
    rotation: '+=360',
    scale: 0,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      // Swap icon
      icon.classList.toggle('icon-sun');
      icon.classList.toggle('icon-moon');

      gsap.to(icon, {
        scale: 1,
        duration: 0.3,
        ease: 'back.out(2)',
      });
    },
  });
});
```

### Form Input Focus

```css
/* Input focus animation */
.input-wrapper {
  position: relative;
}

.input-label {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  transition: all 0.2s ease;
  pointer-events: none;
}

.input-field:focus + .input-label,
.input-field:not(:placeholder-shown) + .input-label {
  top: 0;
  font-size: 0.75rem;
  color: var(--color-accent-teal);
  background: var(--color-bg-card);
  padding: 0 4px;
}

.input-field:focus {
  border-color: var(--color-accent-teal);
  box-shadow: 0 0 0 3px rgba(74, 217, 217, 0.1);
}
```

### Hamburger Menu Animation

```javascript
// Hamburger to X animation
const hamburger = document.querySelector('.hamburger');
const lines = hamburger.querySelectorAll('.line');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.contains('open');

  if (!isOpen) {
    gsap.to(lines[0], { rotation: 45, y: 8, duration: 0.3 });
    gsap.to(lines[1], { opacity: 0, duration: 0.2 });
    gsap.to(lines[2], { rotation: -45, y: -8, duration: 0.3 });
  } else {
    gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3 });
    gsap.to(lines[1], { opacity: 1, duration: 0.2, delay: 0.1 });
    gsap.to(lines[2], { rotation: 0, y: 0, duration: 0.3 });
  }

  hamburger.classList.toggle('open');
});
```

---

## Page Transitions

Using Astro's View Transitions API with custom animations.

### Configuration

```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [],
  // Enable view transitions
  experimental: {
    viewTransitions: true,
  },
});
```

### Transition Styles

```css
/* Page transition animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slide-from-right {
  from { transform: translateX(30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slide-to-left {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(-30px); opacity: 0; }
}

::view-transition-old(root) {
  animation: fade-out 0.3s ease-out, slide-to-left 0.3s ease-out;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-out 0.1s, slide-from-right 0.3s ease-out 0.1s;
  animation-fill-mode: backwards;
}
```

---

## Parallax Effects

### Hero Background Parallax

```javascript
// Parallax background layers
gsap.utils.toArray('.parallax-layer').forEach((layer, i) => {
  const depth = layer.dataset.depth || 0.2;

  gsap.to(layer, {
    yPercent: -100 * depth,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
});
```

### Card Parallax on Mouse

```javascript
// 3D card parallax effect
const cards = document.querySelectorAll('.project-card');

cards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotationY: x * 10,
      rotationX: -y * 10,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  });
});
```

---

## Text Animations

### Split Text Reveal

```javascript
// Split text into words/chars for animation
function splitText(element) {
  const text = element.textContent;
  const words = text.split(' ');

  element.innerHTML = words
    .map(word => `<span class="word"><span class="word-inner">${word}</span></span>`)
    .join(' ');

  return element.querySelectorAll('.word-inner');
}

// Animate split text
const heroTitle = document.querySelector('.hero-title');
const words = splitText(heroTitle);

gsap.from(words, {
  y: '100%',
  opacity: 0,
  rotationX: -90,
  stagger: 0.05,
  duration: 0.8,
  ease: 'back.out(1.7)',
});
```

### CSS for Split Text

```css
.word {
  display: inline-block;
  overflow: hidden;
}

.word-inner {
  display: inline-block;
}
```

### Typewriter Effect

```javascript
// Typewriter effect for taglines
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Usage with ScrollTrigger
ScrollTrigger.create({
  trigger: '.typewriter-text',
  start: 'top 80%',
  onEnter: () => {
    const el = document.querySelector('.typewriter-text');
    typeWriter(el, el.dataset.text, 60);
  },
  once: true,
});
```

### Gradient Text Animation

```css
/* Animated gradient text */
.gradient-text {
  background: linear-gradient(
    90deg,
    var(--color-accent-coral) 0%,
    var(--color-accent-teal) 50%,
    var(--color-accent-orange) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 3s linear infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}
```

---

## Reduced Motion

Always respect user preferences for reduced motion.

### Media Query

```css
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
```

### JavaScript Detection

```javascript
// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Disable GSAP animations if reduced motion is preferred
if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(100); // Skip to end
  ScrollTrigger.getAll().forEach((st) => st.disable());
}

// Or provide alternative simple animations
const animationConfig = prefersReducedMotion
  ? { opacity: 0, duration: 0.01 }
  : { opacity: 0, y: 50, duration: 0.8 };

gsap.from('.animate-element', animationConfig);
```

---

## Animation Performance Tips

1. **Use `transform` and `opacity`** - These are GPU-accelerated
2. **Avoid animating `width`, `height`, `top`, `left`** - These cause layout recalculation
3. **Use `will-change` sparingly** - Only on elements about to animate
4. **Batch DOM reads and writes** - Use requestAnimationFrame
5. **Pause off-screen animations** - Use ScrollTrigger's `onLeave`/`onEnterBack`
6. **Use CSS animations for simple effects** - Less JavaScript overhead

```javascript
// Pause animations when not visible
ScrollTrigger.create({
  trigger: '.animated-section',
  onLeave: () => sectionTimeline.pause(),
  onEnterBack: () => sectionTimeline.play(),
});
```

---

*These animation specifications create an award-worthy experience while maintaining performance and accessibility.*
