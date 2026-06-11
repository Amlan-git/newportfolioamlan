# Portfolio Technical Overview — Amlan Jyoti Bora

> **Build target:** `amlan.live`  
> **Current app type:** Single-page portfolio built with Next.js App Router  
> **Identity:** Full-stack AI Developer · Software Engineer · Indie Hacker  
> **Positioning:** "I build full stack products that are ready to ship."

This document is the current technical and design reference for the portfolio codebase. The implemented codebase is the source of truth. Use this document to preserve the product direction, interaction patterns, visual system, and architectural choices that now exist in the app.

---

## 1. Current Repository Structure

```txt
/
  portfolio-build-spec.md       technical overview and design reference
  package.json                  scripts and dependencies
  package-lock.json             locked dependency graph
  next.config.mjs               Next config, image formats, dev indicator setting
  eslint.config.mjs             ESLint flat config
  tailwind.config.ts            Tailwind theme extension
  tsconfig.json                 TypeScript config
  postcss.config.mjs            PostCSS config
  public/
    assets/
      profilephoto.jpeg         currently available portrait asset
  src/
    app/
      layout.tsx                metadata and root HTML/body shell
      page.tsx                  renders the portfolio component
      globals.css               visual system, layout, responsive styles, animation CSS
    components/
      Portfolio.tsx             main client component containing data, UI, interactions
```

There are currently no nested project detail routes, writing routes, MDX content files, or CMS integration. The live experience is concentrated in `src/components/Portfolio.tsx` and `src/app/globals.css`.

---

## 2. Implemented Tech Stack

| Concern | Current Choice | Notes |
|---|---|---|
| Framework | Next.js 15 App Router | Single `/` route currently implemented |
| Language | TypeScript + React 19 | Main UI is a client component |
| Styling | Tailwind CSS 3 + large `globals.css` | Most custom styling lives in CSS classes |
| Animation | GSAP + ScrollTrigger | Used for reveals, project reel pinning, magnetic buttons, cursor |
| Smooth scroll | Lenis | Driven by GSAP ticker only |
| Icons | `lucide-react` | Used for CTAs, project links, workflow nodes |
| Telemetry | Supabase optional + local fallback | Uses env vars when present, otherwise localStorage/sessionStorage |
| Image handling | `next/image` available | Current hero no longer depends on portrait card |
| Contact CTA | Cal.com | `https://cal.com/amlan-bora` |

### Current Scripts

```bash
npm run dev -- --port 3000
npm run lint
npm run build
```

Important local-dev note: avoid running `npm run build` while `npm run dev` is still active. In this project, doing both at once can corrupt the Next dev manifest and trigger the devtools/RSC runtime error:

```txt
Could not find the module ... segment-explorer-node.js#SegmentViewNode
TypeError: __webpack_modules__[moduleId] is not a function
```

If that happens, stop the dev server, move/remove `.next`, and restart `npm run dev -- --port 3000`.

---

## 3. Product Direction

The portfolio is a single-page product-engineering portfolio. It should help clients and recruiters understand quickly that Amlan can take ambiguous product ideas and turn them into usable, production-minded full-stack AI products.

Current tone:

- Technical but not corporate.
- Confident and direct.
- Dark, warm, focused, and product-led.
- More "builder/product studio" than traditional resume page.

Core promise:

```txt
I build full stack products that are ready to ship.
```

Primary conversion action:

```txt
Schedule call with me -> https://cal.com/amlan-bora
```

---

## 4. Visual System

The implemented visual system is defined mostly through CSS variables in `src/app/globals.css`.

### Current Theme Variables

```css
:root {
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-display: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "SFMono-Regular", "SF Mono", Consolas, "Liberation Mono", monospace;
  --bg: 248 247 244;
  --panel: 255 255 255;
  --ink: 12 12 13;
  --muted: 90 88 84;
  --line: 220 217 210;
  --accent: 255 70 48;
}

:root[data-theme="dark"] {
  --bg: 7 7 8;
  --panel: 17 17 19;
  --ink: 245 243 238;
  --muted: 166 163 155;
  --line: 46 45 43;
  --accent: 255 76 49;
}
```

The site uses one main accent: vermillion/orange-red. Keep semantic states, glows, outlines, and active states in this same accent family.

### Typography

- Display: heavy grotesque/system display via `--font-display`.
- Body: system sans via `--font-sans`.
- Technical labels: monospace via `--font-mono`.
- Serif moment: Fraunces is imported only for the italic `ship` word in the hero headline.

Do not introduce a competing brand palette or a second loud accent color without intentionally redesigning the full system.

### Background

The old dotted/grid background was removed. The current background should stay cleaner:

- warm dark body surface
- subtle radial vermillion glow
- no global dotted background
- no busy grid/crosshair layer in the hero workflow panel

---

## 5. Page Structure

Current page sections:

```txt
#home        hero
openflow     currently building feature block
#projects    horizontal project reel
#skills      skills, services, stack matrix
#experience  work history and education
#research    research artifact
#blog        placeholder writing card
#contact     telemetry panel and CTA footer
```

The nav links currently target:

