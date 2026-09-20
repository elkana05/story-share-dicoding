import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const basePath = isProd ? '/story-share-dicoding/' : '/';

  return {
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'src', 'public'),
    base: basePath,
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
    resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: '.',
      filename: 'sw.js',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        name: 'StoryShare - Dicoding',
        short_name: 'StoryShare',
        description: 'Berbagi cerita dan momen terbaik Anda dengan dunia melalui StoryShare',
        theme_color: '#4F46E5',
        background_color: '#F3F4F6',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: basePath,
        start_url: basePath,
        lang: 'id',
        categories: ['social', 'news'],
        icons: [
          {
            src: `${basePath}icons/icon-144.png`,
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: `${basePath}icons/icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: `${basePath}icons/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        screenshots: [
          {
            src: `${basePath}screenshots/app_screenshot_1789821132035.jpg`,
            sizes: '1366x768',
            type: 'image/jpeg',
            form_factor: 'wide',
            label: 'StoryShare Home - Explore Stories',
          },
        ],
        shortcuts: [
          {
            name: 'Add Story',
            short_name: 'Add',
            description: 'Tambah cerita baru',
            url: `${basePath}#/add-story`,
            icons: [{ src: `${basePath}icons/icon-192.png`, sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Saved Stories',
            short_name: 'Saved',
            description: 'Lihat cerita tersimpan',
            url: `${basePath}#/saved-stories`,
            icons: [{ src: `${basePath}icons/icon-192.png`, sizes: '192x192', type: 'image/png' }],
          },
        ],
      },
    }),
  ],
  };
});
