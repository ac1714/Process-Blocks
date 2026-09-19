# Remove the extra preview frame and reorder the left panel

## Changes

- Remove the bordered, padded card around the combined Builder preview so the rendered blocks appear directly on the Builder canvas.
- Keep the preview’s functional container for rendering and horizontal overflow, but give it no extra visual frame.
- Remove the extra wrapper frame immediately around the editable library element inside each expanded Builder block.
- Change only the surrounding Builder block surface from white to a distinct neutral semantic background. It will differ from both the page background and the white library element.
- Do not change the markup, colors, backgrounds, borders, or other presentation of the actual library elements.
- Move **Library categories** above **Appearance** in the left panel; keep the existing category highlighting and expandable Theme controls unchanged.

## Validation

- Confirm Preview shows no outer border, background, or extra padding around the assembled blocks.
- Confirm the extra wrapper around each editable element is gone, the Builder block has a distinct neutral surface, and the library element itself is visually unchanged.
- Confirm Library categories appears before Appearance and both sections retain their current behavior.
- Verify the app and refreshed standalone export.
