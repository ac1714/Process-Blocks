import { buildPalettes } from "./snippet-colors";
import { getSnippet } from "./snippets";
import { applyOps, type Op } from "./html-ops";
import { applyLayout, type BlockLayout } from "./block-layout";
import { applyTheme, type Theme } from "./theme";
import { renderCustomBlock, type CustomBlock } from "./custom-blocks";
import { applyBlockAppearance, type BlockAppearance } from "./block-appearance";
import { normalizeCollectionLayout, type CollectionLayout } from "./collection-layout";

export const CUSTOM_PREFIX = "custom:";
export const FRAGMENT_PREFIX = "fragment:";

export type BuilderItem = {
  uid: string;
  snippetId: string;
  /** Stable reference number for identifying this block; survives reordering. */
  ref?: number;
  /** Per-block accent override; falls back to the studio theme when absent. */
  colors?: string[];
  ops?: Op[];
  /** Column arrangement of this block's top-level content. */
  layout?: BlockLayout;
  /** Safe outer styling applied to any block after it enters the builder. */
  appearance?: BlockAppearance;
};

/* ---------- block reference numbers ---------- */

export function refLabel(ref: number | undefined): string {
  return String(ref ?? 0).padStart(2, "0");
}

export function nextRef(items: BuilderItem[]): number {
  return items.reduce((m, i) => Math.max(m, i.ref ?? 0), 0) + 1;
}

/** Assign refs to any items missing one (older saved stacks, template inserts). */
export function normalizeRefs(items: BuilderItem[]): BuilderItem[] {
  let m = 0;
  for (const i of items) m = Math.max(m, i.ref ?? 0);
  return items.map((i) => (i.ref ? i : { ...i, ref: ++m }));
}

/** Append `added` after `prev`, handing each a fresh reference number. */
export function appendItems(prev: BuilderItem[], added: BuilderItem[]): BuilderItem[] {
  let r = nextRef(prev);
  return [...prev, ...added.map((i) => ({ ...i, ref: r++ }))];
}

export function refComment(ref: number | undefined, label: string): string {
  return `<!-- block ${refLabel(ref)}: ${label} -->`;
}

export function itemHtmlWithRef(
  item: BuilderItem,
  theme: Theme,
  customBlocks: CustomBlock[],
  savedFragments: { id: string; html: string }[] = [],
): string {
  return `${refComment(item.ref, blockLabel(item.snippetId, customBlocks, savedFragments))}\n${itemHtml(item, theme, customBlocks, savedFragments)}`;
}

export function blockHtmlWithRefs(
  items: BuilderItem[],
  theme: Theme,
  customBlocks: CustomBlock[],
  savedFragments: { id: string; html: string }[] = [],
): string {
  return items.map((i) => itemHtmlWithRef(i, theme, customBlocks, savedFragments)).join("\n\n");
}

export function baseHtml(
  snippetId: string,
  theme: Theme,
  colors: string[] | undefined,
  customBlocks: CustomBlock[],
  savedFragments: { id: string; html: string }[] = [],
): string {
  const [primary, alt] = buildPalettes(colors ?? theme.colors);
  if (snippetId.startsWith(CUSTOM_PREFIX)) {
    const block = customBlocks.find((b) => `${CUSTOM_PREFIX}${b.id}` === snippetId);
    if (!block) return "";
    const p = block.accent ? buildPalettes([block.accent])[0] : primary;
    return renderCustomBlock(block, p, "#0f172a");
  }
  if (snippetId.startsWith(FRAGMENT_PREFIX)) {
    return (
      savedFragments.find((fragment) => `${FRAGMENT_PREFIX}${fragment.id}` === snippetId)?.html ??
      ""
    );
  }
  const snippet = getSnippet(snippetId);
  if (!snippet) return "";
  return applyTheme(snippet.render(primary, alt), theme);
}

export function itemBaseHtml(
  item: BuilderItem,
  theme: Theme,
  customBlocks: CustomBlock[],
  savedFragments: { id: string; html: string }[] = [],
): string {
  const edited = applyOps(
    baseHtml(item.snippetId, theme, item.colors, customBlocks, savedFragments),
    item.ops,
  );
  return applyLayout(edited, item.layout);
}

export function itemHtml(
  item: BuilderItem,
  theme: Theme,
  customBlocks: CustomBlock[],
  savedFragments: { id: string; html: string }[] = [],
): string {
  const base = itemBaseHtml(item, theme, customBlocks, savedFragments);
  return applyBlockAppearance(
    base,
    item.appearance,
    item.colors?.[0] ?? theme.colors[0],
    theme.darkBg,
  );
}

/** The block content before any column arrangement, used by the layout editor. */
export function itemContentHtml(
  item: BuilderItem,
  theme: Theme,
  customBlocks: CustomBlock[],
  savedFragments: { id: string; html: string }[] = [],
): string {
  return applyOps(
    baseHtml(item.snippetId, theme, item.colors, customBlocks, savedFragments),
    item.ops,
  );
}

export function blockHtml(
  items: BuilderItem[],
  theme: Theme,
  customBlocks: CustomBlock[],
  savedFragments: { id: string; html: string }[] = [],
): string {
  return items.map((i) => itemHtml(i, theme, customBlocks, savedFragments)).join("\n\n");
}

/** Render the collection's mixed rows as portable, email-safe HTML. */
export function collectionHtml(
  items: BuilderItem[],
  layout: CollectionLayout | undefined,
  theme: Theme,
  customBlocks: CustomBlock[],
  savedFragments: { id: string; html: string }[] = [],
  withRefs = false,
): string {
  const normalized = normalizeCollectionLayout(
    layout,
    items.map((item) => item.uid),
  );
  const byId = new Map(items.map((item) => [item.uid, item]));
  return normalized.rows
    .map((row) => {
      if (row.columns.length === 1) {
        return (row.columns[0] ?? [])
          .map((uid) => {
            const item = byId.get(uid);
            if (!item) return "";
            return withRefs
              ? itemHtmlWithRef(item, theme, customBlocks, savedFragments)
              : itemHtml(item, theme, customBlocks, savedFragments);
          })
          .join("\n");
      }
      const width = `${(100 / row.columns.length).toFixed(2)}%`;
      const cells = row.columns
        .map((column, index) => {
          const content = column
            .map((uid) => {
              const item = byId.get(uid);
              if (!item) return "";
              return withRefs
                ? itemHtmlWithRef(item, theme, customBlocks, savedFragments)
                : itemHtml(item, theme, customBlocks, savedFragments);
            })
            .join("\n");
          const padding =
            index === 0 ? "0 7px 0 0" : index === row.columns.length - 1 ? "0 0 0 7px" : "0 7px";
          return `<td valign="top" width="${width}" style="padding:${padding};">${content || "&nbsp;"}</td>`;
        })
        .join("");
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;table-layout:fixed;"><tr>${cells}</tr></table>`;
    })
    .join("\n");
}

export function blockLabel(
  snippetId: string,
  customBlocks: CustomBlock[],
  savedFragments: { id: string; name?: string }[] = [],
): string {
  if (snippetId.startsWith(CUSTOM_PREFIX)) {
    return (
      customBlocks.find((b) => `${CUSTOM_PREFIX}${b.id}` === snippetId)?.label ?? "Custom block"
    );
  }
  if (snippetId.startsWith(FRAGMENT_PREFIX)) {
    return (
      savedFragments.find((fragment) => `${FRAGMENT_PREFIX}${fragment.id}` === snippetId)?.name ??
      "Saved step"
    );
  }
  return getSnippet(snippetId)?.label ?? "Unknown";
}
