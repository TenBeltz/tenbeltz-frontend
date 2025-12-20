// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import svgr from '@svgr/rollup';
import node from '@astrojs/node';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false
  },
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  site: 'https://tenbeltz.com/',
  vite: {
    plugins: [
      tailwindcss(),
      svgr(),
    ]
  }
});
