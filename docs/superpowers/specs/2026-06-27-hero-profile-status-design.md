# Hero Profile and Status Refinement

## Scope

Refine only the profile identity and availability metadata in the hero's left column. Preserve the approved hero shell, workflow canvas, copy, actions, proof pills, spacing rhythm, themes, and responsive layout.

## Design

- Increase the `Amlan Bora` label from 18px to 22px while retaining its existing weight, color, and compact line height.
- Place the existing circular profile image inside a compact rounded frame. The frame reuses the project's panel, line, accent, and shadow tokens and adds no new image or icon assets.
- Keep the identity row limited to the framed photo and name. Remove the live India time from beneath the name.
- Replace the bottom status copy with `Available · India · {live IST time}`. Preserve the existing green availability indicator and the existing `Asia/Kolkata` one-second clock update.
- Keep the status semantic label and render the live value in a `time` element with the existing machine-readable date-time value.

## Responsive and Theme Behavior

- Preserve the current 60px desktop and 52px mobile image sizes.
- Scale the surrounding frame with the image so it remains compact at both sizes.
- Use existing CSS variables so the frame and status remain legible in light and dark themes.
- Allow the bottom status to wrap naturally on narrow screens without changing the hero's established alignment.

## Verification

- Update the existing hero structure tests before implementation and confirm they fail for the old identity/status contract.
- Verify the focused hero tests, full Node test suite, ESLint, TypeScript, and production build.
- Visually verify the hero at desktop and mobile sizes, checking both themes when browser controls are available.

## Non-Goals

- No changes to hero copy, CTAs, proof pills, workflow canvas, animations, navigation, other sections, or unrelated project behavior.
