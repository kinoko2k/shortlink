export default defineEventHandler((event) => {
  const { pathname } = getRequestURL(event)

  // Protect /api/links routes
  if (pathname.startsWith('/api/links')) {
    const user = getUserSession(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }
    // Attach user to context if needed, but getUserSession reads from cookie anyway.
    event.context.user = user
  }
})
