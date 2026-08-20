# Motion System Masterplan

## 1. Animation Inventory & Sequencing

### The Entry Experience: "The Archives Open"
Replacing the standard loading spinner with a cinematic, physical entry into the space.
- **Phase 1 (The Approach):** Starts on a pure black screen. A subtle, low-opacity architectural walkway or stone texture fades in. A slow scale transformation (`scale(1.05) to scale(1)`) simulates the camera moving forward.
- **Phase 2 (The Doors):** Heavy wooden doors become visible. They swing open outward using 3D perspective (`rotateY` with `transform-origin` on the hinges).
- **Phase 3 (The Light):** As the doors open, a warm, glowing light (opacity/filter fade) spills from the crack, expanding to fill the screen.
- **Phase 4 (The Reveal):** The light fades down to reveal the main library interior. The transition must complete in under 2.5 seconds to respect the user's time.

### The Blog/Writings: "The Hanging Scroll"
Replacing the standard modal with a physical parchment unrolling.
- **Initialization:** Hidden, tightly rolled (scaleY: 0).
- **Unroll:** Unfurls from the top downwards. `transform-origin: top center`. `scaleY` animates from `0` to `1.02` (the overshoot), then settles to `1`.
- **Content Reveal:** Once the scroll settles, article titles fade in progressively (staggered delay of 50ms each) with a slight upward translation (`translateY(10px)` to `0`).
- **Dismissal:** Rolls back up quickly and smoothly fading out.

### The Bookshelf Interactions
- **Hover (The Inspection):** 
  - The target book slides forward (`translateZ(20px)` or `translateY(-15px)`) and tilts slightly on the Y-axis to reveal its cover edge.
  - The gold foil catches the light (a linear gradient mask translating across the spine).
  - Neighboring books drop in opacity slightly (to `0.6`) and desaturate slightly to enforce focus.
- **Selection (The Pull):** 
  - The chosen book is physically pulled from the shelf (`scale(1.2)`, `translateY(-30px)`).
  - The background library drops into a heavy cinematic blur/darkness (`backdrop-filter: blur`, `background: rgba(0,0,0,0.8)`).
  - The book crossfades and transforms into the `BookViewer` flipbook seamlessly.

### Navigation Interactions
- **Hover State:** Navigation text slightly increases in letter-spacing (`0.1em` to `0.12em`). A soft, warm text-shadow illuminates the text (`0 0 8px rgba(200, 175, 120, 0.4)`). An elegant gold underline expands from the center (`transform: scaleX(0)` to `scaleX(1)`). No bouncing.

### General Page Transitions
- **Contextual Movement:** Switching between main views (e.g., from Library to the About desk) utilizes a slow, controlled crossfade paired with a slight depth push (`scale(0.98)` to `scale(1)` on the incoming element) to feel like camera refocusing.

---

## 2. Interaction States & Transform Behavior

| Element | Property | Initial State | Active/Hover State | Transform Origin |
|---------|----------|---------------|--------------------|------------------|
| Entry Doors | `rotateY` | `0deg` | `90deg` (left), `-90deg` (right) | `left` / `right` |
| Writings Scroll | `scaleY` | `0` | `1` (overshoots to `1.02`) | `top center` |
| Scroll Titles | `translateY`, `opacity` | `10px`, `0` | `0px`, `1` | `center` |
| Book Spine (Hover) | `translateY`, `rotateY` | `0px`, `0deg` | `-15px`, `-5deg` | `bottom center` |
| Nav Links | `letter-spacing`, `text-shadow` | `0.1em`, `none` | `0.12em`, `0 0 8px var(--gold)` | `center` |
| Nav Underline | `scaleX` | `0` | `1` | `center` |

---

## 3. Timing & Easing

To ensure motion feels physical, heavy, and intentional, avoid linear easing. Rely on custom cubic-bezier curves that simulate real-world physics (mass, friction, gravity).

- **The Heavy Pull (Doors, Scroll Unroll, Book Pull):**
  - Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` (Fast acceleration, long slow friction tail).
  - Duration: `600ms - 800ms`.
- **The Delicate Hover (Navigation, Book Inspect):**
  - Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (Standard elegant ease-out).
  - Duration: `300ms - 400ms`.
- **The Settling Overshoot (Scroll unroll bounce):**
  - Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (Slight elastic bounce).
  - Duration: `500ms`.
- **The Cinematic Crossfade (Page Transitions, Light Spills):**
  - Easing: `ease-in-out`.
  - Duration: `800ms - 1200ms`.

---

## 4. Performance Rules

1. **GPU Acceleration:** All major animations MUST utilize hardware-accelerated properties (`transform` and `opacity`). 
2. **Avoid Layout Thrashing:** Never animate `width`, `height`, `margin`, `padding`, or `top`/`left`. Use `scale`, `translate`, and `clip-path` instead.
3. **Paint Bottlenecks:** Be cautious with `box-shadow` and `backdrop-filter: blur` during active motion. If a transition involves heavy blurring, consider crossfading a pre-blurred image asset or disabling the blur during the animation and applying it only at the resting state.
4. **Will-Change:** Apply `will-change: transform, opacity` to the Library Doors and the Book elements immediately before they animate, and remove it after to free memory.

---

## 5. Reduced-Motion Behavior

Respecting `prefers-reduced-motion: reduce`:
- **Entry Experience:** Skip the door sequence entirely. Start directly inside the library with a simple `500ms` fade-in.
- **Scroll Unroll:** Replace the unrolling `scaleY` animation with a standard opacity fade-in.
- **Bookshelf:** Disable the 3D rotation and depth translation on hover. Use only the illumination (opacity/brightness change) and a subtle underline/indicator to show selection.
- **Transitions:** All page and camera transitions default to a quick `300ms` crossfade without any scaling or spatial movement.
