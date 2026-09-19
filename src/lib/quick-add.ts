import { elementPath, type Op } from "./html-ops";
import { buildPalette, type Palette } from "./snippet-colors";

export type QuickAdd = { id: string; label: string; op: Op };

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Responsive (stacking) card grid rendered with the studio accent. */
export function cardGridHtml(palette: Palette, count: number): string {
  const width = count === 2 ? "48%" : "31.5%";
  const cards = Array.from({ length: count }, (_, i) => {
    return `<div style="display:inline-block;vertical-align:top;width:${width};min-width:200px;margin:0 1% 12px 0;padding:16px;border:1px solid ${palette.border};border-radius:6px;background-color:${palette.bg};box-sizing:border-box;">
  <p style="font-family:${FONT};font-size:13px;line-height:1.2;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:${palette.text};margin:0 0 6px 0;">Card ${i + 1}</p>
  <p style="font-family:${FONT};font-size:17px;line-height:1.3;font-weight:700;color:#0f172a;margin:0 0 6px 0;">Card title</p>
  <p style="font-family:${FONT};font-size:15px;line-height:1.5;color:#475569;margin:0;">Short supporting copy for this card.</p>
</div>`;
  }).join("\n");
  return `<div style="font-size:0;margin:0 0 20px 0;">\n${cards}\n</div>`;
}

/**
 * Inspect the rendered block and offer safe structural additions.
 * Repeats (steps, rows, stats) reuse the existing markup so they always match.
 */
export function quickAdds(html: string, colors: (string | undefined)[]): QuickAdd[] {
  if (typeof document === "undefined") return [];
  const palette = buildPalette(colors[0] ?? "#2563eb");
  const out: QuickAdd[] = [];
  const doc = new DOMParser().parseFromString(`<div id="__r">${html}</div>`, "text/html");
  const root = doc.getElementById("__r");
  if (!root) return out;

  const dup = (el: Element | null | undefined, id: string, label: string) => {
    if (!el) return;
    const p = elementPath(root, el);
    if (p === null) return;
    out.push({ id, label, op: { t: "dup", p } });
  };

  const lis = Array.from(root.querySelectorAll("li"));
  dup(lis[lis.length - 1], "li", "Add list item");

  const rows = Array.from(root.querySelectorAll("tr")).filter((tr) => tr.textContent?.trim());
  // The final row usually drops the connector line and closing spacing, so a
  // copy of it looks broken. Duplicate a middle row instead: the copy lands
  // before the last row and keeps the same rule and rhythm as its neighbours.
  if (rows.length > 2) dup(rows[rows.length - 2], "tr", "Add step / row");
  else if (rows.length > 1) dup(rows[rows.length - 1], "tr", "Add step / row");

  out.push({
    id: "cards2",
    label: "Add 2-card grid",
    op: { t: "ins", p: "", html: cardGridHtml(palette, 2) },
  });
  out.push({
    id: "cards3",
    label: "Add 3-card grid",
    op: { t: "ins", p: "", html: cardGridHtml(palette, 3) },
  });

  return out;
}
