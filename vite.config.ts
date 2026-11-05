import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

// base './' + HashRouter: GitHub Pages alt klasöründe (kullanici.github.io/repo/) sorunsuz çalışır.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Yatırım Akademisi',
        short_name: 'Akademi',
        description: 'Kişisel yatırım eğitimi ve pratik',
        lang: 'tr',
        theme_color: '#0f1115',
        background_color: '#0f1115',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        // Veri JSON'ları: önce ağ, yoksa en son cache (çevrimdışı açılış)
        runtimeCaching: [{
          urlPattern: /\/data\/.*\.json$/,
          handler: 'NetworkFirst',
          options: { cacheName: 'veri', networkTimeoutSeconds: 6, expiration: { maxEntries: 20 } },
        }],
      },
    }),
  ],
  test: { environment: 'node', setupFiles: ['fake-indexeddb/auto'] },
})