```ts
["Projects", "Skills", "Experience", "Research", "Blog"]
```

There is no separate nav item for contact because the primary conversion CTA is the Cal.com button.

---

## 6. Global Interaction Patterns

### Custom Cursor

Implemented in `CustomCursor()`.

- Uses GSAP quick setters.
- Disabled on coarse pointers.
- Disabled for reduced motion.
- Expands/changes on `button`, `a`, and `[data-cursor='hover']`.

### Magnetic Buttons

Implemented in `MagneticButton()`.

- Works for links and buttons.
- Uses GSAP `quickTo` for x/y motion.
- Disabled for coarse pointers and reduced motion.
- Used for hero CTA, nav CTA, project actions, footer CTA, and modal actions.

### Theme Toggle

Implemented in `Portfolio`.

- Tracks `dark` / `light` state.
- Applies `document.documentElement.dataset.theme`.
- Uses the View Transitions API when available for a circular clip-path reveal.

### Smooth Scroll

Implemented with Lenis and GSAP ticker.

Important implementation detail:

```ts
const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
const tick = (time: number) => lenis.raf(time * 1000);
gsap.ticker.add(tick);
gsap.ticker.lagSmoothing(0);
```

Do not also drive Lenis with a separate `requestAnimationFrame` loop. A duplicate scroll driver makes pinned ScrollTrigger sections jittery.

---

## 7. Header and CTA System

The header is a fixed pill-style nav.

Current header contents:

- Brand flip link: `amlan.live` / `Amlan`
- Desktop section nav
- `Schedule Call` button -> `https://cal.com/amlan-bora`
- Theme toggle

On mobile, the nav links are hidden and the Cal.com button shortens to `Call`.

Primary CTA hierarchy:

1. Hero: `Schedule call with me`
2. Header: `Schedule Call`
3. Footer/contact: `30 min`
4. Project reel end card: `Schedule call`

All scheduling CTAs should use:

```ts
const scheduleUrl = "https://cal.com/amlan-bora";
```

---

## 8. Hero Section

The hero is a two-column layout:

- Left: positioning, headline, subtitle, CTAs, status strip.
- Right: interactive idea-to-production workflow demo.

### Hero Copy

Current headline:

```txt
I build full stack products
that are ready to ship.
```

The word `ship` is the only serif italic emphasis.

### Hero CTA Row

Current CTA order:

1. `Schedule call with me` -> Cal.com
2. `View Work` -> `#projects`
3. Proof pills: AI apps, Realtime systems, SaaS MVPs

### Right-Side Workflow Demo

The original chaotic pipeline board was replaced with a cleaner "product studio" workflow visualization.

Workflow steps:

1. Brief
2. Flow
3. Interface
4. Systems
5. AI
6. Launch

Implementation details:

- Step data lives in `workflowSteps`.
- Active step cycles every `2200ms` unless reduced motion is enabled.
- User can click workflow nodes to change active step.
- The panel uses an inline SVG trace path, raw idea card, live product preview card, and active detail panel.
- Pointer movement tilts the panel on desktop.
- The previous dotted/crosshair visual layer has been removed for clarity.

---

## 9. Openflow Section

The "Currently building" section highlights Openflow:

```txt
Openflow
A free AI voice writing assistant for turning spoken thoughts into polished text.
```

Current state:

- Static feature block.
- Animated waveform bars.
- Preview button currently uses `pendingUrl`.

Future cleanup:

- Replace `pendingUrl` with a real Openflow link when ready.

---

## 10. Projects Data

Project data is currently local to `Portfolio.tsx`.

Current projects:

1. Query AI
2. Drawly
3. Proposal Pilot
4. Waggle MCP

Each project has:

```ts
type Project = {
  id: string;
  title: string;
  label: string;
  description: string;
  stack: string[];
  features: string[];
  proof: string;
  live: string;
  github: string;
  architecture: string[];
  accent: string;
};
```

### Current Card Content

The horizontal reel cards show:

- architecture visual
- accent/category label
- project title
- label/tagline
- stack pills
- top 3 feature bullets
- actions: Details, Live, GitHub

The `proof` paragraph is intentionally not shown on the card anymore because it duplicated the bullet details and made the card too busy. It is still useful in the project modal.

---

## 11. Horizontal Project Reel

The `#projects` section uses a pinned horizontal scroll reel on desktop.

### Structure

```tsx
<section id="projects" className="projects-section">
  <div className="section-intro section-shell">...</div>
  <div className="projects-reel">
    <div className="projects-sticky">
      <div className="projects-track">
        <article className="project-panel">...</article>
        ...
        <aside className="project-reel-end">...</aside>
      </div>
    </div>
  </div>
</section>
```

The intro text lives above the pinned reel in normal document flow. The pinned element contains only the horizontal card track.

### ScrollTrigger Pattern

```ts
media.add("(min-width: 981px) and (prefers-reduced-motion: no-preference)", () => {
  const section = document.querySelector<HTMLElement>(".projects-section");
  const sticky = document.querySelector<HTMLElement>(".projects-sticky");
  const track = document.querySelector<HTMLElement>(".projects-track");

  if (!section || !sticky || !track) return;

  const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);

  gsap.to(track, {
    x: () => -getDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: sticky,
      start: "top top",
      end: () => `+=${getDistance() + window.innerHeight * 0.5}`,
      pin: sticky,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });
});
```

