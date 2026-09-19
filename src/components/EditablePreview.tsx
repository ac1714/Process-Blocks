import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { elementPath, isEditableText, structuralTarget, type Op } from "@/lib/html-ops";

type Hover = {
  top: number;
  left: number;
  path: string;
} | null;

export function EditablePreview({
  html,
  editable = false,
  onOp,
  className,
}: {
  html: string;
  editable?: boolean;
  onOp?: (op: Op) => void;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const editingRef = useRef(false);
  const [hover, setHover] = useState<Hover>(null);

  const record = useCallback((op: Op) => onOp?.(op), [onOp]);

  useEffect(() => {
    setHover(null);
  }, [html]);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (host && host.innerHTML !== html) host.innerHTML = html;
  }, [html]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !editable) return;
    const h: HTMLDivElement = host;

    function onClick(e: MouseEvent) {
      let target = e.target as Element | null;
      if (!target || !h.contains(target)) return;
      while (target && target !== h && !isEditableText(target)) target = target.parentElement;
      if (!target || target === h) return;
      if ((target as HTMLElement).isContentEditable) return;
      if (!isEditableText(target)) return;
      e.preventDefault();
      const el = target as HTMLElement;
      const path = elementPath(h, el);
      if (path === null) return;
      const key = el.dataset["editKey"] ?? `edit-${path.replaceAll(".", "-")}`;
      el.dataset["editKey"] = key;
      editingRef.current = true;
      el.contentEditable = "true";
      el.spellcheck = false;
      el.style.outline = "2px solid rgba(37,99,235,.55)";
      el.style.outlineOffset = "1px";
      el.focus();
      const before = el.textContent ?? "";
      const finish = () => {
        el.removeEventListener("blur", finish);
        el.contentEditable = "false";
        el.style.outline = "";
        el.style.outlineOffset = "";
        editingRef.current = false;
        const after = el.textContent ?? "";
        if (after !== before) record({ t: "text", p: path, v: after, key });
      };
      el.addEventListener("blur", finish);
    }

    function onKeyDown(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el?.isContentEditable && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        el.blur();
      }
      if (el?.isContentEditable && e.key === "Escape") el.blur();
    }

    function onOver(e: MouseEvent) {
      if (editingRef.current) return;
      const target = e.target as Element | null;
      if (!target || !h.contains(target)) return;
      const el = structuralTarget(h, target);
      if (!el || el === h) {
        setHover(null);
        return;
      }
      const path = elementPath(h, el);
      if (path === null) return;
      const hb = h.getBoundingClientRect();
      const rb = el.getBoundingClientRect();
      setHover({
        top: rb.top - hb.top + h.scrollTop,
        left: rb.right - hb.left - 4,
        path,
      });
    }

    h.addEventListener("click", onClick);
    h.addEventListener("keydown", onKeyDown);
    h.addEventListener("mouseover", onOver);
    const onLeave = () => setHover(null);
    h.addEventListener("mouseleave", onLeave);
    return () => {
      h.removeEventListener("click", onClick);
      h.removeEventListener("keydown", onKeyDown);
      h.removeEventListener("mouseover", onOver);
      h.removeEventListener("mouseleave", onLeave);
    };
  }, [editable, html, record]);

  return (
    <div className="relative">
      <div ref={hostRef} className={"overflow-x-auto " + (className ?? "")} />
      {editable && hover ? (
        <div
          className="absolute z-10 flex -translate-y-1/2 gap-1"
          style={{ top: hover.top + 10, left: Math.max(0, hover.left - 52) }}
        >
          <button
            type="button"
            title="Duplicate item"
            aria-label="Duplicate complete item"
            onClick={() => record({ t: "dup", p: hover.path })}
            className="rounded-sm border border-border bg-background/95 p-1 shadow-sm hover:bg-accent"
          >
            <Plus className="size-3" />
          </button>
          <button
            type="button"
            title="Remove item"
            aria-label="Remove complete item"
            onClick={() => record({ t: "del", p: hover.path })}
            className="rounded-sm border border-border bg-background/95 p-1 shadow-sm hover:bg-accent"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
