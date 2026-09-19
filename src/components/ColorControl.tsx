import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

import { deriveAccents, normalizeHex } from "@/lib/snippet-colors";
import { cn } from "@/lib/utils";

const PALETTES = [
  { name: "Ocean", colors: ["#2563eb", "#0f766e", "#b45309"] },
  { name: "Forest", colors: ["#15803d", "#0369a1", "#a21caf"] },
  { name: "Editorial", colors: ["#1f2937", "#b91c1c", "#b45309"] },
  { name: "Bright", colors: ["#7c3aed", "#0891b2", "#db2777"] },
  { name: "Earth", colors: ["#9a3412", "#3f6212", "#1e40af"] },
  { name: "Mono", colors: ["#334155", "#64748b", "#0f172a"] },
] as const;

export function ColorControl({
  colors,
  onChange,
}: {
  colors: string[];
  onChange: (next: string[]) => void;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const primary = normalizeHex(colors[0] ?? "#2563eb");
  const derived = deriveAccents(primary);
  const resolved = [
    primary,
    normalizeHex(colors[1] ?? derived[0]),
    normalizeHex(colors[2] ?? derived[1]),
  ];

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-1.5">
        {PALETTES.map((palette) => {
          const active = palette.colors.every((color, index) => color === resolved[index]);
          return (
            <button
              key={palette.name}
              type="button"
              onClick={() => onChange([...palette.colors])}
              className={cn(
                "flex items-center gap-2 rounded-sm border bg-card px-2 py-2 text-left text-[13px] font-medium hover:bg-accent",
                active && "border-foreground ring-1 ring-foreground",
              )}
            >
              <span className="flex overflow-hidden rounded-sm border border-border">
                {palette.colors.map((color) => (
                  <span key={color} className="h-5 w-2.5" style={{ backgroundColor: color }} />
                ))}
              </span>
              {palette.name}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setCustomOpen((open) => !open)}
        className="flex w-full items-center justify-between text-[13px] font-medium text-muted-foreground"
      >
        Exact colors{" "}
        {customOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
      </button>
      {customOpen ? (
        <div className="space-y-1.5 rounded-sm border border-border bg-card p-2">
          {["Primary", "Accent 2", "Accent 3"].map((label, index) => (
            <label
              key={label}
              className="flex items-center gap-2 text-[13px] text-muted-foreground"
            >
              <input
                type="color"
                value={resolved[index]}
                onChange={(event) =>
                  onChange(resolved.map((color, i) => (i === index ? event.target.value : color)))
                }
                className="size-6 cursor-pointer border-0 bg-transparent p-0"
                aria-label={`${label} picker`}
              />
              <span className="w-16">{label}</span>
              <input
                value={resolved[index]}
                onChange={(event) =>
                  onChange(resolved.map((color, i) => (i === index ? event.target.value : color)))
                }
                className="min-w-0 flex-1 rounded-sm border border-border bg-background px-2 py-1 font-mono text-[13px] uppercase outline-none"
                aria-label={`${label} hex`}
              />
            </label>
          ))}
          <button
            type="button"
            onClick={() => onChange([primary, ...deriveAccents(primary)])}
            className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-border bg-background px-2 py-1.5 text-[13px] font-medium hover:bg-accent"
          >
            <RotateCcw className="size-3.5" /> Auto-match accents
          </button>
        </div>
      ) : null}
    </div>
  );
}
