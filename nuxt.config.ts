// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-02-09',
  devtools: { enabled: true },
  nitro: {
    port: 3006,
    moduleSideEffects: ['prisma/client'] 
  },
  devServer: {
    port: 3006,
    host: '0.0.0.0'
  },
  routeRules: {
    '/': { redirect: '/admin' }
  },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    // Private keys are only available on the server
    discordClientId: process.env.DISCORD_CLIENT_ID,
    discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
    allowedDiscordId: process.env.ALLOWED_DISCORD_ID,
    jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key',
    appUrl: process.env.APP_URL || 'http://localhost:3006',
    
    // Public keys that are exposed to the client
    public: {
      appUrl: process.env.APP_URL || 'http://localhost:3006',
    }
  },
  typescript: {
    strict: true
  }
})
