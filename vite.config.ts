import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import viteCompression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    viteCompression({
      algorithm: "brotliCompress",
    }),
    VitePWA({
      // Auto-update workflow: when a new deploy ships, the service worker
      // installs in the background and takes over on the next route change.
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "bullet.webp",
        "faction-logos/*.svg",
        "icons/*.svg",
        "startup.ogg",
        "planet.webm",
      ],
      manifest: {
        name: "UN | Central de Controle",
        short_name: "UN Briefing",
        description: "Lancer mission briefing dashboard",
        theme_color: "#991e2a",
        // background_color is the PWA splash-screen color, separate
        // from the icon. Keep it on-brand red so the splash matches
        // the icon and the loading state doesn't flash white.
        background_color: "#991e2a",
        display: "standalone",
        orientation: "any",
        start_url: "./",
        scope: "./",
        icons: [
          {
            src: "icons/pwa-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // Precache the build output. Large fonts (mdi webfont >1MB) are
        // included intentionally — the whole point is that the app keeps
        // working with the WiFi off mid-session.
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff,woff2,ttf,eot,ogg,webm,ico,json,md}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//, /^\/__/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Google Fonts CSS — versioned URL, cache-first is safe.
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts woff/woff2 files.
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // three.js loaded from cdnjs by index.html — needed for Vanta.
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "cdn-libs",
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Event thumbnails hosted on imgur (and similar external image hosts).
            urlPattern: ({ request }) => request.destination === "image",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "external-images",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        // Disabled by default — the service worker can confuse Vite's HMR
        // in development. Flip to `enabled: true` if you want to test the
        // PWA flow locally without running `npm run build && npm run preview`.
        enabled: false,
      },
    }),
  ],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: [
      "lancer-data",
      "lancer-ktb-data",
      "lancer-nrfaw-data",
      "lancer-longrim-data",
    ],
  },
  build: {
    sourcemap: true,
    cssCodeSplit: true,
    reportCompressedSize: true,
  },
  json: {
    namedExports: true,
  },
  css: {
    devSourcemap: true,
  },
});
