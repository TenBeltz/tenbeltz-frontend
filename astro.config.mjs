// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svgr from '@svgr/rollup';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false
  },
  integrations: [tailwind(), react()],
  site: 'https://tenbeltz.com/',
  vite: {
    plugins: [
      svgr(),
    ]
  }
});