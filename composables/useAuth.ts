export const useUser = () => useState<{ username: string; discordId: string } | null>('user', () => null)

export const useAuth = () => {
    const user = useUser()

    const fetchUser = async () => {
        try {
            const { user: fetchedUser } = await $fetch('/api/auth/me')
            user.value = fetchedUser
        } catch (e) {
            user.value = null
        }
    }

    const login = () => {
        window.location.href = '/api/auth/discord/login'
    }

    const logout = async () => {
        await $fetch('/api/auth/logout', { method: 'POST' })
        user.value = null
        navigateTo('/login')
    }

    return {
        user,
        fetchUser,
        login,
        logout
    }
}
