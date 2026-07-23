<!-- src/views/reader/LibraryView.vue — AWS Console style -->
<template>
  <AppLayout>
    <!-- Page header -->
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <p class="text-xs text-[#545b64] mb-0.5">
            <router-link to="/" class="hover:text-[#0073bb]">LireX</router-link> › {{ $t('nav.library') }}
          </p>
          <h1 class="text-xl font-bold text-[#16191f]">{{ $t('nav.library') }}</h1>
        </div>
        <span class="text-sm text-[#545b64]">{{ filteredBooks.length }} ouvrage{{ filteredBooks.length > 1 ? 's' : '' }}</span>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-7xl mx-auto px-4 py-6">

        <!-- Filter bar -->
        <div class="bg-white border border-[#d5dbdb] rounded px-4 py-2.5 mb-4 flex items-center gap-2">
          <span class="text-xs font-semibold text-[#545b64] mr-2">Filtrer :</span>
          <button v-for="f in filters" :key="f.key" @click="activeFilter = f.key"
            :class="['px-3 py-1 rounded text-xs font-semibold transition',
              activeFilter === f.key
                ? 'bg-[#0073bb] text-white'
                : 'text-[#0073bb] hover:bg-[#f2f3f3] border border-[#d5dbdb]']">
            {{ f.label }}
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          <div v-for="i in 12" :key="i" class="bg-white border border-[#d5dbdb] rounded overflow-hidden animate-pulse">
            <div class="aspect-[2/3] bg-[#f2f3f3]"></div>
            <div class="p-2 space-y-1.5">
              <div class="h-2.5 bg-[#f2f3f3] rounded w-4/5"></div>
              <div class="h-2 bg-[#f2f3f3] rounded w-3/5"></div>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredBooks.length === 0"
          class="bg-white border border-[#d5dbdb] rounded p-16 text-center">
          <p class="text-5xl mb-4">📚</p>
          <h2 class="font-semibold text-[#16191f] mb-1">Bibliothèque vide</h2>
          <p class="text-sm text-[#545b64] mb-5">Achetez ou obtenez des livres gratuits pour les retrouver ici.</p>
          <router-link to="/books"
            class="inline-block bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-5 py-2 rounded text-sm transition">
            Explorer le catalogue
          </router-link>
        </div>

        <!-- Books grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          <div v-for="item in filteredBooks" :key="item.id"
            class="group bg-white border border-[#d5dbdb] rounded overflow-hidden hover:border-[#0073bb] hover:shadow-md transition cursor-pointer flex flex-col"
            @click="$router.push('/library/read/' + item.book.id)">

            <!-- Cover -->
            <div class="aspect-[2/3] bg-[#f2f3f3] overflow-hidden relative">
              <img v-if="item.book.cover_url || item.book.cover_image"
                :src="item.book.cover_url || item.book.cover_image" :alt="item.book.title"
                class="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
              <div v-else class="w-full h-full flex items-center justify-center"
                :style="{ background: bookGradient(item.book) }">
                <span class="text-white text-3xl opacity-50">📖</span>
              </div>

              <!-- Progress bar -->
              <div v-if="item.progress_percent > 0"
                class="absolute bottom-0 left-0 right-0 h-1 bg-[#1a2535]">
                <div class="h-full bg-[#0073bb] transition-all" :style="`width:${item.progress_percent}%`"></div>
              </div>

              <!-- Hover overlay -->
              <div class="absolute inset-0 bg-[#232f3e]/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span class="text-white text-xs font-bold bg-[#ff9900] text-[#232f3e] px-3 py-1.5 rounded">
                  📖 Lire
                </span>
              </div>
            </div>

            <!-- Info -->
            <div class="p-2.5 flex-1 flex flex-col">
              <p class="text-xs font-semibold text-[#16191f] line-clamp-2 leading-tight group-hover:text-[#0073bb]">
                {{ item.book.title }}
              </p>
              <p class="text-[10px] text-[#545b64] mt-0.5 truncate">{{ item.book.author?.name }}</p>
              <div v-if="item.progress_percent > 0" class="mt-auto pt-1">
                <div class="flex justify-between text-[10px] text-[#aab7b8] mb-0.5">
                  <span>Progression</span><span class="text-[#0073bb]">{{ item.progress_percent }}%</span>
                </div>
                <div class="h-1 bg-[#f2f3f3] rounded-full">
                  <div class="h-full bg-[#0073bb] rounded-full" :style="`width:${item.progress_percent}%`"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { libraryService } from '@/services/api'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const books        = ref([])
const loading      = ref(true)
const activeFilter = ref('all')

const filters = [
  { key: 'all',       label: 'Tous' },
  { key: 'reading',   label: 'En cours' },
  { key: 'completed', label: 'Terminés' },
]

const filteredBooks = computed(() => {
  if (activeFilter.value === 'reading')   return books.value.filter(b => b.progress_percent > 0 && b.progress_percent < 100)
  if (activeFilter.value === 'completed') return books.value.filter(b => b.progress_percent >= 100)
  return books.value
})

const GRADIENTS = [
  'linear-gradient(160deg,#1e3a5f,#2563eb)', 'linear-gradient(160deg,#3b1f5e,#7c3aed)',
  'linear-gradient(160deg,#064e3b,#059669)', 'linear-gradient(160deg,#7c2d12,#d97706)',
  'linear-gradient(160deg,#1e1e2e,#4338ca)', 'linear-gradient(160deg,#831843,#ec4899)',
]
function bookGradient(book) { return GRADIENTS[(book.id || 0) % GRADIENTS.length] }

onMounted(async () => {
  try {
    const res = await libraryService.myLibrary()
    books.value = res.data.data
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>
