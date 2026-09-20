import { useEffect, useState } from "react";
import {
  Check,
  ChevronLeft,
  Copy,
  Download,
  FolderOpen,
  LayoutGrid,
  Paintbrush,
  PanelLeftClose,
  RotateCcw,
  Save,
  Sliders,
  Star,
  Trash2,
} from "lucide-react";

import { ColorControl } from "@/components/ColorControl";
import { copyText } from "@/lib/copy";
import { blockLabel, itemBaseHtml, itemHtml, type BuilderItem } from "@/lib/render";
import type { CustomBlock } from "@/lib/custom-blocks";
import { FONT_PRESETS, type Theme } from "@/lib/theme";
import { PRESET_COLORS, deriveAccents } from "@/lib/snippet-colors";
import {
  getApplicableAppearanceOptions,
  type BlockBackground,
  type BlockBorder,
  type BlockShell,
} from "@/lib/block-appearance";
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
        <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
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

function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-sm border px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              value === option.value
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-foreground hover:bg-accent",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

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
  items = [],
  customBlocks = [],
  savedFragments = [],
  onSaveTemplate,
  onCopyAll,
  copiedAll,
  selectedItemUid,
  onSelectItemUid,
  onUpdateItem,
  onRemoveItem,
  onResetItemOps,
  rowColumnCount,
  onRowColumnCountChange,
}: {
  view: "builder" | "library" | "preview";
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
  items?: BuilderItem[];
  customBlocks?: CustomBlock[];
  savedFragments?: { id: string; name: string; html: string }[];
  onSaveTemplate?: () => void;
  onCopyAll?: () => void;
  copiedAll?: boolean;
  selectedItemUid?: string | null;
  onSelectItemUid?: (uid: string | null) => void;
  onUpdateItem?: (item: BuilderItem) => void;
  onRemoveItem?: (uid: string) => void;
  onResetItemOps?: (uid: string) => void;
  rowColumnCount?: number;
  onRowColumnCountChange?: (count: number) => void;
}) {
  const [panelTabOverride, setPanelTabOverride] = useState<"block" | "global" | "categories" | null>(null);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  // Clear tab override when switching views or selecting a block
  useEffect(() => {
    setPanelTabOverride(null);
  }, [view, selectedItemUid]);

  // Defaults based on active mode
  const activeTab =
    panelTabOverride ??
    (view === "library" ? "categories" : view === "builder" ? "block" : "global");

  const selectedItem = items.find((it) => it.uid === selectedItemUid);

  async function handleCopyBlock(item: BuilderItem) {
    const html = itemHtml(item, theme, customBlocks, savedFragments);
    const ok = await copyText(html);
    if (ok) {
      setCopiedUid(item.uid);
      setTimeout(() => {
        setCopiedUid((curr) => (curr === item.uid ? null : curr));
      }, 1500);
    }
  }

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

  // Appearance options for the currently selected block
  const applicableAppearance = selectedItem
    ? getApplicableAppearanceOptions(
        itemBaseHtml(selectedItem, theme, customBlocks, savedFragments),
        selectedItem.colors?.[0] ?? theme.colors[0],
      )
    : null;

  return (
    <aside className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto overscroll-contain border-r border-border bg-card/40 p-3 text-sm">
      {/* Panel View Navigation Controls - compact and borderless */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          {view === "builder" && (
            <button
              type="button"
              onClick={() => setPanelTabOverride("block")}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                activeTab === "block"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <Sliders className="size-4" />
              <span>Block</span>
            </button>
          )}
          {view === "library" && (
            <button
              type="button"
              onClick={() => setPanelTabOverride("categories")}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                activeTab === "categories"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="size-4" />
              <span>Categories</span>
            </button>
          )}
          {view !== "preview" && (
            <button
              type="button"
              onClick={() => setPanelTabOverride("global")}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                activeTab === "global"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <Paintbrush className="size-4" />
              <span>Theme</span>
            </button>
          )}
        </div>
        {panelToggle}
      </div>

      {/* 1. BUILDER: Selected Block Customization */}
      {view === "builder" && activeTab === "block" ? (
        selectedItem ? (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Selected Block
                </p>
                <h3 className="text-sm font-semibold truncate max-w-[180px]">
                  {blockLabel(selectedItem.snippetId, customBlocks, savedFragments)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSelectItemUid?.(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Deselect
              </button>
            </div>

            {/* Individual Block Theme & Color Customization */}
            <div className="space-y-3">
              {/* Full ColorControl for this individual block with count=4 and Reset button aligned with THEMES */}
              <ColorControl
                colors={selectedItem.colors ?? theme.colors}
                count={4}
                onChange={(nextColors) => {
                  if (onUpdateItem) {
                    onUpdateItem({ ...selectedItem, colors: nextColors });
                  }
                }}
                darkBg={theme.darkBg}
                onSelectPalette={(nextColors) => {
                  if (onUpdateItem) {
                    onUpdateItem({ ...selectedItem, colors: nextColors });
                  }
                }}
                resetSlot={
                  selectedItem.colors ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (onUpdateItem) {
                          const { colors: _c, ...rest } = selectedItem;
                          onUpdateItem(rest);
                        }
                      }}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Reset
                    </button>
                  ) : null
                }
              />
            </div>

            {/* Row Column Layout Option */}
            {typeof rowColumnCount === "number" && onRowColumnCountChange && (
              <ChoiceGroup<string>
                label="Columns"
                value={String(rowColumnCount)}
                options={[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                ]}
                onChange={(val) => onRowColumnCountChange(Number(val))}
              />
            )}

            {/* Block Appearance Controls (Shell, Border, Background) */}
            {applicableAppearance &&
              (applicableAppearance.shells.length > 0 ||
                applicableAppearance.borders.length > 0 ||
                applicableAppearance.backgrounds.length > 0) && (
                <div className="space-y-3">
                  {applicableAppearance.shells.length > 0 && (
                    <ChoiceGroup<BlockShell>
                      label="Shell"
                      value={
                        applicableAppearance.shells.some(
                          (o) => o.value === selectedItem.appearance?.shell,
                        )
                          ? selectedItem.appearance!.shell!
                          : "original"
                      }
                      options={applicableAppearance.shells}
                      onChange={(shell) =>
                        onUpdateItem?.({
                          ...selectedItem,
                          appearance: { ...selectedItem.appearance, shell },
                        })
                      }
                    />
                  )}
                  {applicableAppearance.borders.length > 0 && (
                    <ChoiceGroup<BlockBorder>
                      label="Border"
                      value={
                        applicableAppearance.borders.some(
                          (o) => o.value === selectedItem.appearance?.border,
                        )
                          ? selectedItem.appearance!.border!
                          : "original"
                      }
                      options={applicableAppearance.borders}
                      onChange={(border) =>
                        onUpdateItem?.({
                          ...selectedItem,
                          appearance: { ...selectedItem.appearance, border },
                        })
                      }
                    />
                  )}
                  {applicableAppearance.backgrounds.length > 0 && (
                    <ChoiceGroup<BlockBackground>
                      label="Background"
                      value={
                        applicableAppearance.backgrounds.some(
                          (o) => o.value === selectedItem.appearance?.background,
                        )
                          ? selectedItem.appearance!.background!
                          : "original"
                      }
                      options={applicableAppearance.backgrounds}
                      onChange={(background) =>
                        onUpdateItem?.({
                          ...selectedItem,
                          appearance: { ...selectedItem.appearance, background },
                        })
                      }
                    />
                  )}
                </div>
              )}

            {/* Block Actions */}
            <div className="flex flex-col gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onResetItemOps?.(selectedItem.uid);
                  if (onUpdateItem) {
                    const { colors: _c, appearance: _a, layout: _l, ...rest } = selectedItem;
                    onUpdateItem({ ...rest, ops: [] });
                  }
                }}
                disabled={
                  !selectedItem.ops?.length &&
                  !selectedItem.colors &&
                  !selectedItem.appearance?.shell &&
                  !selectedItem.appearance?.border &&
                  !selectedItem.appearance?.background &&
                  !selectedItem.layout?.columns
                }
                className="flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
              >
                <RotateCcw className="size-4" />
                <span>Reset edits</span>
              </button>
              <button
                type="button"
                onClick={() => onRemoveItem?.(selectedItem.uid)}
                className="flex items-center gap-2 rounded-sm border border-destructive/30 bg-card px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4" />
                <span>Remove block</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center py-6">
            <Sliders className="mx-auto size-8 text-muted-foreground/40" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">No block selected</p>
              <p className="text-sm text-muted-foreground">
                Click any block card on the canvas to customize its appearance, borders, or colors.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPanelTabOverride("global")}
              className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3.5 py-2 text-sm font-medium hover:bg-accent"
            >
              <Paintbrush className="size-3.5" />
              <span>Edit Global Theme</span>
            </button>
          </div>
        )
      ) : view === "library" && activeTab === "categories" ? (
        /* 2. LIBRARY: Categories list (Default in Library view) */
        <Section label="Library categories">
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
                <span className="flex items-center gap-1.5 truncate">
                  {c === "Favorites" && (
                    <Star
                      className={cn(
                        "size-3.5 shrink-0",
                        activeCategory === c
                          ? "fill-primary-foreground text-primary-foreground"
                          : "fill-amber-400 text-amber-500",
                      )}
                    />
                  )}
                  {c}
                </span>
                <span className="text-sm opacity-70">{categoryCounts[c] ?? 0}</span>
              </button>
            ))}
          </div>
        </Section>
      ) : view === "preview" ? (
        /* 3. PREVIEW: Copy blocks list + Global Style options (font & density only) without extra dividers */
        <div className="space-y-4">
          <Section label="Copy Blocks">
            {onCopyAll && (
              <button
                type="button"
                onClick={onCopyAll}
                disabled={items.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-sm border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-40"
              >
                {copiedAll ? <Check className="size-4" /> : <Copy className="size-4" />}
                <span>{copiedAll ? "Copied all HTML" : "Copy full HTML"}</span>
              </button>
            )}

            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No blocks in layout</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {items.map((item) => {
                  const isCopied = copiedUid === item.uid;
                  const label = blockLabel(item.snippetId, customBlocks, savedFragments);
                  return (
                    <div
                      key={item.uid}
                      className="flex items-center justify-between gap-2 rounded-sm border border-border bg-card px-3 py-2 text-sm font-medium"
                    >
                      <span className="truncate">{label}</span>
                      <button
                        type="button"
                        onClick={() => void handleCopyBlock(item)}
                        title="Copy HTML"
                        className={cn(
                          "flex shrink-0 items-center gap-1 rounded-sm border px-2.5 py-1 text-xs font-medium transition-colors",
                          isCopied
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:bg-accent",
                        )}
                      >
                        {isCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          {/* Preview Global Style Options: Font & Density only - no divider line above */}
          <Section label="Global Styles">
            <div className="grid gap-3 pt-1">
              <div className="grid gap-1.5">
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Font
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {FONT_PRESETS.map((font) => (
                    <button
                      key={font.name}
                      type="button"
                      onClick={() => onThemeChange({ ...theme, fontStack: font.stack })}
                      className={cn(
                        "rounded-sm border px-2 py-1.5 text-xs font-medium",
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
              <div className="grid gap-1.5">
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Density
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["compact", "comfortable"] as const).map((density) => (
                    <button
                      key={density}
                      type="button"
                      onClick={() => onThemeChange({ ...theme, density })}
                      className={cn(
                        "rounded-sm border px-3 py-1.5 text-sm font-medium capitalize",
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
        </div>
      ) : (
        /* 4. GLOBAL THEME SETTINGS (Clean: no top lines, no wasted headers) */
        <div className="space-y-4 pt-1">
          <ColorControl
            colors={theme.colors}
            onChange={(colors) => onThemeChange({ ...theme, colors })}
            darkBg={theme.darkBg}
            onDarkBgChange={(darkBg) => onThemeChange({ ...theme, darkBg })}
            onSelectPalette={(colors, darkBg) =>
              onThemeChange({
                ...theme,
                colors,
                ...(darkBg ? { darkBg } : {}),
              })
            }
          />
          <div className="grid gap-2 pt-1">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Font
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {FONT_PRESETS.map((font) => (
                <button
                  key={font.name}
                  type="button"
                  onClick={() => onThemeChange({ ...theme, fontStack: font.stack })}
                  className={cn(
                    "rounded-sm border px-3 py-2 text-sm font-medium",
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
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Density
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {(["compact", "comfortable"] as const).map((density) => (
                <button
                  key={density}
                  type="button"
                  onClick={() => onThemeChange({ ...theme, density })}
                  className={cn(
                    "rounded-sm border px-3 py-2 text-sm font-medium capitalize",
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
      )}

      {/* Bottom Actions: Project & Templates */}
      <div className="mt-auto flex flex-col gap-2 pt-2">
        {(view === "builder" || view === "preview") && onSaveTemplate ? (
          <button
            type="button"
            onClick={onSaveTemplate}
            disabled={items.length === 0}
            className={FILE_BUTTON}
          >
            <Save className="size-4" /> Save template
          </button>
        ) : null}

        <div className="grid gap-1.5 border-t border-border pt-2">
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
      </div>
    </aside>
  );
}
