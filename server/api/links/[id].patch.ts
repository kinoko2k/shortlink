import { z } from 'zod'
import prisma from '~/server/utils/prisma'

const updateLinkSchema = z.object({
  enabled: z.boolean().optional()
})

export default defineEventHandler(async (event) => {
  const idStr = getRouterParam(event, 'id')
  const id = parseInt(idStr || '')
  
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody(event)
  const validation = updateLinkSchema.safeParse(body)
  
  if (!validation.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  try {
    const updated = await prisma.link.update({
      where: { id },
      data: validation.data
    })
    return updated
  } catch (e) {
    throw createError({ statusCode: 404, statusMessage: 'Link not found' })
  }
})
