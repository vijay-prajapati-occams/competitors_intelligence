import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/competitive-intelligence-test',
      JWT_ACCESS_SECRET: 'test-access-secret-please-ignore-0000000000',
      JWT_REFRESH_SECRET: 'test-refresh-secret-please-ignore-1111111111',
    },
  },
});
