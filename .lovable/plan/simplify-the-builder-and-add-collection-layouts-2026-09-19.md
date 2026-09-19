# Simplify the builder and add collection layouts

## Goal

Make the main Builder the single place for arranging and styling blocks. A collection can mix full-width rows with rows containing several blocks, while the custom block tool becomes a simple one-section content builder.

## Builder header and left panel

- Restore a compact control for hiding and reopening the left panel without losing its state.
- Keep **Builder** and **Library** together, then place **Preview** immediately to the right of Library.
- Place **Save** beside Preview only while Builder is active; remove the duplicate template Save action from the left panel.
- Keep Preview behavior consistent: Preview switches to Builder preview, Hide preview reopens block cards, and Library resets the control to Preview.
- Retain project open/save and HTML export actions at the bottom of the left panel.

## Collection layout on the main Builder

- Replace per-block content columns with collection-level row layouts.
- Let each row be independently set from one through six columns, so one collection can mix full-width and multi-column rows.
- Make narrower screens reduce multi-column rows at sensible breakpoints so cards remain usable rather than squeezing indefinitely.
- Allow whole blocks to move up/down within a column and left/right between columns, with controls kept at each card’s bottom-right.
- Make insertion points work within the selected row/column and preserve drag/reorder behavior.
- Migrate existing saved block-level layouts safely back to normal block content instead of discarding content.

## Block controls

- Remove the block-level Columns editor entirely.
- Add basic **Shell**, **Border**, and **Background** controls to every block card, including blocks originally inserted from the Library.
- Treat inserted Library items as ordinary builder blocks; apply only safe outer-surface changes directly to the block’s existing outer structure, without adding another frame.
- Keep each block’s existing content, inline edits, accent choice, save, copy, and delete behavior intact.

## Quick Add and custom block builder

- Put a single **Quick Add** button beside **Library** and **Build block** at each insertion point.
- Open a compact menu from that button, showing the relevant available additions rather than displaying all options inline on each block.
- Remove multiple-section support from Build block, including Add section and the Section manager.
- Replace it with one ordered list of parts: add a part, configure it, reorder it, remove it, and see the full-width preview below.
- Preserve old custom blocks by flattening their sections and columns into one ordered part list when edited or rendered under the simplified model.

## Technical details

- Introduce a collection layout model made of ordered rows and columns containing block IDs; normalize it whenever blocks are added, removed, loaded, or reordered.
- Render responsive collection rows in the app while keeping copied/exported HTML dependable with table-based fallbacks where needed.
- Extend each builder item with optional safe shell/border/background overrides and apply them after text edits but before final layout rendering.
- Remove obsolete per-block layout controls and section-target state while retaining compatibility normalization for existing saved projects and standalone files.
- Regenerate and verify the standalone local HTML so the same layout, controls, edits, and self-saving behavior work without a server.

## Validation

- Test mixed one-, two-, and six-column rows on desktop and narrow viewports.
- Test block movement in every direction, insertion into a chosen column, deletion, save/load, copy, preview transitions, and panel hiding.
- Confirm Library-added and custom blocks accept safe appearance changes without extra frames or damaged internal styling.
- Confirm legacy saved projects open without losing block content.
- Run type checks, the standalone export build, and browser checks for the app and downloaded local HTML.
