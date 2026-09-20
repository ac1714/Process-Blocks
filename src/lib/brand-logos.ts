export const BRAND_NAMES = [
  "Zendesk",
  "Slack",
  "Jira",
  "Confluence",
  "Gmail",
  "Google Meet",
  "Google Drive",
  "Google Sheets",
  "Salesforce",
  "Workato",
] as const;

export type BrandName = (typeof BRAND_NAMES)[number];

const GILBARBARA = "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos";
const SIMPLE_ICONS = "https://cdn.jsdelivr.net/npm/simple-icons/icons";

/**
 * One specification per brand mark. This is the single source of truth for
 * every place a logo is drawn: library examples, the Build Block picker,
 * copied HTML, and the standalone export.
 *
 * External available sources are hosted on global CDNs (jsdelivr & logotyp).
 *
 * - `vb` is the source artwork viewBox.
 * - `trim` is the painted area inside that viewBox, measured from the real
 *   asset. Marks with built-in padding (Workato, Sheets, Salesforce) are
 *   cropped to their ink so their visible left edge is the layout left edge.
 * - `height` is the rendered height of the painted area in CSS pixels, tuned
 *   per brand so every mark reads at the same optical weight.
 */
type BrandSpec = {
  src: string;
  vb: [number, number];
  trim: { x: number; y: number; w: number; h: number };
  height: number;
};

const FULL = { x: 0, y: 0, w: 1, h: 1 };

const SPECS: Record<BrandName, BrandSpec> = {
  Zendesk: { src: `${GILBARBARA}/zendesk-icon.svg`, vb: [256, 195], trim: FULL, height: 19 },
  Slack: { src: `${GILBARBARA}/slack-icon.svg`, vb: [256, 256], trim: FULL, height: 21 },
  Jira: { src: `${GILBARBARA}/jira.svg`, vb: [256, 256], trim: FULL, height: 21 },
  Confluence: { src: `${GILBARBARA}/confluence.svg`, vb: [256, 246], trim: FULL, height: 21 },
  Gmail: { src: `${GILBARBARA}/google-gmail.svg`, vb: [256, 204], trim: FULL, height: 17 },
  "Google Meet": {
    src: `${GILBARBARA}/google-meet.svg`,
    vb: [256, 201],
    trim: FULL,
    height: 22,
  },
  "Google Drive": {
    src: `${GILBARBARA}/google-drive.svg`,
    vb: [256, 238],
    trim: FULL,
    height: 19,
  },
  "Google Sheets": {
    src: `${SIMPLE_ICONS}/googlesheets.svg`,
    vb: [24, 24],
    trim: { x: 0.1375, y: 0, w: 0.7292, h: 1 },
    height: 24,
  },
  Salesforce: {
    // Official Salesforce cloud mark without words, rendered in brand blue #00A1E0
    src: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%2300A1E0%22%20d%3D%22M10.006%205.415a4.195%204.195%200%20013.045-1.306c1.56%200%202.954.9%203.69%202.205.63-.3%201.35-.45%202.1-.45%202.85%200%205.159%202.34%205.159%205.22s-2.31%205.22-5.176%205.22c-.345%200-.69-.044-1.02-.104a3.75%203.75%200%2001-3.3%201.95c-.6%200-1.155-.15-1.65-.375A4.314%204.314%200%20018.88%2020.4a4.302%204.302%200%2001-4.05-2.82c-.27.062-.54.076-.825.076-2.204%200-4.005-1.8-4.005-4.05%200-1.5.811-2.805%202.01-3.51-.255-.57-.39-1.2-.39-1.846%200-2.58%202.1-4.65%204.65-4.65%201.53%200%202.85.705%203.72%201.8%22%2F%3E%3C%2Fsvg%3E",
    vb: [24, 24],
    trim: { x: 0, y: 0.1712, w: 1, h: 0.6788 },
    height: 18,
  },
  Workato: {
    src: "https://logotyp.us/file/workato.svg",
    vb: [560, 400],
    trim: { x: 0.1982, y: 0.25, w: 0.6036, h: 0.5 },
    height: 20,
  },
};

export type BrandMark = { width: number; height: number };

/** Rendered size of a brand mark's painted area. */
export function brandMarkSize(brand: BrandName, scale = 1): BrandMark {
  const spec = SPECS[brand];
  const height = spec.height * scale;
  const imageHeight = height / spec.trim.h;
  const imageWidth = (imageHeight * spec.vb[0]) / spec.vb[1];
  return { width: Math.round(imageWidth * spec.trim.w), height: Math.round(height) };
}

/** Back-compatible URL map used by the logo picker. */
export const BRAND_LOGO_URLS: Record<BrandName, string> = Object.fromEntries(
  BRAND_NAMES.map((brand) => [brand, SPECS[brand].src]),
) as Record<BrandName, string>;

/** Widest painted mark; used for shared logo columns so arrows can be centered. */
export const BRAND_MARK_COLUMN = Math.max(
  ...BRAND_NAMES.map((brand) => brandMarkSize(brand).width),
);

/** Tallest painted mark; used to align a logo against a first text line. */
export const BRAND_MARK_LINE = Math.max(...BRAND_NAMES.map((brand) => brandMarkSize(brand).height));

/**
 * Transparent, borderless external logo, cropped to its painted area so the
 * left edge of the glyph is the left edge of the element.
 */
export function brandLogoHtml(brand: BrandName, scale = 1): string {
  const spec = SPECS[brand] ?? SPECS["Zendesk"];
  const { width, height } = brandMarkSize(brand in SPECS ? brand : "Zendesk", scale);
  const imageHeight = Math.round((spec.height * scale) / spec.trim.h);
  const imageWidth = Math.round((imageHeight * spec.vb[0]) / spec.vb[1]);
  const offsetX = Math.round(imageWidth * spec.trim.x);
  const offsetY = Math.round(imageHeight * spec.trim.y);
  return (
    `<span role="img" aria-label="${brand}" data-brand-mark="${brand}"` +
    ` style="display:inline-block;overflow:hidden;width:${width}px;height:${height}px;` +
    `line-height:0;background:transparent;border:0;box-shadow:none;">` +
    `<img src="${spec.src}" alt="" width="${imageWidth}" height="${imageHeight}" loading="eager" decoding="sync"` +
    ` style="display:block;width:${imageWidth}px;height:${imageHeight}px;` +
    `max-width:none;max-height:none;min-width:0;min-height:0;` +
    `margin:-${offsetY}px 0 0 -${offsetX}px;background:transparent;border:0;` +
    `box-shadow:none;outline:0;" /></span>`
  );
}
