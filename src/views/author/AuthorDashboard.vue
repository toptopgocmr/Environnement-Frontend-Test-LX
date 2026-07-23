<template>
  <AppLayout>
    <!-- AWS page header -->
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div>
          <p class="text-xs text-[#545b64] mb-0.5">LireX › Espace Auteur</p>
          <h1 class="text-xl font-bold text-[#16191f]">Espace Auteur</h1>
          <p class="text-xs text-[#545b64] mt-0.5">Bonjour, {{ auth.user?.name }}</p>
        </div>
        <router-link to="/author/books/new"
          class="bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-4 py-2 rounded text-sm transition">
          + Publier un ouvrage
        </router-link>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-6xl mx-auto px-4 py-6 space-y-4">

        <!-- KPIs -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div v-for="kpi in kpis" :key="kpi.label" class="bg-white border border-[#d5dbdb] rounded p-4">
            <div class="text-2xl mb-1">{{ kpi.icon }}</div>
            <div class="text-2xl font-bold text-[#16191f]">{{ kpi.value }}</div>
            <div class="text-xs text-[#545b64] mt-0.5">{{ kpi.label }}</div>
            <div v-if="kpi.trend" class="mt-1 text-xs" :class="kpi.trend > 0 ? 'text-[#1d8102]' : 'text-[#d13212]'">
              {{ kpi.trend > 0 ? '↑' : '↓' }} {{ Math.abs(kpi.trend) }}% ce mois
            </div>
          </div>
        </div>

        <!-- Balance + Chart -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Balance card -->
          <div class="bg-[#232f3e] rounded overflow-hidden">
            <div class="px-5 py-4">
              <p class="text-[#aab7b8] text-xs font-medium">Solde disponible</p>
              <p class="text-white text-3xl font-bold mt-1">{{ formatCFA(stats?.pending_balance || 0) }}</p>
              <p class="text-[#aab7b8] text-xs mt-1">Total cumulé : {{ formatCFA(stats?.total_earnings || 0) }}</p>
            </div>
            <div class="px-5 pb-4">
              <router-link to="/author/earnings"
                class="block text-center py-2 rounded text-sm font-semibold text-[#232f3e] bg-[#ff9900] hover:bg-[#e88900] transition">
                Retirer mes fonds →
              </router-link>
            </div>
          </div>

          <!-- Revenue chart -->
          <div class="lg:col-span-2 bg-white border border-[#d5dbdb] rounded overflow-hidden">
            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
              <h2 class="text-sm font-semibold text-[#16191f]">Revenus des 6 derniers mois</h2>
            </div>
            <div class="p-4">
              <canvas id="revenueChart" height="100"></canvas>
            </div>
          </div>
        </div>

        <!-- Books table -->
        <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
          <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-[#16191f]">Mes ouvrages</h2>
            <router-link to="/author/books" class="text-xs text-[#0073bb] hover:underline">Voir tout →</router-link>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-[#545b64] border-b border-[#f2f3f3] bg-[#fafafa]">
                  <th class="px-4 py-2.5 text-left text-xs font-semibold">Titre</th>
                  <th class="px-4 py-2.5 text-left text-xs font-semibold">Statut</th>
                  <th class="px-4 py-2.5 text-right text-xs font-semibold">Ventes</th>
                  <th class="px-4 py-2.5 text-right text-xs font-semibold">Revenus</th>
                  <th class="px-4 py-2.5 text-right text-xs font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#f2f3f3]">
                <tr v-for="book in topBooks" :key="book.id" class="hover:bg-[#fafafa] transition">
                  <td class="px-4 py-3 flex items-center gap-3">
                    <img :src="book.cover_url || '/img/default-cover.jpg'" class="w-8 h-10 rounded object-cover border border-[#d5dbdb]"/>
                    <span class="line-clamp-1 max-w-xs text-[#0073bb]">{{ book.title }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded text-xs font-semibold" :class="statusClass(book.status)">
                      {{ statusLabel(book.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right text-[#16191f]">{{ book.orders_count || 0 }}</td>
                  <td class="px-4 py-3 text-right text-[#1d8102] font-semibold">{{ formatCFA(book.total_revenue || 0) }}</td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex justify-end gap-1">
                      <router-link :to="`/author/books/${book.id}/stats`"
                        class="p-1.5 rounded hover:bg-[#f2f3f3] text-[#0073bb] transition text-xs">📊</router-link>
                      <router-link :to="`/author/books/${book.id}/edit`"
                        class="p-1.5 rounded hover:bg-[#f2f3f3] text-[#545b64] transition text-xs">✏️</router-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="!topBooks.length">
                  <td colspan="5" class="px-4 py-8 text-center text-[#aab7b8] text-sm">Aucun ouvrage publié</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/index'
import { authorService } from '@/services/api'

const auth = useAuthStore()
const stats    = ref(null)
const topBooks = ref([])

const kpis = computed(() => [
  { icon:'📚', label:'Livres publiés',   value: stats.value?.books_count || 0,   trend: null },
  { icon:'🛒', label:'Ventes totales',   value: stats.value?.total_sales || 0,   trend: 12 },
  { icon:'💰', label:'Revenus (FCFA)',   value: formatCFA(stats.value?.total_earnings || 0), trend: 8 },
  { icon:'👥', label:'Abonnés',          value: stats.value?.followers_count || 0, trend: null },
])

onMounted(async () => {
  try {
    const res  = await authorService.dashboard()
    stats.value    = res.data.stats
    topBooks.value = res.data.top_books || []
    await nextTick()
    initChart()
  } catch (e) { console.error(e) }
})

const initChart = () => {
  const ctx = document.getElementById('revenueChart')
  if (!ctx || !stats.value?.monthly_revenue) return
  const mr = stats.value.monthly_revenue
  new window.Chart(ctx, {
    type: 'line',
    data: {
      labels: mr.map(m => m.month),
      datasets: [{
        label: 'Revenus (FCFA)',
        data: mr.map(m => m.revenue),
        borderColor: '#38BDF8',
        backgroundColor: 'rgba(56,189,248,0.1)',
        tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#38BDF8',
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: {
      x: { grid: { color:'#1E3A6A' }, ticks: { color:'#94A3B8' } },
      y: { grid: { color:'#1E3A6A' }, ticks: { color:'#94A3B8' } }
    }}
  })
}

const formatCFA = (v) => new Intl.NumberFormat('fr-FR').format(v) + ' FCFA'

const statusLabel = (s) => ({ draft:'Brouillon', pending:'En attente', published:'Publié', rejected:'Rejeté', suspended:'Suspendu' }[s] || s)
const statusClass = (s) => ({ draft:'bg-[#f2f3f3] text-[#545b64]', pending:'bg-[#fef9e7] text-[#b7950b]', published:'bg-[#eafaf1] text-[#1d8102]', rejected:'bg-[#fdf3f1] text-[#d13212]', suspended:'bg-[#fdebd0] text-[#d35400]' }[s] || '')
</script>
