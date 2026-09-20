import { useEffect, useMemo, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookmarkPlus,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { EditablePreview } from "@/components/EditablePreview";
import { copyText } from "@/lib/copy";
import { PRESET_COLORS, deriveAccents } from "@/lib/snippet-colors";
import {
  blockLabel,
  itemBaseHtml,
  itemHtml,
  itemHtmlWithRef,
  type BuilderItem,
} from "@/lib/render";
import type { Op } from "@/lib/html-ops";
import type { CustomBlock } from "@/lib/custom-blocks";
import type { Theme } from "@/lib/theme";
import {
  getApplicableAppearanceOptions,
  type BlockBackground,
  type BlockBorder,
  type BlockShell,
} from "@/lib/block-appearance";
import type { CollectionLayout } from "@/lib/collection-layout";
import { moveCollectionItem, setRowColumnCount } from "@/lib/collection-layout";
import { cn } from "@/lib/utils";

export type { BuilderItem };

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
    <div className="flex min-w-fit items-center gap-1">
      <span className="text-[13px] font-medium text-muted-foreground">{label}</span>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "h-7 rounded-sm border px-2 text-[13px]",
            value === option.value
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background hover:bg-accent",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function BlockCard({
  item,
  index,
  theme,
  customBlocks,
  savedFragments,
  onRemove,
  onChange,
  onEditBlock,
  onSaveBlock,
  onMove,
  columnCount,
  onColumnCountChange,
  moveDisabled,
  collapseVersion,
  collapseTo,
  selected,
  onSelect,
}: {
  item: BuilderItem;
  theme: Theme;
  customBlocks: CustomBlock[];
  savedFragments: { id: string; name: string; html: string }[];
  onRemove: () => void;
  onChange: (next: BuilderItem) => void;
  onEditBlock?: () => void;
  onSaveBlock: (html: string, label: string) => void;
  onMove: (direction: "up" | "down" | "left" | "right") => void;
  columnCount: number;
  onColumnCountChange: (count: number) => void;
  moveDisabled: Record<"up" | "down" | "left" | "right", boolean>;
  collapseVersion: number;
  collapseTo: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.uid,
  });
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const html = itemHtml(item, theme, customBlocks, savedFragments);
  const baseHtml = useMemo(
    () => itemBaseHtml(item, theme, customBlocks, savedFragments),
    [item, theme, customBlocks, savedFragments],
  );
  const applicable = useMemo(
    () => getApplicableAppearanceOptions(baseHtml, item.colors?.[0] ?? theme.colors[0]),
    [baseHtml, item.colors, theme.colors],
  );

  useEffect(() => {
    if (collapseVersion > 0) setOpen(!collapseTo);
  }, [collapseVersion, collapseTo]);

  async function copyOne() {
    if (await copyText(itemHtmlWithRef(item, theme, customBlocks, savedFragments))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  }

  function addOp(op: Op) {
    onChange({ ...item, ops: [...(item.ops ?? []), op] });
  }

  const appearance = item.appearance ?? {};
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      onClick={() => onSelect?.()}
      className={cn(
        "h-fit min-w-0 scroll-mt-24 rounded-sm border transition-all",
        selected
          ? "border-foreground ring-2 ring-foreground/20 bg-muted/90 shadow-xs"
          : "border-border bg-muted hover:border-border/80",
        isDragging && "z-10 opacity-30 border-dashed border-primary shadow-sm",
      )}
    >
      <div className="flex items-center gap-2 px-2 py-2">
        <button
          {...listeners}
          {...attributes}
          aria-label="Reorder block"
          className="cursor-grab touch-none rounded-sm p-1 text-muted-foreground hover:bg-accent active:cursor-grabbing"
        >
          <span className="grid grid-cols-3 gap-[2px]" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, dotIndex) => (
              <span key={dotIndex} className="size-[2px] rounded-full bg-current" />
            ))}
          </span>
        </button>
        <button
          onClick={() => setOpen((value) => !value)}
          className="flex min-w-0 flex-1 items-center gap-1.5 text-left text-sm"
          aria-label={open ? "Collapse block" : "Expand block to edit"}
        >
          {open ? (
            <ChevronDown className="size-3.5 shrink-0" />
          ) : (
            <ChevronRight className="size-3.5 shrink-0" />
          )}
          <span className="truncate">
            {blockLabel(item.snippetId, customBlocks, savedFragments)}
          </span>
        </button>
        {onEditBlock ? (
          <button
            onClick={onEditBlock}
            aria-label="Edit custom block"
            title="Edit block"
            className="rounded-sm p-1 text-muted-foreground hover:bg-accent"
          >
            <Pencil className="size-4" />
          </button>
        ) : null}
        <button
          onClick={() =>
            onSaveBlock(html, blockLabel(item.snippetId, customBlocks, savedFragments))
          }
          aria-label="Save this block to My blocks"
          title="Save block"
          className="rounded-sm p-1 text-muted-foreground hover:bg-accent"
        >
          <BookmarkPlus className="size-4" />
        </button>
        <button
          onClick={copyOne}
          aria-label="Copy this block"
          className="rounded-sm p-1 text-muted-foreground hover:bg-accent"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
        <button
          onClick={onRemove}
          aria-label="Remove block"
          title="Delete block"
          className="rounded-sm p-1 text-muted-foreground hover:bg-accent"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      {open ? (
        <div className="space-y-2 border-t border-border p-2">
          <EditablePreview html={html} editable onOp={addOp} />
          <div className="flex items-start gap-3">
            <p className="flex-1 text-[13px] text-muted-foreground">Click any text to edit it.</p>
            <div className="grid grid-cols-4 gap-1">
              {(["left", "up", "down", "right"] as const).map((direction) => {
                const Icon =
                  direction === "left"
                    ? ArrowLeft
                    : direction === "right"
                      ? ArrowRight
                      : direction === "up"
                        ? ArrowUp
                        : ArrowDown;
                return (
                  <button
                    key={direction}
                    onClick={() => onMove(direction)}
                    disabled={moveDisabled[direction]}
                    aria-label={`Move block ${direction}`}
                    title={`Move ${direction}`}
                    className="rounded-sm border border-border p-1 text-muted-foreground hover:bg-accent disabled:opacity-30"
                  >
                    <Icon className="size-3.5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-1 border-t border-border px-2 py-1.5">
          {(["left", "up", "down", "right"] as const).map((direction) => {
            const Icon =
              direction === "left"
                ? ArrowLeft
                : direction === "right"
                  ? ArrowRight
                  : direction === "up"
                    ? ArrowUp
                    : ArrowDown;
            return (
              <button
                key={direction}
                onClick={() => onMove(direction)}
                disabled={moveDisabled[direction]}
                aria-label={`Move block ${direction}`}
                className="rounded-sm border border-border p-1 text-muted-foreground hover:bg-accent disabled:opacity-30"
              >
                <Icon className="size-3.5" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyColumnDropZone({
  rowId,
  rowIndex,
  columnIndex,
  isDragging,
  onAdd,
}: {
  rowId: string;
  rowIndex: number;
  columnIndex: number;
  isDragging: boolean;
  onAdd?: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col::${rowId}::${columnIndex}`,
    data: { type: "column", rowId, columnIndex },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group relative flex min-h-[120px] flex-col items-center justify-center rounded-sm border-2 border-dashed p-4 text-center transition-all",
        isOver
          ? "border-primary bg-primary/15 text-primary ring-2 ring-primary/30 scale-[1.01]"
          : isDragging
            ? "border-primary/60 bg-primary/5 text-primary shadow-xs"
            : "border-border/80 bg-muted/20 hover:border-border hover:bg-muted/40",
      )}
    >
      <div className="flex flex-col items-center gap-1.5 pointer-events-none select-none">
        <div
          className={cn(
            "flex size-7 items-center justify-center rounded-full border transition-all",
            isOver
              ? "border-primary bg-primary text-primary-foreground scale-110"
              : isDragging
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground",
          )}
        >
          {isOver ? <ArrowDown className="size-3.5" /> : <Plus className="size-3.5" />}
        </div>
        <p className="text-xs font-medium">
          {isOver ? (
            <span className="font-semibold text-primary">Release to drop here</span>
          ) : isDragging ? (
            <span>Drop here in Column {columnIndex + 1}</span>
          ) : (
            <span className="text-muted-foreground">Empty Column {columnIndex + 1}</span>
          )}
        </p>
      </div>
      {!isDragging && onAdd ? (
        <button
          type="button"
          onClick={onAdd}
          className="mt-2 inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs hover:bg-accent hover:text-foreground"
        >
          <Plus className="size-3" /> Add block
        </button>
      ) : null}
    </div>
  );
}

function ColumnEndDropZone({
  rowId,
  columnIndex,
  isDragging,
}: {
  rowId: string;
  columnIndex: number;
  isDragging: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col::${rowId}::${columnIndex}`,
    data: { type: "column-end", rowId, columnIndex },
  });

  if (!isDragging) return null;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-9 items-center justify-center rounded-sm border-2 border-dashed text-xs font-medium transition-all",
        isOver
          ? "border-primary bg-primary/20 text-primary ring-2 ring-primary/30 scale-[1.01]"
          : "border-primary/40 bg-primary/5 text-primary/70",
      )}
    >
      {isOver ? "Release to drop at end" : "+ Drop at end of column"}
    </div>
  );
}

function NewRowDropZone({ isDragging }: { isDragging: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "new-row::bottom",
    data: { type: "new-row" },
  });

  if (!isDragging) return null;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-12 items-center justify-center rounded-sm border-2 border-dashed text-xs font-medium transition-all my-2",
        isOver
          ? "border-primary bg-primary/20 text-primary ring-2 ring-primary/30 scale-[1.01]"
          : "border-primary/40 bg-primary/5 text-muted-foreground",
      )}
    >
      {isOver ? "Release to create new row" : "+ Drop here to create a new row"}
    </div>
  );
}

export function StackRows({
  items,
  setItems,
  layout,
  setLayout,
  theme,
  customBlocks,
  savedFragments,
  onEditBlock,
  onSaveBlock,
  renderInsert,
  renderAfter,
  collapseVersion = 0,
  collapseTo = true,
  activeId = null,
  onInsertForColumn,
  selectedItemUid,
  onSelectItem,
}: {
  items: BuilderItem[];
  setItems: (next: BuilderItem[]) => void;
  layout: CollectionLayout;
  setLayout: (next: CollectionLayout) => void;
  theme: Theme;
  customBlocks: CustomBlock[];
  savedFragments: { id: string; name: string; html: string }[];
  onEditBlock?: (item: BuilderItem) => void;
  onSaveBlock: (html: string, label: string) => void;
  renderInsert: (row: number, column: number, position: number) => React.ReactNode;
  renderAfter?: (item: BuilderItem) => React.ReactNode;
  collapseVersion?: number;
  collapseTo?: boolean;
  activeId?: string | null;
  onInsertForColumn?: (row: number, column: number) => void;
  selectedItemUid?: string | null;
  onSelectItem?: (uid: string | null) => void;
}) {
  const byId = new Map(items.map((item) => [item.uid, item]));
  if (!items.length) return <>{renderInsert(0, 0, 0)}</>;
  return (
    <div className="grid gap-4">
      {layout.rows.map((row, rowIndex) => (
        <section key={row.id}>
          <div className="collection-row grid items-start gap-2" data-columns={row.columns.length}>
            {row.columns.map((column, columnIndex) => (
              <SortableContext
                key={`${row.id}-${columnIndex}`}
                items={column}
                strategy={verticalListSortingStrategy}
              >
                <div key={`${row.id}-${columnIndex}`} className="grid min-w-0 content-start gap-2">
                  {column.length === 0 ? (
                    <EmptyColumnDropZone
                      rowId={row.id}
                      rowIndex={rowIndex}
                      columnIndex={columnIndex}
                      isDragging={Boolean(activeId)}
                      onAdd={() => onInsertForColumn?.(rowIndex, columnIndex)}
                    />
                  ) : (
                    <>
                      {column.map((uid, position) => {
                        const item = byId.get(uid);
                        if (!item) return null;
                        const length = column.length;
                        return (
                          <div key={uid} className="grid min-w-0 gap-2">
                            <BlockCard
                              item={item}
                              selected={selectedItemUid === uid}
                              onSelect={() => onSelectItem?.(uid)}
                              theme={theme}
                              customBlocks={customBlocks}
                              savedFragments={savedFragments}
                              onSaveBlock={onSaveBlock}
                              collapseVersion={collapseVersion}
                              collapseTo={collapseTo}
                              columnCount={row.columns.length}
                              onColumnCountChange={(count) =>
                                setLayout({
                                  rows: layout.rows.map((candidate) =>
                                    candidate.id === row.id
                                      ? setRowColumnCount(candidate, count)
                                      : candidate,
                                  ),
                                })
                              }
                              moveDisabled={{
                                left: columnIndex === 0,
                                right: columnIndex === row.columns.length - 1,
                                up: position === 0,
                                down: position === length - 1,
                              }}
                              onMove={(direction) =>
                                setLayout(moveCollectionItem(layout, uid, direction))
                              }
                              onRemove={() =>
                                setItems(items.filter((candidate) => candidate.uid !== uid))
                              }
                              onChange={(next) =>
                                setItems(
                                  items.map((candidate) =>
                                    candidate.uid === next.uid ? next : candidate,
                                  ),
                                )
                              }
                              {...(onEditBlock ? { onEditBlock: () => onEditBlock(item) } : {})}
                            />
                            {renderAfter?.(item)}
                          </div>
                        );
                      })}
                      <ColumnEndDropZone
                        rowId={row.id}
                        columnIndex={columnIndex}
                        isDragging={Boolean(activeId)}
                      />
                    </>
                  )}
                </div>
              </SortableContext>
            ))}
          </div>
        </section>
      ))}
      <NewRowDropZone isDragging={Boolean(activeId)} />
      {renderInsert(layout.rows.length, 0, 0)}
    </div>
  );
}
