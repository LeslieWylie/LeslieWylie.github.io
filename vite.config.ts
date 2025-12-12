import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
    // CRITICAL FIX: Vite does not polyfill process.env by default.
    // This defines 'process.env' so your code accessing process.env.API_KEY works in the browser.
    define: {
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY)
      }
    }
  };
});