import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

const COOKIE_NAME = 'auth_token'

interface UserPayload {
  discordId: string
  username: string
}

export const signUserToken = (payload: UserPayload) => {
  const config = useRuntimeConfig()
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' })
}

export const verifyUserToken = (token: string): UserPayload | null => {
  const config = useRuntimeConfig()
  try {
    return jwt.verify(token, config.jwtSecret) as UserPayload
  } catch (e) {
    return null
  }
}

export const setUserSession = (event: H3Event, payload: UserPayload) => {
  const token = signUserToken(payload)
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

export const getUserSession = (event: H3Event): UserPayload | null => {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return null
  return verifyUserToken(token)
}

export const clearUserSession = (event: H3Event) => {
  deleteCookie(event, COOKIE_NAME)
}
