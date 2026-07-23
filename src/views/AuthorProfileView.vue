<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-12 text-gray-400">Chargement...</div>
      <div v-else-if="books.length >= 0">
        <div class="card flex items-center gap-4 mb-8">
          <img :src="authorAvatar" class="w-16 h-16 rounded-full object-cover" />
          <div>
            <h1 class="text-xl font-bold">{{ authorName }}</h1>
            <p class="text-sm text-gray-500">{{ books.length }} livre(s) publié(s)</p>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <RouterLink v-for="book in books" :key="book.id" :to="`/books/${book.id}`">
            <BookCard :book="book" />
          </RouterLink>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { bookService } from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import BookCard from '@/components/book/BookCard.vue'

const route = useRoute()
const books = ref([])
const loading = ref(true)
const authorName = ref('')
const authorAvatar = ref('')

onMounted(async () => {
  try {
    const { data } = await bookService.byAuthor(route.params.id)
    books.value = data.data.data
    if (books.value.length > 0 && books.value[0].author) {
      authorName.value   = books.value[0].author.name
      authorAvatar.value = books.value[0].author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName.value)}&background=EFF6FF&color=2563EB`
    }
  } finally {
    loading.value = false
  }
})
</script>
