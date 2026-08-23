import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` is driven by VITE_SITE_BASE so the site works from a GitHub Pages
// subpath (e.g. https://user.github.io/portfolio/) as well as from root.
export default defineConfig({
  base: process.env.VITE_SITE_BASE || '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
  },
});