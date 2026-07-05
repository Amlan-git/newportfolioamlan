# Light Mode Shader Design

## Goal

Make light mode feel intentional and colorful instead of placing a heavy white veil over a black-backed shader. Preserve the existing light typography, navigation, hero layout, workflow canvas, controls, and dark-mode appearance.

## Selected Direction

Use a theme-aware shader background.

- Dark mode keeps the approved `#000000` shader background and its current dark overlay.
- Light mode changes only the shader background color to the site's warm off-white `#f8f7f4`.
- Light mode retains the same violet, pink, cyan, and blue shader colors, shape, softness, intensity, noise, speed, scale, rotation, and offsets.
- The existing 72% global white veil is reduced to a restrained neutral wash so the shader remains visible without making the page noisy.

This is preferable to a CSS-only white scrim, which turns black shader regions gray, and preferable to disabling the shader, which would break visual continuity between themes.

## Architecture and Data Flow

`Portfolio` already owns the active `dark | light` state. Pass that state into `GrainShaderBackground` as a typed prop.

`GrainShaderBackground` derives `colorBack` from the prop:

- dark: `#000000`
- light: `#f8f7f4`

The component remains responsible for viewport sizing, reduced motion, WebGL detection, dynamic loading, and fallback rendering. No second theme observer or duplicate theme state is introduced.

## Styling

Reduce the light-mode `.grain-shader::after` opacity from `0.72` to `0.18`, keeping the violet/cyan color clearly visible.

Keep foreground surfaces theme-driven:

- navigation stays translucent white
- workflow canvas stays light and readable
- hero text remains dark
- CTA styles remain unchanged in this focused pass

Add a localized warm-white hero-copy scrim only if browser verification shows text contrast varies materially over the light shader. Prefer a soft gradient without a visible card boundary. Do not reintroduce a full-screen wash.

The CSS fallback should remain coherent if WebGL is unavailable. In light mode, the fallback must use a warm off-white base rather than black.

## Theme Transition

Changing the theme re-renders the shader with its new background color while preserving dimensions and reduced-motion state. The existing view transition remains in control of the foreground theme swap.

No page reload, new controls, or user-visible loading state is added.

## Accessibility and Failure Behavior

- Preserve semantic structure and keyboard behavior.
- Keep light-mode body, headline, CTA, proof, and status text readable over all captured shader positions.
- Reduced motion continues to set shader speed to zero.
- If the shader import or WebGL fails, the CSS fallback remains visible and content stays usable.

## Verification

1. Update the focused background test first so it fails until the theme prop, theme-derived background, light overlay, and fallback are implemented.
2. Run the full test suite, lint, and production build.
3. Capture desktop and mobile light-mode screenshots after the loader settles.
4. Confirm the page retains visible violet/cyan color, avoids muddy gray fields, has one viewport-sized canvas, and shows no browser console or framework errors.
5. Toggle dark → light → dark and confirm dark mode is visually unchanged.

## Out of Scope

- Changing the shader palette or animation settings
- Redesigning CTAs, proof pills, workflow animation, or navigation
- Changing dark mode
- Adding a separate static light background
