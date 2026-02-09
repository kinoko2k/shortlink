<template>
  <div class="p-8 max-w-6xl mx-auto">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">ShortLink Admin</h1>
      <div class="flex items-center gap-4">
        <span>{{ user?.username }}</span>
        <button @click="logout" class="text-sm text-red-600 hover:underline">Logout</button>
      </div>
    </header>

    <!-- Create Form -->
    <div class="bg-white p-6 rounded shadow mb-8 border">
      <h2 class="text-xl font-semibold mb-4">Create New Link</h2>
      <form @submit.prevent="createLink" class="flex flex-col gap-4 md:flex-row">
        <input 
          v-model="newLink.originalUrl" 
          type="url" 
          placeholder="https://example.com/long-url" 
          required
          class="flex-1 p-2 border rounded"
        />
        <input 
          v-model="newLink.shortCode" 
          type="text" 
          placeholder="Custom Code (Optional)" 
          class="w-48 p-2 border rounded"
          minlength="7"
          maxlength="10"
        />
        <button 
          type="submit" 
          :disabled="loading"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Creating...' : 'Shorten' }}
        </button>
      </form>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </div>

    <!-- Links Table -->
    <div class="overflow-x-auto bg-white rounded shadow border">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-4 border-b">Short URL</th>
            <th class="p-4 border-b">Original URL</th>
            <th class="p-4 border-b">Clicks</th>
            <th class="p-4 border-b">Created</th>
            <th class="p-4 border-b">Status</th>
            <th class="p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="link in links" :key="link.id" class="hover:bg-gray-50">
            <td class="p-4 border-b font-mono text-blue-600">
              <a :href="`/${link.shortCode}`" target="_blank" class="hover:underline">
                /{{ link.shortCode }}
              </a>
            </td>
            <td class="p-4 border-b max-w-xs truncate" :title="link.originalUrl">
              {{ link.originalUrl }}
            </td>
            <td class="p-4 border-b">{{ link.clicks }}</td>
            <td class="p-4 border-b text-sm text-gray-500">
              {{ new Date(link.createdAt).toLocaleDateString() }}
            </td>
            <td class="p-4 border-b">
              <button 
                @click="toggleLink(link)"
                class="px-3 py-1 rounded text-sm font-medium"
                :class="link.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ link.enabled ? 'Active' : 'Disabled' }}
              </button>
            </td>
            <td class="p-4 border-b">
               <button @click="copyLink(link.shortCode)" class="text-gray-500 hover:text-gray-700 text-sm">
                 Copy
               </button>
            </td>
          </tr>
          <tr v-if="links?.length === 0">
            <td colspan="6" class="p-8 text-center text-gray-500">No links created yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
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
    const url = `${window.location.origin}/${code}`
    navigator.clipboard.writeText(url)
    // could show toast here
}
</script>

<style scoped>
/* Simple CSS reset/utility if Tailwind is missing */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
