// Column layout for a block on the builder canvas.
//
// A block renders to a list of top-level elements. A layout groups those
// elements into ordered columns; rendering wraps them in an email-safe table
// so the copied HTML and the exported page match what the builder shows.

export type BlockLayout = {
  /** groups[columnIndex] = ordered indices of the block's top-level children. */
  groups: number[][];
};

export type LayoutPart = { index: number; label: string };

function labelFor(el: Element, index: number): string {
  const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
  if (text) return text.length > 38 ? `${text.slice(0, 38)}…` : text;
  return `${el.tagName.toLowerCase()} ${index + 1}`;
}

function parse(html: string): Element | null {
  if (typeof document === "undefined") return null;
  const doc = new DOMParser().parseFromString(`<div id="__r">${html}</div>`, "text/html");
  return doc.getElementById("__r");
}

/** The movable top-level pieces of a rendered block. */
export function layoutParts(html: string): LayoutPart[] {
  const root = parse(html);
  if (!root) return [];
  return Array.from(root.children).map((el, index) => ({ index, label: labelFor(el, index) }));
}

/** A single column holding every part, in document order. */
export function defaultLayout(count: number): BlockLayout {
  return { groups: [Array.from({ length: count }, (_, i) => i)] };
}

/**
 * Reconcile a stored layout with the current children: drop indices that no
 * longer exist and append any new ones to the last column.
 */
export function normalizeLayout(layout: BlockLayout | undefined, count: number): BlockLayout {
  const groups = (layout?.groups?.length ? layout.groups : [[]]).map((group) =>
    group.filter((i) => Number.isInteger(i) && i >= 0 && i < count),
  );
  const seen = new Set(groups.flat());
  const missing = Array.from({ length: count }, (_, i) => i).filter((i) => !seen.has(i));
  const last = groups[groups.length - 1];
  if (last) last.push(...missing);
  return { groups };
}

export function setColumnCount(layout: BlockLayout, count: number): BlockLayout {
  const groups = layout.groups.map((group) => [...group]);
  while (groups.length < count) groups.push([]);
  if (groups.length > count) {
    const overflow = groups.splice(count).flat();
    groups[count - 1]?.push(...overflow);
  }
  return { groups };
}

/** Move a part within its column. */
export function movePartVertical(
  layout: BlockLayout,
  column: number,
  position: number,
  direction: -1 | 1,
): BlockLayout {
  const groups = layout.groups.map((group) => [...group]);
  const group = groups[column];
  const to = position + direction;
  if (!group || to < 0 || to >= group.length) return layout;
  const current = group[position];
  const other = group[to];
  if (current === undefined || other === undefined) return layout;
  group[position] = other;
  group[to] = current;
  return { groups };
}

/** Move a part into the neighbouring column. */
export function movePartHorizontal(
  layout: BlockLayout,
  column: number,
  position: number,
  direction: -1 | 1,
): BlockLayout {
  const groups = layout.groups.map((group) => [...group]);
  const target = column + direction;
  if (target < 0 || target >= groups.length) return layout;
  const moved = groups[column]?.splice(position, 1)[0];
  if (moved === undefined) return layout;
  groups[target]?.push(moved);
  return { groups };
}

/** Wrap the block's top-level children into the layout's columns. */
export function applyLayout(html: string, layout: BlockLayout | undefined): string {
  if (!layout) return html;
  const root = parse(html);
  if (!root) return html;
  const children = Array.from(root.children);
  const normalized = normalizeLayout(layout, children.length);
  const groups = normalized.groups;
  if (groups.length < 2) {
    // Single column: still honour any reordering the builder recorded.
    const order = groups[0] ?? [];
    if (order.every((value, index) => value === index)) return html;
    return order.map((i) => children[i]?.outerHTML ?? "").join("\n");
  }
  const width = `${Math.floor(100 / groups.length)}%`;
  const cells = groups
    .map((group, index) => {
      const inner = group.map((i) => children[i]?.outerHTML ?? "").join("\n");
      const padding =
        index === 0 ? "0 10px 0 0" : index === groups.length - 1 ? "0 0 0 10px" : "0 10px";
      return `<td valign="top" width="${width}" style="padding:${padding};">${inner}</td>`;
    })
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;border-spacing:0;table-layout:fixed;margin:0 0 20px 0;"><tr>${cells}</tr></table>`;
}

/**
 * Translate a DOM path recorded against the laid-out block back to a path in
 * the pre-layout content, so inline edits keep targeting the right element.
 * Columns only regroup top-level children, so the mapping is exact.
 */
export function contentPath(
  path: string,
  layout: BlockLayout | undefined,
  childCount: number,
): string {
  if (!layout) return path;
  const groups = normalizeLayout(layout, childCount).groups;
  const parts = path.split(".").filter(Boolean).map(Number);
  if (groups.length < 2) {
    const [first, ...rest] = parts;
    if (first === undefined) return path;
    const mapped = groups[0]?.[first];
    return mapped === undefined ? path : [mapped, ...rest].join(".");
  }
  // table(0) > tbody(0) > tr(0) > td(column) > child(position)
  const [table, tbody, tr, column, position, ...rest] = parts;
  if (table !== 0 || tbody !== 0 || tr !== 0 || column === undefined || position === undefined) {
    return path;
  }
  const mapped = groups[column]?.[position];
  return mapped === undefined ? path : [mapped, ...rest].join(".");
}
