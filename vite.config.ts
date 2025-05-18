/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [react(), tsconfigPaths()],
    define: { __DEV__: !isProd },
    build: { minify: isProd, sourcemap: !isProd },
    test: {
      globals: true,
      environment: 'jsdom',
      mockReset: true,
      setupFiles: './vitest.setup.ts',
      include: ['src/**/*.test.tsx'],
      coverage: {
        reporter: ['text', 'html'],
        reportsDirectory: './coverage',
      },
    },
  };
});
