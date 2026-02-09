import { z } from 'zod'
import { nanoid } from 'nanoid'
import prisma from '~/server/utils/prisma'

const createLinkSchema = z.object({
  originalUrl: z.string().url().refine((url) => {
    // Block javascript: and data: schemes
    return !/^(javascript:|data:|vbscript:)/i.test(url)
  }, {
    message: "Invalid URL scheme"
  }),
  shortCode: z.string().min(7).max(10).optional().refine((code) => {
      // If provided, ensure it uses safe characters
      if (!code) return true
      return /^[a-zA-Z0-9_-]+$/.test(code)
  }, {
      message: "Short code contains invalid characters"
  })
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validation = createLinkSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validation.error.message
    })
  }

  const { originalUrl, shortCode: providedShortCode } = validation.data

  let shortCode = providedShortCode

  // Generate if not provided
  if (!shortCode) {
    let unique = false
    let maxRetries = 5
    while (!unique && maxRetries > 0) {
      const candidate = nanoid(7) // 7 chars
      const existing = await prisma.link.findUnique({
        where: { shortCode: candidate }
      })
      if (!existing) {
        shortCode = candidate
        unique = true
      }
      maxRetries--
    }
    
    if (!unique) {
        throw createError({ statusCode: 500, statusMessage: "Failed to generate unique code" })
    }
  } else {
    // Check if provided code exists
    const existing = await prisma.link.findUnique({
        where: { shortCode }
    })
    if (existing) {
        throw createError({ statusCode: 409, statusMessage: "Short code already exists" })
    }
  }

  // Create
  const link = await prisma.link.create({
    data: {
      originalUrl,
      shortCode: shortCode! 
    }
  })

  return link
})
