import { defineConfig } from 'vitest/config';
import path from 'path';

const globalAlias = {
  '@global': path.resolve(__dirname, 'lib'),
};

const service = (name: string) => ({
  test: {
    name,
    include: [`${name}/src/**/*.test.ts`],
    environment: 'node' as const,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, name, 'src'),
      ...globalAlias,
    },
  },
});

export default defineConfig({
  test: {
    projects: [
      service('app-auth'),
      service('app-surveys-service'),
      service('app-review-service'),
      service('app-report-service'),
      service('app-analysis-service'),
    ],
  },
});
