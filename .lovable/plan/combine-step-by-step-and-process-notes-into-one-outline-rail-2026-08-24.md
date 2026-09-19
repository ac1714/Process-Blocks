# Combine Step-by-step and Process Notes into one Outline rail

Right now the canvas is squeezed between two side rails that say much the same thing: the left rail lists blocks with a note box, the right rail lists the same blocks as numbered steps. Merge them into a single rail.

## What changes

- One rail on the right, titled **Outline**, replacing both the left Notes rail and the right Steps rail.
- Each entry shows: step number, the block label (clickable — scrolls to and highlights the block on the canvas), and, for checklists, its sub-items and decision options nested underneath as today.
- The note for that step lives directly under its label in the same entry: an editable text box in Edit mode ("Add context for this step…"), and plain note text in View mode (entries with no note simply show none).
- The canvas becomes a two-column layout (document + outline), so the document itself gets noticeably wider.

## Toolbar

- The **Notes** and **Steps** buttons collapse into a single **Outline** toggle (list icon).
- Files toggle stays as-is.

## Technical notes

- `src/components/workspace/Rails.tsx`: replace `StepsRail` and `NotesRail` with one `OutlineRail({ mode })` that walks `doc.blocks`, keeps the existing numbering logic and `scrollTo` helper, and renders the note editor inline via `updateBlock`.
- `src/components/workspace/Canvas.tsx`: drop the left aside and the 3-column grid template; render document + right `OutlineRail` gated on one visibility flag.
- `src/lib/store/workspace.ts`: replace `notesVisible` / `stepsVisible` (and their setters) with `outlineVisible` / `setOutlineVisible`.
- `src/components/workspace/TopBar.tsx`: single Outline button wired to the new flag.
- No changes to Markdown parsing/serialization — notes are still stored per block.
