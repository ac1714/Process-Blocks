import { buildPalette } from "./snippet-colors";

export type BlockShell = "original" | "card" | "accent" | "plain";
export type BlockBorder = "original" | "hairline" | "bold" | "none";
export type BlockBackground = "original" | "white" | "tint" | "dark";

export type BlockAppearance = {
  shell?: BlockShell;
  border?: BlockBorder;
  background?: BlockBackground;
};

export type ChoiceOption<T> = {
  value: T;
  label: string;
};

export type ApplicableAppearance = {
  shells: ChoiceOption<BlockShell>[];
  borders: ChoiceOption<BlockBorder>[];
  backgrounds: ChoiceOption<BlockBackground>[];
};

const ROOT_ID = "__appearance";

export function getApplicableAppearanceOptions(
  html: string,
  accent = "#2563eb",
): ApplicableAppearance {
  const ALL_SHELLS: ChoiceOption<BlockShell>[] = [
    { value: "original", label: "Original" },
    { value: "card", label: "Card" },
    { value: "accent", label: "Accent" },
    { value: "plain", label: "Plain" },
  ];
  const ALL_BORDERS: ChoiceOption<BlockBorder>[] = [
    { value: "original", label: "Original" },
    { value: "hairline", label: "Line" },
    { value: "bold", label: "Bold" },
    { value: "none", label: "None" },
  ];
  const ALL_BACKGROUNDS: ChoiceOption<BlockBackground>[] = [
    { value: "original", label: "Original" },
    { value: "white", label: "White" },
    { value: "tint", label: "Tint" },
    { value: "dark", label: "Dark" },
  ];

  if (typeof document === "undefined" || !html) {
    return { shells: ALL_SHELLS, borders: ALL_BORDERS, backgrounds: ALL_BACKGROUNDS };
  }

  const doc = new DOMParser().parseFromString(`<div id="${ROOT_ID}">${html}</div>`, "text/html");
  const root = doc.getElementById(ROOT_ID);
  const element = root?.firstElementChild as HTMLElement | null;
  if (!element) {
    return { shells: [], borders: [], backgrounds: [] };
  }

  const pal = buildPalette(accent);

  function optionAffectsElement(
    testType: "shell" | "border" | "background",
    testValue: BlockShell | BlockBorder | BlockBackground,
  ): boolean {
    if (testValue === "original") return true;

    const origClone = element!.cloneNode(true) as HTMLElement;
    const modClone = element!.cloneNode(true) as HTMLElement;

    if (testType === "shell") {
      const r = (origClone.style.borderRadius || "").trim();
      const s = (origClone.style.boxShadow || "").trim();
      const bt = (origClone.style.borderTop || "").trim();

      if (testValue === "plain") {
        if ((!r || r === "0" || r === "0px") && (!s || s === "none")) {
          return false;
        }
        modClone.style.borderRadius = "0";
        modClone.style.boxShadow = "none";
      } else if (testValue === "card") {
        if (r === "6px" && (!s || s === "none")) {
          return false;
        }
        modClone.style.borderRadius = "6px";
      } else if (testValue === "accent") {
        if (r === "6px" && bt.includes("4px solid")) {
          return false;
        }
        modClone.style.borderRadius = "6px";
        modClone.style.borderTop = `4px solid ${pal.base}`;
      }
    } else if (testType === "border") {
      const origBorder = (origClone.style.border || "").trim();
      const origWidth = (origClone.style.borderWidth || "").trim();
      const origStyle = origClone.getAttribute("style") || "";
      const hasBorder = Boolean(
        (origBorder && origBorder !== "0" && origBorder !== "0px" && origBorder !== "none") ||
        (origWidth && origWidth !== "0" && origWidth !== "0px") ||
        origStyle.includes("border:") ||
        origStyle.includes("border-top:") ||
        origStyle.includes("border-bottom:"),
      );

      if (testValue === "none") {
        if (!hasBorder) return false;
        modClone.style.border = "0";
      } else if (testValue === "hairline") {
        if (
          origBorder === `1px solid ${pal.border}` ||
          origStyle.includes(`1px solid ${pal.border}`) ||
          origBorder === "1px solid #cbd5e1" ||
          origStyle.includes("1px solid #cbd5e1")
        ) {
          return false;
        }
        modClone.style.border = `1px solid ${pal.border}`;
      } else if (testValue === "bold") {
        if (origBorder === `2px solid ${pal.base}` || origStyle.includes(`2px solid ${pal.base}`)) {
          return false;
        }
        modClone.style.border = `2px solid ${pal.base}`;
      }
    } else if (testType === "background") {
      const bg = (origClone.style.backgroundColor || "").trim().toLowerCase();
      const styleAttr = origClone.getAttribute("style") || "";

      if (testValue === "white") {
        if (
          bg === "#ffffff" ||
          bg === "rgb(255, 255, 255)" ||
          bg === "white" ||
          styleAttr.includes("background-color:#ffffff") ||
          styleAttr.includes("background-color: #ffffff")
        ) {
          return false;
        }
        modClone.style.backgroundColor = "#ffffff";
      } else if (testValue === "tint") {
        if (
          bg === pal.bg.toLowerCase() ||
          styleAttr.includes(`background-color:${pal.bg.toLowerCase()}`) ||
          styleAttr.includes(`background-color: ${pal.bg.toLowerCase()}`)
        ) {
          return false;
        }
        modClone.style.backgroundColor = pal.bg;
      } else if (testValue === "dark") {
        if (
          bg === "#0f172a" ||
          bg === "rgb(15, 23, 42)" ||
          styleAttr.includes("background-color:#0f172a") ||
          styleAttr.includes("background-color: #0f172a")
        ) {
          return false;
        }
        modClone.style.backgroundColor = "#0f172a";
        modClone.style.color = "#f8fafc";
      }
    }

    return modClone.outerHTML !== origClone.outerHTML;
  }

  const shells = ALL_SHELLS.filter((opt) => optionAffectsElement("shell", opt.value));
  const borders = ALL_BORDERS.filter((opt) => optionAffectsElement("border", opt.value));
  const backgrounds = ALL_BACKGROUNDS.filter((opt) =>
    optionAffectsElement("background", opt.value),
  );

  return {
    shells: shells.length > 1 ? shells : [],
    borders: borders.length > 1 ? borders : [],
    backgrounds: backgrounds.length > 1 ? backgrounds : [],
  };
}

