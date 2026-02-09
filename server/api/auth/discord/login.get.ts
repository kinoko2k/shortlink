export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const { discordClientId, appUrl } = config
  
  const redirectUri = `${appUrl}/api/auth/discord/callback`
  const scope = 'identify'
  
  const params = new URLSearchParams({
    client_id: discordClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope
  })
  
  return sendRedirect(event, `https://discord.com/api/oauth2/authorize?${params.toString()}`)
})
