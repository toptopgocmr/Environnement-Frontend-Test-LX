<!-- src/views/CartView.vue — AWS Console style -->
<template>
  <AppLayout>
    <!-- Page header -->
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <p class="text-xs text-[#545b64] mb-0.5">
            <router-link to="/books" class="hover:text-[#0073bb]">LireX</router-link>
            <span class="mx-1">›</span>{{ $t('cart.title') }}
          </p>
          <h1 class="text-xl font-bold text-[#16191f]">{{ $t('cart.title') }}</h1>
        </div>
        <span class="text-sm text-[#545b64]">{{ cart.items.length }} {{ $t('cart.subtitle') }}</span>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-7xl mx-auto px-4 py-6">

        <!-- Empty cart -->
        <div v-if="cart.items.length === 0"
          class="bg-white border border-[#d5dbdb] rounded p-16 text-center">
          <p class="text-5xl mb-4">🛒</p>
          <h2 class="font-semibold text-[#16191f] text-lg mb-1">{{ $t('cart.empty') }}</h2>
          <p class="text-sm text-[#545b64] mb-5">{{ $t('cart.emptyHint') }}</p>
          <router-link to="/books"
            class="inline-block bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-5 py-2 rounded text-sm transition">
            {{ $t('cart.browse') }}
          </router-link>
        </div>

        <!-- Cart items + summary -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <!-- Items list -->
          <div class="lg:col-span-2 space-y-3">
            <div v-for="book in cart.items" :key="book.id"
              class="bg-white border border-[#d5dbdb] rounded overflow-hidden hover:border-[#0073bb] transition">

              <!-- Item header -->
              <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2 flex items-center justify-between">
                <router-link :to="`/books/${book.id}`"
                  class="text-sm font-semibold text-[#0073bb] hover:underline line-clamp-1">
                  {{ book.title }}
                </router-link>
                <button @click="cart.remove(book.id)"
                  class="text-xs text-[#d13212] hover:underline ml-4 flex-shrink-0">
                  {{ $t('cart.remove') }}
                </button>
              </div>

              <!-- Item body -->
              <div class="px-4 py-3 flex gap-4 items-center">
                <router-link :to="`/books/${book.id}`" class="flex-shrink-0">
                  <img v-if="book.cover_url || book.cover_image"
                    :src="book.cover_url || book.cover_image" :alt="book.title"
                    class="w-14 object-cover rounded border border-[#d5dbdb]" style="height:80px"/>
                  <div v-else class="w-14 rounded border border-[#d5dbdb] flex items-center justify-center"
                    style="height:80px" :style="{ background: bookGradient(book) }">
                    <svg width="20" height="20" viewBox="0 0 36 32" fill="none">
                      <path d="M2 3C2 1.9 2.9 1 4 1H17V31H4C2.9 31 2 30.1 2 29V3Z" stroke="white" stroke-width="1.6" fill="white" fill-opacity="0.2"/>
                      <path d="M19 1H32C33.1 1 34 1.9 34 3V29C34 30.1 33.1 31 32 31H19V1Z" stroke="white" stroke-width="1.6" fill="white" fill-opacity="0.2"/>
                    </svg>
                  </div>
                </router-link>

                <div class="flex-1 min-w-0">
                  <p class="text-xs text-[#545b64]">{{ book.author?.name }}</p>
                  <p class="text-xs text-[#545b64] mt-1">
                    <span class="px-2 py-0.5 bg-[#f2f3f3] rounded text-[10px] font-medium">{{ book.category?.name || 'Livre' }}</span>
                  </p>
                </div>

                <div class="flex-shrink-0 text-right">
                  <p class="text-lg font-bold" :class="book.is_free ? 'text-[#1d8102]' : 'text-[#ff9900]'">
                    {{ book.is_free ? $t('book.free') : formatPrice(book) }}
                  </p>
                  <router-link
                    :to="book.is_free ? `/library/read/${book.id}` : `/checkout/${book.id}`"
                    class="mt-2 inline-block text-xs bg-[#0073bb] hover:bg-[#005276] text-white px-4 py-1.5 rounded font-semibold transition">
                    {{ book.is_free ? $t('cart.read') : $t('cart.buy') }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary panel -->
          <div class="lg:col-span-1">
            <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden sticky top-4">
              <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
                <h3 class="text-sm font-semibold text-[#16191f]">{{ $t('cart.summary') }}</h3>
              </div>
              <div class="p-4 space-y-2">
                <div v-for="book in cart.items" :key="book.id"
                  class="flex justify-between text-xs text-[#545b64]">
                  <span class="truncate mr-2 max-w-[140px]">{{ book.title }}</span>
                  <span class="font-medium flex-shrink-0 text-[#16191f]">
                    {{ book.is_free ? $t('book.free') : formatPrice(book) }}
                  </span>
                </div>
                <div class="border-t border-[#d5dbdb] pt-2 mt-2 flex justify-between text-sm font-bold">
                  <span class="text-[#16191f]">Total</span>
                  <span class="text-[#ff9900]">{{ totalFormatted }}</span>
                </div>
              </div>
              <div class="px-4 pb-4">
                <p class="text-[10px] text-[#aab7b8] text-center mb-3">{{ $t('cart.separateNote') }}</p>
                <button @click="cart.clear()"
                  class="w-full text-xs text-[#d13212] hover:bg-[#fdf3f1] py-2 border border-[#d5dbdb] hover:border-[#d13212] rounded transition">
                  {{ $t('cart.clear') }}
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useCartStore } from '@/stores/index'

const { t } = useI18n()
const router = useRouter()
const cart = useCartStore()

const GRADIENTS = [
  'linear-gradient(160deg,#1e3a5f,#2563eb)', 'linear-gradient(160deg,#3b1f5e,#7c3aed)',
  'linear-gradient(160deg,#064e3b,#059669)', 'linear-gradient(160deg,#7c2d12,#d97706)',
  'linear-gradient(160deg,#1e1e2e,#4338ca)', 'linear-gradient(160deg,#831843,#ec4899)',
]
function bookGradient(book) { return GRADIENTS[(book.id || 0) % GRADIENTS.length] }

function formatPrice(book) {
  const price = parseFloat(book.price)
  const cur   = book.currency || 'XAF'
  return isNaN(price) ? 'N/A' : `${price.toLocaleString('fr-FR')} ${cur}`
}

const totalFormatted = computed(() => {
  const paid = cart.items.filter(b => !b.is_free)
  if (paid.length === 0) return t('book.free')
  const sum = paid.reduce((a, b) => a + (parseFloat(b.price) || 0), 0)
  const cur = paid[0]?.currency || 'XAF'
  return `${sum.toLocaleString('fr-FR')} ${cur}`
})
</script>
