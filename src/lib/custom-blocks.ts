import { buildPalette, type Palette } from "./snippet-colors";
import { brandLogoHtml, type BrandName } from "./brand-logos";
import { applyOps, type Op } from "./html-ops";

export type PartType =
  | "eyebrow"
  | "title"
  | "deck"
  | "paragraph"
  | "bullets"
  | "steps"
  | "stats"
  | "table"
  | "callout"
  | "divider"
  | "button"
  | "brand-logo"
  | "image";

export type Shell = "card" | "darkhead" | "accent-top" | "plain";
export type BorderStyle = "hairline" | "bold" | "none";
export type BackgroundStyle = "white" | "tint" | "dark";
export type AlignStyle = "left" | "center" | "right";
export type ColumnWidthStyle = "equal" | "fit";
export type PaddingStyle = "tight" | "normal" | "roomy";

export type PartOpts = {
  size?: "s" | "m" | "l";
  marker?: "check" | "dot" | "number";
  tone?: "info" | "success" | "warning";
  style?: "solid" | "outline";
  count?: number;
  rows?: number;
  cols?: number;
  brand?: BrandName;
};

export type CustomPart = { id: string; type: PartType; opts?: PartOpts };

export type CustomSection = {
  id: string;
  columns: CustomPart[][];
  /** Per-column alignment; omit an entry to inherit the block alignment. */
  aligns?: (AlignStyle | undefined)[];
  /** "equal" (default) splits the width evenly; "fit" sizes columns to content. */
  width?: ColumnWidthStyle;
};

export type CustomBlock = {
  id: string;
  label: string;
  shell: Shell;
  headerTitle: string;
  parts: CustomPart[];
  /** Layout-aware content. Older blocks omit this and use `parts` as one column. */
  sections?: CustomSection[];
  border?: BorderStyle;
  background?: BackgroundStyle;
  align?: AlignStyle;
  padding?: PaddingStyle;
  /** Optional per-block accent hex; falls back to the studio color. */
  accent?: string;
  /** Text edits made directly in the custom-block preview. */
  ops?: Op[];
};

export const PART_LABELS: { type: PartType; label: string }[] = [
  { type: "eyebrow", label: "Eyebrow" },
  { type: "title", label: "Title" },
  { type: "deck", label: "Deck" },
  { type: "paragraph", label: "Paragraph" },
  { type: "bullets", label: "List" },
  { type: "steps", label: "Steps" },
  { type: "stats", label: "KPI" },
  { type: "table", label: "Table" },
  { type: "callout", label: "Callout" },
  { type: "divider", label: "Divider" },
  { type: "button", label: "Button" },
  { type: "brand-logo", label: "Logos" },
  { type: "image", label: "Image" },
];

export const SHELL_LABELS: { shell: Shell; label: string }[] = [
  { shell: "card", label: "Plain card" },
  { shell: "darkhead", label: "Dark header" },
  { shell: "accent-top", label: "Accent top" },
  { shell: "plain", label: "Borderless" },
];

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const INK = "#0f172a";
const BODY = "#475569";
const HAIRLINE = "#cbd5e1";
const RADIUS = "6px";

const TONES: Record<NonNullable<PartOpts["tone"]>, string> = {
  info: "",
  success: "#15803d",
  warning: "#b45309",
};

const TITLE_SIZE: Record<NonNullable<PartOpts["size"]>, string> = {
  s: "18px",
  m: "22px",
  l: "28px",
};

type Ctx = { align: AlignStyle; dark: boolean };

function heading(size: string, ink: string) {
  return `font-family:${FONT};font-size:${size};line-height:1.3;font-weight:700;color:${ink};letter-spacing:0;`;
}

function body(ink: string) {
  return `font-family:${FONT};font-size:16px;line-height:1.55;color:${ink};`;
}

const LABEL = `font-family:${FONT};font-size:13px;line-height:1.25;letter-spacing:1px;text-transform:uppercase;font-weight:700;`;

