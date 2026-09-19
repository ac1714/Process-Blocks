// Builds the exported single-file version of the studio.
//
// The generated files under src/generated are produced by
// `bun run build:standalone` (scripts/build-standalone.mjs): one compiled CSS
// sheet and one bundled JS runtime, both inlined so the export has zero
// external requests apart from the optional web fonts.

import css from "@/generated/standalone.css.txt?raw";
import js from "@/generated/standalone.js.txt?raw";
import { ROOT_ID, STATE_TAG_ID } from "@/standalone/self-save";

const FONTS =
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Quicksand:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap";

/** Keep `</script>` inside embedded payloads from closing the tag early. */
function safe(text: string) {
  return text.replace(/<\/script/gi, "<\\/script");
}

export function buildStandaloneHtml(state: unknown): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Block Studio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link rel="stylesheet" href="${FONTS}" />
    <style>${css}</style>
  </head>
  <body>
    <div id="${ROOT_ID}"></div>
    <script type="application/json" id="${STATE_TAG_ID}">${safe(JSON.stringify(state))}</script>
    <script type="module">${safe(js)}</script>
  </body>
</html>
`;
}

export function downloadStandaloneHtml(state: unknown, name = "block-studio.html") {
  const html = buildStandaloneHtml(state);
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
