# Inline Step Info with Change Tracking

Replace the Step Info popover with an inline editor, and turn metadata rows into explicit change records that show old vs. new values and mark additions and removals.

## What changes

### 1. Inline editor (no popover)

- The **Info** button on a block toolbar becomes a toggle that reveals an editable info panel **in place** — above or below the step, exactly where it renders in View mode.
- The panel shows Title, Description, and the metadata list as real inline fields, so nothing overlaps the step content.
- Panel footer keeps: position (above / below), visibility toggle, and Clear step info.
- In View mode the same panel renders read-only (and is skipped when hidden or empty).

I typed into the current popover's Label field in the live preview and the value did register, so the underlying cause is likely the popover floating over the block rather than a broken input. Moving it inline removes the overlap either way; if a stuck field still shows up after the rewrite, I'll chase it then.

### 2. Metadata becomes change records

Each row captures one field and what happened to it:

```text
Label          Change     Old value        New value
Priority       Changed    Normal        →  Urgent
Tag: vip       Added                    →  vip
Assignee       Removed    Tier 1 queue
Owner          Info                        Support Ops
```

- **Change** is a small select: Added, Changed, Removed, or Info (plain fact, no change).
- **Old value** shows only for Changed and Removed. **New value** shows only for Added, Changed, and Info.
- View mode renders each row as a compact line: label, a colored chip for the change type (green Added, amber Changed, red Removed, neutral Info), then `old → new` with the old value struck through for Removed.
- Rows stay reorderable and removable.

Existing metadata entries (label + single value) keep working: they load as `Info` rows with that value as the new value.

### 3. Split paths become full-size stacked cards

The current side-by-side columns inside one dashed container go away. Instead:

```text
──────────  Process splits into 2 paths  ──────────

┌──────────────────────────────────────────────┐
│ Path A — Customer replies                     │
│  [ full-width steps, same size as normal ]    │
│  Ends by: rejoining the main flow             │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Path B — No response in 48h                   │
│  [ full-width steps ]                         │
│  Ends by: stopping here — "Ticket auto-closed"│
└──────────────────────────────────────────────┘

──────────  Paths converge  ──────────
```

- Each path is its own full-width card in the document flow, stacked vertically — no outer block wrapper, no dashed container, no cramped columns.
- Steps inside a path render at full document width and look identical to top-level steps (same chrome, same info panel, same drag handles).
- A slim split marker line opens the group; the converge marker closes it, and only appears when at least one path rejoins.
- Path header holds the editable path title and a delete-path control; the path footer keeps the outcome selector (rejoin / stop here / continue at another step).
- "Add path" sits after the last path card in Edit mode.

The grouping still exists in the saved Markdown (the paths need to be structurally tied together and to their converge point), but nothing about that grouping shows up as a block card in the UI.

## Technical notes

- `src/lib/markdown/types.ts`: extend `BlockInfoMeta` to `{ key: string; change?: "added" | "changed" | "removed" | "info"; from?: string; to?: string; value?: string }`, keeping `value` for backward compatibility.
- `src/lib/markdown/parse.ts` / `serialize.ts`: persist `change`, `from`, `to` on the `<block-info>` meta entries; read legacy `value` into `to` with `change: "info"`.
- `src/components/blocks/BlockInfo.tsx`: split into `BlockInfoPanel` (renders read-only view, or the inline editor when Edit mode + expanded) and a small `BlockInfoToggle` for the toolbar; delete the absolute-positioned popover markup.
- `src/components/blocks/BlockView.tsx`: keep rendering the panel above/below the block; the toolbar button only toggles expansion state (local `useState` per block).
- `src/components/blocks/SplitBlock.tsx`: drop the grid/columns and the dashed wrapper; render markers plus one full-width card per lane, stacked. The `split` block keeps its data shape (`lanes`, `convergeLabel`) so parsing, serialization, outline, and lane actions in the store stay as they are.
- `src/components/blocks/BlockView.tsx`: render the `split` case without `BlockChrome` so no outer block card surrounds the paths.
