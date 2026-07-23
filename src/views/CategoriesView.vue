<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Catégories</h1>
      <div v-if="loading" class="text-center py-12 text-gray-400">{{ $t('common.loading') }}</div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <RouterLink
          v-for="cat in categories"
          :key="cat.id"
          :to="`/books?category_id=${cat.id}`"
          class="card flex flex-col items-center p-5 hover:shadow-md transition-shadow cursor-pointer"
        >
          <span class="text-3xl mb-2">{{ cat.icon }}</span>
          <span class="font-medium text-center text-sm">{{ cat.name }}</span>
          <span class="text-xs text-gray-400 mt-1">{{ cat.books_count }} livres</span>
        </RouterLink>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { categoryService } from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
const { t } = useI18n()

const categories = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await categoryService.list()
    categories.value = data.data
  } finally {
    loading.value = false
  }
})
</script>
