# Stabilize the Preview control and shorten Block Builder labels

## Changes

- Give the **Preview / Hide preview** header control a fixed minimum width and centered label so toggling it does not shift adjacent controls.
- Rename only the Block Builder’s Add Part labels:
  - **Bullet list** → **List**
  - **Numbered steps** → **Steps**
  - **Stat row** → **KPI**
  - **Brand logo** → **Logos**
- Keep each option’s existing block type and behavior unchanged; this is a label-only change.
- Remove the **Block Studio / Builder controls** identity strip from the expanded left panel.
- Move the existing collapse-panel button onto the same row as the **Library categories** heading, aligned to its right.
- Keep the collapsed panel’s reopen button unchanged.
- Include the same updates in the refreshed standalone export.

## Validation

- Toggle Preview repeatedly and confirm the button and neighboring header controls remain stationary.
- Confirm the four shorter labels appear in Add Part and still insert the correct elements.
- Confirm the expanded panel starts with Library categories, its collapse button shares that heading row, and collapsing/reopening still works.
- Verify the app and standalone export pass their existing checks.
