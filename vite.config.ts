import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/quick-memo-app/', // Add this line for GitHub Pages
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'], // Precache these assets
        // No specific runtimeCaching needed for a simple localStorage-based app initially
      },
      manifest: {
        name: 'Quick Memo App',
        short_name: 'QuickMemo',
        description: 'A fast PWA memo app for instant note-taking.',
        theme_color: '#242424', // You can customize this
        background_color: '#ffffff', // You can customize this
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', // Create this in /public
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // Create this in /public
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // Maskable icon, create this in /public
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable PWA in development for testing
        type: 'module',
      }
    }),
  ],
})
