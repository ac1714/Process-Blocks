# Header and Builder card cleanup

## Changes

- Replace the separate Builder and Library buttons with one compact two-option segmented toggle. Preserve the existing view-switch behavior, icons, and active-state clarity.
- Standardize Builder/Library, Preview/Hide preview, Save, and Copy all controls to the same fixed height without allowing labels to wrap or resize the header.
- Remove the positional number shown before each block name in Builder cards. Keep Library catalog numbering unchanged.

## Validation

- Check Builder and Library states at the current viewport and a narrower viewport for equal control heights, stable alignment, and no wrapping.
- Confirm the segmented toggle switches views correctly and retains the established Preview behavior.
- Confirm Builder cards no longer show numbers while Library identifiers remain visible.
