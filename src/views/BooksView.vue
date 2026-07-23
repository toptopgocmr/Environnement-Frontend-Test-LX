<!-- src/views/BooksView.vue -->
<template>
  <AppLayout>
    <!-- AWS page header -->
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <p class="text-xs text-[#545b64] mb-0.5">LireX › {{ $t('nav.catalogue') }}</p>
          <h1 class="text-xl font-bold text-[#16191f]">{{ $t('common.catalogTitle') }}</h1>
        </div>
        <span class="text-sm text-[#545b64]">{{ total }} {{ $t('common.booksAvailable') }}</span>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-7xl mx-auto px-4 py-6 flex gap-5">

        <!-- Sidebar filters -->
        <aside class="w-64 flex-shrink-0 space-y-4">

          <!-- Search -->
          <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-3 py-2">
              <p class="text-xs font-semibold text-[#16191f]">{{ $t('home.searchBtn') }}</p>
            </div>
            <div class="p-3">
              <div class="flex items-center border border-[#aab7b8] rounded overflow-hidden h-8">
                <input v-model="search" @input="onSearchInput" type="text" :placeholder="$t('common.titleSearch')"
                  class="flex-1 px-2 text-xs text-[#16191f] outline-none h-full placeholder-[#aab7b8]"/>
                <button v-if="search" @click="search=''; fetchBooks()" class="px-2 text-[#aab7b8] hover:text-[#16191f] text-sm">✕</button>
              </div>
            </div>
          </div>

          <!-- Category filter -->
          <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-3 py-2">
              <p class="text-xs font-semibold text-[#16191f]">{{ $t('book.category') }}</p>
            </div>
            <ul class="py-1 max-h-64 overflow-y-auto">
              <li>
                <button @click="category_id=''; page=1; fetchBooks()"
                  :class="['w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition',
                    !category_id ? 'bg-[#e8f5fd] text-[#0073bb] font-semibold' : 'text-[#16191f] hover:bg-[#f2f3f3]']">
                  <span :class="['w-2 h-2 rounded-full flex-shrink-0', !category_id ? 'bg-[#0073bb]' : 'border border-[#aab7b8]']"></span>
                  {{ $t('common.allDomains') }}
                </button>
              </li>
              <li v-for="cat in categories" :key="cat.id">
                <button @click="category_id=cat.id; page=1; fetchBooks()"
                  :class="['w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition',
                    category_id===cat.id ? 'bg-[#e8f5fd] text-[#0073bb] font-semibold' : 'text-[#16191f] hover:bg-[#f2f3f3]']">
                  <span :class="['w-2 h-2 rounded-full flex-shrink-0', category_id===cat.id ? 'bg-[#0073bb]' : 'border border-[#aab7b8]']"></span>
                  {{ cat.icon }} {{ cat.name }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Price filter -->
          <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-3 py-2">
              <p class="text-xs font-semibold text-[#16191f]">{{ $t('book.price') }}</p>
            </div>
            <ul class="py-1">
              <li v-for="opt in priceOpts" :key="opt.value">
                <button @click="is_free=opt.value; page=1; fetchBooks()"
                  :class="['w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition',
                    is_free===opt.value ? 'bg-[#e8f5fd] text-[#0073bb] font-semibold' : 'text-[#16191f] hover:bg-[#f2f3f3]']">
                  <span :class="['w-2 h-2 rounded-full flex-shrink-0', is_free===opt.value ? 'bg-[#0073bb]' : 'border border-[#aab7b8]']"></span>
                  {{ opt.label }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Sort -->
          <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-3 py-2">
              <p class="text-xs font-semibold text-[#16191f]">{{ $t('common.sortBy') }}</p>
            </div>
            <ul class="py-1">
              <li v-for="opt in sortOpts" :key="opt.value">
                <button @click="sort=opt.value; page=1; fetchBooks()"
                  :class="['w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition',
                    sort===opt.value ? 'bg-[#e8f5fd] text-[#0073bb] font-semibold' : 'text-[#16191f] hover:bg-[#f2f3f3]']">
                  <span :class="['w-2 h-2 rounded-full flex-shrink-0', sort===opt.value ? 'bg-[#0073bb]' : 'border border-[#aab7b8]']"></span>
                  {{ opt.label }}
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Book grid -->
        <div class="flex-1 min-w-0">

          <!-- Results info bar -->
          <div class="bg-white border border-[#d5dbdb] rounded px-4 py-2 mb-4 flex items-center justify-between">
            <p class="text-xs text-[#545b64]">
              <span class="font-semibold text-[#16191f]">{{ total }}</span> {{ $t('common.results') }}
              <span v-if="search"> {{ $t('common.resultsFor') }} « <em class="not-italic text-[#0073bb]">{{ search }}</em> »</span>
            </p>
            <span v-if="category_id || is_free || search"
              @click="category_id=''; is_free=''; search=''; sort='recent'; fetchBooks()"
              class="text-xs text-[#d13212] hover:underline cursor-pointer">
              {{ $t('common.clearFilters') }}
            </span>
          </div>

          <!-- Skeleton -->
          <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div v-for="i in 12" :key="i" class="bg-white border border-[#d5dbdb] rounded overflow-hidden animate-pulse">
              <div class="aspect-[2/3] bg-[#f2f3f3]"></div>
              <div class="p-3 space-y-2">
                <div class="h-3 bg-[#f2f3f3] rounded w-4/5"></div>
                <div class="h-3 bg-[#f2f3f3] rounded w-3/5"></div>
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="books.length === 0" class="bg-white border border-[#d5dbdb] rounded p-12 text-center">
            <p class="text-4xl mb-3">📭</p>
            <p class="font-semibold text-[#16191f] mb-1">{{ $t('common.noResults') }}</p>
            <p class="text-sm text-[#545b64] mb-4">{{ $t('common.adjustFilters') }}</p>
            <button @click="category_id=''; is_free=''; search=''; fetchBooks()"
              class="bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-4 py-2 rounded text-sm transition">
              {{ $t('common.showAllBooks') }}
            </button>
          </div>

          <!-- Grid -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <router-link v-for="book in books" :key="book.id" :to="`/books/${book.id}`"
              class="group bg-white border border-[#d5dbdb] rounded overflow-hidden hover:border-[#0073bb] hover:shadow-md transition flex flex-col">
              <div class="aspect-[2/3] bg-[#f2f3f3] overflow-hidden relative">
                <!-- Couverture réelle -->
                <img v-if="book.cover_url || book.cover_image"
                  :src="book.cover_url || book.cover_image" :alt="book.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
                <!-- Couverture générée si pas d'image -->
                <div v-else class="w-full h-full flex flex-col items-center justify-center p-3 group-hover:brightness-95 transition"
                  :style="{ background: bookGradient(book) }">
                  <svg class="mb-2 opacity-30" width="28" height="28" viewBox="0 0 36 32" fill="none">
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
                <span v-if="book.is_free"
                  class="absolute top-2 left-2 bg-[#1d8102] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {{ $t('book.free') }}
                </span>
              </div>
              <div class="p-3 flex-1 flex flex-col">
                <p class="text-xs font-semibold text-[#16191f] line-clamp-2 leading-tight mb-1 group-hover:text-[#0073bb]">
                  {{ book.title }}
                </p>
                <p class="text-xs text-[#545b64] truncate">{{ book.author?.name }}</p>
                <div class="mt-auto pt-2 flex items-center justify-between">
                  <span class="text-xs font-bold text-[#ff9900]">
                    {{ book.is_free ? $t('book.free') : `${Number(book.price).toLocaleString('fr-FR')} XAF` }}
                  </span>
                  <span v-if="book.average_rating > 0" class="text-xs text-[#aab7b8]">★ {{ book.average_rating }}</span>
                </div>
              </div>
            </router-link>
          </div>

          <!-- Pagination -->
          <div v-if="lastPage > 1" class="mt-6 bg-white border border-[#d5dbdb] rounded px-4 py-3 flex items-center justify-between">
            <button @click="page--; fetchBooks()" :disabled="page===1"
              class="text-xs font-semibold text-[#0073bb] hover:underline disabled:opacity-40 disabled:cursor-not-allowed">
              ← {{ $t('common.previous') }}
            </button>
            <div class="flex gap-1">
              <button v-for="p in pagesToShow" :key="p" @click="page=p; fetchBooks()"
                :class="['w-8 h-7 rounded text-xs font-semibold transition',
                  p===page ? 'bg-[#0073bb] text-white' : 'text-[#0073bb] hover:bg-[#f2f3f3]']">
                {{ p }}
              </button>
            </div>
            <button @click="page++; fetchBooks()" :disabled="page===lastPage"
              class="text-xs font-semibold text-[#0073bb] hover:underline disabled:opacity-40 disabled:cursor-not-allowed">
              {{ $t('common.next') }} →
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { bookService, categoryService } from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'