function part(p: Palette, item: CustomPart, last: boolean, ctx: Ctx): string {
  const o = item.opts ?? {};
  const mb = last ? "0" : "16px";
  const ink = ctx.dark ? "#f8fafc" : INK;
  const sub = ctx.dark ? "#cbd5e1" : BODY;
  const rule = ctx.dark ? "rgba(255,255,255,0.18)" : HAIRLINE;
  const align = ctx.align === "left" ? "" : `text-align:${ctx.align};`;
  const P = body(sub);
  const H = heading(TITLE_SIZE[o.size ?? "m"], ink);

  switch (item.type) {
    case "eyebrow":
      return `<div style="${LABEL}${align}color:${ctx.dark ? p.bgStrong : p.base};margin:0 0 ${mb} 0;">Section label</div>`;
    case "title":
      return `<div style="${H}${align}margin:0 0 ${mb} 0;">Write the title here</div>`;
    case "deck":
      return `<div style="${body(ink)}${align}font-size:16px;margin:0 0 ${mb} 0;">A short deck that introduces what this section covers.</div>`;
    case "paragraph":
      return `<div style="${P}${align}margin:0 0 ${mb} 0;">Replace this paragraph with your own copy. Keep it to a few sentences so it stays scannable inside the course.</div>`;
    case "bullets": {
      const marker = o.marker ?? "check";
      const rows = [1, 2, 3];
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;margin:0 0 ${mb} 0;">
  ${rows
    .map((i) => {
      const pad = i === rows.length ? "0" : "10px";
      const glyph = marker === "number" ? String(i) : marker === "dot" ? "&bull;" : "&#10003;";
      return `<tr>
    <td valign="top" style="width:26px;padding:0 0 ${pad} 0;"><div style="width:18px;height:18px;line-height:18px;text-align:center;border-radius:9px;background-color:${p.bg};border:1px solid ${p.border};color:${p.text};font-family:${FONT};font-size:15px;font-weight:700;">${glyph}</div></td>
    <td valign="top" style="padding:0 0 ${pad} 8px;"><div style="${P}">List item ${i} &mdash; replace with your own text.</div></td>
  </tr>`;
    })
    .join("\n  ")}
</table>`;
    }
    case "steps":
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;margin:0 0 ${mb} 0;">
  ${[1, 2, 3]
    .map(
      (i) => `<tr>
    <td valign="top" style="width:46px;padding:0 14px ${i === 3 ? "0" : "16px"} 0;"><div style="width:32px;height:32px;line-height:32px;text-align:center;border-radius:16px;background-color:${p.base};color:${p.onBase};font-family:${FONT};font-size:15px;font-weight:700;">${i}</div></td>
    <td valign="top" style="padding:2px 0 ${i === 3 ? "0" : "16px"} 0;">
      <div style="font-family:${FONT};font-size:16px;font-weight:700;color:${ink};margin:0 0 4px 0;">Step ${i} title</div>
      <div style="${P}">Explain what the learner should do in this step.</div>
    </td>
  </tr>`,
    )
    .join("\n  ")}
</table>`;
    case "stats": {
      const count = Math.max(2, Math.min(4, o.count ?? 3));
      const data = [
        ["92%", "Completion"],
        ["3.4x", "Faster ramp"],
        ["21", "Modules"],
        ["4.8", "Avg rating"],
      ].slice(0, count);
      const width = (100 / count).toFixed(2);
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;margin:0 0 ${mb} 0;">
  <tr>
    ${data
      .map(
        ([n, l]) => `<td valign="top" width="${width}%" style="padding:0 6px;">
      <div style="background-color:${p.bg};border:1px solid ${p.border};border-radius:${RADIUS};padding:16px;text-align:center;">
        <div style="font-family:${FONT};font-size:26px;line-height:1.15;font-weight:700;color:${p.text};letter-spacing:0;">${n}</div>
        <div style="${LABEL}color:${p.text};margin:6px 0 0 0;">${l}</div>
      </div>
    </td>`,
      )
      .join("\n    ")}
  </tr>
</table>`;
    }
    case "table": {
      const cols = Math.max(2, Math.min(4, o.cols ?? 2));
      const rows = Math.max(1, Math.min(6, o.rows ?? 2));
      const letters = ["A", "B", "C", "D"].slice(0, cols);
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;border-spacing:0;margin:0 0 ${mb} 0;border:1px solid ${rule};border-radius:${RADIUS};overflow:hidden;">
  <tr>
    ${letters
      .map(
        (c) =>
          `<td style="${LABEL}color:${p.onBase};background-color:${p.base};padding:11px 14px;">Column ${c}</td>`,
      )
      .join("\n    ")}
  </tr>
  ${Array.from({ length: rows }, (_v, r) => r + 1)
    .map(
      (i) => `<tr>
    ${letters
      .map(
        () =>
          `<td style="${P}font-size:15px;padding:11px 14px;border-top:1px solid ${rule};">Row ${i} value</td>`,
      )
      .join("\n    ")}
  </tr>`,
    )
    .join("\n  ")}
</table>`;
    }
    case "callout": {
      const toneHex = TONES[o.tone ?? "info"];
      const tp = toneHex ? buildPalette(toneHex) : p;
      const title = o.tone === "success" ? "Tip" : o.tone === "warning" ? "Heads up" : "Note";
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;background-color:${tp.bg};border:1px solid ${tp.border};border-radius:${RADIUS};margin:0 0 ${mb} 0;">
  <tr><td style="padding:16px 18px;">
    <div style="${LABEL}color:${tp.text};margin:0 0 6px 0;">${title}</div>
    <div style="${body(INK)}">Add the point you want learners to remember.</div>
  </td></tr>
</table>`;
    }
    case "divider":
      return `<div style="height:1px;line-height:1px;font-size:0;background-color:${rule};margin:0 0 ${mb} 0;">&nbsp;</div>`;
    case "button": {
      const outline = o.style === "outline";
      const css = outline
        ? `color:${p.base};background-color:transparent;border:2px solid ${p.base};padding:10px 20px;`
        : `color:${p.onBase};background-color:${p.base};border:2px solid ${p.base};padding:10px 20px;`;
      return `<div style="${align}margin:0 0 ${mb} 0;"><a href="#" style="display:inline-block;font-family:${FONT};font-size:15px;font-weight:700;text-decoration:none;border-radius:${RADIUS};${css}">Open the resource</a></div>`;
    }
    case "brand-logo": {
      const brand = o.brand ?? "Zendesk";
      const scale = o.size === "l" ? 1.6 : o.size === "s" ? 0.85 : 1.15;
      return `<div style="${align}margin:0 0 ${mb} 0;line-height:0;">${brandLogoHtml(brand, scale)}</div>`;
    }
    case "image":
      return `<div style="margin:0 0 ${mb} 0;"><img src="https://placehold.co/1200x600/e2e8f0/64748b?text=Replace+this+image" alt="Replace this image" width="100%" style="display:block;width:100%;background:transparent;border:0;box-shadow:none;" /></div>`;
    default:
      return "";
  }
}

const PADDINGS: Record<PaddingStyle, string> = {
  tight: "12px",
  normal: "18px",
  roomy: "26px",
};

export function renderCustomBlock(block: CustomBlock, studio: Palette): string {
  const p = block.accent ? buildPalette(block.accent) : studio;
  const background = block.background ?? "white";
  const dark = background === "dark";
  const align = block.align ?? "left";
  const pad = PADDINGS[block.padding ?? "normal"];

  const flattened = block.sections?.length
    ? block.sections.flatMap((section) => section.columns.flat())
    : block.parts;
  const sections: CustomSection[] = [{ id: "content", columns: [flattened] }];
  const inner = sections
    .map((section, sectionIndex) => {
      const fit = section.width === "fit";
      const width = (100 / section.columns.length).toFixed(2);
      const columns = section.columns
        .map((column, columnIndex) => {
          const colAlign = section.aligns?.[columnIndex] ?? align;
          const content = column
            .map((item, itemIndex) =>
              part(p, item, itemIndex === column.length - 1, { align: colAlign, dark }),
            )
            .join("\n");
          const widthAttr = fit ? "" : ` width="${width}%"`;
          return `<td valign="top"${widthAttr} align="${colAlign}" style="padding:0 ${columnIndex === section.columns.length - 1 ? "0" : "7px"} 0 ${columnIndex === 0 ? "0" : "7px"};">${content || "&nbsp;"}</td>`;
        })
        .join("\n");
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;table-layout:${fit ? "auto" : "fixed"};${sectionIndex === sections.length - 1 ? "" : "margin-bottom:14px;"}"><tr>${columns}</tr></table>`;
    })
    .join("\n");

  const surface = dark ? "#0f172a" : background === "tint" ? p.bg : "#ffffff";
  const borderStyle = block.border ?? "hairline";
  const borderCss =
    borderStyle === "none"
      ? ""
      : borderStyle === "bold"
        ? `border:2px solid ${dark ? "rgba(255,255,255,0.18)" : p.border};`
        : `border:1px solid ${dark ? "rgba(255,255,255,0.14)" : HAIRLINE};`;

  const wrap = (extra: string, rows: string) =>
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px 0;font-family:${FONT};border-collapse:separate;${extra}">
${rows}
</table>`;

  const bodyCell = `  <tr><td style="padding:${pad};">
      ${inner}
  </td></tr>`;

  let rendered: string;
  if (block.shell === "plain") rendered = wrap("", bodyCell);
  else {
    const base = `background-color:${surface};${borderCss}border-radius:${RADIUS};`;

    if (block.shell === "accent-top")
      rendered = wrap(`${base}border-top:4px solid ${p.base};`, bodyCell);
    else if (block.shell === "darkhead")
      rendered = wrap(
        base,
        `  <tr><td style="background-color:${p.base};padding:16px ${pad};border-radius:${RADIUS} ${RADIUS} 0 0;${align === "center" ? "text-align:center;" : ""}">
      <div style="font-family:${FONT};font-size:18px;line-height:1.35;font-weight:700;color:${p.onBase};letter-spacing:0;">${block.headerTitle}</div>
  </td></tr>
${bodyCell}`,
      );
    else rendered = wrap(base, bodyCell);
  }

  return applyOps(rendered, block.ops);
}
