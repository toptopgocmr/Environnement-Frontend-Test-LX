<!-- src/views/reader/WishlistView.vue — AWS Console style -->
<template>
  <AppLayout>
    <!-- Page header -->
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <p class="text-xs text-[#545b64] mb-0.5">
            <router-link to="/" class="hover:text-[#0073bb]">LireX</router-link> › Liste de souhaits
          </p>
          <h1 class="text-xl font-bold text-[#16191f]">Liste de souhaits</h1>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-[#545b64]">{{ books.length }} ouvrage{{ books.length > 1 ? 's' : '' }}</span>
          <button v-if="books.length > 0" @click="clearAll"
            class="text-xs text-[#d13212] hover:underline border border-[#d5dbdb] hover:border-[#d13212] px-3 py-1.5 rounded transition">
            Tout retirer
          </button>
        </div>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-5xl mx-auto px-4 py-6">

        <!-- Loading -->
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i"
            class="bg-white border border-[#d5dbdb] rounded overflow-hidden animate-pulse">
            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] h-10"></div>
            <div class="p-4 flex gap-4">
              <div class="w-14 h-20 bg-[#f2f3f3] rounded"></div>
              <div class="flex-1 space-y-2 py-1">
                <div class="h-3 bg-[#f2f3f3] rounded w-3/4"></div>
                <div class="h-3 bg-[#f2f3f3] rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="books.length === 0"
          class="bg-white border border-[#d5dbdb] rounded p-16 text-center">
          <p class="text-5xl mb-4">🔖</p>
          <h2 class="font-semibold text-[#16191f] mb-1">Votre liste est vide</h2>
          <p class="text-sm text-[#545b64] mb-5">Ajoutez des livres depuis le catalogue pour les retrouver ici.</p>
          <router-link to="/books"
            class="inline-block bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-5 py-2 rounded text-sm transition">
            Parcourir le catalogue
          </router-link>
        </div>

        <!-- List -->
        <div v-else class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
          <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
            <h2 class="text-sm font-semibold text-[#16191f]">Livres sauvegardés</h2>
          </div>
          <div class="divide-y divide-[#f2f3f3]">
            <div v-for="book in books" :key="book.id"
              class="px-4 py-4 flex gap-4 hover:bg-[#fafafa] transition group">

              <!-- Cover -->
              <router-link :to="`/books/${book.id}`" class="flex-shrink-0">
                <img v-if="book.cover_url || book.cover_image"
                  :src="book.cover_url || book.cover_image" :alt="book.title"
                  class="w-14 object-cover rounded border border-[#d5dbdb]" style="height:80px"/>
                <div v-else class="w-14 rounded border border-[#d5dbdb] bg-[#f2f3f3] flex items-center justify-center"
                  style="height:80px">
                  <span class="text-2xl">📚</span>
                </div>
              </router-link>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <router-link :to="`/books/${book.id}`"
                  class="text-sm font-semibold text-[#0073bb] hover:underline line-clamp-2">
                  {{ book.title }}
                </router-link>
                <p class="text-xs text-[#545b64] mt-0.5">{{ book.author?.name }}</p>
                <div class="mt-2 flex items-center gap-3">
                  <span class="text-sm font-bold" :class="book.is_free ? 'text-[#1d8102]' : 'text-[#ff9900]'">
                    {{ book.is_free ? 'Gratuit' : `${Number(book.price).toLocaleString('fr-FR')} XAF` }}
                  </span>
                  <span v-if="book.average_rating > 0" class="text-xs text-[#aab7b8]">★ {{ book.average_rating }}</span>
                  <span v-if="book.category?.name"
                    class="text-[10px] px-2 py-0.5 bg-[#f2f3f3] rounded text-[#545b64]">
                    {{ book.category.name }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex-shrink-0 flex flex-col gap-2 justify-center">
                <router-link :to="`/books/${book.id}`"
                  class="text-xs bg-[#0073bb] hover:bg-[#005276] text-white px-4 py-1.5 rounded font-semibold transition text-center">
                  Voir
                </router-link>
                <button @click="removeFromWishlist(book.id)"
                  :disabled="removing === book.id"
                  class="text-xs text-[#d13212] hover:underline px-4 py-1.5 border border-[#d5dbdb] hover:border-[#d13212] rounded transition disabled:opacity-50">
                  {{ removing === book.id ? '…' : 'Retirer' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { libraryService } from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import { toast } from 'vue3-toastify'

const books    = ref([])
const loading  = ref(true)
const removing = ref(null)

async function fetchWishlist() {
  loading.value = true
  try {
    const { data } = await libraryService.wishlist()
    books.value = data.data?.data ?? data.data ?? []
  } finally { loading.value = false }
}

async function removeFromWishlist(bookId) {
  removing.value = bookId
  try {
    await libraryService.toggleWishlist(bookId)
    books.value = books.value.filter(b => b.id !== bookId)
    toast.success('Retiré de la liste de souhaits')
  } catch { toast.error('Erreur lors de la suppression') }
  finally { removing.value = null }
}

async function clearAll() {
  if (!confirm('Vider toute la liste de souhaits ?')) return
  for (const book of books.value) {
    await libraryService.toggleWishlist(book.id).catch(() => {})
  }
  books.value = []
  toast.success('Liste vidée')
}

onMounted(fetchWishlist)
</script>
