# Loader Typing Animation Design

## Goal

Animate the existing `AMLAN.LIVE` loader mark as a single letter-by-letter typing sequence. After the full word appears, it remains visible briefly before the existing loader fade completes.

## Scope

- Preserve the current full-screen loader layout, typography, accent slash, status lines, colors, and theme behavior.
- Animate exactly `AMLAN.LIVE` once on each loader appearance.
- Show a blinking caret during the typing sequence and brief hold.
- Slightly extend the loader timing so the completed word is readable before exit.
- Keep the change local to the existing loader markup and loader CSS.
- Do not alter the persistent `amlan.live` header brand or other page animations.

## Interaction And Timing

The loader starts with the word visually hidden while retaining its intended layout. Typing begins 100ms after the loader appears, and its ten characters appear in order at 70ms intervals. The final character is visible by 730ms. The caret tracks the typing treatment, blinks during the sequence, and remains visible during the 370ms hold. At 1.1 seconds, the loader begins its existing 550ms fade-and-hide exit.

The accent slash and three loader status lines keep their current animations and timing. The complete loader duration is 1.65 seconds.

## Implementation Approach

Render the loader word as character spans inside an accessible label. Each visual character receives a CSS custom property for its index, allowing one shared keyframe animation to stagger its reveal. A CSS pseudo-element supplies the caret. This avoids JavaScript timers, keeps the sequence deterministic, and makes individual character timing precise with the existing proportional display font.

The complete word remains available to assistive technology as a single label; the individually animated characters are decorative. Layout space is reserved from the start so typing does not shift the loader or slash.

## Reduced Motion

Under `prefers-reduced-motion: reduce`, the full word appears immediately, the caret does not blink, and the loader begins a 300ms fade after a 350ms static hold. The content and loading transition remain understandable without motion.

## Testing And Verification

- Add a focused source-level regression test that confirms the loader exposes the complete accessible label, renders all ten ordered characters with stagger indexes, and includes the typing, caret, hold, exit, and reduced-motion CSS contracts.
- Run the focused test first and confirm it fails before implementation.
- Run the full existing test suite and lint after implementation.
- Verify in the local browser on port 3003 that the typing sequence plays once, holds, fades, produces no error overlay or console error, and leaves the portfolio page usable.

## Out Of Scope

- Looping or deleting the loader text.
- Changing loader copy, typography, colors, slash design, or status messages.
- Adding dependencies or a reusable site-wide typewriter component.
