export const useUser = () => useState<{ username: string; discordId: string } | null>('user', () => null)

export const useAuth = () => {
    const user = useUser()

    const fetchUser = async () => {
        try {
            const data = await $fetch<{ user: { username: string; discordId: string } | null }>('/api/auth/me')
            user.value = data.user
        } catch (e) {
            console.error('Failed to fetch user:', e)
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
