// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import svgr from '@svgr/rollup';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

const SITE_ORIGIN = 'https://tenbeltz.com';

import { localizedPath } from './src/i18n/routes.js';

// Pages that render `<meta name="robots" content="noindex">` must never be listed in the sitemap:
// doing so tells Google to index and not index the same URL. Entries are locale-stripped, so one
// line covers both `/404` and `/en/404`. Add any future noindex page here — this list cannot be
// derived automatically, because the integration only ever sees URLs, never the rendered markup.
const NOINDEX_PATHS = new Set(['/404', '/500']);

// Locale-stripped pathname: 'https://tenbeltz.com/en/casos/' -> '/casos', either home -> ''.
const localePath = (/** @type {string} */ url) => {
  const path = new URL(url).pathname.replace(/\/$/, ''); // '/' -> '', '/en/casos/' -> '/en/casos'
  const isEnglish = path === '/en' || path.startsWith('/en/');
  return isEnglish ? path.slice('/en'.length) : path;
};

// The sitemap integration's own `i18n` option can only pair URLs that share a path once `/en/`
// is stripped, so it silently produced zero alternates for the translated slugs above. We build
// the whole `links` array by hand instead, using the same hreflang values as SEO.astro (`es`,
// `en`, `x-default`) so the sitemap and the HTML annotations agree.
/** @returns {{ lang: string, url: string }[]} */
const alternatesFor = (/** @type {string} */ url) => {
  const pathname = new URL(url).pathname;
  const esUrl = `${SITE_ORIGIN}${localizedPath(pathname, 'es')}`;
  const enUrl = `${SITE_ORIGIN}${localizedPath(pathname, 'en')}`;
  return [
    { lang: 'es', url: esUrl },
    { lang: 'en', url: enUrl },
    { lang: 'x-default', url: esUrl },
  ];
};

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
      // No `i18n` option on purpose: `alternatesFor` below replaces the links it would generate.
      // Careful — that option did double duty. It also seeded the integration's built-in
      // status-page filter (`isStatusCodePage(Object.keys(opts.i18n?.locales ?? {}))`), which is
      // how `/en/404` stayed out of the sitemap. Without it that filter only knows the unprefixed
      // `/404` and `/500`, so the `filter` below now owns the exclusion for both locales.
      filter: (/** @type {string} */ page) => !NOINDEX_PATHS.has(localePath(page)),
      // Canonicals are emitted without a trailing slash (see SEO.astro). The sitemap must
      // declare the exact same URLs or Google discards them as non-canonical. Root keeps its slash.
      serialize(item) {
        const stripSlash = (/** @type {string} */ url) =>
          url.replace(/(https?:\/\/[^/]+\/.+)\/$/, '$1');
        item.url = stripSlash(item.url);
        item.links = alternatesFor(item.url);
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
  // Canonicals never carry a trailing slash, so `/services/` must not also serve a 200.
  trailingSlash: 'never',
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
