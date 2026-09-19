export type BlockShell = "original" | "card" | "accent" | "plain";
export type BlockBorder = "original" | "hairline" | "bold" | "none";
export type BlockBackground = "original" | "white" | "tint" | "dark";

export type BlockAppearance = {
  shell?: BlockShell;
  border?: BlockBorder;
  background?: BlockBackground;
};

const ROOT_ID = "__appearance";

export function applyBlockAppearance(
  html: string,
  appearance?: BlockAppearance,
  accent = "#0f766e",
): string {
  if (!appearance || typeof document === "undefined") return html;
  if (Object.values(appearance).every((value) => !value || value === "original")) return html;
  const doc = new DOMParser().parseFromString(`<div id="${ROOT_ID}">${html}</div>`, "text/html");
  const root = doc.getElementById(ROOT_ID);
  const element = root?.firstElementChild as HTMLElement | null;
  if (!root || !element) return html;

  if (appearance.shell === "plain") {
    element.style.borderRadius = "0";
    element.style.boxShadow = "none";
  } else if (appearance.shell === "card") {
    element.style.borderRadius = "6px";
  } else if (appearance.shell === "accent") {
    element.style.borderRadius = "6px";
    element.style.borderTop = `4px solid ${accent}`;
  }

  if (appearance.border === "none") element.style.border = "0";
  if (appearance.border === "hairline") element.style.border = "1px solid #cbd5e1";
  if (appearance.border === "bold") element.style.border = "2px solid #64748b";

  if (appearance.background === "white") element.style.backgroundColor = "#ffffff";
  if (appearance.background === "tint") element.style.backgroundColor = "#f1f5f9";
  if (appearance.background === "dark") {
    element.style.backgroundColor = "#0f172a";
    element.style.color = "#f8fafc";
  }
  return root.innerHTML;
}
