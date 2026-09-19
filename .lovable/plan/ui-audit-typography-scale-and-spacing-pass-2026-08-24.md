# UI audit: typography scale and spacing pass

The workspace works, but it reads as cramped and visually noisy: text sizes were chosen ad-hoc per component (there are `text-[10px]`, `text-[11px]`, `text-[12px]`, `text-[13px]`, `text-[15px]`, `text-xs`, `text-sm` all in play), and padding/gaps were tuned block-by-block rather than from a shared rhythm. This pass fixes both without changing behaviour.

## 1. One typography scale

Define a small, named scale and apply it everywhere, replacing every arbitrary pixel size:

- Body / step content: 14px (`text-sm`)
- Secondary text, notes, outline entries: 13px
- Labels, chips, uppercase eyebrows: 11px (only for uppercase micro-labels)
- Block titles: 16px semibold; document title stays 24px
- Toolbar and sidebar buttons: 14px, not 12px

Concretely: eliminate `text-[10px]`, `text-[12px]`, `text-[15px]` entirely; keep at most two custom steps (13px, 11px) registered as `--text-*` theme tokens in `src/styles.css` so they are used consistently rather than hand-written per file.

## 2. Toolbar

Buttons currently have generous padding (`px-4 py-2`) around 12px text, so the labels look undersized inside oversized pills. Move to 14px labels, `px-3 py-2`, consistent `gap-2`, and a uniform 36px control height across Files / Outline / Import / mode toggle / Save. Group related controls with a divider instead of equal spacing between all seven items, so the bar reads as three clusters (view toggles, import, mode + save).

## 3. Outline rail

Everything in the rail is 11–12px, so headings, steps, sub-items and notes all look alike. Give it hierarchy: 13px medium step labels, 12px muted sub-items, notes at 12px with a clear left indent, and consistent 8px vertical rhythm between entries (today it mixes `space-y-0.5`, `space-y-1`, `space-y-2`, `space-y-3`). Rail padding goes to a single value, and the "Outline" header gets a sticky, bordered treatment so it doesn't float.

## 4. Canvas rhythm

Edit mode uses `space-y-2` / `space-y-1`, view mode `space-y-5` / `space-y-10` — a big jump. Normalise to a defined pair (edit: 12px between blocks with insert slots absorbing the rest; view: 40px) and make block padding consistent: edit blocks `p-4 pt-12`, view blocks `p-4` instead of the current `p-3` / `p-2` mix. Also normalise the top-of-document spacing so the title, intro and first block are evenly spaced.

## 5. Sidebar and palette

Align both rails to the same padding scale as the outline (16px container, 8–12px item padding), palette group headers to the 11px uppercase label style, palette buttons to 14px text with a 16px icon (currently a 20px icon next to 14px text looks unbalanced), and the file list to 14px rows at a consistent 36px height.

## 6. Inside the widgets (the actual cramped part)

This is where the worst offenders live, so it gets specific rules rather than a general sweep. The governing distinction: **brand surfaces** (the Slack message/modal body, the Zendesk ticket and rule cards as a customer would see them) keep their brand-accurate sizes and paddings; **editor chrome** around and inside them (inline inputs, toggles, add/remove links, section labels) follows the app scale. Today the two are mixed, which is what makes them feel arbitrary.

- **Zendesk rule cards** (`ZendeskRule.tsx`): condition and action rows use `px-1`, `px-1.5`, `py-0.5` inputs jammed into `p-2` boxes with `mb-1.5` — rows visually collide. Standardise every inline input to a single control height with `px-2 py-1` padding, condition/action group boxes to `p-3`, and 8px between rows. Section labels ("Conditions", "Actions") all take the 11px uppercase label style with equal spacing above and below.
- **Zendesk ticket** (`ZendeskTicket.tsx`): the property strip and comment area currently mix `mt-1`, `py-1.5`, and `p-2`. Give the strip consistent field spacing (12px column gap, 8px row gap), align field label-to-input spacing to one value, and pad the strip and the comment box identically so the "above"/"below" placements look symmetric.
- **Slack surfaces** (`SlackBlockKit.tsx`): keep the 15px input / 13px button / 12px meta sizes — those are Slack's real values. Fix instead the editor toolbar above them (`py-0.5` micro-buttons, `text-xs`) to match the app's control height, the `text-[10px]` block-type badges, and the inconsistent `space-y-1` vs `space-y-3` between Block Kit blocks (one 12px rhythm).
- **Split lanes** (`SplitBlock.tsx`): lane cards are `p-4` but the footer controls use `mt-4 pt-3` with `py-1`/`py-1.5`/`py-2` controls side by side. Unify footer control heights, use one `mt-4 pt-4` divider, and set the lane column gap and the outcome pill spacing to the same rhythm as the canvas.
- **Block info** (`BlockInfo.tsx`) and **block chrome** (`BlockView.tsx`): the `pt-12` reserved for the floating toolbar leaves an odd gap on short blocks — tighten it to match the toolbar height exactly. Change-tracking chips, field rows and the info panel get one shared padding and 8px row rhythm instead of the current per-row values. Instruction checklists get consistent checkbox-to-text alignment and even item spacing.
- **Callout / note / external blocks** in `BlockView.tsx`: all move from `p-3` to the shared block padding, with their eyebrow labels on the 11px label style and one value for label-to-body spacing.

## Technical notes

- Add `--text-label` (11px) and `--text-body-sm` (13px) plus matching line-heights to the `@theme` block in `src/styles.css`; use `text-label` / `text-body-sm` utilities in components.
- Files touched: `src/styles.css`, `TopBar.tsx`, `Rails.tsx`, `Sidebar.tsx`, `Palette.tsx`, `Canvas.tsx`, `InsertSlot.tsx`, and the block components listed above.
- Presentation-only: no changes to the store, markdown parse/serialize, or import logic.
- Verified afterwards with a Playwright pass at desktop and mobile widths.
