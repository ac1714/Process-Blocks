// Local-first project save/load via the File System Access API.
// The full studio state is serialized to a JSON file the user picks on disk.
// No backend, no database — the file IS the project.

/* eslint-disable @typescript-eslint/no-explicit-any */

export type ProjectState = {
  theme?: Record<string, unknown>;
  items?: unknown[];
  collectionLayout?: Record<string, unknown>;
  favorites?: string[];
  customBlocks?: unknown[];
  savedFragments?: unknown[];
  templates?: unknown[];
  panelOpen?: boolean;
  trayOpen?: boolean;
};

// Cached handle for the currently-loaded project file. Once set, "Save
// changes" overwrites that same file without re-prompting for a location.
let handle: any = null;

const w = (): any => (typeof window === "undefined" ? {} : window);

export function isFsAccessSupported(): boolean {
  return typeof window !== "undefined" && typeof (window as any).showOpenFilePicker === "function";
}

/** Parse project content from raw JSON or an exported standalone HTML file. */
export function parseProjectContent(text: string): ProjectState | null {
  const trimmed = text.trim();
  if (
    trimmed.startsWith("<!doctype html>") ||
    trimmed.startsWith("<html") ||
    trimmed.includes("block-studio-state")
  ) {
    // Check for embedded state in an exported HTML file
    const match = trimmed.match(
      /<script[^>]*id=["']block-studio-state["'][^>]*>([\s\S]*?)<\/script>/i,
    );
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]) as ProjectState;
      } catch {
        /* continue to standard parse */
      }
    }
  }
  try {
    return JSON.parse(trimmed) as ProjectState;
  } catch {
    return null;
  }
}

/** Open a picker and load a project JSON or standalone HTML file, caching its handle. */
export async function loadProjectFile(): Promise<ProjectState | null> {
  const win = w();
  if (typeof win.showOpenFilePicker === "function") {
    try {
      const [h] = await win.showOpenFilePicker({
        types: [
          {
            description: "Block Studio project or HTML",
            accept: {
              "application/json": [".json"],
              "text/html": [".html", ".htm"],
            },
          },
        ],
      });
      handle = h;
      const file = await h.getFile();
      const text = await file.text();
      return parseProjectContent(text);
    } catch {
      // Picker cancelled or permission denied
      return null;
    }
  }

  // Universal browser fallback using file input (works in Firefox, Safari, iOS, iframes)
  if (typeof document === "undefined") return null;
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.html,.htm";
    input.style.display = "none";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      try {
        const text = await file.text();
        resolve(parseProjectContent(text));
      } catch {
        resolve(null);
      } finally {
        input.remove();
      }
    };
    input.oncancel = () => {
      resolve(null);
      input.remove();
    };
    document.body.appendChild(input);
    input.click();
  });
}

/**
 * Save the current state to disk. If a file was previously loaded (or saved),
 * overwrite it in place; otherwise prompt for a save location or download.
 */
export async function saveProjectFile(
  state: ProjectState,
): Promise<"saved" | "cancelled" | "unsupported"> {
  const win = w();
  const json = JSON.stringify(state, null, 2);

  if (typeof win.showSaveFilePicker !== "function") {
    // Fallback download if File System Access API isn't available
    if (typeof document !== "undefined") {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "block-studio-project.json";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return "saved";
    }
    return "unsupported";
  }

  try {
    if (!handle) {
      handle = await win.showSaveFilePicker({
        suggestedName: "block-studio-project.json",
        types: [{ description: "Block Studio project", accept: { "application/json": [".json"] } }],
      });
    }
    const writable = await handle.createWritable();
    await writable.write(json);
    await writable.close();
    return "saved";
  } catch {
    return "cancelled";
  }
}
