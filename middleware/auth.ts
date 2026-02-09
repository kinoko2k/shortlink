export default defineNuxtRouteMiddleware(async (to, from) => {
    // Only run on client to avoid hydration mismatch and infinite loops on server
    if (import.meta.server) return

    const { user, fetchUser } = useAuth()
    
    if (!user.value) {
        await fetchUser()
    }

    if (!user.value) {
        return navigateTo('/login')
    }
})
