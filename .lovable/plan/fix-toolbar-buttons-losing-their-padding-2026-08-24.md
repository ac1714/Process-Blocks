# Fix toolbar buttons losing their padding

## What's wrong

The Notes, Steps, Edit, View, Import and Save buttons all have padding set in the code, but it is being wiped out at runtime. The Zendesk base stylesheet we pull in for the ticket/rule blocks contains a global rule that sets `padding: 0` on every `<button>` on the page, and because of how that stylesheet is loaded it overrides our own button styling everywhere — not just inside the Zendesk blocks. That's why the icon and label sit flush against the button edges.

## The fix

1. Stop the Zendesk base stylesheet from styling the whole app:
   - Load it into a low-priority CSS layer so app utilities always win, and/or scope its reset so it only applies inside Zendesk-styled block containers.
   - Same treatment check for the Slack stylesheet so it can't leak button/link resets either.
2. Re-set the toolbar button sizing so it reads correctly once padding applies:
   - Toolbar height slightly taller, buttons at comfortable horizontal/vertical padding with a consistent gap between icon and label.
   - Edit/View segmented control gets matching inner padding so the active pill isn't flush to its border.
   - Save keeps a slightly wider padding as the primary action.
3. Verify in the running preview by measuring the computed padding on each of those buttons (not just by eye), and screenshot the toolbar.

## Scope

Presentation only — no changes to save behaviour, rail toggling, or block logic.
