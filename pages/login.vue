<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md text-center max-w-sm w-full">
      <h1 class="text-2xl font-bold mb-6">ShortLink Login</h1>
      <p class="mb-6 text-gray-600">Access Restricted to Administrator</p>
      
      <button 
        @click="login"
        class="bg-[#5865F2] text-white px-6 py-2 rounded hover:bg-[#4752C4] transition-colors w-full flex items-center justify-center gap-2"
      >
        <span>Login with Discord</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login, user } = useAuth()

// If already logged in, go to admin
watchEffect(() => {
    if (user.value) {
        navigateTo('/admin')
    }
})
</script>