const route  = useRoute()
const { t } = useI18n()
const router = useRouter()

const books       = ref([])
const categories  = ref([])
const loading     = ref(true)
const total       = ref(0)
const page        = ref(Number(route.query.page) || 1)
const lastPage    = ref(1)
const category_id = ref(route.query.category_id || '')
const is_free     = ref(route.query.is_free || '')
const sort        = ref(route.query.sort || 'recent')
const search      = ref(route.query.search || '')

const priceOpts = computed(() => [
  { value: '', label: t('common.allPrices') },
  { value: '0', label: t('book.free') },
  { value: '1', label: t('common.paidOnly') },
])
const sortOpts = computed(() => [
  { value: 'recent', label: t('common.sortRecent') },
  { value: 'popular', label: t('common.sortPopular') },
  { value: 'price_asc', label: t('common.priceAsc') },
  { value: 'price_desc', label: t('common.priceDesc') },
])

const pagesToShow = computed(() => {
  const pages = []
  const start = Math.max(1, page.value - 2)
  const end   = Math.min(lastPage.value, page.value + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

let debounceTimer = null
function onSearchInput() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchBooks() }, 400)
}

async function fetchBooks() {
  loading.value = true
  const params = { page: page.value, per_page: 16, sort: sort.value }
  if (category_id.value) params.category_id = category_id.value
  if (is_free.value !== '') params.is_free = is_free.value
  if (search.value) params.q = search.value
  router.replace({ query: { ...params } })
  try {
    const { data } = await bookService.list(params)
    books.value    = data.data.data ?? []
    total.value    = data.data.total ?? 0
    lastPage.value = data.data.last_page ?? 1
  } catch (err) {
    console.error('[BooksView] Erreur API:', err)
    books.value = []
    total.value = 0
  } finally { loading.value = false }
}

onMounted(async () => {
  const [, cats] = await Promise.allSettled([fetchBooks(), categoryService.list()])
  if (cats.status === 'fulfilled') categories.value = cats.value.data.data ?? []
})

const COVER_GRADIENTS = [
  'linear-gradient(160deg,#1e3a5f,#2563eb)',
  'linear-gradient(160deg,#3b1f5e,#7c3aed)',
  'linear-gradient(160deg,#064e3b,#059669)',
  'linear-gradient(160deg,#7c2d12,#d97706)',
  'linear-gradient(160deg,#1e1e2e,#4338ca)',
  'linear-gradient(160deg,#831843,#ec4899)',
  'linear-gradient(160deg,#134e4a,#0891b2)',
  'linear-gradient(160deg,#422006,#b45309)',
]
function bookGradient(book) {
  const idx = (book.id || 0) % COVER_GRADIENTS.length
  return COVER_GRADIENTS[idx]
}
</script>
