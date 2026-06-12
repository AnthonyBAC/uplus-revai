import { defineConfig } from 'vitest/config'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'app-frontend',
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: { modules: { classNameStrategy: 'non-scoped' } },
    server: { deps: { inline: ['react', 'react-dom'] } },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@uplus/db': path.resolve(__dirname, '../packages/db/src'),
      '@uplus/auth': path.resolve(__dirname, '../packages/auth/src'),
    },
  },
})
