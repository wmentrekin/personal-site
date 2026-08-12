import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // TODO: update to the real domain once it's registered (Phase 5 of docs/roadmap-to-launch.md) --
  // the sitemap below generates absolute URLs from this value, so they'll be wrong until then.
  site: "https://example.com",
  integrations: [sitemap()]
});
