// Self-saving logic for the exported standalone HTML file.
//
// The exported file contains the whole studio inline, so "saving" means
// rewriting the very file the browser opened: we take the current document,
// swap the embedded state JSON, and write it back through the File System
// Access API. When that API isn't available (Safari, Firefox, or the served
// Lovable preview) we fall back to downloading an updated copy.

/* eslint-disable @typescript-eslint/no-explicit-any */

export const STATE_TAG_ID = "block-studio-state";
export const ROOT_ID = "root";

const w = (): any => (typeof window === "undefined" ? {} : window);

let handle: any = null;

export function readEmbeddedState<T>(): T | null {
  if (typeof document === "undefined") return null;
  const tag = document.getElementById(STATE_TAG_ID);
  if (!tag?.textContent) return null;
  try {
    return JSON.parse(tag.textContent) as T;
  } catch {
    return null;
  }
}

/** Current filename, used as the suggested name on first save. */
export function currentFileName(): string {
  try {
    const last = decodeURIComponent(location.pathname.split("/").pop() ?? "");
    if (last && last.toLowerCase().endsWith(".html")) return last;
  } catch {
    /* ignore */
  }
  return "block-studio.html";
}

/** Serialize the live document with the given state embedded. */
export function serializeSelf(state: unknown): string {
  const clone = document.documentElement.cloneNode(true) as HTMLElement;

  const tag = clone.querySelector(`#${STATE_TAG_ID}`);
  if (tag) tag.textContent = JSON.stringify(state);

  // Drop the rendered markup — the runtime rebuilds it from the state on load.
  const root = clone.querySelector(`#${ROOT_ID}`);
  if (root) root.innerHTML = "";

  return `<!doctype html>\n${clone.outerHTML}`;
}

export function download(html: string, name: string) {
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function saveToSelf(state: unknown): Promise<"saved" | "downloaded" | "cancelled"> {
  const html = serializeSelf(state);
  const name = currentFileName();
  const win = w();

  if (typeof win.showSaveFilePicker !== "function") {
    download(html, name);
    return "downloaded";
  }

  try {
    if (!handle) {
      handle = await win.showSaveFilePicker({
        suggestedName: name,
        types: [{ description: "Block Studio file", accept: { "text/html": [".html"] } }],
      });
    }
    const writable = await handle.createWritable();
    await writable.write(html);
    await writable.close();
    return "saved";
  } catch {
    return "cancelled";
  }
}
