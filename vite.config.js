import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        whyUs: resolve(__dirname, 'why-us.html'),
        privacyPolicy: resolve(__dirname, 'privacy-policy.html'),
        termsConditions: resolve(__dirname, 'terms-conditions.html'),
      },
    },
  },
});
