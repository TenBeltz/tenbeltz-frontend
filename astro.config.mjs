// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import svgr from '@svgr/rollup';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false
  },
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en-US',
        },
      },
      // Canonicals are emitted without a trailing slash (see SEO.astro). The sitemap must
      // declare the exact same URLs or Google discards them as non-canonical. Root keeps its slash.
      serialize(item) {
        const stripSlash = (/** @type {string} */ url) =>
          url.replace(/(https?:\/\/[^/]+\/.+)\/$/, '$1');
        item.url = stripSlash(item.url);
        if (item.links) {
          item.links = item.links.map((link) => ({ ...link, url: stripSlash(link.url) }));
        }
        return item;
      },
    }),
  ],
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  site: 'https://tenbeltz.com/',
  vite: {
    server: {
      allowedHosts: ['fatima-unvoracious-wanda.ngrok-free.dev'],
    },
    plugins: [
      tailwindcss(),
      svgr(),
    ]
  }
});
