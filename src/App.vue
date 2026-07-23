<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { RouterView } from 'vue-router'

const auth = useAuthStore()

onMounted(async () => {
  if (auth.token) {
    try { await auth.fetchMe() } catch {}
  }
})
</script>
