# Paper Grain Gradient Background Design

## Goal

Replace the portfolio's custom full-page `AmbientCanvas` background with Paper Design's real `GrainGradient` React component. Use the exact shared preset while keeping the existing portfolio layout, interactions, loader, and content unchanged.

## Selected Direction

Use `@paper-design/shaders-react` directly and pin its installed version. This preserves the reference shader's rendering and animation rather than approximating it with CSS or rebuilding it in the current 2D canvas.

The alternatives are:

1. Rebuild the look in the existing 2D canvas. This avoids a dependency but would only approximate the WebGL shader.
2. Export a static image or video. This is predictable but loses responsiveness, reduced-motion behavior, and the live shader.
3. Use the official React component. This is the selected option because it is the most faithful and keeps the integration small.

## Visual Configuration

The full viewport background uses:

- colors: `#7300ff`, `#eba8ff`, `#00bfff`, `#2b00ff`
- background: `#000000`
- softness: `0.5`
- intensity: `0.5`
- noise: `0.25`
- shape: `corners`
- speed: `1`
- scale: `1`
- rotation: `0`
- offsets: `0`, `0`

The shader replaces the existing ambient canvas across the whole site. It sits behind all page content, remains fixed during scrolling, ignores pointer input, and is clipped to the viewport.

## Component Architecture

Create a focused client component named `GrainShaderBackground`. It owns only:

- loading the Paper shader on the client
- tracking viewport dimensions for the shader's numeric width and height
- detecting reduced-motion preference
- applying the exact shader props
- rendering a CSS fallback beneath the shader

`Portfolio` continues to render one background component as its first visual layer. The old `AmbientCanvas` import and render are removed, but the rest of `Portfolio` is not refactored.

The shader package is loaded client-side so browser-only canvas/WebGL behavior cannot interfere with server rendering or hydration.

## Styling and Layering

Reuse the existing ambient background stacking contract: fixed positioning, `inset: 0`, `z-index: 0`, `overflow: hidden`, and `pointer-events: none`.

The current SVG grain overlay is reduced or removed because the shader already supplies noise. The hero's local warm glow is also disabled if it visibly muddies the purple/blue preset. Foreground surfaces keep their existing translucency and borders unless contrast testing proves a small opacity adjustment is necessary.

The light-theme toggle remains functional. The shader itself keeps the supplied black-backed preset in both themes; foreground theme colors may change as they do today. This avoids inventing an unrequested light shader preset.

## Motion and Failure Behavior

When `prefers-reduced-motion: reduce` is active, render the shader with `speed={0}` so the same visual becomes static. Listen for preference changes and update without a reload.

If the shader cannot load or WebGL rendering is unavailable, the fixed wrapper still displays a CSS fallback made from dark purple and cyan radial gradients. Page content must remain fully usable.

## Performance

- Keep one shader instance for the whole site.
- Update dimensions only when the viewport changes.
- Avoid stacking the previous animated canvas beneath the shader.
- Pin the package version because the upstream project warns that pre-1.0 releases may contain breaking changes.
- Check desktop and mobile rendering for frame rate, resize behavior, and excessive GPU use.

## Verification

1. Add a focused test that asserts the official component, exact preset, reduced-motion path, responsive sizing, fallback, and cleanup behavior.
2. Run the project test suite, lint, and production build.
3. Inspect the live page at desktop and mobile sizes.
4. Confirm there is one background canvas, content remains readable, no error overlay or console errors appear, scrolling still works, and reduced motion produces a static frame.
5. Compare the rendered shader against the supplied Paper preset for palette, corner composition, grain, and animation character.

## Out of Scope

- Recreating or modifying the Paper shader source
- Adding shader controls to the portfolio UI
- Redesigning portfolio content or layout
- Creating a separate light-theme shader preset
