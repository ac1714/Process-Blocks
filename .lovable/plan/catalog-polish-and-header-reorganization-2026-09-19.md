# Catalog polish and header reorganization

## Goal

Make the selected library samples visually consistent and dependable, then move document, theme, and file actions into a clearer header layout.

## Plan

### 1. Repair the selected library samples

- Replace the two failing hosted logo URLs for Google Sheets and Workato with reliable external sources.
- Add a visible branded fallback so a blocked or unavailable external logo never leaves a broken-image gap.
- Standardize logo containers so all brands have a consistent visual size, fixed alignment, and spacing beside one-line or two-line text.
- Audit the selected Zendesk, Slack, Confluence, Jira, Google Workspace, Salesforce, Workato, process-flow, heading, and numbered-step examples.
- Correct undersized or inconsistent labels, titles, metadata, row spacing, and outer padding while preserving each sample’s intended brand character.
- Ensure compact samples wrap safely rather than overlapping at narrower card widths.

### 2. Add a Theme modal

- Add a **Theme** button immediately to the right of the Builder / Library toggle.
- Move Color, Font, and Density controls from the left panel into a focused modal.
- Keep palette selection, Exact colors, Auto-match accents, Quicksand, and density behavior unchanged.
- Remove those controls from the left panel so it remains focused on library navigation.

### 3. Reorganize header actions

- Place **Save**, **Preview**, and **Copy all** together on the left side, directly after Theme.
- Move **Open project**, **Save project**, and **Export self-saving HTML** to a right-aligned file-action group.
- Use distinct labels/tooltips so template saving and project-file saving cannot be confused.
- Preserve disabled, copied, preview, standalone, and custom save/open behavior.

### 4. Improve block ordering controls

- Add explicit move-up and move-down controls beside each block’s drag handle, with unavailable directions disabled at the first and last positions.
- Replace the current two-column grip with a clearer three- or four-column dot grip while preserving drag-and-drop behavior.
- Add a **Save block** action to each block so the complete current block, including its inline edits and styling, can be stored in My blocks and reused.
- Keep block numbering, expand/collapse, editing, copying, and removal unchanged.

### 5. Restack the custom block builder

- Make the **Add Part** area a full-width section.
- Place the full-width section manager directly below Add Part.
- Place the full-width preview below the section manager instead of beside it.
- Preserve shell settings, section/column controls, part movement, and save behavior while removing the current split-column layout.

### 6. Validate the finished experience

- Check all external logos for successful loading, correct rendered dimensions, and alignment.
- Review the selected catalog samples at desktop and narrower widths for clipping, overlap, typography, and padding.
- Verify the Theme modal and every moved header action.
- Verify button-based and drag-based block reordering, including first/last disabled states.
- Verify a complete edited block can be saved to My blocks and inserted again without losing its content or appearance.
- Verify the custom block builder’s Add Part → section manager → preview order at desktop and narrower widths.
- Regenerate and inspect the self-saving HTML so it includes the same corrected samples, logos, and header.
- Run code checks and confirm the page metadata remains complete.

## Technical details

- Keep sample content in its catalog data sources rather than adding exceptions to the preview component.
- Consolidate logo sizing and fallback behavior in the shared brand-logo renderer and shared tool-sample helpers.
- Reuse the existing dialog and theme controls; simplify the left-panel interface after relocating its settings and file actions.
- Use existing semantic interface tokens for all application controls. Exported sample HTML will retain its portable inline styling.
