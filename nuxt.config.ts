// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/styles/main.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "~/styles/foundations/_functions.scss" as *; @use "~/styles/foundations/_variables.scss" as *; @use "~/styles/foundations/_mixins.scss" as *; ',
        },
      },
    },
  },
  modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/test-utils"],
  runtimeConfig: {
    public: {
      apiUrl: "http://localhost:4000",
    },
  },
});
