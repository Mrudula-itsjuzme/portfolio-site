# Dream Bubbles: Design & Architecture Document

## 1. Concept
The **Dream Bubbles** system extends the Dark Academia library metaphor by transforming generic tooltips and modals into "visual memories." When reading a project book, specific text annotations act as triggers. Instead of a hard cut to a modal, clicking these triggers causes a piece of media (a screenshot, a diagram, or a memory) to gently float out of the physical page, expanding into a focused "Dream Bubble." It creates the feeling of an illuminated manuscript where illustrations physically emerge from the text.

## 2. Visual Language
The aesthetics of Dream Bubbles vary based on the media type, but they all share the Dark Academia DNA:
- **Depth and Materiality:** Bubbles cast soft, diffuse shadows onto the book below (`box-shadow: 0 20px 40px rgba(0,0,0,0.5)`).
- **Lighting:** A subtle, warm inner glow (champagne/gold) indicating illumination (`box-shadow: inset 0 0 15px rgba(230,200,140,0.1)`).
- **Borders:** Thin, elegant framing, sometimes using double lines or metallic gradients to mimic antique picture frames or archival polaroids.
- **Backdrop:** Rather than a flat black overlay, the background gently dims and blurs, keeping the book visible but out of focus to maintain physical context.

## 3. Interaction Model
- **The Trigger:** Subtle in-text annotations like `[FIG 01. ARCHITECTURE]` or marginalia labels with a slight golden underline and a custom cursor (e.g., a magnifying glass or feather).
- **Hover State (Trigger):** The trigger text glows slightly, and a tiny spark or dust mote might appear nearby to hint at interactivity.
- **Activation (Click):** The media emerges from the *exact screen coordinates* of the trigger text.
- **Focus:** The bubble scales up and centers itself in the viewport. The book behind it blurs.
- **Dismissal:** Clicking anywhere outside the bubble, pressing `Escape`, or clicking a subtle '×' collapses the bubble back into the original text coordinate, dissolving it.

## 4. Media Types & Treatments
Different media require distinct visual containers:
- **Screenshots / UI Previews:** Floating polaroids or framed archival prints with thick, warm parchment-colored borders.
- **Technical Diagrams / Charts:** Scientific plates with dark backgrounds, grid lines, and thin copper-colored borders. Captions rendered in `Outfit` (sans-serif) or a monospace typewriter font.
- **Videos / Demos:** Floating cinematic windows, borderless but with a heavy drop shadow and a subtle glass reflection over the video element.
- **Personal Content:** Scraps of journal clippings, slightly rotated, with a textured paper background.

## 5. Animation Choreography (The "Dream" Motion)
The transition is handled via Framer Motion, utilizing the `layoutId` pattern (or manual coordinate mapping) for seamless origin-to-center physics.
- **Origin:** Starts at `scale: 0.1`, `opacity: 0`, positioned exactly over the trigger word.
- **Emerge:** Uses a physical spring (`type: "spring", stiffness: 180, damping: 20`). The bubble curves slightly outward as it moves to the center (`translateZ` / `scale` / `translateY`).
- **Settle:** Lands in the center of the screen, floating with a very subtle, slow vertical drift (`y: [0, -4, 0]`, `duration: 6s`).
- **Return:** Reverses the path and spring dynamics back to the origin point before fading out.

## 6. Component Architecture
To keep the existing book architecture intact, the system uses two main components:
1. `<DreamTrigger />`: An inline component placed within the book's `<Page />` text. It accepts an `id` and a `label`. Clicking it dispatches an event (or updates context) with the trigger's bounding rect and the associated media data.
2. `<DreamPortal />`: A top-level component rendered *outside* the flipbook (in `BookViewer.jsx`). It listens for the active bubble state and renders the expanding media over everything else, handling the complex Framer Motion transitions without being clipped by the page.

## 7. Data Structure
Project data will be enriched to support a `dreams` dictionary. 
```javascript
// Example addition to a project object
dreams: {
  "arch-diagram": {
    type: "diagram",
    src: "https://example.com/arch.png",
    caption: "The data ingestion pipeline.",
    alt: "Architecture diagram showing ingestion"
  },
  "ui-preview": {
    type: "screenshot",
    src: "https://example.com/ui.png",
    caption: "The final dashboard layout.",
  }
}
```
The `<DreamTrigger id="arch-diagram" label="[FIG 1]" />` simply looks up the data from the project context.

## 8. Responsive Behavior
- **Desktop:** Bubbles can expand to `max-width: 80vw` and float in the center.
- **Mobile:** The origin-to-center animation remains, but the bubble expands to fill most of the screen (`width: 90vw`, `margin-top: 10vh`). The subtle floating animation is disabled to prevent scroll interference and save battery.

## 9. Accessibility
- Triggers are rendered as `<button>` elements with `aria-haspopup="dialog"`.
- Focus is trapped within the Dream Bubble when open.
- The `Escape` key closes the bubble and returns focus to the trigger.
- Users with `prefers-reduced-motion: reduce` get a simple `opacity` fade-in in the center of the screen, skipping the complex coordinate-based scaling.

## 10. Performance Strategy
- **Lazy Loading:** The `<DreamPortal />` and its heavier image/video assets are only loaded into the DOM when a trigger is clicked. We do not preload large GIFs for every bubble.
- **GPU Acceleration:** All expanding animations rely strictly on `transform` (`scale`, `translate`) and `opacity`. No layout properties are animated.
- **No Heavy 3D Libs:** Framer Motion (already in use) is fully capable of handling the spring physics without needing Three.js.

## 11. Example Project Implementation
Inside `buildPages()` (in `BookViewer.jsx`), paragraphs can be parsed to include triggers, or custom page types (`kind: "essay-with-dreams"`) can be created that interleave text with `<DreamTrigger />` components.

## 12. Recommended Implementation Order
1. **Data Layer:** Update the `projects.js` to include a sample `dreams` dictionary for one project.
2. **Context / State:** Add state to `BookViewer.jsx` to track `activeDream` (which holds coordinates and data).
3. **The Trigger:** Build `<DreamTrigger />` to replace static marginalia text.
4. **The Portal:** Build `<DreamPortal />` using Framer Motion to handle the spring animation from the trigger's coordinates to the screen center.
5. **Media Treatments:** Implement the specific CSS wrappers inside `<DreamPortal />` for `diagram`, `screenshot`, and `video`.
6. **Integration:** Update `Page.jsx` to render the triggers natively within the text blocks.
