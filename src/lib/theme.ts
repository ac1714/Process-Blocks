import { deriveAccents } from "./snippet-colors";

export type Density = "comfortable" | "compact";

export type Theme = {
  colors: string[];
  fontStack: string;
  density: Density;
  darkBg?: string;
};

export const SYSTEM_FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const FONT_PRESETS: { name: string; stack: string }[] = [
  { name: "System", stack: SYSTEM_FONT },
  { name: "Quicksand", stack: "'Quicksand', Arial, sans-serif" },
  { name: "Helvetica", stack: "Helvetica, Arial, sans-serif" },
  { name: "Verdana", stack: "Verdana, Geneva, sans-serif" },
  { name: "Trebuchet", stack: "'Trebuchet MS', Tahoma, sans-serif" },
  { name: "Georgia", stack: "Georgia, 'Times New Roman', serif" },
];

export const DEFAULT_DARK_BG = "#0f172a";

export const DARK_BG_PRESETS: { name: string; hex: string }[] = [
  { name: "Slate", hex: "#0f172a" },
  { name: "Navy", hex: "#0b192c" },
  { name: "Charcoal", hex: "#18181b" },
  { name: "Violet", hex: "#1e1035" },
  { name: "Zinc", hex: "#09090b" },
];

export const DEFAULT_THEME: Theme = {
  colors: ["#2563eb", ...deriveAccents("#2563eb")],
  fontStack: SYSTEM_FONT,
  density: "comfortable",
  darkBg: DEFAULT_DARK_BG,
};

/** Apply only user-selected theme settings; individual blocks retain their composition. */
export function applyTheme(html: string, theme: Theme): string {
  let out = html;
  if (theme.fontStack && theme.fontStack !== SYSTEM_FONT) {
    out = out.split(SYSTEM_FONT).join(theme.fontStack);
  }
  if (theme.density === "compact") {
    out = out.replace(
      /padding:((?:1[2-9]|[2-9]\d)px(?:\s+(?:0|[1-9]|1[0-9]|[2-9]\d)px){0,3})/g,
      (_m, v: string) =>
        `padding:${v.replace(/(\d+(?:\.\d+)?)px/g, (_x, n: string) => `${Math.max(12, Math.round(Number(n) * 0.8))}px`)}`,
    );
  }
  return out;
}
