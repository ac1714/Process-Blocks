import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2, X } from "lucide-react";

import { EditablePreview } from "@/components/EditablePreview";
import { BRAND_NAMES, brandLogoHtml } from "@/lib/brand-logos";
import {
  PART_LABELS,
  SHELL_LABELS,
  renderCustomBlock,
  type AlignStyle,
  type BackgroundStyle,
  type BorderStyle,
  type CustomBlock,
  type CustomPart,
  type PaddingStyle,
  type PartOpts,
  type PartType,
  type Shell,
} from "@/lib/custom-blocks";
import { PRESET_COLORS, buildPalettes } from "@/lib/snippet-colors";
import { applyTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type { Op } from "@/lib/html-ops";

function newId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function normalizeBlock(block: CustomBlock): CustomBlock {
  const parts = block.sections?.length
    ? block.sections.flatMap((section) => section.columns.flat())
    : (block.parts ?? []);
  return {
    ...block,
    parts,
    sections: [{ id: block.sections?.[0]?.id ?? newId(), columns: [parts] }],
  };
}

function emptyBlock(): CustomBlock {
  return normalizeBlock({
    id: newId(),
    label: "My block",
    shell: "card",
    headerTitle: "Section header",
    border: "hairline",
    background: "white",
    align: "left",
    padding: "normal",
    parts: [
      { id: newId(), type: "eyebrow" },
      { id: newId(), type: "title" },
      { id: newId(), type: "paragraph" },
    ],
  });
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 rounded-sm border px-2 text-[13px] font-medium",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-fit items-center gap-1.5">
      <span className="text-[13px] font-semibold uppercase text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

const OPTIONABLE: PartType[] = [
  "title",
  "bullets",
  "stats",
  "table",
  "callout",
  "button",
  "brand-logo",
];

function PartOptions({ part, onChange }: { part: CustomPart; onChange: (opts: PartOpts) => void }) {
  const options = part.opts ?? {};
  const set = (patch: PartOpts) => onChange({ ...options, ...patch });
  if (part.type === "title")
    return (
      <div className="flex gap-1">
        {(["s", "m", "l"] as const).map((value) => (
          <Toggle
            key={value}
            active={(options.size ?? "m") === value}
            onClick={() => set({ size: value })}
          >
            {value.toUpperCase()}
          </Toggle>
        ))}
      </div>
    );
  if (part.type === "bullets")
    return (
      <div className="flex flex-wrap gap-1">
        {(["check", "dot", "number"] as const).map((value) => (
          <Toggle
            key={value}
            active={(options.marker ?? "check") === value}
            onClick={() => set({ marker: value })}
          >
            {value}
          </Toggle>
        ))}
      </div>
    );
  if (part.type === "stats")
    return (
      <div className="flex gap-1">
        {[2, 3, 4].map((value) => (
          <Toggle
            key={value}
            active={(options.count ?? 3) === value}
            onClick={() => set({ count: value })}
          >
            {value}
          </Toggle>
        ))}
      </div>
    );
  if (part.type === "table")
    return (
      <div className="flex flex-wrap gap-2">
        <Group label="Cols">
          {[2, 3, 4].map((value) => (
            <Toggle
              key={value}
              active={(options.cols ?? 2) === value}
              onClick={() => set({ cols: value })}
            >
              {value}
            </Toggle>
          ))}
        </Group>
        <Group label="Rows">
          {[2, 3, 4, 5].map((value) => (
            <Toggle
              key={value}
              active={(options.rows ?? 2) === value}
              onClick={() => set({ rows: value })}
            >
              {value}
            </Toggle>
          ))}
        </Group>
      </div>
    );
  if (part.type === "callout")
    return (
      <div className="flex gap-1">
        {(["info", "success", "warning"] as const).map((value) => (
          <Toggle
            key={value}
            active={(options.tone ?? "info") === value}
            onClick={() => set({ tone: value })}
          >
            {value}
          </Toggle>
        ))}
      </div>
    );
  if (part.type === "button")
    return (
      <div className="flex gap-1">
        {(["solid", "outline"] as const).map((value) => (
          <Toggle
            key={value}
            active={(options.style ?? "solid") === value}
            onClick={() => set({ style: value })}
          >
            {value}
          </Toggle>
        ))}
      </div>
    );
  if (part.type === "brand-logo")
    return (
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {BRAND_NAMES.map((brand) => (
          <button
            key={brand}
            type="button"
            onClick={() => set({ brand })}
            aria-label={`Use ${brand} logo`}
            className={cn(
              "flex h-10 items-center gap-2 rounded-sm border px-2 text-left text-[13px]",
              (options.brand ?? "Zendesk") === brand
                ? "border-foreground bg-accent"
                : "border-border bg-card",
            )}
          >
            <span
              className="flex w-8 shrink-0 items-center justify-start"
              dangerouslySetInnerHTML={{ __html: brandLogoHtml(brand) }}
            />
            <span className="truncate">{brand}</span>
          </button>
        ))}
      </div>
    );
  return null;
}

export function ElementBuilder({
  theme,
  initial,
  onSave,
  onClose,
  variant = "modal",
}: {
  theme: Theme;
  initial?: CustomBlock;
  onSave: (block: CustomBlock) => void;
  onClose: () => void;
  variant?: "modal" | "panel";
}) {
  const [block, setBlock] = useState<CustomBlock>(() => normalizeBlock(initial ?? emptyBlock()));
  useEffect(() => {
    if (variant === "panel") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [variant]);
  const [primary] = buildPalettes(theme.colors);
  const html = applyTheme(renderCustomBlock(block, primary, theme.darkBg), theme);
  const parts = block.parts;
  const addTextOp = (op: Op) =>
    setBlock((current) => ({ ...current, ops: [...(current.ops ?? []), op] }));
  const commitParts = (next: CustomPart[]) =>
    setBlock((current) => ({
      ...current,
      parts: next,
      sections: [{ id: current.sections?.[0]?.id ?? newId(), columns: [next] }],
    }));
  const movePart = (index: number, direction: -1 | 1) => {
    const destination = index + direction;
    if (destination < 0 || destination >= parts.length) return;
    const next = [...parts];
    [next[index], next[destination]] = [next[destination] as CustomPart, next[index] as CustomPart];
    commitParts(next);
  };

  return (
    <div
      className={cn(
        variant === "panel"
          ? "h-full min-h-0"
          : "fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-2 sm:p-4",
      )}
    >
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-sm border border-border bg-background",
          variant === "panel"
            ? "min-h-[680px] w-full"
            : "h-[calc(100dvh-1rem)] w-full max-w-7xl shadow-xl sm:h-[calc(100dvh-2rem)]",
        )}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2">
          <input
            value={block.label}
            onChange={(event) => setBlock({ ...block, label: event.target.value })}
            aria-label="Block name"
            className="min-w-0 rounded-sm border border-border bg-card px-2 py-1 text-sm font-medium outline-none"
          />
          {block.shell === "darkhead" ? (
            <input
              value={block.headerTitle}
              onChange={(event) => setBlock({ ...block, headerTitle: event.target.value })}
              aria-label="Header title"
              className="min-w-0 rounded-sm border border-border bg-card px-2 py-1 text-sm"
            />
          ) : null}
          <button
            onClick={() => onSave(normalizeBlock(block))}
            disabled={!parts.length}
            className="ml-auto flex h-8 shrink-0 items-center gap-1.5 rounded-sm bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-40"
          >
            <Save className="size-3.5" />
            {initial ? "Save changes" : "Save"}
          </button>
          <button
            onClick={onClose}
            aria-label="Close element builder"
            className="flex size-8 shrink-0 items-center justify-center rounded-sm hover:bg-accent"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-3 py-2">
          <Group label="Shell">
            {SHELL_LABELS.map((item) => (
              <Toggle
                key={item.shell}
                active={block.shell === item.shell}
                onClick={() => setBlock({ ...block, shell: item.shell as Shell })}
              >
                {item.label}
              </Toggle>
            ))}
          </Group>
          <Group label="Border">
            {(["hairline", "bold", "none"] as BorderStyle[]).map((value) => (
              <Toggle
                key={value}
                active={(block.border ?? "hairline") === value}
                onClick={() => setBlock({ ...block, border: value })}
              >
                {value}
              </Toggle>
            ))}
          </Group>
          <Group label="Background">
            {(["white", "tint", "dark"] as BackgroundStyle[]).map((value) => (
              <Toggle
                key={value}
                active={(block.background ?? "white") === value}
                onClick={() => setBlock({ ...block, background: value })}
              >
                {value}
              </Toggle>
            ))}
          </Group>
          <Group label="Align">
            {(["left", "center", "right"] as AlignStyle[]).map((value) => (
              <Toggle
                key={value}
                active={(block.align ?? "left") === value}
                onClick={() => setBlock({ ...block, align: value })}
              >
                {value}
              </Toggle>
            ))}
          </Group>
          <Group label="Padding">
            {(["tight", "normal", "roomy"] as PaddingStyle[]).map((value) => (
              <Toggle
                key={value}
                active={(block.padding ?? "normal") === value}
                onClick={() => setBlock({ ...block, padding: value })}
              >
                {value}
              </Toggle>
            ))}
          </Group>
          <Group label="Accent">
            <Toggle
              active={!block.accent}
              onClick={() => {
                const { accent: _unused, ...rest } = block;
                setBlock(rest);
              }}
            >
              Studio
            </Toggle>
            {PRESET_COLORS.map((color) => (
              <button
                key={color.hex}
                type="button"
                title={color.name}
                aria-label={`${color.name} accent`}
                onClick={() => setBlock({ ...block, accent: color.hex })}
                className={cn(
                  "size-7 shrink-0 rounded-sm border",
                  block.accent === color.hex
                    ? "border-foreground ring-1 ring-foreground"
                    : "border-border",
                )}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </Group>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <section className="border-b border-border bg-muted/30 p-4">
            <div className="flex w-full flex-wrap items-center gap-1.5">
              {PART_LABELS.map((item) => (
                <button
                  key={item.type}
                  onClick={() => commitParts([...parts, { id: newId(), type: item.type }])}
                  className="flex h-8 items-center gap-1 rounded-sm border border-border bg-card px-2 text-[13px] hover:bg-accent"
                >
                  <Plus className="size-3" />
                  {item.label}
                </button>
              ))}
            </div>
          </section>
          <section className="border-b border-border bg-muted/30 p-4">
            <div className="space-y-2">
              {parts.map((part, index) => {
                const options = (
                  <PartOptions
                    part={part}
                    onChange={(opts) =>
                      commitParts(
                        parts.map((item) => (item.id === part.id ? { ...item, opts } : item)),
                      )
                    }
                  />
                );
                return (
                  <div
                    key={part.id}
                    className="space-y-2 border-l-2 border-border bg-background/60 p-3"
                  >
                    <div className="flex flex-wrap items-center gap-1">
                      <span
                        className={cn(
                          "min-w-0 truncate text-sm font-medium",
                          part.type !== "title" && "flex-1",
                        )}
                      >
                        {PART_LABELS.find((item) => item.type === part.type)?.label}
                      </span>
                      {part.type === "title" ? options : null}
                      <span className="flex-1" />
                      <button
                        onClick={() => movePart(index, -1)}
                        disabled={index === 0}
                        aria-label="Move part up"
                        className="rounded-sm p-1 hover:bg-accent disabled:opacity-30"
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                      <button
                        onClick={() => movePart(index, 1)}
                        disabled={index === parts.length - 1}
                        aria-label="Move part down"
                        className="rounded-sm p-1 hover:bg-accent disabled:opacity-30"
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                      <button
                        onClick={() => commitParts(parts.filter((item) => item.id !== part.id))}
                        aria-label="Remove part"
                        title="Delete part"
                        className="rounded-sm p-1 hover:bg-accent"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                    {part.type !== "title" && OPTIONABLE.includes(part.type) ? options : null}
                  </div>
                );
              })}
            </div>
          </section>
          <section className="bg-muted/30 p-4">
            <div className="mb-3 text-[13px] font-semibold uppercase text-muted-foreground">
              Preview
            </div>
            <EditablePreview html={html} editable onOp={addTextOp} />
          </section>
        </div>
      </div>
    </div>
  );
}
