import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { build } from "vite";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outDir = resolve(root, ".standalone-build");
const generated = resolve(root, "src/generated");

await rm(outDir, { recursive: true, force: true });
await mkdir(generated, { recursive: true });

await build({
  root,
  configFile: false,
  mode: "production",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": resolve(root, "src") } },
  // The export runs from a file:// page with no bundler and no Node globals,
  // so every build-time environment reference must be inlined here.
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": "{}",
    "process.platform": JSON.stringify("browser"),
    "process.version": JSON.stringify(""),
    global: "globalThis",
  },
  build: {
    outDir,
    emptyOutDir: true,
    cssCodeSplit: false,
    // esbuild isn't installed in this toolchain; the payload is inlined anyway.
    minify: false,
    lib: {
      entry: resolve(root, "src/standalone/main.tsx"),
      formats: ["es"],
      fileName: () => "standalone.js",
    },
  },
});

const js = await readFile(resolve(outDir, "standalone.js"), "utf8");
const cssFile = (await readdir(outDir)).find((file) => file.endsWith(".css"));
if (!cssFile) throw new Error("Standalone build did not emit CSS");
const css = await readFile(resolve(outDir, cssFile), "utf8");
await writeFile(resolve(generated, "standalone.js.txt"), js);
await writeFile(resolve(generated, "standalone.css.txt"), css);
await rm(outDir, { recursive: true, force: true });
