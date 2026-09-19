import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  pointerWithin,
  type CollisionDetection,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  Check,
  Copy,
  Hammer,
  Library,
  Menu,
  PanelLeftOpen,
  Plus,
  Save,
  Wand2,
  X,
} from "lucide-react";

import { SnippetCard } from "@/components/SnippetCard";
import { StackRows } from "@/components/StackTray";
import { StudioPanel } from "@/components/StudioPanel";
import { ElementBuilder } from "@/components/ElementBuilder";
import { EditablePreview } from "@/components/EditablePreview";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SNIPPETS, CATEGORIES, catalogRef } from "@/lib/snippets";
import {
  CUSTOM_PREFIX,
  FRAGMENT_PREFIX,
  appendItems,
  baseHtml,
  blockHtmlWithRefs,
  collectionHtml,
  nextRef,
  normalizeRefs,
  type BuilderItem,
} from "@/lib/render";
import {
  defaultCollectionLayout,
  insertCollectionItem,
  normalizeCollectionLayout,
  reorderCollectionItem,
  type CollectionLayout,
} from "@/lib/collection-layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copyText } from "@/lib/copy";
import { DEFAULT_THEME, type Theme } from "@/lib/theme";
import type { CustomBlock } from "@/lib/custom-blocks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { loadProjectFile, saveProjectFile } from "@/lib/project-file";
import {
  STORAGE_KEY,
  LEGACY_KEY,
  type Persisted,
  type SavedFragment,
  type Template,
} from "@/lib/studio-state";

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export type StudioAppProps = {
  /** Pre-seeded state (used by the exported standalone file). */
  initialState?: Partial<Persisted> | null;
  /** Overrides the "Save changes" action. */
  onSaveProject?: (state: Persisted) => void | Promise<void>;
  /** Overrides the "Load project" action. */
  onOpenProject?: () => Promise<Partial<Persisted> | null>;
  /** Offered as an extra panel action when provided. */
  onExportStandalone?: (state: Persisted) => void | Promise<void>;
  openLabel?: string;
  saveLabel?: string;
  /** Skip reading/writing localStorage (standalone file owns its own state). */
  disableLocalStorage?: boolean;
};

