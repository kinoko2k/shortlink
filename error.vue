<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-800">404</h1>
      <p class="text-2xl font-light text-gray-600 mt-4">
        お探しのページは見つかりませんでした。
      </p>
      <p class="text-gray-500 mt-2">
        リンクが無効になっているか、削除された可能性があります。
      </p>
      <div class="mt-8">
        <NuxtLink
          to="/"
          class="px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
        >
          トップページへ戻る
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  error: Object
})
</script>
