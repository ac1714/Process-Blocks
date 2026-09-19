import { Download, FolderOpen, PanelLeftClose, Save } from "lucide-react";

import { ColorControl } from "@/components/ColorControl";
import { FONT_PRESETS, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

function Section({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex min-h-8 items-center justify-between gap-2">
        <p className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        {action}
      </div>
      {children}
    </div>
  );
}

const FILE_BUTTON =
  "flex w-full items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 text-left text-sm font-medium hover:bg-accent disabled:opacity-40";

export function StudioPanel({
  view,
  categories,
  onCategory,
  categoryCounts,
  activeCategory,
  theme,
  onThemeChange,
  onOpenProject,
  onSaveProject,
  onExport,
  openLabel,
  saveLabel,
  onTogglePanel,
}: {
  view: "builder" | "library";
  categories: string[];
  onCategory: (c: string) => void;
  categoryCounts: Record<string, number>;
  activeCategory: string | null;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onOpenProject: () => void;
  onSaveProject: () => void;
  onExport?: () => void;
  openLabel?: string;
  saveLabel?: string;
  onTogglePanel: () => void;
}) {
  const panelToggle = (
    <button
      type="button"
      onClick={onTogglePanel}
      aria-label="Hide left panel"
      title="Hide panel"
      className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-border hover:bg-accent"
    >
      <PanelLeftClose className="size-4" />
    </button>
  );
  return (
    <aside className="flex h-full min-h-0 flex-col gap-5 overflow-y-auto overscroll-contain border-r border-border bg-card/40 p-4 text-sm">
      {view === "builder" ? (
        <Section label="Appearance" action={panelToggle}>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <p className="text-[13px] font-semibold">Color</p>
              <ColorControl
                colors={theme.colors}
                onChange={(colors) => onThemeChange({ ...theme, colors })}
              />
            </div>
            <div className="grid gap-2">
              <p className="text-[13px] font-semibold">Font</p>
              <div className="grid grid-cols-2 gap-1.5">
                {FONT_PRESETS.map((font) => (
                  <button
                    key={font.name}
                    type="button"
                    onClick={() => onThemeChange({ ...theme, fontStack: font.stack })}
                    className={cn(
                      "rounded-sm border px-2 py-2 text-[13px] font-medium",
                      theme.fontStack === font.stack
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card hover:bg-accent",
                    )}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <p className="text-[13px] font-semibold">Density</p>
              <div className="grid grid-cols-2 gap-1.5">
                {(["compact", "comfortable"] as const).map((density) => (
                  <button
                    key={density}
                    type="button"
                    onClick={() => onThemeChange({ ...theme, density })}
                    className={cn(
                      "rounded-sm border px-2 py-2 text-[13px] font-medium capitalize",
                      theme.density === density
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card hover:bg-accent",
                    )}
                  >
                    {density}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>
      ) : (
        <Section label="Library categories" action={panelToggle}>
          <div className="flex flex-col gap-1">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCategory(c)}
                aria-current={activeCategory === c ? "true" : undefined}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-sm border px-3 py-2 text-left text-sm font-medium transition-colors",
                  activeCategory === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-accent",
                )}
              >
                <span className="truncate">{c}</span>
                <span className="text-[13px] opacity-70">{categoryCounts[c] ?? 0}</span>
              </button>
            ))}
          </div>
        </Section>
      )}

      <div className="mt-auto grid gap-1.5 border-t border-border pt-4">
        <button type="button" onClick={onOpenProject} className={FILE_BUTTON}>
          <FolderOpen className="size-4" /> {openLabel ?? "Open project"}
        </button>
        <button type="button" onClick={onSaveProject} className={FILE_BUTTON}>
          <Save className="size-4" /> {saveLabel ?? "Save project"}
        </button>
        {onExport ? (
          <button type="button" onClick={onExport} className={FILE_BUTTON}>
            <Download className="size-4" /> Export HTML
          </button>
        ) : null}
      </div>
    </aside>
  );
}
