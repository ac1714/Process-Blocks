import { useState } from "react";
import { Check, Copy, CopyPlus, Pencil, Plus, Star, Trash2 } from "lucide-react";

import { EditablePreview } from "@/components/EditablePreview";
import { copyText } from "@/lib/copy";
import { cn } from "@/lib/utils";

export function SnippetCard({
  id,
  label,
  html,
  favorite,
  tag,
  catalog,
  onToggleFavorite,
  onAdd,
  onDelete,
  onEdit,
  onDuplicate,
}: {
  id: string;
  label: string;
  html: string;
  favorite: boolean;
  tag?: string;
  /** Permanent library catalog number, e.g. L-07. */
  catalog?: string;
  onToggleFavorite: (id: string) => void;
  onAdd: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleCopy() {
    if (await copyText(html)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  }

  function handleAdd() {
    onAdd(id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  const iconBtn =
    "flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-background/95 shadow-sm hover:bg-accent";

  return (
    <div className="group bg-background">
      <div className="flex items-center gap-2 px-1 pb-1.5">
        {catalog ? (
          <span
            title={`Library block ${catalog}`}
            className="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground"
          >
            {catalog}
          </span>
        ) : null}
        {favorite ? (
          <Star className="size-3.5 shrink-0 fill-current text-muted-foreground" />
        ) : null}
        <span className="truncate text-sm font-medium">{label}</span>
        {tag ? (
          <span className="ml-auto shrink-0 rounded-sm border border-border px-1.5 py-0.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {tag}
          </span>
        ) : null}
      </div>

      <div className="relative p-3">
        <EditablePreview html={html} />

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            onClick={() => onToggleFavorite(id)}
            aria-label={favorite ? `Unstar ${label}` : `Star ${label}`}
            className={iconBtn}
          >
            <Star className={cn("size-3.5", favorite && "fill-current")} />
          </button>
          {onEdit ? (
            <button onClick={() => onEdit(id)} aria-label={`Edit ${label}`} className={iconBtn}>
              <Pencil className="size-3.5" />
            </button>
          ) : null}
          {onDuplicate ? (
            <button
              onClick={() => onDuplicate(id)}
              aria-label={`Duplicate ${label}`}
              className={iconBtn}
            >
              <CopyPlus className="size-3.5" />
            </button>
          ) : null}
          <button
            onClick={handleCopy}
            aria-label={`Copy ${label} HTML`}
            className="flex h-8 items-center gap-1.5 rounded-sm border border-border bg-background/95 px-2.5 text-sm font-medium shadow-sm hover:bg-accent"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleAdd}
            aria-label={`Add ${label} to the combined block`}
            className="flex h-8 items-center gap-1.5 rounded-sm border border-border bg-background/95 px-2.5 text-sm font-medium shadow-sm hover:bg-accent"
          >
            {added ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
            {added ? "Added" : "Add"}
          </button>
          {onDelete ? (
            <button onClick={() => onDelete(id)} aria-label={`Delete ${label}`} className={iconBtn}>
              <Trash2 className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
