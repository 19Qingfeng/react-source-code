import { defineConfig } from 'vite';
import reactPlugins from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [reactPlugins()],
  resolve: {
    alias: {
      react: path.posix.resolve('src/react'),
      'react-dom': path.posix.resolve('src/react-dom'),
      'react-dom-bindings': path.posix.resolve('src/react-dom-bindings'),
      'react-reconciler': path.posix.resolve('src/react-reconciler'),
      scheduler: path.posix.resolve('src/scheduler'),
      shared: path.posix.resolve('src/shared'),
    },
  },
});
