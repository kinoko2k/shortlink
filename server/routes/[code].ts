import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')

  if (!code) {
     throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const link = await prisma.link.findUnique({
    where: { shortCode: code }
  })

  if (!link || !link.enabled) {
    throw createError({ statusCode: 404, statusMessage: 'Link not found or disabled' })
  }

  // Increment clicks in background
  // Using event.waitUntil (Nitro feature) to not block response
  if (event.context.waitUntil) { // Type check for safety
      event.waitUntil(
         prisma.link.update({
             where: { id: link.id },
             data: { clicks: { increment: 1 } }
         })
      )
  } else {
      // Fallback if waitUntil not supported
      await prisma.link.update({
             where: { id: link.id },
             data: { clicks: { increment: 1 } }
      }).catch(console.error)
  }

  return sendRedirect(event, link.originalUrl, 302)
})
