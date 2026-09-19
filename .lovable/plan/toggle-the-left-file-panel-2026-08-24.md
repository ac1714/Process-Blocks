# Toggle the left file panel

Add a way to show/hide the left file-explorer panel (the folder + file list), matching how the Notes and Steps rails already toggle from the toolbar.

## What changes

- New **Files** toggle button in the top toolbar, styled exactly like the existing Notes and Steps buttons (icon + label, active state when shown).
- Clicking it collapses the left panel entirely, giving the canvas the full width; clicking again brings it back.
- The panel is visible by default, so nothing changes for existing users until they toggle it.

## Technical notes

- `src/lib/store/workspace.ts`: add `filesVisible: boolean` (default `true`) and `setFilesVisible(v)` alongside the existing `notesVisible` / `stepsVisible` state.
- `src/components/workspace/TopBar.tsx`: add a `PanelLeft` (lucide) button before the Notes button, wired to `filesVisible` / `setFilesVisible`, reusing the same class names as the Notes/Steps buttons.
- `src/routes/index.tsx`: render the `<aside>` wrapping `<Sidebar />` only when `filesVisible` is true.

No changes to file handling, parsing, or block logic.
