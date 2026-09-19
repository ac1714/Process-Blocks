import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { StudioApp } from "@/components/StudioApp";
import { downloadStandaloneHtml } from "@/lib/standalone-export";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Block Studio — Build Documents from Copy-Ready HTML Blocks" },
      {
        name: "description",
        content:
          "A block builder first: stack pre-built blocks and samples into a numbered document, edit any block, then copy clean HTML per block or export a standalone page.",
      },
      {
        property: "og:title",
        content: "Block Studio — Build Documents from Copy-Ready HTML Blocks",
      },
      {
        property: "og:description",
        content:
          "Insert pre-built blocks and samples, arrange them in a numbered stack, and copy clean HTML or export a self-saving page.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <StudioApp
      onExportStandalone={(state) => {
        downloadStandaloneHtml(state);
        toast.success("Self-saving HTML exported — open it from your desktop");
      }}
    />
  );
}
