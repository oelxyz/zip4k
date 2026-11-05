import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        en: 'index.html',
        id: 'id/index.html',
      },
    },
  },
});