Current intent:

- Desktop: pinned horizontal reel.
- Reduced motion: no pinned horizontal tween.
- Tablet/mobile: normal vertical stacked cards.

### Card Design Pattern

The current card direction is a wide landscape project panel:

- `aspect-ratio: 16 / 9`
- `max-height: 55vh`
- abstract warm/vermillion gradient background
- overlapping outline effect
- card content remains inside the card, not outside it
- project title sits at the top of each card content area

Avoid adding a separate large title lockup to the left of the card. That was tested and removed.

---

## 12. Project Detail Modal

Clicking `Details` opens an overlay modal.

Current tabs:

- Overview
- Architecture
- Features
- Links

The modal uses:

- `activeProject`
- `activeTab`
- `openProject(project)`
- `track("project_open", project.id)`

The modal still uses `project.proof`, which is appropriate there because users intentionally asked for details.

Future accessibility improvement:

- Add Escape-key close.
- Add focus trap.
- Restore focus to the triggering button after close.

---

## 13. Skills and Stack

Skills are modeled as `skillPillars`:

- Full-stack Web Apps
- AI Product & Engineering
- Backend Systems
- UI Engineering
- Deployment & Tooling

The stack matrix includes:

- Languages
- Frontend
- Backend
- Databases
- AI / GenAI
- Tools

This section should stay practical and scannable. Avoid turning it into a marketing block.

---

## 14. Experience, Research, Blog, Contact

### Experience

Current timeline:

- Cybersecurity Analyst · Microland Ltd
- Software Engineer Intern · TheFlak Group / APRIC

Education:

- Amity University
- Scaler Academy

### Research

Current artifact:

```txt
Solving Handwritten Equations Using Convolutional Neural Network
Published in IDVRP Conference Journal, 2022
```

### Blog

Currently a placeholder for a future Dev.to link.

### Contact

Footer includes:

- telemetry panel
- email
- LinkedIn
- 30-minute Cal.com link

---

## 15. Telemetry

Telemetry is implemented in `useTelemetry()`.

If Supabase env vars exist:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

the app writes to and reads from `portfolio_events`.

Tracked events:

- `visit`
- `project_open`
- `cta_click`

If Supabase is not configured:

- Visits are stored in localStorage.
- Active status is shown as `1`.
- Top project defaults to Query AI.

This keeps the UI functional without requiring backend setup.

---

## 16. Accessibility and Motion

Current accessibility-minded behaviors:

- Cursor disabled on coarse pointers.
- Cursor disabled on reduced motion.
- Workflow auto-cycle disabled on reduced motion.
- Horizontal project reel disabled on reduced motion.
- Buttons and links use native elements.
- Project modal has `role="dialog"` and `aria-modal="true"`.

Known future improvements:

- Add modal focus trap.
- Add keyboard close for modal.
- Add more explicit tab roles/ARIA attributes in the modal tabs.
- Test with VoiceOver and keyboard-only navigation.

---

## 17. Performance Guidelines

Current patterns to preserve:

- Animate `transform` and `opacity`, not layout properties.
- Use GSAP/ScrollTrigger for scroll-linked work.
- Keep Lenis driven from one loop only: the GSAP ticker.
- Avoid adding another animation library unless there is a strong reason.
- Avoid global background noise or heavy decorative layers.
- Keep mobile fallback simpler than desktop pinned interactions.

For project reel changes:

- Do not alter the ScrollTrigger horizontal distance unless the card count or track structure changes.
- Use `invalidateOnRefresh: true`.
- Use `gsap.matchMedia()` for desktop-only scroll effects.
- Keep reduced-motion behavior static.

---

## 18. Current Known Placeholders

These are intentional but should be replaced before final launch:

- `pendingUrl = "javascript:void(0)"`.
- Openflow preview link.
- Proposal Pilot live/GitHub if not ready.
- Blog Dev.to link.
- Real "Last shipped" data in the hero status strip.

---

## 19. Development Workflow

### Start Locally

```bash
npm install
npm run dev -- --port 3000
```

Open:

```txt
http://localhost:3000
```

### Stop Dev Server

Find process:

```bash
lsof -i :3000 -P -n
```

Stop the Node PID:

```bash
kill <PID>
```

### Verify

```bash
npm run lint
```

Run `npm run build` only after stopping the dev server to avoid Next dev cache issues.

---

## 20. Design Guardrails

Keep:

- dark warm product-studio mood
- vermillion accent
- large confident type
- technical mono labels
- product-focused cards and diagrams
- clear Cal.com conversion path
- practical full-stack/AI credibility

Avoid:

- busy background grids or dotted patterns
- scattered overlapping UI elements that obscure content
- duplicate detail paragraphs on project cards
- multiple scroll drivers
- strict greenfield spec rewrites that fight the built app
- new dependencies for effects already covered by GSAP/Lenis

The goal is a portfolio that feels like a polished product interface, not a static resume and not a decorative agency landing page.
