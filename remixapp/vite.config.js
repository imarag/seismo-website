import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import path from 'path';
import mdx from '@mdx-js/rollup'; // MDX plugin

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app/'), 
    },
  },
  plugins: [
    mdx(), 
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
  ],
});
