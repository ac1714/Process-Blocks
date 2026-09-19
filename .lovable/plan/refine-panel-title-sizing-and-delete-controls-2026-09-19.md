# Refine panel, title sizing, and delete controls

## Changes

- Move the left-panel minimize button out of the top header and place it on the same row as **Appearance** in Builder view or **Library categories** in Library view.
- When the panel is hidden, keep a compact restore button at the left edge of the workspace so it remains accessible without occupying the header.
- Keep the panel’s open/closed state when switching between Builder and Library.
- Place the **S / M / L** title-size buttons immediately after the **Title** label, with the move and delete actions remaining aligned to the right.
- Replace X icons with trash/delete icons for actions that remove a complete block or a custom-block part.
- Keep X icons for non-destructive close actions, including closing the custom block builder.
- Make the custom-block preview text editable in place, using the same click-to-edit interaction as blocks already placed in the Builder.
- Store those text edits with the custom block so they remain visible after saving, reopening, adding from the Library, saving the project, and exporting standalone HTML.

## Validation

- Verify the panel button aligns with both left-panel headings and restores the panel after minimizing.
- Verify title sizing stays adjacent to the Title label at desktop and narrower widths.
- Verify block and part removal use delete icons, while close controls still use X icons.
- Verify eyebrow, title, paragraph, list, step, table, callout, button, and other text in custom blocks can be edited and persists through save/reopen and export.
- Rebuild and check the live preview for layout or interaction errors.

## Technical note

- Extend the custom-block data with persisted text-edit operations, apply them whenever a custom block is rendered, and connect the custom-block preview to update those operations.
