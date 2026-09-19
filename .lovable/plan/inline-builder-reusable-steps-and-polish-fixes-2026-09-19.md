# Inline builder, reusable steps, and polish fixes

Refine the builder so creation, insertion, and configuration happen directly in the block stack, while fixing the export, branding, templates, and affected library samples.

## Builder flow

- Move the Block Studio identity from the top bar into the upper-left of the left controls panel; keep the Builder/Library switch and document actions in the top bar.
- Add insertion controls before, between, and after builder blocks. Each control opens an inline choice at that exact position: insert from the library or build a custom block.
- Render the custom block editor directly at the selected insertion point instead of in a right-side panel. Saving inserts the block there; cancelling removes the inline editor without changing the stack.
- Open custom-block layout configuration inline within its existing row. Keep stock-block instance controls—accent, reset, quick-add, text editing—inside that row so configuration no longer changes the page width.
- Remove the obsolete right-panel builder state and layout.

## Reliable in-canvas editing and reusable steps

- Replace the fragile blur-only text-edit flow with explicit editable targets that support nested text markup, preserve edits before other controls rerender, and record stable targets after structural additions or removals.
- Keep Enter/Escape and visible focus behavior predictable, and verify edits persist after collapse, reorder, quick-add, save, and reload.
- Add a “Save as block” action to eligible individual steps/rows/list items. It saves a copy of that rendered step—including current text and styling—to **My blocks** without removing or duplicating it in the current builder stack.
- Store saved step fragments as reusable library entries with stable IDs and render them alongside custom blocks and templates; include them in project files and standalone-file state.

## Templates and standalone export

- Replace the browser name prompt with an in-app save-template dialog containing a name field, Cancel, and Save actions, including validation and keyboard/focus behavior.
- Restore a reproducible standalone generation script and make the regular build refresh the inlined standalone CSS and JavaScript before the app is bundled, preventing exports from shipping an older studio version.
- Keep the standalone file self-saving and ensure the new inline builder, reusable steps, template dialog, fonts, and logo sources are included in the exported tool.
- Rename remaining old default filenames such as `ignite-studio.html` and `ignite-studio-project.json` to Block Studio names.

## Fonts and logos

- Add Quicksand to the selectable studio font list and load it in both the main app and standalone export.
- Replace embedded brand-logo SVG strings with externally hosted image URLs from Wikimedia Commons or another stable public source.
- Render logos through accessible `<img>` markup with fixed dimensions and a text fallback so unavailable external images do not break layouts.
- Apply the external-logo renderer consistently in stock tool samples, custom blocks, and the custom block editor.

## Library sample fixes

- Add proper internal spacing to **L-115 — Cross-tool handoff**.
- Fix the status/header overlap in **L-118 — Update a Jira issue**, allowing the header content to wrap cleanly at narrow widths without changing the library card width.

## Validation

- Verify desktop and narrow layouts: left-panel identity, insertion at every gap, inline custom editing, library block configuration, and no right-side panel.
- Verify nested and plain text can be edited and survives structural changes, reorder, reload, and export.
- Save individual steps to My blocks, reinsert them, save/load a project, and reopen an exported standalone file.
- Confirm the custom template dialog replaces the browser prompt, Quicksand renders, remote logos load with fallbacks, and L-115/L-118 no longer have spacing or overlap defects.
- Confirm the app build is clean and the generated standalone bundle contains the current version.

## Technical details

- Update the persisted state with a backward-compatible reusable-fragment collection; older saved projects continue to load with an empty collection.
- Use stable edit identifiers in rendered markup where possible, with DOM paths only as a compatibility fallback for older saved operations.
- Use semantic design tokens and existing controls for all new inline insertion, dialog, and row actions.
