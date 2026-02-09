import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return links
})
