import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event)
  
  // Clean path (remove leading slash)
  const code = pathname.substring(1)

  // Exclusion patterns
  const isExcluded = [
    /^\/api(\/|$)/,       // /api or /api/...
    /^\/_nuxt(\/|$)/,     // /_nuxt or /_nuxt/...
    /^\/__nuxt(\/|$)/,    // /__nuxt or /__nuxt/...
    /^\/_ipx(\/|$)/,      // /_ipx or /_ipx/...
    /^\/favicon\.ico$/,
    /^\/admin(\/|$)/,     // /admin or /admin/...
    /^\/login(\/|$)/      // /login or /login/...
  ].some(regex => regex.test(pathname))

  if (!code || isExcluded) {
    return
  }

  // Try to find link
  const link = await prisma.link.findUnique({
    where: { shortCode: code }
  })

  // If found and enabled, redirect
  if (link && link.enabled) {
    // Increment clicks in background
    if (event.context.waitUntil) {
        event.waitUntil(
            prisma.link.update({
                where: { id: link.id },
                data: { clicks: { increment: 1 } }
            })
        )
    } else {
        // Fallback
        prisma.link.update({
                where: { id: link.id },
                data: { clicks: { increment: 1 } }
        }).catch(console.error)
    }

    return sendRedirect(event, link.originalUrl, 302)
  }

  // If not found, do nothing (pass to Nuxt Pages to handle 404)
})
