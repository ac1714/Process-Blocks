import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { StudioApp } from "@/components/StudioApp";
import { downloadStandaloneHtml } from "@/lib/standalone-export";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Block Studio" },
      {
        name: "description",
        content: "Build documents from copy-ready HTML blocks with a numbered block stack.",
      },
      {
        property: "og:title",
        content: "Block Studio",
      },
      {
        property: "og:description",
        content: "Build documents from copy-ready HTML blocks with a numbered block stack.",
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
