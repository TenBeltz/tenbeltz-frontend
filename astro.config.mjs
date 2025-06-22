// @ts-check
import { defineConfig } from 'astro/config';
import svgr from '@svgr/rollup';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false
  },
  integrations: [
    react(),
    tailwind()
  ],
  site: 'https://tenbeltz.com/',
  vite: {
    plugins: [svgr()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
          }
        }
      }
    }
  }
});