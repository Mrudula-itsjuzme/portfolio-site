# UI Masterplan

## 1. Current-State Audit

### Overall Visual Identity & Metaphor
The website successfully establishes a "Dark Academia / Enchanted Library" metaphor. The primary focal point is a skeumorphic, double-decker wooden bookshelf populated with interactive book volumes. The atmosphere is warm, slightly dusty, and intimate, resembling a private archive. 

### Page Structure & Layout
- **Header**: Fixed top bar with a logo, title, subtitle, and navigation links. Also contains actions for downloading a resume and toggling ambient sound.
- **Main Area**: A centered bookshelf showcasing repositories as distinct book spines.
- **Modals**: Overlay modals for "About," "Contact," and "Writings" providing brief information.
- **BookViewer**: An overlay flipbook for inspecting individual projects.
- **Footer**: A floating stats bar detailing volumes, projects, research notes, and experiments.

### Navigation
Navigation relies on standard header links that either smooth-scroll to anchors (`#archive`) or open fixed modals with blurred backdrops (`#about`, `#contact`, etc.).

### Typography
- Headings & Logo: `Cinzel` (serif, classic, cinematic).
- Body & Accents: `Cormorant Garamond` (elegant serif) and `Outfit` (clean sans-serif for UI elements).
- Typography generally fits the theme but can sometimes lack strict hierarchical contrast, particularly within the BookViewer.

### Colors & Backgrounds
- Deep greens, rich browns (`var(--walnut-950)` to `var(--walnut-600)`), and parchment/gold accents (`--gold`, `--parchment`).
- The background utilizes radial gradients and repeating linear gradients to simulate a dimly lit, wood-paneled room.

### Bookshelf Composition & Books
- Books are dynamically generated from GitHub repositories.
- They feature realistic textures (leather grain, foil stamps, gilded edges).
- Books tilt and align organically.

### Interactive Elements & Animations
- **Hover**: Book spines lift upwards, gilding shimmers, and a small dust puff animation triggers.
- **Click**: Books open into a React PageFlip `BookViewer`.
- **Audio**: Ambient low-frequency drones play, with distinct tones for pulling and flipping books.
- **Intro**: `UnswirlingPages` animation plays on initial load.
- **Modals**: Fade and scale-in transitions.

### Loading Experience
- A custom spinner with a library notice for fetching GitHub repositories.
- `UnswirlingPages` masks the initial rendering of the shelf.

### Responsive Behavior
- **Mobile (<768px)**: The bookshelf switches from a vertical stack to a horizontal scrollable row with navigational arrows. 
- The navigation modals and flipbook scale down effectively, though the flipbook can feel cramped on very small screens.

### Blog / Writing Section
- Currently a placeholder modal stating "records are currently being compiled." It breaks the immersion by relying on a standard web modal rather than integrating with the library metaphor (e.g., a ledger, a desk, or loose parchment).

### Performance Bottlenecks & Assets
- Heavy use of CSS box-shadows, filters (blur), and gradients for wood and leather textures.
- The `dust-field` relies on multiple continuously animating DOM elements, which could cause layout thrashing or CPU drain on lower-end devices.
- React-PageFlip and Three.js (listed in dependencies but minimally used/optimized here) can be heavy.
- Audio API initialization could cause micro-stutters if not deferred.

---

## 2. Design Direction & Final Visual Language

The website must feel like **entering a mysterious, beautifully designed private library** rather than a conventional SaaS dashboard or typical portfolio.

### Core Aesthetic Pillars
- **Dark Academia**: Scholarly, timeless, and slightly esoteric.
- **Cinematic Storytelling**: Dramatic lighting, intentional pacing, and narrative discovery.
- **Antique Library Architecture**: Solid mahogany, brass fittings, dust motes, and soft sconce lighting.
- **Subtle Fantasy**: The archive feels alive, bordering on enchanted.
- **Tactile Materials**: Leather, parchment, gold foil, and heavy wood.

### Anti-Goals (What to Avoid)
- No AI-generated generic UI.
- No excessive glassmorphism, neon cyberpunk glow, or oversized rounded cards.
- No cartoon-like effects or bouncy physics.
- Avoid visual clutter; rely on negative space and shadow for definition.

---

## 3. The Design System

### Typography System
- **Display / Primary Headings**: `Cinzel` (Regular/Bold). Used for book titles, the main logo, and grand section headers.
- **Secondary Headings**: `Cormorant Garamond` (Italic/Semibold). Used for subheadings, author names, and quotes.
- **Body Text**: `Cormorant Garamond` (Regular). For all long-form reading (book pages, essays).
- **UI & Navigation**: `Outfit` (Light/Regular). Used sparingly for utility text (buttons, stats, metadata) to ensure legibility without breaking the antique feel. Letter-spacing applied generously (`0.1em` to `0.15em`) for elegance.

