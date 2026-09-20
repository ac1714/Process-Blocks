export type Palette = {
  base: string;
  bg: string;
  bgStrong: string;
  border: string;
  text: string;
  onBase: string;
};

export const PRESET_COLORS: { name: string; hex: string }[] = [
  { name: "Blue", hex: "#2563eb" },
  { name: "Green", hex: "#15803d" },
  { name: "Amber", hex: "#b45309" },
  { name: "Red", hex: "#b91c1c" },
  { name: "Purple", hex: "#6d28d9" },
  { name: "Slate", hex: "#334155" },
];

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function normalizeHex(input: string): string {
  let hex = (input || "").trim();
  if (!hex.startsWith("#")) hex = `#${hex}`;
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? hex.toLowerCase() : "#2563eb";
}

function toRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex);
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

function toHex(rgb: [number, number, number]): string {
  return `#${rgb.map((v) => clamp(v).toString(16).padStart(2, "0")).join("")}`;
}

function mix(hex: string, target: [number, number, number], amount: number): string {
  const [r, g, b] = toRgb(hex);
  return toHex([
    r + (target[0] - r) * amount,
    g + (target[1] - g) * amount,
    b + (target[2] - b) * amount,
  ]);
}

export function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function rgbToHsl(hex: string): [number, number, number] {
  const [r, g, b] = toRgb(hex).map((v) => v / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const hue = ((h % 1) + 1) % 1;
  if (s === 0) return toHex([l * 255, l * 255, l * 255]);
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const conv = (t: number) => {
    const x = ((t % 1) + 1) % 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return toHex([conv(hue + 1 / 3) * 255, conv(hue) * 255, conv(hue - 1 / 3) * 255]);
}

/** Color harmony styles for accent generation */
export type ColorHarmony =
  "complementary" | "analogous" | "triadic" | "split" | "monochromatic" | "warm" | "cool";

/** Generates accents based on chosen color harmony theory */
export function deriveAccentsByHarmony(
  primary: string,
  harmony: ColorHarmony = "complementary",
): [string, string] {
  const [h, s, l] = rgbToHsl(normalizeHex(primary));
  const sat = Math.max(0.32, Math.min(0.78, s || 0.5));
  const lum = Math.max(0.28, Math.min(0.52, l));

  switch (harmony) {
    case "analogous":
      return [hslToHex(h + 0.083, sat, lum), hslToHex(h - 0.083, sat, lum * 0.9)];
    case "triadic":
      return [hslToHex(h + 0.333, sat, lum), hslToHex(h + 0.666, sat, lum * 0.92)];
    case "split":
      return [hslToHex(h + 0.416, sat, lum), hslToHex(h + 0.583, sat, lum * 0.95)];
    case "monochromatic":
      return [
        hslToHex(h, Math.max(0.2, sat * 0.72), Math.min(0.72, lum + 0.22)),
        hslToHex(h, Math.min(0.9, sat * 1.18), Math.max(0.2, lum - 0.16)),
      ];
    case "warm":
      return [hslToHex(0.085, 0.75, 0.44), hslToHex(0.03, 0.7, 0.46)];
    case "cool":
      return [hslToHex(0.52, 0.72, 0.4), hslToHex(0.64, 0.68, 0.46)];
    case "complementary":
    default:
      return [hslToHex(h + 0.5, sat, lum), hslToHex(h + 0.28, sat, lum * 0.92)];
  }
}

/** Adjust lightness of a hex color by a delta (-1 to 1) */
export function adjustLightness(hex: string, delta: number): string {
  const [h, s, l] = rgbToHsl(normalizeHex(hex));
  const newL = Math.max(0.08, Math.min(0.92, l + delta));
  return hslToHex(h, s, newL);
}

/** Default secondary / tertiary accents derived from the primary by hue rotation. */
export function deriveAccents(primary: string): [string, string] {
  return deriveAccentsByHarmony(primary, "complementary");
}

/** Full accent set: [primary, secondary, tertiary], filling gaps with derived defaults. */
export function resolveColors(
  colors: (string | undefined)[] | undefined,
  fallback = "#2563eb",
): [string, string, string] {
  const primary = normalizeHex(colors?.[0] ?? fallback);
  const [d2, d3] = deriveAccents(primary);
  return [primary, normalizeHex(colors?.[1] ?? d2), normalizeHex(colors?.[2] ?? d3)];
}

export function buildPalettes(colors: (string | undefined)[]): [Palette, [Palette, Palette]] {
  const [a, b, c] = resolveColors(colors);
  return [buildPalette(a), [buildPalette(b), buildPalette(c)]];
}

export function buildPalette(baseInput: string): Palette {
  const base = normalizeHex(baseInput);
  return {
    base,
    bg: mix(base, [255, 255, 255], 0.92),
    bgStrong: mix(base, [255, 255, 255], 0.82),
    border: mix(base, [255, 255, 255], 0.62),
    text: mix(base, [0, 0, 0], 0.45),
    onBase: luminance(base) > 0.55 ? "#111827" : "#ffffff",
  };
}
