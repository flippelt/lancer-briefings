import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
@@ -10,5 +15,5 @@ export default defineConfig({
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
