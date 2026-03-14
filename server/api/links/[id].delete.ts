import { z } from 'zod'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const idStr = getRouterParam(event, 'id')
  const id = parseInt(idStr || '')
  
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  try {
    const deleted = await prisma.link.delete({
      where: { id }
    })
    return deleted
  } catch (e) {
    throw createError({ statusCode: 404, statusMessage: 'Link not found' })
  }
})