export function StudioApp({
  initialState,
  onSaveProject,
  onOpenProject,
  onExportStandalone,
  openLabel,
  saveLabel,
  disableLocalStorage,
}: StudioAppProps = {}) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [items, setItems] = useState<BuilderItem[]>([]);
  const [collectionLayout, setCollectionLayout] = useState<CollectionLayout>({ rows: [] });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customBlocks, setCustomBlocks] = useState<CustomBlock[]>([]);
  const [savedFragments, setSavedFragments] = useState<SavedFragment[]>([]);
  const [panelOpen, setPanelOpen] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<CustomBlock | null>(null);
  const [editingItemUid, setEditingItemUid] = useState<string | null>(null);
  const [insertTarget, setInsertTarget] = useState<{
    row: number;
    column: number;
    position: number;
  } | null>(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<"builder" | "library">("builder");
  const [preview, setPreview] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [collapseVersion, setCollapseVersion] = useState(0);

  const scrollRef = useRef<HTMLElement | null>(null);
  const scrollMemo = useRef<Record<string, number>>({ builder: 0, library: 0 });

  useEffect(() => {
    if (!items.length) setEditingTemplateId(null);
  }, [items.length]);

  function applyState(p: Partial<Persisted>) {
    if (p.theme) {
      const { colors, fontStack, density } = p.theme as Theme;
      setTheme({
        ...DEFAULT_THEME,
        ...(colors ? { colors } : {}),
        ...(fontStack ? { fontStack } : {}),
        ...(density ? { density } : {}),
      });
    }
    if (Array.isArray(p.items)) {
      const nextItems = normalizeRefs(p.items).map((item) => {
        const { layout: _legacyLayout, ...rest } = item;
        return rest;
      });
      setItems(nextItems);
      setCollectionLayout(
        normalizeCollectionLayout(
          p.collectionLayout,
          nextItems.map((item) => item.uid),
        ),
      );
    }
    if (Array.isArray(p.favorites)) setFavorites(p.favorites);
    if (Array.isArray(p.customBlocks)) setCustomBlocks(p.customBlocks);
    if (Array.isArray(p.savedFragments)) setSavedFragments(p.savedFragments);
    if (typeof p.panelOpen === "boolean") setPanelOpen(p.panelOpen);
    if (Array.isArray(p.templates))
      setTemplates(p.templates.map((t) => ({ ...t, items: normalizeRefs(t.items) })));
  }

  useEffect(() => {
    if (initialState) {
      applyState(initialState);
      setHydrated(true);
      return;
    }
    if (disableLocalStorage) {
      setHydrated(true);
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        applyState(JSON.parse(raw) as Partial<Persisted>);
      } else {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          const old = JSON.parse(legacy) as { uid: string; snippetId: string }[];
          if (Array.isArray(old))
            setItems(normalizeRefs(old.map((i) => ({ uid: i.uid, snippetId: i.snippetId }))));
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const snapshot = useMemo<Persisted>(
    () => ({
      theme,
      items,
      collectionLayout,
      favorites,
      customBlocks,
      savedFragments,
      templates,
      panelOpen,
      trayOpen: false,
    }),
    [theme, items, collectionLayout, favorites, customBlocks, savedFragments, templates, panelOpen],
  );

  useEffect(() => {
    setCollectionLayout((current) =>
      normalizeCollectionLayout(
        current,
        items.map((item) => item.uid),
      ),
    );
  }, [items]);

  useEffect(() => {
    if (!hydrated || disableLocalStorage) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      /* storage full or blocked */
    }
  }, [snapshot, hydrated, disableLocalStorage]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const entries = useMemo(() => {
    const stock = SNIPPETS.filter((s) => s.gallery !== false).map((s) => ({
      id: s.id,
      label: s.label,
      category: s.category as string,
      catalog: catalogRef(s.id),
    }));
    const custom = customBlocks.map((b) => ({
      id: `${CUSTOM_PREFIX}${b.id}`,
      label: b.label,
      category: "My blocks",
      custom: true as const,
    }));
    const fragments = savedFragments.map((fragment) => ({
      id: `${FRAGMENT_PREFIX}${fragment.id}`,
      label: fragment.name,
      category: "My blocks",
      fragment: true as const,
    }));
    const tpl = templates.map((t) => ({
      id: `tpl:${t.id}`,
      label: t.name,
      category: "My blocks",
      template: true as const,
      items: t.items,
    }));
    return [...tpl, ...fragments, ...custom, ...stock];
  }, [customBlocks, savedFragments, templates]);

  const visible = useMemo(() => {
    return [...entries].sort(
      (a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)),
    );
  }, [entries, favorites]);

  const categories = [
    ...(templates.length || customBlocks.length || savedFragments.length ? ["My blocks"] : []),
    ...CATEGORIES,
  ];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: entries.length };
    for (const e of entries) counts[e.category] = (counts[e.category] ?? 0) + 1;
    return counts;
  }, [entries]);

  const groupedVisible = useMemo(
    () =>
      categories
        .map((name) => ({ name, entries: visible.filter((entry) => entry.category === name) }))
        .filter((group) => group.entries.length > 0),
    [categories, visible],
  );

  function switchView(next: "builder" | "library") {
    scrollMemo.current[view] = scrollRef.current?.scrollTop ?? 0;
    if (next === "library") {
      if (!activeCategory) setActiveCategory(groupedVisible[0]?.name ?? null);
      // The library always shows blocks in their normal editable state.
      setPreview(false);
    }
    setView(next);
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollMemo.current[next] ?? 0;
    });
  }

  function scrollToCategory(name: string) {
    setActiveCategory(name);
    switchView("library");
    requestAnimationFrame(() => {
      const id = `category-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleMainScroll() {
    const scroller = scrollRef.current;
    if (!scroller || view !== "library") return;
    scrollMemo.current["library"] = scroller.scrollTop;
    const top = scroller.getBoundingClientRect().top + 24;
    let current: string | null = null;
    for (const group of groupedVisible) {
      const id = `category-${group.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top <= top) current = group.name;
    }
    setActiveCategory(current ?? groupedVisible[0]?.name ?? null);
  }

  function togglePreview() {
    const next = !preview;
    setPreview(next);
    // Preview always happens on the builder: turning it on collapses the block
    // cards, turning it off expands them again.
    if (view !== "builder") switchView("builder");
    setCollapseVersion((version) => version + 1);
    if (next) {
      setBuilderOpen(false);
      setEditingBlock(null);
      setEditingItemUid(null);
      setInsertTarget(null);
    }
  }

  function addSnippet(snippetId: string, target = insertTarget) {
    if (snippetId.startsWith("tpl:")) {
      const tplId = snippetId.slice(4);
      const t = templates.find((x) => x.id === tplId);
      if (t)
        setItems((prev) => {
          const added = normalizeRefs(t.items.map((i) => ({ ...i, uid: uid(i.snippetId) })));
          const next = appendItems(prev, added);
          const inserted = next.slice(prev.length);
          setCollectionLayout((layout) => {
            let updated = normalizeCollectionLayout(
              layout,
              prev.map((item) => item.uid),
            );
            for (const item of inserted)
              updated = insertCollectionItem(
                updated,
                item.uid,
                target?.row ?? updated.rows.length,
                target?.column ?? 0,
                target?.position ?? 0,
              );
            return updated;
          });
          return next;
        });
      setInsertTarget(null);
      return;
    }
    setItems((prev) => {
      const added = { uid: uid(snippetId), snippetId, ref: nextRef(prev) };
      setCollectionLayout((layout) =>
        insertCollectionItem(
          normalizeCollectionLayout(
            layout,
            prev.map((item) => item.uid),
          ),
          added.uid,
          target?.row ?? layout.rows.length,
          target?.column ?? 0,
          target?.position ?? 0,
        ),
      );
      return [...prev, added];
    });
    setInsertTarget(null);
  }

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  function toggleFavorite(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  function handleDragStart(e: DragStartEvent) {
    setActiveDragId(String(e.active.id));
  }

  function handleDragCancel() {
    setActiveDragId(null);
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveDragId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setCollectionLayout((layout) =>
      reorderCollectionItem(layout, String(active.id), String(over.id)),
    );
  }

  const collisionDetectionStrategy: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    return closestCenter(args);
  };

  const activeDragItem = useMemo(
    () => (activeDragId ? items.find((i) => i.uid === activeDragId) : null),
    [activeDragId, items],
  );

  function saveTemplate() {
    if (!items.length) return;
    if (editingTemplateId) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === editingTemplateId ? { ...t, items, collectionLayout } : t)),
      );
      setEditingTemplateId(null);
      toast.success("Saved stack updated");
      return;
    }
    setTemplateName(`Template ${templates.length + 1}`);
    setTemplateDialogOpen(true);
  }

  function createTemplate() {
    const name = templateName.trim();
    if (!name) return;
    setTemplates((prev) => [...prev, { id: uid("tpl"), name, items, collectionLayout }]);
    setTemplateDialogOpen(false);
    toast.success("Template saved");
  }

  async function copyAll() {
    if (!items.length) return;
    if (
      await copyText(
        collectionHtml(items, collectionLayout, theme, customBlocks, savedFragments, true),
      )
    ) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1400);
    }
  }

  function editTemplate(id: string) {
    const t = templates.find((x) => `tpl:${x.id}` === id);
    if (!t) return;
    setItems(
      appendItems(
        [],
        t.items.map((i) => ({ ...i, uid: uid(i.snippetId) })),
      ),
    );
    setEditingTemplateId(t.id);
    setCollectionLayout(
      normalizeCollectionLayout(
        t.collectionLayout,
        t.items.map((item) => item.uid),
      ),
    );
    switchView("builder");
  }

  function findCustom(id: string) {
    return customBlocks.find((b) => `${CUSTOM_PREFIX}${b.id}` === id);
  }

  function openLayoutEditor(item: BuilderItem) {
    const block = findCustom(item.snippetId);
    if (!block) return;
    setEditingBlock(block);
    setEditingItemUid(item.uid);
    setBuilderOpen(true);
  }

  async function openProject() {
    const data = onOpenProject ? await onOpenProject() : await loadProjectFile();
    if (!data) return;
    applyState(data as Partial<Persisted>);
    toast.success("Project loaded");
  }

  async function saveProject() {
    if (onSaveProject) {
      await onSaveProject(snapshot);
      return;
    }
    const res = await saveProjectFile(snapshot);
    if (res === "saved") toast.success("Project saved");
  }

  const tab = (id: "builder" | "library", label: string, Icon: typeof Hammer) => (
    <button
      type="button"
      onClick={() => switchView(id)}
      aria-pressed={view === id}
      className={cn(
        "flex h-8 items-center gap-1.5 whitespace-nowrap px-3 text-sm font-medium first:rounded-l-sm last:rounded-r-sm",
        view === id
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon className="size-3.5" /> {label}
    </button>
  );

  return (
    <DndContext
      id="snippet-dnd"
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-background text-sm">
        <header className="shrink-0 border-b border-border bg-background">
          <div className="flex flex-wrap items-center gap-2 px-5 py-3">
            <div
              className="flex h-8 items-stretch divide-x divide-border overflow-hidden rounded-sm border border-border"
              role="group"
              aria-label="Workspace view"
            >
              {tab("builder", "Builder", Hammer)}
              {tab("library", "Library", Library)}
            </div>
            <button
              onClick={togglePreview}
              disabled={!items.length}
              className="inline-flex h-8 w-[104px] shrink-0 grow-0 items-center justify-center whitespace-nowrap rounded-sm border border-border px-2.5 text-center text-sm font-medium leading-none disabled:opacity-40"
            >
              {preview ? "Hide preview" : "Preview"}
            </button>
            {view === "builder" ? (
              <button
                type="button"
                onClick={saveTemplate}
                disabled={!items.length}
                className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-sm border border-border bg-background px-3 text-sm font-medium hover:bg-accent disabled:opacity-40"
              >
                <Save className="size-4" /> Save
              </button>
            ) : null}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[13px] text-muted-foreground">
                {items.length} block{items.length === 1 ? "" : "s"}
              </span>
              <button
                onClick={copyAll}
                disabled={!items.length}
                className="flex h-8 items-center gap-2 whitespace-nowrap rounded-sm border border-border px-3 text-sm font-medium hover:bg-accent disabled:opacity-40"
              >
                {copiedAll ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copiedAll ? "Copied" : "Copy all"}
              </button>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {panelOpen ? (
            <div className="w-[300px] shrink-0">
              <StudioPanel
                view={view}
                categories={categories}
                onCategory={scrollToCategory}
                categoryCounts={categoryCounts}
                activeCategory={activeCategory}
                theme={theme}
                onThemeChange={setTheme}
                onOpenProject={() => void openProject()}
                onSaveProject={() => void saveProject()}
                {...(onExportStandalone
                  ? { onExport: () => void onExportStandalone(snapshot) }
                  : {})}
                {...(openLabel ? { openLabel } : {})}
                {...(saveLabel ? { saveLabel } : {})}
                onTogglePanel={() => setPanelOpen(false)}
              />
            </div>
          ) : null}

          {!panelOpen ? (
            <div className="shrink-0 border-r border-border bg-card/40 px-2 py-4">
              <button
                type="button"
                onClick={() => setPanelOpen(true)}
                aria-label="Show left panel"
                title="Show panel"
                className="flex size-8 items-center justify-center rounded-sm border border-border bg-background hover:bg-accent"
              >
                <PanelLeftOpen className="size-4" />
              </button>
            </div>
          ) : null}

          <main
            ref={scrollRef}
            onScroll={handleMainScroll}
            className="min-w-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5"
          >
            {view === "builder" ? (
              <div className="collection-layout space-y-4">
                {builderOpen ? (
                  <ElementBuilder
                    variant="panel"
                    theme={theme}
                    {...(editingBlock ? { initial: editingBlock } : {})}
                    onClose={() => {
                      setBuilderOpen(false);
                      setInsertTarget(null);
                      setEditingBlock(null);
                      setEditingItemUid(null);
                    }}
                    onSave={(block) => {
                      const snippetId = `${CUSTOM_PREFIX}${block.id}`;
                      const existed = customBlocks.some((saved) => saved.id === block.id);
                      setCustomBlocks((prev) =>
                        existed
                          ? prev.map((saved) => (saved.id === block.id ? block : saved))
                          : [...prev, block],
                      );
                      if (!existed) {
                        setItems((prev) => {
                          const added = { uid: uid(snippetId), snippetId, ref: nextRef(prev) };
                          const target = insertTarget ?? {
                            row: collectionLayout.rows.length,
                            column: 0,
                            position: 0,
                          };
                          setCollectionLayout((layout) =>
                            insertCollectionItem(
                              layout,
                              added.uid,
                              target.row,
                              target.column,
                              target.position,
                            ),
                          );
                          return [...prev, added];
                        });
                      }
                      setBuilderOpen(false);
                      setInsertTarget(null);
                      setEditingBlock(null);
                      setEditingItemUid(null);
                    }}
                  />
                ) : null}
                <StackRows
                  items={items}
                  setItems={setItems}
                  layout={normalizeCollectionLayout(
                    collectionLayout,
                    items.map((item) => item.uid),
                  )}
                  setLayout={setCollectionLayout}
                  theme={theme}
                  customBlocks={customBlocks}
                  savedFragments={savedFragments}
                  onSaveBlock={(html, label) => {
                    setSavedFragments((prev) => [...prev, { id: uid("block"), name: label, html }]);
                    toast.success("Block saved to My blocks");
                  }}
                  collapseVersion={collapseVersion}
                  collapseTo={preview}
                  onEditBlock={openLayoutEditor}
                  activeId={activeDragId}
                  onInsertForColumn={(row, column) => {
                    setInsertTarget({ row, column, position: 0 });
                    setEditingItemUid(null);
                    setEditingBlock(null);
                    setBuilderOpen(false);
                    switchView("library");
                  }}
                  renderInsert={(row, column, position) => (
                    <div className="group flex items-center gap-2 py-0.5">
                      <span className="h-px flex-1 bg-border" />
                      <button
                        type="button"
                        onClick={() => {
                          setInsertTarget({ row, column, position });
                          setEditingItemUid(null);
                          setEditingBlock(null);
                          setBuilderOpen(false);
                          switchView("library");
                        }}
                        className="flex items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <Library className="size-3" /> Library
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInsertTarget({ row, column, position });
                          setEditingItemUid(null);
                          setEditingBlock(null);
                          setBuilderOpen(true);
                        }}
                        className="flex items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <Wand2 className="size-3" /> Build block
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="flex items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground"
                          >
                            <Menu className="size-3" /> Quick Add
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                          {[
                            { id: "section-heading", label: "Text" },
                            { id: "bullet-list", label: "List" },
                            { id: "step-stack", label: "Steps" },
                            { id: "stat-tiles", label: "KPI" },
                            { id: "drive-share", label: "Logos" },
                          ].map((option) => (
                            <DropdownMenuItem
                              key={option.id}
                              onSelect={() => addSnippet(option.id, { row, column, position })}
                            >
                              <Plus className="mr-2 size-3.5" />
                              {option.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                  )}
                />

                {preview && items.length ? (
                  <EditablePreview
                    html={collectionHtml(
                      items,
                      collectionLayout,
                      theme,
                      customBlocks,
                      savedFragments,
                      true,
                    )}
                  />
                ) : null}
              </div>
            ) : (
              <div className="space-y-8">
                {groupedVisible.map((group) => (
                  <section
                    key={group.name}
                    id={`category-${group.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="scroll-mt-4"
                  >
                    <h2 className="mb-3 border-b border-border pb-2 text-base font-semibold">
                      {group.name}
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {group.entries.map((e) => (
                        <SnippetCard
                          key={e.id}
                          id={e.id}
                          label={e.label}
                          html={
                            "template" in e
                              ? blockHtmlWithRefs(
                                  (templates.find((t) => `tpl:${t.id}` === e.id)?.items ??
                                    []) as BuilderItem[],
                                  theme,
                                  customBlocks,
                                  savedFragments,
                                )
                              : baseHtml(e.id, theme, undefined, customBlocks, savedFragments)
                          }
                          favorite={favorites.includes(e.id)}
                          onToggleFavorite={toggleFavorite}
                          onAdd={addSnippet}
                          {...("catalog" in e && e.catalog ? { catalog: e.catalog } : {})}
                          {...("template" in e
                            ? {
                                tag: "Saved",
                                onEdit: editTemplate,
                                onDelete: (id: string) =>
                                  setTemplates((prev) => prev.filter((t) => `tpl:${t.id}` !== id)),
                              }
                            : {})}
                          {...("fragment" in e
                            ? {
                                tag: "Step",
                                onDelete: (id: string) =>
                                  setSavedFragments((prev) =>
                                    prev.filter(
                                      (fragment) => `${FRAGMENT_PREFIX}${fragment.id}` !== id,
                                    ),
                                  ),
                              }
                            : {})}
                          {...("custom" in e
                            ? {
                                onDelete: (id: string) =>
                                  setCustomBlocks((prev) =>
                                    prev.filter((b) => `${CUSTOM_PREFIX}${b.id}` !== id),
                                  ),
                                onEdit: (id: string) => {
                                  const block = findCustom(id);
                                  if (block) {
                                    setEditingBlock(block);
                                    setEditingItemUid(null);
                                    const lastRow = Math.max(0, collectionLayout.rows.length - 1);
                                    const lastColumn = Math.max(
                                      0,
                                      (collectionLayout.rows[lastRow]?.columns.length ?? 1) - 1,
                                    );
                                    const position =
                                      collectionLayout.rows[lastRow]?.columns[lastColumn]?.length ??
                                      0;
                                    setInsertTarget({ row: lastRow, column: lastColumn, position });
                                    setBuilderOpen(true);
                                    switchView("builder");
                                  }
                                },
                                onDuplicate: (id: string) => {
                                  const block = findCustom(id);
                                  if (block)
                                    setCustomBlocks((prev) => [
                                      ...prev,
                                      {
                                        ...block,
                                        id: uid("blk"),
                                        label: `${block.label} copy`,
                                        parts: block.parts.map((p) => ({ ...p })),
                                      },
                                    ]);
                                },
                              }
                            : {})}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </main>
        </div>
        <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Save as template</DialogTitle>
              <DialogDescription>Save the current block stack to My blocks.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                createTemplate();
              }}
              className="space-y-4"
            >
              <label className="grid gap-1.5 text-sm font-medium">
                Template name
                <input
                  autoFocus
                  value={templateName}
                  onChange={(event) => setTemplateName(event.target.value)}
                  className="h-10 rounded-sm border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <DialogFooter>
                <DialogClose asChild>
                  <button type="button" className="h-10 rounded-sm border border-border px-4">
                    Cancel
                  </button>
                </DialogClose>
                <button
                  type="submit"
                  disabled={!templateName.trim()}
                  className="h-10 rounded-sm bg-primary px-4 font-medium text-primary-foreground disabled:opacity-40"
                >
                  <Plus className="mr-1 inline size-4" /> Save template
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <DragOverlay dropAnimation={null}>
          {activeDragItem ? (
            <div className="w-[300px] max-w-full rounded-sm border-2 border-primary bg-card p-2.5 shadow-2xl ring-2 ring-primary/20 pointer-events-none opacity-95">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
                  ::
                </span>
                <span className="truncate text-xs font-semibold text-foreground">
                  {activeDragItem.appearance?.title || activeDragItem.snippetId}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
