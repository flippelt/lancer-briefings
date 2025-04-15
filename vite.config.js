import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'src/main.js',
      },
      external: [],
    },
    outDir: 'dist',
    assetsDir: '.',
    chunkFileNames: 'assets/[name]-[hash].js',
  },
});
