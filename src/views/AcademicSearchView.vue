<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Recherche académique</h1>
        <p class="text-gray-500 mt-1">Thèses, mémoires, articles, rapports de recherche</p>
      </div>

      <div class="flex gap-6">
        <!-- Filtres -->
        <aside class="w-56 flex-shrink-0 space-y-4">
          <div class="card space-y-3">
            <h3 class="font-semibold text-sm text-gray-700">Type de document</h3>
            <div v-for="type in docTypes" :key="type.value" class="flex items-center gap-2">
              <input type="checkbox" :id="type.value" :value="type.value" v-model="filters.doc_types" class="rounded" />
              <label :for="type.value" class="text-sm text-gray-700">{{ type.label }}</label>
            </div>
          </div>

          <div class="card space-y-3">
            <h3 class="font-semibold text-sm text-gray-700">Langue</h3>
            <select v-model="filters.language" class="input text-sm">
              <option value="">Toutes</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <div class="card space-y-3">
            <h3 class="font-semibold text-sm text-gray-700">Année</h3>
            <div class="flex gap-2">
              <input v-model="filters.year_from" type="number" class="input text-sm" placeholder="De" min="2000" :max="currentYear" />
              <input v-model="filters.year_to" type="number" class="input text-sm" placeholder="À" min="2000" :max="currentYear" />
            </div>
          </div>

          <div class="card space-y-3">
            <h3 class="font-semibold text-sm text-gray-700">Accès</h3>
            <div class="flex items-center gap-2">
              <input type="checkbox" id="is_free" v-model="filters.is_free" />
              <label for="is_free" class="text-sm text-gray-700">Gratuit uniquement</label>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" id="rentable" v-model="filters.allow_rental" />
              <label for="rentable" class="text-sm text-gray-700">Location disponible</label>
            </div>
          </div>

          <button @click="doSearch" class="btn-primary w-full text-sm">Appliquer les filtres</button>
          <button @click="resetFilters" class="btn-outline w-full text-sm">Réinitialiser</button>
        </aside>

        <!-- Résultats -->
        <div class="flex-1 space-y-4">
          <div class="flex items-center gap-3">
            <input
              v-model="filters.q"
              class="input flex-1"
              placeholder="Titre, auteur, université, mots-clés..."
              @keydown.enter="doSearch"
            />
            <button @click="doSearch" class="btn-primary px-6">Rechercher</button>
          </div>

          <div v-if="loading" class="text-center py-12 text-gray-400">Recherche en cours...</div>

          <div v-else-if="books.length === 0 && searched" class="text-center py-12 text-gray-400">
            Aucun résultat pour votre recherche.
          </div>

          <div v-else class="space-y-3">
            <p v-if="books.length > 0" class="text-sm text-gray-500">{{ total }} résultat(s)</p>

            <div v-for="book in books" :key="book.id" class="card hover:shadow-md transition-shadow">
              <div class="flex gap-4">
                <img :src="book.cover_url || '/img/default-cover.jpg'" class="w-16 h-20 object-cover rounded flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <RouterLink :to="`/books/${book.id}`" class="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
                      {{ book.title }}
                    </RouterLink>
                    <span class="badge bg-purple-100 text-purple-700 flex-shrink-0 text-xs">{{ docTypeLabel(book.document_type) }}</span>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">{{ book.author?.name }}</p>
                  <p v-if="book.university" class="text-xs text-gray-400">🏛️ {{ book.university }}</p>
                  <p v-if="book.field_of_study" class="text-xs text-gray-400">📚 {{ book.field_of_study }}</p>
                  <div class="flex items-center gap-3 mt-2">
                    <span class="font-semibold text-sm" :class="book.is_free ? 'text-green-600' : 'text-blue-600'">
                      {{ book.is_free ? 'Gratuit' : `${Number(book.price).toLocaleString('fr-FR')} XAF` }}
                    </span>
                    <span v-if="book.allow_rental" class="text-xs text-amber-600">⏱ Location disponible</span>
                    <span class="text-xs text-gray-400">{{ book.pages }} pages · {{ book.publication_year }}</span>
                  </div>
                  <div class="flex gap-2 mt-3">
                    <RouterLink :to="`/books/${book.id}`" class="btn-primary text-xs px-3 py-1.5">Voir le livre</RouterLink>
                    <button @click="generateCitation(book)" class="btn-outline text-xs px-3 py-1.5">📋 Citer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="lastPage > 1" class="flex justify-center gap-2 mt-6">
            <button v-for="p in lastPage" :key="p" @click="goPage(p)"
              class="w-8 h-8 rounded text-sm" :class="p === currentPage ? 'bg-blue-600 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'">
              {{ p }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal citation -->
      <div v-if="citationModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl p-6 max-w-lg w-full space-y-4">
          <h2 class="font-bold text-lg">Citation – {{ citationModal.title }}</h2>
          <div>
            <label class="block text-sm font-medium mb-1">Format</label>
            <select v-model="citationStyle" @change="fetchCitation" class="input">
              <option value="apa">APA</option>
              <option value="mla">MLA</option>
              <option value="chicago">Chicago</option>
              <option value="ieee">IEEE</option>
              <option value="harvard">Harvard</option>
            </select>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 font-mono leading-relaxed select-all">
            {{ citationText || 'Chargement...' }}
          </div>
          <div class="flex gap-3">
            <button @click="copyCitation" class="btn-outline flex-1">📋 Copier</button>
            <button @click="citationModal = null" class="btn-primary flex-1">Fermer</button>
          </div>
          <p v-if="copied" class="text-green-600 text-xs text-center">✓ Copié dans le presse-papiers</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import api, { bookService } from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'

const books    = ref([])
const loading  = ref(false)
const searched = ref(false)
const total    = ref(0)
const currentPage = ref(1)
const lastPage = ref(1)
const currentYear = new Date().getFullYear()

const citationModal = ref(null)
const citationStyle = ref('apa')
const citationText  = ref('')
const copied        = ref(false)

const filters = ref({ q: '', doc_types: [], language: '', year_from: '', year_to: '', is_free: false, allow_rental: false })

const docTypes = [
  { value: 'these',    label: 'Thèse' },
  { value: 'memoire',  label: 'Mémoire' },
  { value: 'article',  label: 'Article' },
  { value: 'manuel',   label: 'Manuel' },
  { value: 'rapport',  label: 'Rapport' },
  { value: 'revue',    label: 'Revue' },
  { value: 'guide',    label: 'Guide' },
  { value: 'roman',    label: 'Roman' },
  { value: 'essai',    label: 'Essai' },
]

async function doSearch(page = 1) {
  loading.value = true; searched.value = true
  try {
    const params = { page, per_page: 10, ...filters.value }
    if (filters.value.doc_types.length) params.document_type = filters.value.doc_types.join(',')
    const { data } = await bookService.list(params)
    books.value    = data.data.data
    total.value    = data.data.total
    lastPage.value = data.data.last_page
    currentPage.value = page
  } finally { loading.value = false }
}

function resetFilters() {
  filters.value = { q: '', doc_types: [], language: '', year_from: '', year_to: '', is_free: false, allow_rental: false }
  books.value = []; searched.value = false
}

function goPage(p) { doSearch(p) }

async function generateCitation(book) {
  citationModal.value = book
  citationText.value = ''
  await fetchCitation()
}

async function fetchCitation() {
  if (!citationModal.value) return
  try {
    const { data } = await api.post(`/books/${citationModal.value.id}/citation`, { style: citationStyle.value })
    citationText.value = data.data.citation
  } catch { citationText.value = 'Erreur lors de la génération.' }
}

async function copyCitation() {
  await navigator.clipboard.writeText(citationText.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const docTypeLabel = (t) => ({ these:'Thèse', memoire:'Mémoire', article:'Article', manuel:'Manuel', rapport:'Rapport', roman:'Roman', essai:'Essai', guide:'Guide', revue:'Revue', poesie:'Poésie', biographie:'Biographie', conference:'Conférence', nouvelle:'Nouvelle', autre:'Autre' }[t] || t)
</script>
