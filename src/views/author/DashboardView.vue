<!-- src/views/author/DashboardView.vue — AWS Console style -->
<template>
  <AppLayout>
    <!-- AWS page header -->
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <p class="text-xs text-[#545b64] mb-0.5">LireX › Espace Auteur</p>
          <h1 class="text-xl font-bold text-[#16191f]">Tableau de bord Auteur</h1>
          <p class="text-xs text-[#545b64] mt-0.5">Bienvenue, {{ auth.user?.name }}</p>
        </div>
        <router-link to="/author/books/new"
          class="bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-4 py-2 rounded text-sm transition flex items-center gap-2">
          <span>+</span> Soumettre un livre
        </router-link>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-5xl mx-auto px-4 py-6 space-y-5">

        <!-- KPI cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <template v-if="loading">
            <div v-for="i in 4" :key="i"
              class="bg-white border border-[#d5dbdb] rounded p-4 animate-pulse">
              <div class="h-7 bg-[#f2f3f3] rounded w-1/2 mb-2"></div>
              <div class="h-3 bg-[#f2f3f3] rounded w-3/4"></div>
            </div>
          </template>
          <template v-else>
            <div class="bg-white border border-[#d5dbdb] rounded p-4">
              <p class="text-2xl font-bold text-[#0073bb]">{{ stats.books || 0 }}</p>
              <p class="text-xs text-[#545b64] mt-1">Livres soumis</p>
              <p class="text-xs text-[#1d8102] mt-0.5">{{ stats.published || 0 }} publiés</p>
            </div>
            <div class="bg-white border border-[#d5dbdb] rounded p-4">
              <p class="text-2xl font-bold text-[#1d8102]">{{ stats.total_sales || 0 }}</p>
              <p class="text-xs text-[#545b64] mt-1">Ventes totales</p>
            </div>
            <div class="bg-white border border-[#d5dbdb] rounded p-4">
              <p class="text-2xl font-bold text-[#ff9900]">{{ fmt(stats.total_earned) }}</p>
              <p class="text-xs text-[#545b64] mt-1">Gains cumulés</p>
            </div>
            <div class="bg-white border border-[#d5dbdb] rounded p-4">
              <p class="text-2xl font-bold text-[#8b5cf6]">{{ fmt(stats.pending_balance) }}</p>
              <p class="text-xs text-[#545b64] mt-1">Solde disponible</p>
            </div>
          </template>
        </div>

        <!-- Quick actions panel -->
        <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
          <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
            <h2 class="text-sm font-semibold text-[#16191f]">Actions rapides</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#f2f3f3]">
            <router-link to="/author/books/new"
              class="flex items-center gap-3 px-5 py-4 hover:bg-[#f2f3f3] transition group">
              <div class="w-9 h-9 bg-[#e8f5fd] rounded flex items-center justify-center text-lg flex-shrink-0">📝</div>
              <div>
                <p class="text-sm font-semibold text-[#0073bb] group-hover:underline">Soumettre un livre</p>
                <p class="text-xs text-[#545b64]">Proposer un nouvel ouvrage</p>
              </div>
            </router-link>
            <router-link to="/author/books"
              class="flex items-center gap-3 px-5 py-4 hover:bg-[#f2f3f3] transition group">
              <div class="w-9 h-9 bg-[#f2f3f3] rounded flex items-center justify-center text-lg flex-shrink-0">📚</div>
              <div>
                <p class="text-sm font-semibold text-[#0073bb] group-hover:underline">Mes livres</p>
                <p class="text-xs text-[#545b64]">Gérer votre catalogue</p>
              </div>
            </router-link>
            <router-link to="/author/earnings"
              class="flex items-center gap-3 px-5 py-4 hover:bg-[#f2f3f3] transition group">
              <div class="w-9 h-9 bg-[#eafaf1] rounded flex items-center justify-center text-lg flex-shrink-0">💰</div>
              <div>
                <p class="text-sm font-semibold text-[#0073bb] group-hover:underline">Mes revenus</p>
                <p class="text-xs text-[#545b64]">Historique des gains</p>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Recent books table -->
        <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
          <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-[#16191f]">Livres récents</h2>
            <router-link to="/author/books" class="text-xs text-[#0073bb] hover:underline">Voir tout →</router-link>
          </div>

          <!-- Skeleton -->
          <div v-if="loadingBooks" class="divide-y divide-[#f2f3f3]">
            <div v-for="i in 3" :key="i" class="flex gap-3 px-4 py-3 animate-pulse">
              <div class="w-10 h-14 bg-[#f2f3f3] rounded flex-shrink-0"></div>
              <div class="flex-1 space-y-2 py-1">
                <div class="h-3 bg-[#f2f3f3] rounded w-3/4"></div>
                <div class="h-3 bg-[#f2f3f3] rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="recentBooks.length === 0"
            class="px-4 py-10 text-center text-sm text-[#545b64]">
            Aucun livre soumis pour l'instant.
          </div>

          <!-- Rows -->
          <div v-else class="divide-y divide-[#f2f3f3]">
            <div v-for="book in recentBooks" :key="book.id"
              class="flex items-center gap-4 px-4 py-3 hover:bg-[#fafafa] transition">
              <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title"
                class="w-10 h-14 object-cover rounded border border-[#d5dbdb] flex-shrink-0"/>
              <div v-else
                class="w-10 h-14 rounded border border-[#d5dbdb] bg-[#f2f3f3] flex items-center justify-center flex-shrink-0">
                <span class="text-lg">📖</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-[#0073bb] truncate hover:underline cursor-pointer">
                  {{ book.title }}
                </p>
                <p class="text-xs text-[#545b64]">{{ book.category?.name }}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <span :class="['px-2 py-0.5 rounded text-xs font-semibold', statusClass(book.status)]">
                  {{ statusLabel(book.status) }}
                </span>
                <p class="text-xs text-[#aab7b8] mt-1">{{ book.orders_count || 0 }} ventes</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Espace Auteur complet banner -->
        <div class="bg-white border border-[#d5dbdb] rounded px-5 py-4 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-[#16191f]">🖥 Espace Auteur complet (backend)</p>
            <p class="text-xs text-[#545b64] mt-0.5">Gérez vos forfaits, statistiques détaillées et retraits</p>
          </div>
          <a href="/author" target="_blank"
            class="bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] text-xs font-semibold px-4 py-2 rounded transition">
            Ouvrir →
          </a>
        </div>

      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { authorService } from '@/services/api'
import { useAuthStore } from '@/stores/index.js'
import AppLayout from '@/components/layout/AppLayout.vue'

const auth         = useAuthStore()
const stats        = ref({})
const recentBooks  = ref([])
const loading      = ref(true)
const loadingBooks = ref(true)

const fmt = v => v ? `${Number(v).toLocaleString('fr-FR')} XAF` : '0 XAF'

const statusLabel = s => ({ draft:'Brouillon', pending:'En attente', published:'Publié', rejected:'Rejeté', suspended:'Suspendu' }[s] || s)
const statusClass = s => ({
  published: 'bg-[#eafaf1] text-[#1d8102]',
  pending:   'bg-[#fef9e7] text-[#b7950b]',
  rejected:  'bg-[#fdf3f1] text-[#d13212]',
  draft:     'bg-[#f2f3f3] text-[#545b64]',
  suspended: 'bg-[#fdebd0] text-[#d35400]',
}[s] || 'bg-[#f2f3f3] text-[#545b64]')

onMounted(async () => {
  try { const { data } = await authorService.dashboard(); stats.value = data.data.stats }
  finally { loading.value = false }
  try { const { data } = await authorService.myBooks({ per_page: 5 }); recentBooks.value = data.data.data ?? [] }
  finally { loadingBooks.value = false }
})
</script>
