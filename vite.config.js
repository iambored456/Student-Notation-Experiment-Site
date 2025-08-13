// vite.config.mjs
import { defineConfig } from 'vite';


export default defineConfig({
    base: '/Student-Notation-Experiment/',
    build: {
    outDir: 'docs',
    emptyOutDir: true
  },
  server: {
    open: true 
  }
});
