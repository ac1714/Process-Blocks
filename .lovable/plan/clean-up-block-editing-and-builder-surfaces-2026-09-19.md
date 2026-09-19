# Clean up block editing and builder surfaces

## Goal

Make editing act on complete content units, remove inner-item saving, and visually separate the custom builder workspace from finished library blocks without adding extra frames around the content.

## Changes

- Remove the “Save as block” action from hovered inner steps, rows, list items, and cards.
- Keep the existing whole-block save action in each builder block header.
- Make inline duplicate/remove controls target complete logical items:
  - a numbered step duplicates or removes its entire row, including its number and text;
  - a table action targets the full row rather than an individual cell;
  - a list action targets the full list item;
  - nested text, badges, numbers, and layout cells do not receive independent structural actions.
- Keep text editing available within those items.
- Review the quick-add choices generated for each block and suppress options that do not represent a valid complete unit for that block.
- Remove the extra visual frame around the custom block preview so it shows the block’s own selected shell only.
- Remove card-like framing from individual section-management areas while retaining their controls and boundaries.
- Give the Add Part, Section Manager, and Preview work areas a distinct neutral workspace surface so they are clearly different from finished library elements.
- Update the helper text so it describes only the remaining edit, duplicate, and remove behavior.
- Standardize image, logo, icon, and badge alignment across every library element:
  - align the visual with the first title or text line beside it;
  - do not vertically center the visual against the height of the entire multi-line container;
  - apply the same rule to tool-flow rows such as the Workato “Recipe triggered” example and to equivalent library patterns.
- Make library logo/image assets transparent and borderless, removing white tiles, fallback color boxes, favicon backgrounds, and subtle image outlines.
- Replace the Salesforce asset with its icon-only mark and Workato with a transparent mark that has no colored background.
- Add multiple Google Sheets library examples using the Google Sheets icon, covering distinct practical layouts rather than duplicating the existing tracker sample.

## Technical notes

- Replace broad tag-based hover targeting with semantic target resolution that prefers complete rows and list items and excludes individual cells.
- Remove the inner-fragment callback path from the builder stack; retain saved fragments already in My blocks for backward compatibility.
- Use existing theme tokens for workspace differentiation and borders.
- Audit shared library helpers and individual image/icon rows so top alignment is consistent at the source rather than patched only in the selected example.
- Use transparent externally hosted logo assets with a non-boxed fallback that does not introduce a background or border.

## Validation

- Confirm hovering a step number or step text offers one action for the whole step, never the number alone.
- Confirm rows and list items duplicate/remove as complete units and inner save controls are absent.
- Confirm whole-block saving still adds the finished block to My blocks.
- Confirm builder sections and preview have differentiated workspace backgrounds without extra content frames.
- Confirm images, logos, icons, and badges align with the first adjacent title/text line across all library categories, including wrapped multi-line examples.
- Confirm every logo/image remains transparent and borderless, Salesforce and Workato use the requested mark styles, and the new Google Sheets samples appear with working icons.
- Check desktop and narrow layouts, browser console, type validation, current standalone export, and route metadata.
