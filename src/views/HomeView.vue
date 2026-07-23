<!-- src/views/HomeView.vue -->
<template>
  <AppLayout>
    <!-- AWS-style page header -->
    <div class="bg-[#232f3e] text-white py-10 px-6 border-b border-[#3a4a5a]">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p class="text-[#ff9900] text-xs font-semibold uppercase tracking-widest mb-2">{{ $t('home.tagline') }}</p>
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
              {{ $t('home.hero') }}
            </h1>
            <p class="text-[#8fb3c9] text-sm max-w-xl">
              {{ $t('home.heroSub') }}
            </p>
          </div>
          <div class="flex gap-3 flex-shrink-0">
            <router-link to="/books"
              class="bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-5 py-2.5 rounded text-sm transition">
              {{ $t('home.explore') }}
            </router-link>
            <a href="http://127.0.0.1:8000/register"
              class="border border-[#8fb3c9] text-[#8fb3c9] hover:text-white hover:border-white font-semibold px-5 py-2.5 rounded text-sm transition">
              {{ $t('home.becomeAuthor') }}
            </a>
          </div>
        </div>

        <!-- Stats bar -->
        <div class="grid grid-cols-3 gap-px mt-8 bg-[#3a4a5a] rounded overflow-hidden">
          <div class="bg-[#1a2535] px-6 py-4 text-center">
            <p class="text-2xl font-bold text-[#ff9900]">3K+</p>
            <p class="text-[#8fb3c9] text-xs mt-0.5">{{ $t('home.books') }}</p>
          </div>
          <div class="bg-[#1a2535] px-6 py-4 text-center">
            <p class="text-2xl font-bold text-[#ff9900]">500+</p>
            <p class="text-[#8fb3c9] text-xs mt-0.5">{{ $t('home.authors') }}</p>
          </div>
          <div class="bg-[#1a2535] px-6 py-4 text-center">
            <p class="text-2xl font-bold text-[#ff9900]">10+</p>
            <p class="text-[#8fb3c9] text-xs mt-0.5">{{ $t('home.domains') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content area -->
    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-6xl mx-auto px-6 py-8">

        <!-- Search panel -->
        <div class="bg-white border border-[#d5dbdb] rounded mb-6 p-4">
          <div class="flex items-center gap-3">
            <div class="flex-1 flex items-center border border-[#aab7b8] rounded overflow-hidden h-9">
              <input
                v-model="searchQuery"
                @keyup.enter="goSearch"
                type="text"
                :placeholder="$t('home.searchPlaceholder')"
                class="flex-1 px-3 text-sm text-[#16191f] outline-none h-full placeholder-[#aab7b8]"
              />
            </div>
            <button @click="goSearch"
              class="bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-4 h-9 rounded text-sm transition flex-shrink-0">
              {{ $t('home.searchBtn') }}
            </button>
          </div>
        </div>

        <!-- 2-column layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Left: Categories -->
          <div class="lg:col-span-1">
            <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
              <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
                <h2 class="text-sm font-semibold text-[#16191f]">{{ $t('home.exploreByDomain') }}</h2>
              </div>
              <div v-if="loadingCats" class="p-4 space-y-2">
                <div v-for="i in 8" :key="i" class="h-8 bg-[#f2f3f3] rounded animate-pulse"></div>
              </div>
              <ul v-else class="divide-y divide-[#f2f3f3]">
                <li v-for="cat in categories" :key="cat.id">
                  <router-link :to="`/books?category_id=${cat.id}`"
                    class="flex items-center justify-between px-4 py-2.5 text-sm text-[#0073bb] hover:bg-[#f2f3f3] hover:text-[#005276] transition group">
                    <span class="flex items-center gap-2">
                      <span>{{ cat.icon || '📚' }}</span>
                      <span class="group-hover:underline">{{ cat.name }}</span>
                    </span>
                    <span class="text-xs text-[#aab7b8] bg-[#f2f3f3] px-2 py-0.5 rounded-full">{{ cat.books_count || 0 }}</span>
                  </router-link>
                </li>
              </ul>
              <div class="border-t border-[#d5dbdb] px-4 py-2.5">
                <router-link to="/books" class="text-sm text-[#0073bb] hover:underline hover:text-[#005276]">
                  {{ $t('home.seeAll') }} →
                </router-link>
              </div>
            </div>
          </div>

          <!-- Right: Featured books -->
          <div class="lg:col-span-2 space-y-6">

            <!-- Featured books panel -->
            <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
              <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5 flex items-center justify-between">
                <h2 class="text-sm font-semibold text-[#16191f]">{{ $t('home.featured') }}</h2>
                <router-link to="/books" class="text-sm text-[#0073bb] hover:underline">{{ $t('home.seeAll') }}</router-link>
              </div>
              <div v-if="loadingBooks" class="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div v-for="i in 6" :key="i" class="rounded bg-[#f2f3f3] animate-pulse" style="height:180px"></div>
              </div>
              <div v-else-if="featuredBooks.length === 0" class="p-8 text-center text-[#545b64] text-sm">
                {{ $t('common.loading') }}
              </div>
              <div v-else class="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <router-link v-for="book in featuredBooks" :key="book.id" :to="`/books/${book.id}`"
                  class="group flex flex-col border border-[#d5dbdb] rounded overflow-hidden hover:border-[#0073bb] hover:shadow-sm transition">
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
                  <div class="p-2">
                    <p class="text-xs font-semibold text-[#16191f] line-clamp-2 group-hover:text-[#0073bb] leading-tight">{{ book.title }}</p>
                    <p class="text-xs text-[#545b64] mt-0.5 truncate">{{ book.author?.name }}</p>
                    <p class="text-xs font-bold text-[#ff9900] mt-1">
                      {{ book.is_free ? $t('book.free') : `${Number(book.price).toLocaleString('fr-FR')} XAF` }}
                    </p>
                  </div>
                </router-link>
              </div>
            </div>

            <!-- Recent books panel -->
            <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
              <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5 flex items-center justify-between">
                <h2 class="text-sm font-semibold text-[#16191f]">{{ $t('home.latest') }}</h2>
                <router-link to="/books?sort=recent" class="text-sm text-[#0073bb] hover:underline">{{ $t('home.seeAll') }}</router-link>
              </div>
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-[#d5dbdb] bg-[#f8f8f8]">
                    <th class="text-left px-4 py-2 text-xs font-semibold text-[#545b64] w-10">#</th>
                    <th class="text-left px-4 py-2 text-xs font-semibold text-[#545b64]">{{ $t('book.title') }}</th>
                    <th class="text-left px-4 py-2 text-xs font-semibold text-[#545b64] hidden sm:table-cell">{{ $t('book.by') }}</th>
                    <th class="text-left px-4 py-2 text-xs font-semibold text-[#545b64] hidden sm:table-cell">{{ $t('book.category') }}</th>
                    <th class="text-right px-4 py-2 text-xs font-semibold text-[#545b64]">{{ $t('book.price') }}</th>
                  </tr>
                </thead>
                <tbody v-if="loadingRecent">
                  <tr v-for="i in 5" :key="i" class="border-b border-[#f2f3f3]">
                    <td colspan="5" class="px-4 py-3">
                      <div class="h-4 bg-[#f2f3f3] rounded animate-pulse"></div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr v-for="(book, idx) in recentBooks" :key="book.id"
                    :class="['border-b border-[#f2f3f3] hover:bg-[#f8f8f8] transition', idx % 2 === 1 ? 'bg-[#fafafa]' : '']">
                    <td class="px-4 py-2.5 text-xs text-[#aab7b8]">{{ idx + 1 }}</td>
                    <td class="px-4 py-2.5">
                      <router-link :to="`/books/${book.id}`" class="text-[#0073bb] hover:underline font-medium line-clamp-1">
                        {{ book.title }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2.5 text-[#545b64] hidden sm:table-cell text-xs">{{ book.author?.name }}</td>
                    <td class="px-4 py-2.5 hidden sm:table-cell">
                      <span class="bg-[#e8f0fe] text-[#0073bb] text-xs px-2 py-0.5 rounded-full">{{ book.category?.name }}</span>
                    </td>
                    <td class="px-4 py-2.5 text-right text-xs font-semibold text-[#16191f]">
                      {{ book.is_free ? $t('book.free') : `${Number(book.price).toLocaleString('fr-FR')} XAF` }}
                    </td>
                  </tr>
                  <tr v-if="recentBooks.length === 0">
                    <td colspan="5" class="px-4 py-8 text-center text-[#545b64] text-sm">{{ $t('common.loading') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { bookService, categoryService } from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'

const { t } = useI18n()
const router       = useRouter()
const searchQuery  = ref('')
const categories   = ref([])
const featuredBooks = ref([])
const recentBooks  = ref([])
const loadingCats  = ref(true)
const loadingBooks = ref(true)
const loadingRecent = ref(true)

function goSearch() {
  if (searchQuery.value.trim()) router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
}

onMounted(async () => {
  const [cats, featured, recent] = await Promise.allSettled([
    categoryService.list(),
    bookService.featured(),
    bookService.list({ sort: 'recent', per_page: 8 }),
  ])
  if (cats.status === 'fulfilled') categories.value = cats.value.data.data ?? []
  loadingCats.value = false
  if (featured.status === 'fulfilled') featuredBooks.value = featured.value.data.data ?? []
  loadingBooks.value = false
  if (recent.status === 'fulfilled') recentBooks.value = recent.value.data.data?.data ?? recent.value.data.data ?? []
    loadingRecent.value = false
})

function bookGradient(book) {
  const colors = ['#1a2535,#2a3f5f','#2d1b4e,#4a2d7a','#1a3a2a,#2d5e3e','#3a1a1a,#6b2b2b','#1a2a3a,#2b4a6b']
  const idx = (book.id || 0) % colors.length
  return `linear-gradient(135deg,${colors[idx]})`
}
</script>
