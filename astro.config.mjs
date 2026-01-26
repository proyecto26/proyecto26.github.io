import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    })
  ],
  site: 'https://proyecto26.com',
  output: 'static',
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      cssMinify: true,
    }
  }
});
