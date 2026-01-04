// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: [
    "~/styles/base.scss",
    "~/styles/main.scss",
    "~/styles/title.scss",
    "~/styles/_button.scss",
  ],
  vite: {
    // AJOUT : Masquer les warnings de framer-motion
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) {
            return;
          }
          warn(warning);
        },
      },
    },
    optimizeDeps: {
      include: ['react-compiler-runtime', 'react', 'react-dom'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "~/styles/foundations/_functions.scss" as *; @use "~/styles/foundations/_variables.scss" as *; @use "~/styles/foundations/_mixins.scss" as *; ',
        },
      },
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxtjs/sanity",
  ],
  sanity: {
    projectId: "73k1zd4f",
    dataset: "production",
    apiVersion: "2024-01-01", // <--- AJOUT : Règle le warning de version d'API
    visualEditing: {
      token: process.env.NUXT_SANITY_API_TOKEN,
      studioUrl: process.env.NUXT_SANITY_STUDIO_URL,
      stega: false,
    },
  },
  runtimeConfig: {
    public: {
      // Rappel : Change http://localhost:4000 par l'URL Render si tu as déployé ton API
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost:4000",
    },
  },
});