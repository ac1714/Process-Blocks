/** Structural + text edit operations applied on top of a freshly rendered snippet. */
export type Op =
  | { t: "text"; p: string; v: string; key?: string }
  | { t: "dup"; p: string }
  | { t: "del"; p: string }
  /** Insert markup after the node at `p`; an empty path appends to the block. */
  | { t: "ins"; p: string; html: string };

function nodeAt(root: Element, path: string): Element | null {
  let node: Element | null = root;
  for (const part of path.split(".").filter(Boolean)) {
    node = (node?.children[Number(part)] as Element | undefined) ?? null;
    if (!node) return null;
  }
  return node;
}

export function elementPath(root: Element, el: Element): string | null {
  const parts: number[] = [];
  let cur: Element | null = el;
  while (cur && cur !== root) {
    const parent: Element | null = cur.parentElement;
    if (!parent) return null;
    parts.unshift(Array.prototype.indexOf.call(parent.children, cur));
    cur = parent;
  }
  return cur === root ? parts.join(".") : null;
}

/** Ops are recorded against the tree state at record time, so replay order matters. */
export function applyOps(html: string, ops: Op[] | undefined): string {
  if (!ops?.length || typeof document === "undefined") return html;
  const doc = new DOMParser().parseFromString(`<div id="__r">${html}</div>`, "text/html");
  const root = doc.getElementById("__r");
  if (!root) return html;
  for (const op of ops) {
    if (op.t === "ins" && !op.p) {
      root.insertAdjacentHTML("beforeend", op.html);
      continue;
    }
    const keyed =
      op.t === "text" && op.key
        ? root.querySelector(`[data-edit-key="${CSS.escape(op.key)}"]`)
        : null;
    const node = keyed ?? nodeAt(root, op.p);
    if (!node) continue;
    if (op.t === "text") node.textContent = op.v;
    else if (op.t === "del") node.remove();
    else if (op.t === "ins") node.insertAdjacentHTML("afterend", op.html);
    else node.parentElement?.insertBefore(node.cloneNode(true), node.nextSibling);
  }
  return root.innerHTML;
}

const REPEATABLE = new Set(["TR", "LI"]);

/** An element is duplicatable/removable when it is one of several like siblings. */
export function isRepeatable(el: Element): boolean {
  const parent = el.parentElement;
  if (!parent) return false;
  const like = Array.from(parent.children).filter((c) => c.tagName === el.tagName);
  if (like.length < 2) return false;
  return REPEATABLE.has(el.tagName) || el.tagName === "DIV";
}

/** Find the complete content unit that structural controls should affect. */
export function structuralTarget(root: Element, start: Element): Element | null {
  let current: Element | null = start;
  let repeatedDiv: Element | null = null;
  while (current && current !== root) {
    if (current.tagName === "LI" || current.tagName === "TR") {
      return isRepeatable(current) ? current : null;
    }
    if (current.tagName === "DIV" && isRepeatable(current)) repeatedDiv = current;
    current = current.parentElement;
  }
  return repeatedDiv;
}

/** Leaf-ish elements whose text can be edited in place. */
export function isEditableText(el: Element): boolean {
  if (!el.textContent?.trim()) return false;
  return !["TABLE", "TBODY", "THEAD", "TFOOT", "TR"].includes(el.tagName);
}
