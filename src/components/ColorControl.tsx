import { useState } from "react";
import { ArrowLeftRight, Check, RotateCcw } from "lucide-react";

import { deriveAccents, normalizeHex } from "@/lib/snippet-colors";
import { DARK_BG_PRESETS, DEFAULT_DARK_BG } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const PALETTES = [
  { name: "Ocean", colors: ["#2563eb", "#0f766e", "#b45309"], darkBg: "#0f172a" },
  { name: "Forest", colors: ["#15803d", "#0369a1", "#a21caf"], darkBg: "#052e16" },
  { name: "Editorial", colors: ["#1f2937", "#b91c1c", "#b45309"], darkBg: "#18181b" },
  { name: "Bright", colors: ["#7c3aed", "#0891b2", "#db2777"], darkBg: "#1e1035" },
  { name: "Sunset", colors: ["#e11d48", "#ea580c", "#d97706"], darkBg: "#1f1214" },
  { name: "Teal", colors: ["#0d9488", "#2563eb", "#e11d48"], darkBg: "#042f2e" },
  { name: "Indigo", colors: ["#4f46e5", "#06b6d4", "#f59e0b"], darkBg: "#0b192c" },
  { name: "Earth", colors: ["#9a3412", "#3f6212", "#1e40af"], darkBg: "#1c1917" },
  { name: "Amber", colors: ["#d97706", "#0284c7", "#7c3aed"], darkBg: "#1c1407" },
  { name: "Mono Pro", colors: ["#0f172a", "#475569", "#94a3b8"], darkBg: "#09090b" },
] as const;

