<!-- src/views/SearchView.vue -->
<template>
  <AppLayout>
    <!-- AWS page header -->
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-5xl mx-auto">
        <p class="text-xs text-[#545b64] mb-1">LireX › {{ $t('nav.search') }}</p>
        <div class="flex gap-3 items-center">
          <div class="flex-1 flex items-center border border-[#aab7b8] rounded overflow-hidden h-9 focus-within:border-[#0073bb] focus-within:ring-2 focus-within:ring-[#0073bb]/20 transition">
            <svg class="w-4 h-4 text-[#aab7b8] mx-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input ref="inputRef" v-model="query" @input="onInput" @keyup.enter="doSearch"
              type="search" :placeholder="$t('home.searchPlaceholder')"
              class="flex-1 text-sm text-[#16191f] outline-none h-full placeholder-[#aab7b8] bg-transparent"/>
            <button v-if="query" @click="clear" class="px-3 text-[#aab7b8] hover:text-[#16191f] text-lg leading-none">✕</button>
          </div>
          <button @click="doSearch"
            class="bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-5 h-9 rounded text-sm transition flex-shrink-0">
            Rechercher
          </button>
        </div>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-5xl mx-auto px-6 py-6">

        <!-- Loading -->
        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div v-for="i in 12" :key="i"
            class="bg-white border border-[#d5dbdb] rounded overflow-hidden animate-pulse">
            <div class="aspect-[2/3] bg-[#f2f3f3]"></div>
            <div class="p-3 space-y-2">
              <div class="h-3 bg-[#f2f3f3] rounded w-4/5"></div>
              <div class="h-3 bg-[#f2f3f3] rounded w-3/5"></div>
            </div>
          </div>
        </div>

        <!-- Empty state: no query -->
        <div v-else-if="!query.trim()">
          <div class="bg-white border border-[#d5dbdb] rounded p-8 text-center mb-6">
            <p class="text-4xl mb-3">🔍</p>
            <p class="font-semibold text-[#16191f] mb-1">Que recherchez-vous ?</p>
            <p class="text-sm text-[#545b64]">Tapez un titre, un auteur ou un mot-clé dans la barre ci-dessus.</p>
          </div>

          <!-- Category chips -->
          <div v-if="categories.length > 0" class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
              <p class="text-xs font-semibold text-[#16191f]">Parcourir par domaine</p>
            </div>
            <div class="p-4 flex flex-wrap gap-2">
              <router-link v-for="cat in categories.slice(0, 16)" :key="cat.id"
                :to="`/books?category_id=${cat.id}`"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f3f3] border border-[#d5dbdb] rounded text-sm text-[#0073bb] hover:bg-[#e8f5fd] hover:border-[#0073bb] transition">
                <span>{{ cat.icon }}</span> {{ cat.name }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- No results -->
        <div v-else-if="books.length === 0 && searched"
          class="bg-white border border-[#d5dbdb] rounded p-12 text-center">
          <p class="text-4xl mb-3">😔</p>
          <p class="font-semibold text-[#16191f] mb-1">Aucun résultat pour « {{ lastQuery }} »</p>
          <p class="text-sm text-[#545b64] mb-5">Essayez d'autres termes ou parcourez la bibliothèque complète.</p>
          <router-link to="/books"
            class="bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-5 py-2 rounded text-sm transition">
            Voir tous les livres
          </router-link>
        </div>

        <!-- Results -->
        <div v-else-if="books.length > 0">
          <!-- Results header -->
          <div class="bg-white border border-[#d5dbdb] rounded px-4 py-2.5 mb-4 flex items-center justify-between">
            <p class="text-sm text-[#545b64]">
              <span class="font-semibold text-[#16191f]">{{ total }}</span>
              résultat{{ total > 1 ? 's' : '' }} pour
              « <span class="text-[#0073bb]">{{ lastQuery }}</span> »
            </p>
            <router-link :to="`/books?search=${encodeURIComponent(lastQuery)}`"
              class="text-sm text-[#0073bb] hover:underline">
              Voir tout dans la bibliothèque →
            </router-link>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <router-link v-for="book in books" :key="book.id" :to="`/books/${book.id}`"
              class="group bg-white border border-[#d5dbdb] rounded overflow-hidden hover:border-[#0073bb] hover:shadow-md transition flex flex-col">
              <div class="aspect-[2/3] bg-[#f2f3f3] overflow-hidden relative">
                <img v-if="book.cover_url || book.cover_image"
                  :src="book.cover_url || book.cover_image" :alt="book.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
                <div v-else class="w-full h-full flex flex-col items-center justify-center p-3"
                  :style="{ background: bookGradient(book) }">
                  <svg class="mb-2 opacity-30" width="26" height="24" viewBox="0 0 36 32" fill="none">
                    <path d="M2 3C2 1.9 2.9 1 4 1H17V31H4C2.9 31 2 30.1 2 29V3Z" stroke="white" stroke-width="1.6" fill="white" fill-opacity="0.2"/>
                    <path d="M19 1H32C33.1 1 34 1.9 34 3V29C34 30.1 33.1 31 32 31H19V1Z" stroke="white" stroke-width="1.6" fill="white" fill-opacity="0.2"/>
                    <line x1="18" y1="1" x2="18" y2="31" stroke="white" stroke-width="1.3"/>
                    <line x1="6" y1="10" x2="14" y2="10" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
                    <line x1="6" y1="14" x2="14" y2="14" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
                    <line x1="23" y1="10" x2="31" y2="22" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    <line x1="31" y1="10" x2="23" y2="22" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <p class="text-white text-[10px] font-bold text-center leading-tight line-clamp-4 px-1">{{ book.title }}</p>
                  <p class="text-white text-[9px] opacity-70 text-center mt-1 truncate w-full">{{ book.author?.name }}</p>
                </div>
              </div>
              <div class="p-3 flex-1 flex flex-col">
                <p class="text-xs font-semibold text-[#16191f] line-clamp-2 leading-tight mb-1 group-hover:text-[#0073bb]">
                  {{ book.title }}
                </p>
                <p class="text-xs text-[#545b64] truncate">{{ book.author?.name }}</p>
                <p class="text-xs font-bold text-[#ff9900] mt-auto pt-2">
                  {{ book.is_free ? $t('book.free') : `${Number(book.price).toLocaleString('fr-FR')} XAF` }}
                </p>
              </div>
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bookService, categoryService } from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
const { t } = useI18n()

const route      = useRoute()
const router     = useRouter()
const query      = ref(route.query.q || '')
const books      = ref([])
const categories = ref([])
const loading    = ref(false)
const searched   = ref(false)
const lastQuery  = ref('')
const total      = ref(0)
const inputRef   = ref(null)

let debounceTimer = null
function onInput() {
  clearTimeout(debounceTimer)
  if (!query.value.trim()) { books.value = []; searched.value = false; return }
  debounceTimer = setTimeout(doSearch, 450)
}

async function doSearch() {
  if (!query.value.trim()) return
  loading.value = true; searched.value = false
  lastQuery.value = query.value.trim()
  router.replace({ query: { q: lastQuery.value } })
  try {
    const { data } = await bookService.list({ search: lastQuery.value, per_page: 20 })
    books.value = data.data.data ?? []
    total.value = data.data.total ?? 0
    searched.value = true
  } finally { loading.value = false }
}

function clear() {
  query.value = ''; books.value = []; searched.value = false
  router.replace({ query: {} }); inputRef.value?.focus()
}

onMounted(async () => {
  inputRef.value?.focus()
  const [, cats] = await Promise.allSettled([
    query.value.trim() ? doSearch() : Promise.resolve(),
    categoryService.list(),
  ])
  if (cats.status === 'fulfilled') categories.value = cats.value.data.data ?? []
})
</script>
