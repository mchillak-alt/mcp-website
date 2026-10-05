import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        original: fileURLToPath(
          new URL("./original/index.html", import.meta.url),
        ),
        comparison: fileURLToPath(
          new URL("./compare/index.html", import.meta.url),
        ),
        savedHome: fileURLToPath(
          new URL(
            "./history/2026-09-17-before-reversion/index.html",
            import.meta.url,
          ),
        ),
        savedTinyChain: fileURLToPath(
          new URL(
            "./history/2026-09-17-before-reversion/tinychain/index.html",
            import.meta.url,
          ),
        ),
        savedOriginal: fileURLToPath(
          new URL(
            "./history/2026-09-17-before-reversion/original/index.html",
            import.meta.url,
          ),
        ),
        savedComparison: fileURLToPath(
          new URL(
            "./history/2026-09-17-before-reversion/compare/index.html",
            import.meta.url,
          ),
        ),
      },
    },
  },
});
