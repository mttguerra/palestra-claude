import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 8080,
    host: true,
    open: false,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.js'],
  },
});
