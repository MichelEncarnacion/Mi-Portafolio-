// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://michel-encarnacion.dev",
  output: "server",
  adapter: vercel(),
  integrations: [react(), sitemap()],
  vite: {
    ssr: {
      noExternal: ["@vercel/og"],
    },
  },
});
