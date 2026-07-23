<!-- src/views/reader/OrdersView.vue — AWS Console style -->
<template>
  <AppLayout>
    <!-- Page header -->
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <p class="text-xs text-[#545b64] mb-0.5">
            <router-link to="/" class="hover:text-[#0073bb]">LireX</router-link> › Mes commandes
          </p>
          <h1 class="text-xl font-bold text-[#16191f]">Mes commandes</h1>
        </div>
        <span class="text-sm text-[#545b64]">{{ orders.length }} commande{{ orders.length !== 1 ? 's' : '' }}</span>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-5xl mx-auto px-4 py-6">

        <!-- Loading -->
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 4" :key="i"
            class="bg-white border border-[#d5dbdb] rounded overflow-hidden animate-pulse">
            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] h-10"></div>
            <div class="p-4 flex gap-4">
              <div class="w-14 h-20 bg-[#f2f3f3] rounded"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3 bg-[#f2f3f3] rounded w-2/3"></div>
                <div class="h-3 bg-[#f2f3f3] rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="orders.length === 0"
          class="bg-white border border-[#d5dbdb] rounded p-16 text-center">
          <p class="text-5xl mb-4">🧾</p>
          <h2 class="font-semibold text-[#16191f] mb-1">Aucune commande</h2>
          <p class="text-sm text-[#545b64] mb-5">Vos achats apparaîtront ici.</p>
          <router-link to="/books"
            class="inline-block bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-5 py-2 rounded text-sm transition">
            Parcourir le catalogue
          </router-link>
        </div>

        <!-- Orders table -->
        <div v-else class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
          <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-[#16191f]">Historique des commandes</h2>
            <span class="text-xs text-[#545b64]">{{ orders.length }} résultat{{ orders.length > 1 ? 's' : '' }}</span>
          </div>

          <div class="divide-y divide-[#f2f3f3]">
            <div v-for="order in orders" :key="order.id"
              class="px-4 py-4 hover:bg-[#fafafa] transition">
              <div class="flex items-start gap-4">
                <!-- Cover -->
                <router-link :to="`/books/${order.book?.id}`" class="flex-shrink-0">
                  <img v-if="order.book?.cover_url || order.book?.cover_image"
                    :src="order.book?.cover_url || order.book?.cover_image" :alt="order.book?.title"
                    class="w-12 object-cover rounded border border-[#d5dbdb]" style="height:68px"/>
                  <div v-else class="w-12 rounded border border-[#d5dbdb] flex items-center justify-center bg-[#f2f3f3]" style="height:68px">
                    <span class="text-2xl">📚</span>
                  </div>
                </router-link>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <router-link :to="`/books/${order.book?.id}`"
                        class="text-sm font-semibold text-[#0073bb] hover:underline line-clamp-1">
                        {{ order.book?.title || 'Livre' }}
                      </router-link>
                      <p class="text-xs text-[#545b64] mt-0.5">{{ order.book?.author?.name }}</p>
                    </div>
                    <span :class="['px-2.5 py-0.5 rounded text-xs font-bold flex-shrink-0', statusClass(order.payment_status)]">
                      {{ statusLabel(order.payment_status) }}
                    </span>
                  </div>

                  <div class="mt-2 flex items-center gap-6 text-xs text-[#545b64]">
                    <span><span class="text-[#16191f] font-medium">Réf:</span> {{ order.reference }}</span>
                    <span><span class="text-[#16191f] font-medium">Montant:</span>
                      <span class="text-[#ff9900] font-bold ml-1">{{ formatAmount(order) }}</span>
                    </span>
                    <span>{{ formatDate(order.created_at) }}</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex-shrink-0 flex flex-col gap-1.5">
                  <router-link v-if="order.payment_status === 'paid' && order.type !== 'print' && order.book"
                    :to="`/library/read/${order.book.id}`"
                    class="text-xs bg-[#0073bb] hover:bg-[#005276] text-white px-3 py-1.5 rounded font-semibold transition text-center">
                    📖 Lire
                  </router-link>
                  <router-link v-if="order.type === 'print'"
                    :to="`/tracking/${order.id}`"
                    class="text-xs bg-[#f2f3f3] hover:bg-[#e8f5fd] border border-[#d5dbdb] hover:border-[#0073bb] text-[#0073bb] px-3 py-1.5 rounded font-semibold transition text-center">
                    📍 Suivi
                  </router-link>
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
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { orderService } from '@/services/api'

const orders  = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await orderService.myOrders()
    orders.value = data.data?.data ?? data.data ?? []
  } catch { orders.value = [] }
  finally { loading.value = false }
})

function statusClass(status) {
  const map = {
    paid:    'bg-[#eafaf1] text-[#1d8102] border border-[#a9dfbf]',
    pending: 'bg-[#fef9e7] text-[#b7950b] border border-[#f9e79f]',
    failed:  'bg-[#fdf3f1] text-[#d13212] border border-[#f5cba7]',
  }
  return map[status] ?? 'bg-[#f2f3f3] text-[#545b64] border border-[#d5dbdb]'
}
function statusLabel(status) {
  const map = { paid: '✓ Payé', pending: '⏳ En attente', failed: '✗ Échoué' }
  return map[status] ?? status
}
function formatAmount(order) {
  if (!order.amount) return 'Gratuit'
  return `${Number(order.amount).toLocaleString('fr-FR')} ${order.currency || 'XAF'}`
}
function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
