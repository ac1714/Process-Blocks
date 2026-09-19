# Split paths in a process

Add a **Split** block that breaks the process into two or more parallel paths shown side-by-side, where each path holds its own stack of blocks and each path declares its own outcome.

## What it looks like

```text
┌─ SPLIT ─────────────────────────────────────────────┐
│  Path A: Refund         │  Path B: Replacement      │
│  ┌───────────────────┐  │  ┌──────────────────────┐ │
│  │ instruction block │  │  │ zd-macro block       │ │
│  │ zd-ticket block   │  │  │ callout block        │ │
│  └───────────────────┘  │  └──────────────────────┘ │
│  outcome: converges     │  outcome: converges       │
└─────────────────────────────────────────────────────┘
        ╰──────── Paths converge ────────╯
              (converge bar, editable label)
```

- Each lane has an editable title and its own insert slots, drag-and-drop, and full block palette (any existing block type can live in a lane).
- Lanes are side-by-side columns on desktop and stack vertically on narrow screens.
- Add/remove lane controls in edit mode.

## Rejoin marker

Each lane carries an outcome that you set from a small dropdown on the lane footer:

- **Converges** — the lane feeds into the converge bar
- **Terminal** — with an editable outcome label (e.g. "Ticket closed", "Escalated to Tier 2")
- **Jumps to step N** — pick another block in the document; renders as a link that scrolls to it

A **converge bar** renders directly below the split whenever at least one lane converges. It spans the width of the converging lanes, has an editable label (default "Paths converge"), and visually connects the lane bottoms into the main flow. If no lane converges, no bar renders and the split reads as a true fork.

## Outline panel

The Outline gets nested entries: the split appears as one numbered step, with each lane indented beneath it and each lane's blocks under that. Process notes still work per block, and the split block itself gets its own note.

## Technical notes

- `src/lib/markdown/types.ts`: new block variant `{ type: "split"; lanes: SplitLane[]; convergeLabel?: string }` where `SplitLane = { key, title, blocks: Block[], outcome: { kind: "converge" } | { kind: "terminal"; label: string } | { kind: "jump"; targetId: string } }`. `Block` becomes recursive — one nesting level only (no split inside a split; the palette hides Split when inside a lane).
- `parse.ts` / `serialize.ts`: `<split-paths data-id converge-label>` containing `<split-lane key title outcome outcome-label outcome-target>` wrappers; lane children reuse the existing block serializers so nothing about current files changes.
- `src/lib/store/workspace.ts`: block mutation helpers (`updateBlock`, `removeBlock`, `moveBlock`, `insertBlock`, `reorderBlocks`) get a recursive walk so they can target blocks inside lanes; add `addLane`, `removeLane`, `setLaneOutcome`.
- `src/components/blocks/SplitBlock.tsx`: renders lanes with `SortableList` per lane, `InsertSlot` per lane position, lane header/footer chrome, and the converge bar. `BlockView` gets the `split` case.
- `Palette.tsx`: add a "Split paths" entry (Git-branch icon) under a Flow group; `Rails.tsx` outline walks lanes recursively.
- Drag-and-drop across lanes is out of scope for this pass — blocks move within their lane; use delete + insert to move between lanes.

---

# View mode spacing

View mode currently uses the same tight `space-y-2` / `p-1` rhythm as edit mode. Change so that in view mode blocks get noticeably more separation:

- Canvas block stack: `space-y-2` in edit, roughly `space-y-8` in view.
- `BlockChrome` view padding grows from `p-1` to about `py-2`.
- More space between the document intro and the first block, and inside split lanes between lane blocks.
- Edit mode density stays exactly as it is today.

# Standardized step info (title / description / metadata)

Every block gains an optional, standardized info record — empty by default, so nothing changes for existing documents.

Fields:

- **Title** — short heading for the step
- **Description** — a paragraph of context
- **Metadata** — a list of key/value pairs you add, edit, and remove (e.g. Owner: Tier 1, SLA: 4h, System: Zendesk)

Behavior:

- Edit mode: a compact **Info** control in the block chrome opens a small editor to set the title, description, add/edit/remove metadata rows, choose position (above or below the block), and flip the visibility toggle.
- View mode: renders as a clean info panel above or below the block, showing only the parts that are filled in. Metadata renders as label/value pairs.
- Each block has its own visibility toggle, so a step can carry info that stays hidden until you turn it on. Hidden info still shows in edit mode (dimmed) so it isn't lost.
- Works for all block types, including blocks inside split lanes.

## Technical notes

- `types.ts`: `BlockBase` gains `info?: { title?: string; description?: string; meta?: { key: string; value: string }[]; position?: "above" | "below"; visible?: boolean }`.
- `parse.ts` / `serialize.ts`: a `<block-info position visible>` child element with `<info-title>`, `<info-description>`, and `<info-meta key value>` entries; omitted entirely when empty.
- New `src/components/blocks/BlockInfo.tsx` (renderer) and `BlockInfoEditor.tsx` (popover editor), wired into `BlockChrome` in `BlockView.tsx` so every block type inherits it in one place.
- Uses the existing `updateBlock` store action, so split-lane blocks are covered by the same recursive walk described above.
