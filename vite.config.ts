import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    plugins: [react()],
    define: {
      __DEV__: !isProd,
    },
    build: {
      minify: isProd,
      sourcemap: !isProd,
    },
  }
})
