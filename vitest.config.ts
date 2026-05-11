import { defineConfig } from 'vitest/config';
import path from 'path';

const service = (name: string) => ({
  test: {
    name,
    include: [`${name}/src/**/*.test.ts`],
    environment: 'node' as const,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, name, 'src'),
      '@service': path.resolve(__dirname, name, 'src'),
      '@root': path.resolve(__dirname),
    },
  },
});

export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      service('app-auth'),
      service('app-surveys-service'),
      service('app-review-service'),
      service('app-report-service'),
      service('app-analysis-service'),
      service('app-frontend'),
    ],
  },
});
