# Builder-first Block Studio

Refocus the app so the builder is where all the work happens: library blocks become editable once added, text is edited directly in the canvas, and quick-add buttons extend blocks without leaving the page.

## Numbering moves to the library

- Each library block gets a permanent catalog number shown on its card (e.g. `A-07`), stable across sessions so blocks can be referenced by number.
- The library search also accepts a catalog number.
- Builder rows drop the number chip and show the block name only. The "Go to block" field is replaced by simple position order in the stack.

## Search gets a clear purpose

Today the search box sits in the left panel even in the builder, where it does nothing visible. It searches library block names and descriptions only, so it moves into the library view header, labelled "Search library", with the result count next to it.

## Builder view does everything

- "Build a block" no longer opens a separate full-screen tool. A custom block is created and edited in a side panel next to the builder stack, so custom and library blocks sit in the same list.
- Any block in the stack — library or custom — can be expanded and edited: click any text in the preview to change it, hover a row/step/card for duplicate and remove.
- Each expanded block gets a quick-add bar:
  - Add another step or list item
  - Add a responsive card grid (2 or 3 cards, stacks on narrow screens)
  - Add a stat row or an extra table row
    Buttons only appear when they make sense for that block.
- Accent colour and "Reset text" stay per block.
- Library view keeps its cards with an Add button; adding jumps the new block into the builder stack.

## Layout and scroll fixes

- The left panel is currently a sticky column with its own scroll area, which gets clipped and leaves the page in a stuck scroll position. It becomes a full-height column with its own independent scrolling, so it never gets cut off and never fights the main scroll.
- The floating bottom tray is removed; the builder stack replaces it, so the reserved bottom padding and the stuck-scroll behaviour go away.
- Switching between Builder and Library restores each view's own scroll position instead of leaving the page mid-scroll.

## Colour controls

"Auto-match accents" moves inside the "Exact colors" section and is only visible when that section is expanded.

## Technical notes

- `src/lib/snippets*.ts`: derive a stable catalog number per snippet id from a fixed ordered list; expose `catalogRef(id)`. Keep `BuilderItem.ref` for internal identity but stop rendering it in `StackTray` rows.
- `src/components/StudioApp.tsx`: remove `StackTray` fixed tray usage and `jump`/`highlightRef` state; move `query`/`count` props out of `StudioPanel` into the library header; hold per-view scroll offsets.
- `src/components/StackTray.tsx`: `Row` gains a quick-add toolbar that appends ops. Extend `src/lib/html-ops.ts` with an `ins` op (`{ t: "ins"; p: string; html: string }`) and an `applyOps` branch that inserts rendered markup after the target node, so library blocks can gain steps, rows, stats, and card grids without converting them to custom parts.
- Quick-add markup comes from small theme-aware fragment builders reusing `renderCustomBlock` primitives and `buildPalette`, so inserted pieces match the studio theme.
- `src/components/ElementBuilder.tsx`: keep the editor, render it as an in-page side panel instead of a modal overlay.
- `src/components/ColorControl.tsx`: move the auto-match button inside the `customOpen` branch.
- `src/components/StudioPanel.tsx`: drop the Search section, switch the aside to `h-[100dvh] sticky top-0 overflow-y-auto` with its own overscroll containment.
