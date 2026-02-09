<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-indigo-600">ShortLink</h1>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {{ user?.username?.charAt(0).toUpperCase() }}
              </div>
              <span class="hidden sm:block text-sm font-medium text-gray-700">{{ user?.username }}</span>
            </div>
            <button 
              @click="logout" 
              class="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Create Link Card -->
      <div class="bg-white overflow-hidden shadow sm:rounded-lg mb-8">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Create New Short Link</h3>
          <form @submit.prevent="createLink" class="mt-2 sm:flex sm:items-start gap-4">
            <div class="w-full sm:flex-1">
              <label for="url" class="sr-only">Long URL</label>
              <input 
                v-model="newLink.originalUrl" 
                type="url" 
                name="url" 
                id="url" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border" 
                placeholder="https://example.com/very/long/url/to/shorten" 
                required
              />
            </div>
            <div class="mt-4 sm:mt-0 w-full sm:w-48">
               <label for="code" class="sr-only">Custom Code</label>
               <input 
                 v-model="newLink.shortCode" 
                 type="text" 
                 name="code" 
                 id="code" 
                 class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border" 
                 placeholder="Custom Code" 
                 minlength="7"
                 maxlength="10"
               />
            </div>
            <button 
              type="submit" 
              :disabled="loading"
              class="mt-4 w-full sm:mt-0 sm:w-auto flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {{ loading ? 'Creating...' : 'Shorten' }}
            </button>
          </form>
          <div v-if="error" class="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ error }}
          </div>
        </div>
      </div>

      <!-- Stats or Empty State -->
      <div v-if="!links || links.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No links created</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new short link above.</p>
      </div>

      <!-- Links List -->
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="link in links" :key="link.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0 pr-4">
                <div class="flex items-center gap-3 mb-1">
                  <a :href="`/${link.shortCode}`" target="_blank" class="text-lg font-mono font-medium text-indigo-600 truncate hover:underline">
                    /{{ link.shortCode }}
                  </a>
                  <button 
                    @click="copyLink(link.shortCode)" 
                    class="text-gray-400 hover:text-gray-600 focus:outline-none"
                    title="Copy full URL"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z"></path></svg>
                  </button>
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="link.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ link.enabled ? 'Active' : 'Disabled' }}
                  </span>
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  <p class="truncate">{{ link.originalUrl }}</p>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  <span class="font-medium">{{ link.clicks }} clicks</span>
                </div>
                <div class="text-xs text-gray-400">
                  {{ new Date(link.createdAt).toLocaleDateString() }}
                </div>
                <div class="mt-1">
                   <button 
                    @click="toggleLink(link)"
                    class="text-xs font-medium text-indigo-600 hover:text-indigo-900"
                  >
                    {{ link.enabled ? 'Disable' : 'Enable' }}
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user, logout } = useAuth()
const config = useRuntimeConfig()

const loading = ref(false)
const error = ref('')
const newLink = reactive({
  originalUrl: '',
  shortCode: ''
})

// Fetch Links
const { data: links, refresh } = await useFetch('/api/links')

// Create Link
const createLink = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const payload: any = { originalUrl: newLink.originalUrl }
    if (newLink.shortCode) payload.shortCode = newLink.shortCode

    await $fetch('/api/links', {
      method: 'POST',
      body: payload
    })
    
    newLink.originalUrl = ''
    newLink.shortCode = ''
    refresh()
  } catch (e: any) {
    error.value = e.data?.statusMessage || 'Failed to create link'
  } finally {
    loading.value = false
  }
}

// Toggle Link
const toggleLink = async (link: any) => {
  try {
    await $fetch(`/api/links/${link.id}`, {
      method: 'PATCH',
      body: { enabled: !link.enabled }
    })
    refresh()
  } catch (e) {
    alert('Failed to update status')
  }
}

const copyLink = (code: string) => {
    // Check if we are in browser
    if (import.meta.client) {
        const url = `${window.location.origin}/${code}`
        navigator.clipboard.writeText(url).then(() => {
            // Optional: You could add a tiny "Copied!" tooltip state here
        })
    }
}
</script>
