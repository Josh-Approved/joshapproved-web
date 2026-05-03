import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://joshapproved.com',
  output: 'static',
  build: {
    format: 'directory',
  },
});