export function ColorControl({
  colors,
  onChange,
  darkBg = DEFAULT_DARK_BG,
  onDarkBgChange,
  onSelectPalette,
  count = 3,
  resetSlot,
}: {
  colors: string[];
  onChange: (next: string[]) => void;
  darkBg?: string;
  onDarkBgChange?: (darkBg: string) => void;
  onSelectPalette?: (colors: string[], darkBg?: string) => void;
  count?: 3 | 4;
  resetSlot?: React.ReactNode;
}) {
  const primary = normalizeHex(colors[0] ?? "#2563eb");
  const derived = deriveAccents(primary);
  const fourthFallback = adjustLightness(primary, 0.22);
  const resolved = [
    primary,
    normalizeHex(colors[1] ?? derived[0]),
    normalizeHex(colors[2] ?? derived[1]),
    ...(count === 4 ? [normalizeHex(colors[3] ?? fourthFallback)] : []),
  ];

  const [activeEditingIndex, setActiveEditingIndex] = useState<number | null>(null);

  function autoAccents() {
    const [acc2, acc3] = deriveAccents(resolved[0]);
    const acc4 = adjustLightness(resolved[0], 0.22);
    onChange(count === 4 ? [resolved[0], acc2, acc3, acc4] : [resolved[0], acc2, acc3]);
  }

  function swapAccents() {
    if (count === 4) {
      onChange([resolved[0], resolved[2], resolved[1], resolved[3]]);
    } else {
      onChange([resolved[0], resolved[2], resolved[1]]);
    }
  }

  const ROLE_NAMES = ["Primary", "Accent 2", "Accent 3", "Accent 4"];

  return (
    <div className="space-y-4">
      {/* THEMES */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            THEMES
          </p>
          {resetSlot}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {PALETTES.map((palette) => {
            const active =
              palette.colors.every((color, index) => color === resolved[index]) &&
              (!onDarkBgChange || !palette.darkBg || palette.darkBg === darkBg);
            return (
              <button
                key={palette.name}
                type="button"
                onClick={() => {
                  const targetColors =
                    count === 4
                      ? [...palette.colors, adjustLightness(palette.colors[0], 0.22)]
                      : [...palette.colors];
                  if (onSelectPalette) {
                    onSelectPalette(targetColors, palette.darkBg);
                  } else {
                    onChange(targetColors);
                    if (onDarkBgChange && palette.darkBg) {
                      onDarkBgChange(palette.darkBg);
                    }
                  }
                }}
                className={cn(
                  "flex items-center gap-2 rounded-sm border bg-card px-2 py-1.5 text-left text-sm font-medium transition-colors hover:bg-accent",
                  active
                    ? "border-foreground bg-accent/60 ring-1 ring-foreground"
                    : "border-border",
                )}
              >
                <span className="flex shrink-0 overflow-hidden rounded-sm border border-border/80 shadow-2xs">
                  {palette.colors.map((color) => (
                    <span key={color} className="h-4 w-2" style={{ backgroundColor: color }} />
                  ))}
                  {palette.darkBg && (
                    <span className="h-4 w-1.5 border-l border-white/20" style={{ backgroundColor: palette.darkBg }} />
                  )}
                </span>
                <span className="truncate">{palette.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* COLORS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            COLORS
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={swapAccents}
              title="Swap Accent 2 and Accent 3"
              className="flex items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <ArrowLeftRight className="size-3" /> Swap
            </button>
            <button
              type="button"
              onClick={autoAccents}
              title="Auto-derive accents from primary"
              className="flex items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <RotateCcw className="size-3" /> Auto
            </button>
          </div>
        </div>

        {/* Clean, only showing the colored squares without standalone text boxes */}
        <div className="flex items-center gap-2">
          {resolved.map((color, index) => {
            const roleName = ROLE_NAMES[index] || `Accent ${index + 1}`;
            const isEditing = activeEditingIndex === index;
            return (
              <div key={index} className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setActiveEditingIndex(isEditing ? null : index)}
                  title={`${roleName}: ${color}`}
                  className={cn(
                    "flex h-9 w-full items-center justify-center rounded-sm border transition-all",
                    isEditing
                      ? "border-foreground ring-2 ring-foreground/20 scale-105"
                      : "border-border hover:border-foreground/40",
                  )}
                  style={{ backgroundColor: color }}
                />

                {/* Inline Popover Editor */}
                {isEditing && (
                  <div className="absolute top-full left-0 z-30 mt-1 w-48 rounded-sm border border-border bg-popover p-2 shadow-lg">
                    <div className="flex items-center justify-between pb-1.5 text-xs font-semibold text-muted-foreground">
                      <span>Pick {roleName}</span>
                      <button
                        type="button"
                        onClick={() => setActiveEditingIndex(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative size-7 shrink-0 overflow-hidden rounded-xs border border-border">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const val = e.target.value;
                            onChange(resolved.map((c, i) => (i === index ? val : c)));
                          }}
                          className="absolute inset-0 size-full cursor-pointer opacity-0"
                        />
                        <span className="size-full" style={{ backgroundColor: color }} />
                      </div>
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          if (/^#?[0-9a-fA-F]{0,6}$/.test(val)) {
                            const nextHex = val.startsWith("#") ? val : `#${val}`;
                            if (/^#[0-9a-fA-F]{6}$/.test(nextHex)) {
                              onChange(resolved.map((c, i) => (i === index ? nextHex : c)));
                            }
                          }
                        }}
                        className="w-full rounded-xs border border-border bg-background px-2 py-1 font-mono text-xs uppercase text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Dark Surface Color swatch alongside palette */}
          {onDarkBgChange && (
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setActiveEditingIndex(activeEditingIndex === 99 ? null : 99)}
                title={`Dark Surface: ${darkBg}`}
                className={cn(
                  "flex h-9 w-full items-center justify-center rounded-sm border transition-all",
                  activeEditingIndex === 99
                    ? "border-foreground ring-2 ring-foreground/20 scale-105"
                    : "border-border hover:border-foreground/40",
                )}
                style={{ backgroundColor: darkBg }}
              />

              {activeEditingIndex === 99 && (
                <div className="absolute top-full right-0 z-30 mt-1 w-52 rounded-sm border border-border bg-popover p-2 shadow-lg">
                  <div className="flex items-center justify-between pb-1.5 text-xs font-semibold text-muted-foreground">
                    <span>Dark Surface Color</span>
                    <button
                      type="button"
                      onClick={() => setActiveEditingIndex(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-1 pb-2">
                    {DARK_BG_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => onDarkBgChange(preset.hex)}
                        title={`${preset.name} (${preset.hex})`}
                        className={cn(
                          "flex h-6 items-center justify-center rounded-xs border text-[10px] text-white",
                          darkBg.toLowerCase() === preset.hex.toLowerCase()
                            ? "border-white ring-1 ring-white"
                            : "border-border/60 hover:opacity-90",
                        )}
                        style={{ backgroundColor: preset.hex }}
                      >
                        {darkBg.toLowerCase() === preset.hex.toLowerCase() && (
                          <Check className="size-2.5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative size-7 shrink-0 overflow-hidden rounded-xs border border-border">
                      <input
                        type="color"
                        value={darkBg}
                        onChange={(e) => onDarkBgChange(e.target.value)}
                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                      />
                      <span className="size-full" style={{ backgroundColor: darkBg }} />
                    </div>
                    <input
                      type="text"
                      value={darkBg}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        if (/^#?[0-9a-fA-F]{0,6}$/.test(val)) {
                          const nextHex = val.startsWith("#") ? val : `#${val}`;
                          if (/^#[0-9a-fA-F]{6}$/.test(nextHex)) {
                            onDarkBgChange(nextHex);
                          }
                        }
                      }}
                      className="w-full rounded-xs border border-border bg-background px-1.5 py-1 font-mono text-[12px] uppercase text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
