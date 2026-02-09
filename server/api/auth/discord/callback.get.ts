export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const code = query.code as string

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Code is missing'
    })
  }

  try {
    // 1. Exchange code for token
    const tokenResponse = await $fetch<{ access_token: string }>('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: config.discordClientId,
        client_secret: config.discordClientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${config.appUrl}/api/auth/discord/callback`
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    const accessToken = tokenResponse.access_token

    // 2. Get User Info
    const user = await $fetch<{ id: string; username: string; discriminator: string }>('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    // 3. Check Allowed ID
    if (user.id !== config.allowedDiscordId) {
       throw createError({
        statusCode: 403,
        statusMessage: 'Non-compliant Discord ID: Access Denied'
      })
    }

    // 4. Set Session
    setUserSession(event, {
        discordId: user.id,
        username: user.username
    })

    return sendRedirect(event, '/admin')

  } catch (error: any) {
    console.error('Auth Error:', error)
    throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || 'Authentication Failed'
    })
  }
})
