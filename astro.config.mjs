import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://joshapproved.com',
  output: 'static',

  build: {
    format: 'directory',
  },

  adapter: cloudflare()
});