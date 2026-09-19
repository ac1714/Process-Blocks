# Repair the export, rework builder controls, and fix layout defects

## Standalone HTML export

- Diagnose the exported file's local startup failure and correct the generated page so it opens directly from disk with no server.
- Keep it one self-contained file with its project state embedded.
- Preserve local editing and **Save file**: write in place through the browser's file picker when supported, download an updated copy otherwise.
- Regenerate the embedded standalone assets after all other changes.

## Left panel

- Always visible; remove the collapse and reopen controls entirely.
- In **Builder**, show the Appearance controls directly, with no Theme expand/collapse button.
- In **Library**, show Library Categories in that same place, keeping category navigation and scroll-based active highlighting.
- Add a bottom area holding **Save**, **Open project**, **Save project**, and **Export HTML**.

## Header

- Left: Builder / Library switch.
- Right: block count, then **Preview**, then **Copy all**; restyle Copy all as a normal secondary control rather than the primary accent button.
- Keep the Preview control fixed size so its label never wraps or resizes.

## View and preview behavior

- Adding a library element keeps the current view; no automatic switch to Builder.
- Clicking **Preview** switches to Builder and enters preview mode.
- Clicking **Hide preview** returns to Builder editing with the block cards expanded again.
- Switching to Library resets the control back to **Preview** and leaves preview mode.

## Columns on the builder screen

- Move column layout out of the separate block configuration tool and onto the main builder screen.
- On a block card, allow splitting its content into multiple columns and setting how many.
- Allow moving content up and down within a column and side to side between columns.
- Keep block-level drag reordering and the existing per-block editing, accent, quick-add, and copy actions.

## Block card controls

- Move the up/down block reorder buttons to the bottom-right corner of each block card.
- Keep the drag grip and remaining actions in the card header.

## Layout defects

- Correct the Workato artwork crop so its left edge is not clipped and its visible mark aligns with Salesforce in the mixed workflow example.
- Repair the split-heading sample's missing left padding.
- Fix **Add step / row**: the added row currently copies the last row, which omits the connector line and uses the final row's reduced spacing. The inserted row must carry the same connector and spacing as the rows above it, and the row that ends the block must keep the closing treatment.

## Technical notes

- Panel content becomes view-dependent in `StudioPanel`, driven by the active view from `StudioApp`.
- Preview state, view state, and block-card collapse signaling are coordinated in `StudioApp`.
- Column editing moves from `ElementBuilder`'s section manager into the builder block card surface in `StackTray`, reusing the existing section/column data model in `custom-blocks`.
- The duplicate-row fix belongs in the quick-add source selection and op application, not in individual library samples.

## Validation

- Open a freshly exported file from a local `file://` path: full studio renders, no startup error; edit, save, reopen, and confirm the edit persists.
- Confirm Builder shows Appearance, Library shows categories, no collapse controls remain, and the bottom panel actions work.
- Confirm header order and the less prominent Copy all.
- Exercise Preview, Hide preview, and Library switching against the described behavior.
- Create multi-column content on a block card and move items vertically and horizontally.
- Verify Workato/Salesforce alignment, split-heading padding, and added step/row spacing and connectors at desktop and narrow widths.
- Run the existing type and standalone generation checks.
