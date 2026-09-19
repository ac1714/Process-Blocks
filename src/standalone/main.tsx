// Entry point for the exported standalone HTML file.
// Bundled into a single inline script — no imports at runtime, no server.

import { createRoot } from "react-dom/client";
import "@/styles.css";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { StudioApp } from "@/components/StudioApp";
import type { Persisted } from "@/lib/studio-state";
import {
  readEmbeddedState,
  saveToSelf,
  serializeSelf,
  download,
  currentFileName,
  ROOT_ID,
} from "./self-save";

function App() {
  const initial = readEmbeddedState<Partial<Persisted>>();

  return (
    <>
      <StudioApp
        {...(initial ? { initialState: initial } : {})}
        saveLabel="Save file"
        onSaveProject={async (state) => {
          const res = await saveToSelf(state);
          if (res === "saved") toast.success("Saved into this file");
          if (res === "downloaded")
            toast.success("Updated copy downloaded (this browser can't write files in place)");
        }}
        onExportStandalone={(state) => {
          const html = serializeSelf(state);
          download(html, currentFileName());
          toast.success("Standalone HTML exported");
        }}
      />
      <Toaster position="bottom-right" />
    </>
  );
}

const el = document.getElementById(ROOT_ID);
if (el) createRoot(el).render(<App />);
