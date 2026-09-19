# Library navigation, theme panel, and element-level polish

## Goal

Simplify the header and library navigation, make preview mode close editing controls, and individually correct every tool/process example so its logos, arrows, opening text, and spacing are intentional.

## Changes

### Left panel and header

- Move **Theme** from the header into the left controls panel.
- Clicking Theme will expand Color, Font, and Density controls directly inside that panel; clicking it again will collapse them.
- Keep Exact colors and Auto-match accents behavior within the expanded Color controls.
- Remove the Library search field and its query/filter behavior entirely.
- Move the builder block count immediately to the right of **Copy all**.
- Keep Save, Preview, and Copy all together on the left and project file actions on the right.

### Active library category

- Track which library category is currently nearest the top of the library viewport while scrolling.
- Give that category a clear selected treatment in the Categories panel.
- Update the selected category immediately when a category button is clicked, while retaining smooth scrolling.
- Avoid changing the active category from builder-only scrolling.

### Preview behavior

- Lift each builder block's expanded/collapsed state to the builder stack so it can be controlled centrally.
- Opening Preview will collapse every expanded block and close any open inline Build Block editor.
- Returning from Preview will leave blocks collapsed rather than unexpectedly restoring open sections.
- Preserve manual per-block expand/collapse outside Preview.

### Logo and example audit

- Remove fallback initials currently rendered behind successful logo images; use an accessible, visually empty fallback when an external image fails so characters such as `S` and `C` never appear beside logos.
- Replace the Workato asset with a verified transparent, borderless mark without a colored tile/background.
- Audit every Tools & process example individually rather than relying on a broad CSS override.
- Assign appropriate logo dimensions per brand and context, with consistent visual weight rather than forcing every asset into the same fixed dimensions.
- Align each logo to the first adjacent title/baseline and give the content below an explicit, consistent gap.
- Give vertical-flow arrows equal space from the preceding and following icon rows, with a centered arrow column.
- Upgrade weak opening lines into an intentional role per example—section label, title, status, or supporting copy—with explicit size, weight, line height, and spacing.
- Correct icon/text alignment in wrapped and narrow layouts, including Slack, Confluence, Salesforce, Google Workspace, Jira, Zendesk, and Workato examples.
- Keep imagery transparent and borderless; do not introduce image tiles, outlines, or global image overrides.

## Validation

- Verify Theme expands inside both open and narrow left-panel layouts without clipping.
- Verify Library has no search control and scrolling highlights the correct category.
- Verify the block count sits directly after Copy all at desktop and narrow widths.
- Open multiple blocks and an inline editor, then confirm Preview collapses/closes all of them.
- Inspect every Tools & process library block for stray characters, broken images, logo sizing/alignment, opening typography, and arrow spacing.
- Confirm the Workato mark is transparent and remains legible.
- Check current project export and standalone HTML, type validation, browser console, and route metadata.

## Technical details

- Pass theme state and controls into the left panel instead of using a dialog.
- Use viewport-relative section observation on the existing library scroll container for active-category state.
- Store expanded block IDs in the stack owner so Preview can clear them deterministically.
- Keep presentation fixes in each example's generated markup and small brand-specific helpers; avoid global CSS selectors and override chains.
