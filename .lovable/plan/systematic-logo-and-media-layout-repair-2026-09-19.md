# Systematic logo and media layout repair

## Scope correction

- Discard the unrelated proposal to hide Library categories in Builder view; make no category-visibility change.
- Keep the current library elements and their content, but repair their internal presentation where identified below.

## Build a repeatable media-layout system

- Replace the current nested, conflicting logo sizing wrappers with one brand-media specification containing the verified source, visible dimensions, aspect ratio, and any brand-specific optical offset.
- Keep product logos transparent and borderless. Use a framed image/tile only when the sample represents an object or experience—such as a file, meeting, or screenshot—not as decoration around a product logo.
- Add explicit reusable layout primitives for:
  - logo + first-line title,
  - logo + stacked title/detail,
  - logo/title + right-aligned status or action,
  - vertical process steps with arrows.
- Keep presentation in generated element markup. Do not add global CSS overrides.
- Require each library sample to select its own layout and media treatment explicitly rather than inheriting an accidental default.

## Audit and repair every Tools & process element

- Review all 30 visible examples individually, not only the selected items.
- For every product logo, verify the asset loads, has a tight transparent canvas, preserves its natural proportions, and is large enough to identify without overpowering adjacent text.
- Align the visible left edge of each logo with the text/content below it; do not center narrow marks inside a wider invisible slot that shifts their visual edge.
- Align logos to the first line of adjacent text and vertically align status pills, metadata, and right-side actions within the same header row.
- Normalize intentional internal spacing per example, including fixing the two rail layouts with only 2px right padding.
- Replace ad hoc header markup in the Slack workflow result, Jira issue, and Drive file examples with explicit variants of the new layout primitives.
- Add the missing Zendesk identity treatment to the automation comparison example.
- Give the Drive file and Meet review examples purpose-built file/meeting imagery instead of presenting only a bare product logo; retain transparent product marks as attribution.
- Keep Google Sheets, Salesforce, Workato, Gmail, Jira, Slack, Zendesk, Confluence, Drive, and Meet marks appropriately sized per brand rather than forcing one universal square.
- Review every arrow and connector against the logos it joins: set arrow size proportionally to the logo mark rather than an arbitrary fixed glyph, horizontally center each arrow on the logo column, and give equal measured space above and below.
- Apply the same review to horizontal arrows between people, owners, or status boxes so they are sized and vertically centered against the content they separate.
- Apply the same brand sizing rules in the Build Block logo picker and custom-block output so Builder, Library, copied HTML, and standalone output agree.

## Prevent the regression

- Add stable data markers to generated brand media and process connectors so the complete catalog can be checked reliably.
- Add automated checks covering every visible Tools & process element:
  - every image request succeeds and has non-zero natural dimensions,
  - rendered aspect ratios match the intended brand specification,
  - no logo receives an unintended background, border, or shadow,
  - logo/title and logo/content left edges meet their declared alignment,
  - right-side controls remain aligned without collisions,
  - workflow arrows are centered with equal upper/lower spacing,
  - sample content stays within its card at desktop and narrow widths.
- Capture and inspect the full Tools & process catalog at desktop and narrow widths after the fixes.

## Preview control

- Make **Preview / Hide preview** a fixed-height, fixed-width, non-shrinking, non-wrapping header control so its label never wraps or changes button height.

## Validation

- Verify all 30 Tools & process samples in the Library and after insertion into Builder.
- Verify representative copied blocks and the regenerated standalone export preserve the same media sizes, alignment, padding, and connector spacing.
- Confirm there are no broken images, stray fallback characters, overlaps, unexpected borders/backgrounds, or console errors.
