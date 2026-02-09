export default defineEventHandler((event) => {
  const user = getUserSession(event)
  return { user }
})
