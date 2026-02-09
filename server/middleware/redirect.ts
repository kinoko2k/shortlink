import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event)
  
  // Clean path (remove leading slash)
  const code = pathname.substring(1)

  // Skip for root, api routes, system routes, and known pages
  if (
      !code ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_nuxt') ||
      pathname.startsWith('/__nuxt') || // dev tools
      pathname.startsWith('/_ipx') || 
      pathname === '/admin' || 
      pathname.startsWith('/admin/') ||
      pathname === '/login' ||
      pathname === '/favicon.ico'
  ) {
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
