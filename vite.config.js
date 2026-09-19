import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'),
  base: '/story-share-dicoding/',
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
        scope: '/story-share-dicoding/',
        start_url: '/story-share-dicoding/',
        lang: 'id',
        categories: ['social', 'news'],
        icons: [
          {
            src: '/story-share-dicoding/icons/app_icon_512_1789821112827.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any',
          },
          {
            src: '/story-share-dicoding/icons/app_icon_512_1789821112827.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable',
          },
        ],
        screenshots: [
          {
            src: '/story-share-dicoding/screenshots/app_screenshot_1789821132035.jpg',
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
            url: '/story-share-dicoding/#/add-story',
            icons: [{ src: '/story-share-dicoding/icons/app_icon_512_1789821112827.jpg', sizes: '192x192' }],
          },
          {
            name: 'Saved Stories',
            short_name: 'Saved',
            description: 'Lihat cerita tersimpan',
            url: '/story-share-dicoding/#/saved-stories',
            icons: [{ src: '/story-share-dicoding/icons/app_icon_512_1789821112827.jpg', sizes: '192x192' }],
          },
        ],
      },
    }),
  ],
});
