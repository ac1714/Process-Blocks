# Increase padding on header and right-sidebar controls

Goal: Make the header buttons and the right-side palette buttons feel less cramped while keeping the overall app compact and information-dense.

## Scope

- **Primary targets:** TopBar (header) buttons and icons; right-hand Palette text buttons.
- **General audit:** Also review the left sidebar file list and the left/right rails for the same pinch points, but only apply small, compact increases where needed.

## Plan

1. **TopBar padding pass** (`src/components/workspace/TopBar.tsx`)
   - Increase horizontal padding on the Notes, Steps, Import Slack, and Save buttons.
   - Slightly increase the vertical padding of the mode toggle segment buttons.
   - Add a little more gap between the header icon/text button group so icons and labels don’t sit on each other.
   - Keep the bar height increase minimal (compact).

2. **Right Palette padding pass** (`src/components/workspace/Palette.tsx`)
   - Increase padding on each block-template button and the group header labels.
   - Add a small gap between the icon and the label so the text buttons are easier to scan.

3. **Compact general spacing audit**
   - `src/components/workspace/Sidebar.tsx`: check the file list button and bottom tip padding; bump only the most cramped values.
   - `src/components/workspace/Rails.tsx`: check process-note and step list item padding; add a tiny bit of vertical breathing room.
   - Avoid large changes that would make the workspace feel empty.

4. **Verification**
   - Run a build check after the edits.
   - Inspect the preview to confirm the header and right palette buttons look less cramped and the density remains compact.
