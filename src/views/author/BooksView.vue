<!-- src/views/author/BooksView.vue — AWS Console style -->
<template>
  <AppLayout>
    <!-- AWS page header -->
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <p class="text-xs text-[#545b64] mb-0.5">LireX › Espace Auteur › Mes livres</p>
          <h1 class="text-xl font-bold text-[#16191f]">Mes livres</h1>
          <p class="text-xs text-[#545b64] mt-0.5">{{ total }} ouvrage{{ total !== 1 ? 's' : '' }} soumis</p>
        </div>
        <router-link to="/author/books/new"
          class="bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-4 py-2 rounded text-sm transition">
          + Nouveau livre
        </router-link>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-5xl mx-auto px-4 py-6">

        <!-- Filter tabs -->
        <div class="bg-white border border-[#d5dbdb] rounded px-4 py-2.5 mb-4 flex items-center gap-2 overflow-x-auto">
          <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value; page = 1; fetchBooks()"
            :class="['flex-shrink-0 px-3 py-1 rounded text-xs font-semibold transition',
              activeTab === tab.value ? 'bg-[#0073bb] text-white' : 'text-[#0073bb] border border-[#d5dbdb] hover:bg-[#f2f3f3]']">
            {{ tab.label }}
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="bg-white border border-[#d5dbdb] rounded p-4 flex gap-4 animate-pulse">
            <div class="w-14 h-20 bg-[#f2f3f3] rounded flex-shrink-0"></div>
            <div class="flex-1 space-y-2 py-1">
              <div class="h-3 bg-[#f2f3f3] rounded w-2/3"></div>
              <div class="h-3 bg-[#f2f3f3] rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="books.length === 0"
          class="bg-white border border-[#d5dbdb] rounded p-16 text-center">
          <p class="text-5xl mb-4">📝</p>
          <h2 class="font-semibold text-[#16191f] mb-1">Aucun livre dans cette catégorie</h2>
          <router-link to="/author/books/new"
            class="inline-block mt-4 bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-5 py-2 rounded text-sm transition">
            + Soumettre un livre
          </router-link>
        </div>

        <!-- Books list -->
        <div v-else class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
          <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
            <h2 class="text-sm font-semibold text-[#16191f]">Catalogue</h2>
          </div>
          <div class="divide-y divide-[#f2f3f3]">
            <div v-for="book in books" :key="book.id"
              class="flex gap-4 px-4 py-4 hover:bg-[#fafafa] transition">
              <img :src="book.cover_url || book.cover_image || '/img/default-cover.jpg'" :alt="book.title"
                class="w-14 h-20 object-cover rounded border border-[#d5dbdb] flex-shrink-0"/>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-semibold text-[#0073bb] line-clamp-2 flex-1 text-sm">{{ book.title }}</h3>
                  <span :class="['flex-shrink-0 px-2 py-0.5 rounded text-xs font-semibold', statusClass(book.status)]">
                    {{ statusLabel(book.status) }}
                  </span>
                </div>
                <p class="text-xs text-[#545b64] mt-0.5">{{ book.category?.name }} · {{ book.language?.toUpperCase() }}</p>
                <div class="flex items-center gap-4 mt-1.5">
                  <span class="font-bold text-[#ff9900] text-sm">
                    {{ book.is_free ? 'Gratuit' : `${Number(book.price).toLocaleString('fr-FR')} XAF` }}
                  </span>
                  <span class="text-xs text-[#aab7b8]">{{ book.orders_count || 0 }} vente{{ (book.orders_count || 0) > 1 ? 's' : '' }}</span>
                  <span v-if="book.average_rating > 0" class="text-xs text-[#ff9900]">★ {{ book.average_rating }}</span>
                </div>
              </div>
              <div class="flex flex-col gap-1.5 flex-shrink-0 self-center">
                <a :href="`/author/books/${book.id}/edit`" target="_blank"
                  class="text-xs px-3 py-1.5 border border-[#d5dbdb] text-[#0073bb] hover:bg-[#f2f3f3] rounded transition text-center">
                  ✏️ Modifier
                </a>
                <a :href="`/author/books/${book.id}/stats`" target="_blank"
                  class="text-xs px-3 py-1.5 border border-[#d5dbdb] text-[#0073bb] hover:bg-[#f2f3f3] rounded transition text-center">
                  📊 Stats
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="lastPage > 1" class="flex items-center justify-center gap-2 mt-4">
          <button @click="page--; fetchBooks()" :disabled="page === 1"
            class="px-4 py-2 rounded border border-[#d5dbdb] text-sm text-[#0073bb] hover:bg-[#f2f3f3] disabled:opacity-40 transition">← Préc.</button>
          <span class="text-sm text-[#545b64]">Page {{ page }} / {{ lastPage }}</span>
          <button @click="page++; fetchBooks()" :disabled="page === lastPage"
            class="px-4 py-2 rounded border border-[#d5dbdb] text-sm text-[#0073bb] hover:bg-[#f2f3f3] disabled:opacity-40 transition">Suiv. →</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { authorService } from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'

const books     = ref([])
const loading   = ref(true)
const total     = ref(0)
const page      = ref(1)
const lastPage  = ref(1)
const activeTab = ref('')

const tabs = [
  { value: '',          label: 'Tous' },
  { value: 'published', label: 'Publiés' },
  { value: 'pending',   label: 'En attente' },
  { value: 'draft',     label: 'Brouillons' },
  { value: 'rejected',  label: 'Refusés' },
]

async function fetchBooks() {
  loading.value = true
  try {
    const params = { page: page.value, per_page: 10 }
    if (activeTab.value) params.status = activeTab.value
    const { data } = await authorService.myBooks(params)
    books.value    = data.data.data ?? []
    total.value    = data.data.total ?? 0
    lastPage.value = data.data.last_page ?? 1
  } finally { loading.value = false }
}

const statusLabel = s => ({ draft:'Brouillon', pending:'En attente', published:'Publié', rejected:'Rejeté', suspended:'Suspendu' }[s] || s)
const statusClass  = s => ({ published:'bg-[#eafaf1] text-[#1d8102]', pending:'bg-[#fef9e7] text-[#b7950b]', rejected:'bg-[#fdf3f1] text-[#d13212]', draft:'bg-[#f2f3f3] text-[#545b64]', suspended:'bg-[#fdebd0] text-[#d35400]' }[s] || 'bg-[#f2f3f3] text-[#545b64]')

onMounted(fetchBooks)
</script>