function invertTypographyForDarkSurface(container: HTMLElement, darkBg: string) {
  // Ensure the top container background and base text color are set cleanly
  container.style.backgroundColor = darkBg;
  container.style.color = "#f8fafc";

  // Select all descendants with inline style attributes
  const allElements = [container, ...Array.from(container.querySelectorAll<HTMLElement>("*"))];

  for (const el of allElements) {
    const style = el.getAttribute("style");
    if (!style) continue;

    let updated = style;

    // 1. If an inner table/card or cell had a light/white background, convert to dark elevation or transparent
    if (el !== container) {
      // White, off-white, light slate/paper background
      updated = updated.replace(
        /background(?:-color)?:\s*(?:#ffffff|#fbfcfe|#f8fafc|#f1f5f9|#e2e8f0|white|rgb\(255,\s*255,\s*255\))/gi,
        "background-color:rgba(255,255,255,0.06)",
      );
    }

    // 2. Invert dark text colors to high contrast light colors
    // Invert any dark hex color #0xxx, #1xxx, #2xxx, #3xxx, #4xxx, #5xxx, #6xxx used as text color
    updated = updated.replace(
      /color:\s*#(?:0[0-9a-f]{5}|1[0-9a-f]{5}|2[0-9a-f]{5}|3[0-9a-f]{5}|4[0-9a-f]{5}|5[0-9a-f]{5}|6[0-9a-f]{5})/gi,
      "color:#f8fafc",
    );
    // Invert dark rgb text colors
    updated = updated.replace(
      /color:\s*rgb\(\s*(?:[0-9]|[1-9][0-9]|1[0-2][0-9])\s*,\s*(?:[0-9]|[1-9][0-9]|1[0-2][0-9])\s*,\s*(?:[0-9]|[1-9][0-9]|1[0-2][0-9])\s*\)/gi,
      "color:#f8fafc",
    );

    // Specific known palette ink / body / muted texts
    updated = updated.replace(/color:\s*(?:#0f172a|#111827|#1f2937|#03363d)/gi, "color:#f8fafc");
    updated = updated.replace(/color:\s*(?:#475569|#334155)/gi, "color:#e2e8f0");
    updated = updated.replace(/color:\s*(?:#64748b|#94a3b8)/gi, "color:#cbd5e1");

    // 3. Invert dark borders to subtle translucent white
    updated = updated.replace(
      /border(?:-[a-z]+)?:\s*([1234]px)\s+solid\s+(?:#(?:0[0-9a-f]{5}|1[0-9a-f]{5}|2[0-9a-f]{5}|3[0-9a-f]{5}|4[0-9a-f]{5}|5[0-9a-f]{5}|6[0-9a-f]{5}|cbd5e1|94a3b8|e2e8f0)|rgb\([^)]+\))/gi,
      "border:$1 solid rgba(255,255,255,0.18)",
    );

    if (updated !== style) {
      el.setAttribute("style", updated);
    }
  }
}

export function applyBlockAppearance(
  html: string,
  appearance?: BlockAppearance,
  accent = "#2563eb",
  darkBg = "#0f172a",
): string {
  if (!appearance || typeof document === "undefined") return html;
  if (Object.values(appearance).every((value) => !value || value === "original")) return html;
  const doc = new DOMParser().parseFromString(`<div id="${ROOT_ID}">${html}</div>`, "text/html");
  const root = doc.getElementById(ROOT_ID);
  const element = root?.firstElementChild as HTMLElement | null;
  if (!root || !element) return html;

  const pal = buildPalette(accent);

  if (appearance.shell === "plain") {
    element.style.borderRadius = "0";
    element.style.boxShadow = "none";
  } else if (appearance.shell === "card") {
    element.style.borderRadius = "6px";
  } else if (appearance.shell === "accent") {
    element.style.borderRadius = "6px";
    element.style.borderTop = `4px solid ${pal.base}`;
  }

  if (appearance.border === "none") element.style.border = "0";
  if (appearance.border === "hairline") element.style.border = `1px solid ${pal.border}`;
  if (appearance.border === "bold") element.style.border = `2px solid ${pal.base}`;

  if (appearance.background === "white") element.style.backgroundColor = "#ffffff";
  if (appearance.background === "tint") element.style.backgroundColor = pal.bg;
  if (appearance.background === "dark") {
    element.style.backgroundColor = darkBg;
    element.style.color = "#f8fafc";
    invertTypographyForDarkSurface(element, darkBg);
  }
  return root.innerHTML;
}
