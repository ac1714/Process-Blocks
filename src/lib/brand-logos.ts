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

const ICONIFY = "https://api.iconify.design";

/**
 * One specification per brand mark. This is the single source of truth for
 * every place a logo is drawn: library examples, the Build Block picker,
 * copied HTML, and the standalone export.
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
  Zendesk: { src: `${ICONIFY}/logos:zendesk-icon.svg`, vb: [256, 195], trim: FULL, height: 19 },
  Slack: { src: `${ICONIFY}/logos:slack-icon.svg`, vb: [256, 256], trim: FULL, height: 21 },
  Jira: { src: `${ICONIFY}/logos:jira.svg`, vb: [256, 256], trim: FULL, height: 21 },
  Confluence: { src: `${ICONIFY}/logos:confluence.svg`, vb: [256, 246], trim: FULL, height: 21 },
  Gmail: { src: `${ICONIFY}/logos:google-gmail.svg`, vb: [256, 204], trim: FULL, height: 17 },
  "Google Meet": {
    src: `${ICONIFY}/logos:google-meet.svg`,
    vb: [256, 201],
    trim: FULL,
    height: 22,
  },
  "Google Drive": {
    src: `${ICONIFY}/logos:google-drive.svg`,
    vb: [256, 238],
    trim: FULL,
    height: 19,
  },
  "Google Sheets": {
    src: `${ICONIFY}/simple-icons:googlesheets.svg?color=%23188038`,
    vb: [24, 24],
    trim: { x: 0.1375, y: 0, w: 0.7292, h: 1 },
    height: 24,
  },
  Salesforce: {
    src: `${ICONIFY}/simple-icons:salesforce.svg?color=%2300A1E0`,
    vb: [24, 24],
    trim: { x: 0, y: 0.15, w: 1, h: 0.7 },
    height: 16,
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
  const spec = SPECS[brand];
  const { width, height } = brandMarkSize(brand, scale);
  const imageHeight = Math.round((spec.height * scale) / spec.trim.h);
  const imageWidth = Math.round((imageHeight * spec.vb[0]) / spec.vb[1]);
  const offsetX = Math.round(imageWidth * spec.trim.x);
  const offsetY = Math.round(imageHeight * spec.trim.y);
  return (
    `<span role="img" aria-label="${brand}" data-brand-mark="${brand}"` +
    ` style="display:inline-block;overflow:hidden;width:${width}px;height:${height}px;` +
    `line-height:0;background:transparent;border:0;box-shadow:none;">` +
    `<img src="${spec.src}" alt="" width="${imageWidth}" height="${imageHeight}"` +
    ` onerror="this.style.visibility='hidden'"` +
    ` style="display:block;width:${imageWidth}px;height:${imageHeight}px;` +
    `max-width:none;max-height:none;min-width:0;min-height:0;` +
    `margin:-${offsetY}px 0 0 -${offsetX}px;background:transparent;border:0;` +
    `box-shadow:none;outline:0;" /></span>`
  );
}