### Color & Material System
- **Background / Walls**: Deep Library Green (`#0a120e` to `#14241d`) with subtle vignette gradients.
- **Woodworks (Shelves, Desk)**: Rich Walnut and Mahogany (`#17100d`, `#241811`, `#332118`).
- **Parchment (Pages, Modals)**: Warm, aged paper (`#e6d7bd`, `#cbb798`, `#f4e4c7`).
- **Ink**: Deep Charcoal (`#2e2318` or `#1a1614`). Never pure black.
- **Accents (Foil, Highlights)**: Muted Antique Gold (`#c8a868`, `#d7be89`).
- **Leather Bindings**: Deep Oxblood (`#4f1c1e`), Forest (`#35543f`), Navy (`#324765`), Charcoal (`#3f3f40`), Amber (`#644229`).

### Surface & Depth
- **Lighting**: Cinematic chiaroscuro. Light should appear to cast from warm wall sconces, creating specular highlights on gold foil and deep, soft drop shadows beneath shelves and books.
- **Shadows**: Multi-layered, soft, and dark (e.g., `0 20px 40px rgba(0,0,0,0.8)`). Avoid sharp or colored shadows.
- **Borders**: Hairline brass/gold borders (`1px solid rgba(200, 175, 120, 0.15)`). No thick borders or pill-shaped cards.
- **Textures**: Rely on CSS noise/grain and repeating linear gradients for wood grain. Keep it subtle to avoid cheapening the look.

### Spacing & Layout
- Generous padding and margins. The library should feel spacious, not cramped.
- The bookshelf should remain the central anchor, with UI elements floating discreetly at the edges.

---

## 4. Interaction & Motion System

### Book Interactions
- **Hover**: The spine smoothly slides forward (`translateY(-10px) scale(1.02)`), casting a deeper shadow. A subtle, elegant shimmer sweeps across the gold foil.
- **Click (Pull)**: The book gracefully scales up, crossfading into the `BookViewer`. The ambient sound deepens slightly.

### Navigation Interactions
- Links should underline smoothly or gently glow (text-shadow) on hover.
- Modals should **not** feel like web popups. Instead, they should appear as parchment ledgers sliding onto a desk or elegantly fading into the center of the screen with a subtle scale-down effect (cinematic focus pull).

### Loading & Page Transitions
- **Initial Load**: Fade in from pure black. A cinematic sweep of light reveals the shelf. The dust particles fade in gradually.
- **Page Transitions**: Rely on crossfades and slow, purposeful easing (`cubic-bezier(0.4, 0, 0.2, 1)`).

### Scroll Interactions
- Parallax depth. As the user scrolls, the dust field and background wall should move at slightly different speeds to create a 3D diorama effect.

---

## 5. Feature Improvements & Strategy

### The "Writings" / Blog Experience
- **Current**: A placeholder modal.
- **Vision**: Writings should be integrated into the physical space. Instead of a modal, clicking "Writings" could scroll the view down to a "Reading Desk" containing scattered parchment letters, an open ledger, or a stack of journals representing blog posts.

### Responsive Strategy
- **Tablet/Mobile**: The horizontal scroll for the bookshelf works well but needs refined swipe physics (momentum scrolling). Modals must consume the full screen with ample padding, mimicking a book held close to the face. The BookViewer must gracefully degrade to single-page swiping on mobile.

### Accessibility
- Ensure high contrast between Ink and Parchment.
- Support `prefers-reduced-motion` by disabling the dust field and simplifying book pull animations to standard fades.
- Ensure all books and navigation items are fully keyboard navigable (`:focus-visible` utilizing gold outlines).

### Performance Optimization
- Convert heavy CSS blur/shadows on non-interactive background elements to pre-rendered `.webp` static assets if they cause lag.
- Use `will-change: transform` judiciously only on the currently animating book.
- Throttle the dust particle count based on screen size/DPI.

---

## 6. Implementation Order

1. **Refine the Base Theme**: Update `library.css` to enforce the strict color palette, typography scaling, and lighting (removing generic modal styling).
2. **Upgrade Bookshelf Interactivity**: Enhance the book hover states (smooth the foil shimmer, perfect the shadow depth).
3. **Overhaul Modals**: Redesign "About" and "Contact" to resemble tactile artifacts (parchment ledgers or calling cards) rather than floating web cards.
4. **Build the "Writings" Desk**: Replace the placeholder modal with a new visual section (the Reading Desk) for blog posts.
5. **Optimize Performance**: Audit CSS paint complexity, optimize the dust particles, and ensure smooth 60fps scrolling on mobile.
6. **Cinematic Polish**: Refine the initial loading sequence, audio fade-ins, and `BookViewer` transitions.
