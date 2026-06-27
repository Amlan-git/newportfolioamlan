# Hero Identity Layout Refinement

## Scope

Refine only the identity cluster at the top of the hero's left column. Preserve the approved hero shell, headline, body copy, actions, proof pills, availability status, workflow canvas, themes, animations, and responsive layout.

## Design

- Increase the profile image from 60px to 72px on desktop and from 52px to 60px on mobile.
- Keep the existing framed-avatar treatment, but make the frame fully circular with a `999px` radius at every breakpoint.
- Increase `Amlan Bora` from 22px to 26px, retaining its current weight, color, and compact line height.
- Move the existing `>_ FULL-STACK AI ENGINEER` role line inside `.hero-identity-copy`, directly beneath the name and beside the photo.
- Preserve the terminal-prompt badge and the role's existing typography and accent treatment.
- Use a small internal gap between the name and role, while the existing headline rhythm continues below the completed identity row.

## Responsive and Theme Behavior

- Keep the avatar, name, and role in one horizontal identity row at desktop and mobile widths.
- Allow the role line to wrap within the identity-copy area only if a narrow viewport requires it.
- Reuse existing theme variables for frame, text, accent, and shadow styling.
- Do not change the availability/status line or move any other hero content.

## Verification

- Update the existing structural hero tests first and confirm they fail against the old identity contract.
- Verify the focused hero tests, full Node test suite, ESLint, TypeScript, and production build.
- Visually verify desktop and mobile layouts in light and dark themes, checking alignment, wrapping, overflow, and console errors.

## Non-Goals

- No changes to hero messaging, CTAs, proof pills, availability metadata, workflow canvas, navigation, project sections, or unrelated behavior.
