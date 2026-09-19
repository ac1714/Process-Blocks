# Rebuild: Block-Builder Studio (based on Remix of Ignite Snippets)

## Goal

Replace the current Process Canvas app with a copy of "Remix of Ignite Snippets"
(project a3220bff) and refocus it on the block builder: a stack of copy-ready
HTML blocks you assemble by inserting pre-built blocks and samples, with a
clear numbering/ID system for referencing specific blocks.

The original Ignite Snippets project is not modified — it is only read.

## What the new app keeps from the base

Everything the base already does:

- Full snippet gallery (Steps & lists, Cards & grids, Callouts, Headlines,
  Text & layout, Tables & data, Media & CTA, Tools & process with Zendesk,
  Slack, Workato, Google, Jira, Salesforce blocks).
- Color palettes and studio theme.
- Element builder (build a block from parts) and custom saved blocks.
- Drag-and-drop stack with editing, saved templates, favorites.
- Copy-per-block HTML and standalone self-saving HTML export.

## Changes on top of the base

1. **Refocus the layout on the block builder.**
   - The block stack (the document being built) becomes the primary,
     always-visible surface.
   - The gallery and samples become the insertion palette for adding
     pre-built blocks — still browsable by category, reachable from the
     builder, not the main screen.
2. **Block identification system.**
   - Every block in the stack gets a stable, visible reference number
     (01, 02, 03, …) that stays with the block while reordering.
   - Numbers appear on stack items, in copy/exported HTML as an HTML comment
     (e.g. `<!-- block 03: Update a Zendesk ticket -->`), and in the
     standalone export.
   - Optional visible number chip on the rendered block, toggleable.
   - Jump-to-block: a small field or list to go straight to a block number.
3. **Both outputs, verified.**
   - Copy single block (with its number comment) — already exists, keep.
   - Copy the whole stack — already exists, keep.
   - Standalone self-saving HTML export — already exists, keep; ensure block
     numbering carries through.

## Steps

1. Copy the base project's source into this project: `src/`, `public/`,
   configs (`package.json`, `vite.config.ts`, `tsconfig.json`, etc.),
   excluding git metadata and dependencies. Remove all old Process Canvas
   code and its extra dependencies.
2. Install dependencies from the base's lockfile and confirm the app runs
   identically to the base.
3. Implement the block numbering system (stable IDs, visible chips, HTML
   comments in copy/export, jump-to-block).
4. Rearrange the studio so the block stack leads and the gallery is the
   insertion palette.
5. Update the page title/description to match the refocused purpose.
6. Verify: typecheck, Playwright pass over building a stack, reordering,
   numbering, copying a block, and standalone export.

## Notes

- Nothing is written to the original Ignite Snippets project.
- This project becomes the new app; the old Process Canvas code is removed
  as part of the copy.
