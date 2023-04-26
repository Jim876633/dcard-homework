import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { styleTsconfigPaths } from 'vite-plugin-style-tsconfig-paths';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), styleTsconfigPaths()],
  server: {
    proxy: {
      '/githubOauth': 'https://jim-issues-tracker-server.netlify.app/',
    },
  },
});
