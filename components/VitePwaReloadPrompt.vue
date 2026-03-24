<template>
  <div
    v-if="offlineReady || needRefresh"
    class="fixed right-0 bottom-0 m-4 p-4 border rounded-md shadow-lg bg-white"
    role="alert"
  >
    <div class="flex items-start">
      <div class="ml-3">
        <p class="text-sm font-medium text-gray-900">
          <span v-if="offlineReady"> アプリがオフラインで動作する準備ができました </span>
          <span v-else> 新しいコンテンツが利用可能です。更新してください。 </span>
        </p>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            v-if="needRefresh"
            @click="updateServiceWorker()"
            class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            更新
          </button>
          <button
            @click="close"
            class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()

const close = () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>
