# UI Improvement Plan

## NOTE

THIS FILE SHOULD NOT BE COMMITTED. DO NOT INCLUDE THIS IN COMMITS.

## Desktop Layout Width

- Yes: desktop content should use more of the available space.
- Current issue: `ui.page` caps every tab at `1120px`, leaving too much unused space on wide desktop.
- Recommended change: raise the desktop max width to `1280px` or `1360px`.
- Do not make every page full-bleed; keep readable constraints for forms/settings.
- Best approach: add page-size variants:
  - `pageWide` for Timer, History, Exercise Library.
  - `pageNarrow` for Settings/modals and form-heavy surfaces.

## Commit 1

`git commit -m "style: widen desktop app content"`

- Increase main page max width for data-heavy tabs.
- Add `pageWide` / `pageNarrow` layout helpers.
- Use wider layout on Timer, History, Exercise Library.
- Keep Settings and modal content constrained.
- Check desktop spacing at 1280px, 1440px, and ultrawide.

## Commit 2

`git commit -m "style: improve timer dashboard hierarchy"`

- Reduce visual competition between main timer, rest card, and metrics.
- Make active timer/rest state easier to scan.
- Add clearer disabled/idle styling for rest controls.
- Improve set log drawer spacing and action placement.
- Keep mobile layout unchanged unless needed.

## Commit 3

`git commit -m "style: refine history archive density"`

- Improve archive header action grouping.
- Make list/card view spacing more consistent.
- Improve selected session detail layout on desktop width.
- Keep session detail table readable with clear horizontal scroll behavior.
- Make destructive actions visually distinct but not oversized.

## Commit 4

`git commit -m "style: refine exercise library browsing layout"`

- Give exercise list and detail panel better desktop proportions.
- Keep filters compact and aligned across breakpoints.
- Improve selected exercise pill placement.
- Reduce excessive detail-card height on desktop.
- Make video/demo area less dominant unless loaded.

## Commit 5

`git commit -m "style: unify settings layout patterns"`

- Extract repeated settings row/toggle styles into shared components.
- Align Timer, Sound, and Shortcut tab spacing.
- Make reset/test actions consistent across tabs.
- Keep mobile full-screen modal behavior.
- Improve keyboard shortcut rows for long labels.

## Commit 6

`git commit -m "style: tighten visual system consistency"`

- Normalize section headers, card padding, and toolbar spacing.
- Audit button heights and touch targets.
- Reduce one-off Tailwind class strings where shared style helpers fit.
- Improve empty states and placeholder rows.
- Keep palette restrained; avoid adding new dominant colors.

## Commit 7

`git commit -m "fix: improve responsive overflow handling"`

- Audit remaining horizontal overflow risks.
- Ensure wide tables scroll inside their panels only.
- Clamp long labels in pills, cards, and dropdown buttons.
- Verify toast, rest alert, modals, and drawer do not overlap mobile nav.
- Check all tabs at 360px, 390px, 768px, 1280px, and 1440px.
