// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [],
  runtimeConfig: {
    // Private keys are only available on the server
    discordClientId: process.env.DISCORD_CLIENT_ID,
    discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
    allowedDiscordId: process.env.ALLOWED_DISCORD_ID,
    jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key',
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    
    // Public keys that are exposed to the client
    public: {
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    }
  },
  typescript: {
    strict: true
  }
})
