# Split paths side-by-side

Paths render as parallel columns again, without shrinking any card. Instead of squeezing lanes into the current column, the process area itself expands where a split occurs.

## Layout

```text
        ┌──────── document column (unchanged width) ────────┐
        │  step 1                                            │
        │  step 2                                            │
└─── split breaks out full width ──────────────────────────────────┘
  ┌── Path A (full card width) ──┐  ┌── Path B (full card width) ──┐
  │ blocks…                      │  │ blocks…                      │
  │ Ends by: rejoining flow      │  │ Ends by: stopping here       │
  └──────────────────────────────┘  └──────────────────────────────┘
        ╰──────────── Paths converge ────────────╯
        │  step 3                                            │
        └────────────────────────────────────────────────────┘
```

- Lane cards keep the same width as a normal step card — nothing inside a lane gets narrower.
- The split block breaks out of the centered document column and uses the full width of the process area (and the process area itself gets more room: the outline rail can be collapsed as today, and the canvas no longer caps the split at the reading column).
- If the lanes together exceed the available width, the split row scrolls horizontally rather than shrinking the cards. Below the medium breakpoint lanes stack vertically as they do now.
- Split marker above, "Add path" and converge marker below, both spanning the split's full width.
- Lane cards stretch to equal height so the "Ends by" footers line up.

## Outline handling

The outline gets nested entries for splits:

- The split appears as one numbered step: "Split into N paths".
- Each lane is listed indented under it with its title, and the lane's blocks are numbered beneath the lane in the same style as top-level blocks (checklists still expand their items, decisions still list options).
- Numbering continues through lanes in order (Path A's steps, then Path B's), so every block still has one unique number.
- Each lane shows its outcome as a small trailing line ("rejoins the main flow" / the terminal label / "continues at <step>").
- Process notes stay per block, including blocks inside lanes, and the split block itself gets its own note.
- Clicking any lane entry scrolls to that block on the canvas, same as today.

## Technical notes

- `src/components/workspace/Canvas.tsx`: the document stack keeps `max-w-3xl mx-auto`, but the container becomes full-width with the inner max-width applied per block, so a `split` block can render at the full process-area width. Simplest form: keep the wrapper `max-w-3xl` and give the split a break-out wrapper (`w-screen`-free approach: `mx-[calc(50%-50vw)]`-style is fragile — instead move `max-w-3xl` from the stack container onto each non-split child and let split children span the padded full width).
- `src/components/blocks/SplitBlock.tsx`: lanes render in a `flex gap-6 overflow-x-auto items-stretch` row on `md+` (stacked below), each lane a fixed `basis-[48rem] shrink-0 grow` card matching normal step width; `LaneCard` gets `h-full flex flex-col` with `mt-auto` on the outcome footer.
- `src/components/workspace/Rails.tsx`: factor the per-block outline `<li>` rendering into a helper that takes a numbering counter, then recurse into `split` lanes with an indented sub-list plus lane title and outcome line.
- No changes to types, parse/serialize, or the store — presentation only.
