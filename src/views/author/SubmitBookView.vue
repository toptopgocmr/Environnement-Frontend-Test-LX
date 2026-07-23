<!-- src/views/author/SubmitBookView.vue — AWS Console style -->
<template>
  <AppLayout>
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-2xl mx-auto">
        <p class="text-xs text-[#545b64] mb-0.5">LireX › Espace Auteur › Soumettre un livre</p>
        <h1 class="text-xl font-bold text-[#16191f]">Soumettre un livre</h1>
        <p class="text-xs text-[#545b64] mt-0.5">Proposez un ouvrage à la bibliothèque LireX</p>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-2xl mx-auto px-4 py-6">
        <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
          <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
            <h2 class="text-sm font-semibold text-[#16191f]">Informations du livre</h2>
          </div>
          <div class="p-5 space-y-4">

            <div v-if="success" class="p-3 bg-[#eafaf1] border border-[#a9dfbf] text-[#1d8102] rounded text-sm">{{ success }}</div>
            <div v-if="error"   class="p-3 bg-[#fdf3f1] border border-[#f5c6bf] text-[#d13212] rounded text-sm">{{ error }}</div>

            <div>
              <label class="block text-xs font-semibold text-[#545b64] mb-1">Titre *</label>
              <input v-model="form.title" placeholder="Titre de votre livre"
                class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb] focus:ring-2 focus:ring-[#0073bb]/20"/>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#545b64] mb-1">
                Description * <span class="font-normal text-[#aab7b8]">(min. 100 caractères)</span>
              </label>
              <textarea v-model="form.description" rows="4" placeholder="Résumé de votre livre…"
                class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb] focus:ring-2 focus:ring-[#0073bb]/20 resize-none"></textarea>
              <p class="text-xs text-[#aab7b8] mt-0.5 text-right">{{ form.description.length }} / 100 min</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#545b64] mb-1">Catégorie *</label>
                <select v-model="form.category_id"
                  class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb] bg-white">
                  <option value="">Sélectionner…</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#545b64] mb-1">Langue *</label>
                <select v-model="form.language"
                  class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb] bg-white">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#545b64] mb-1">Format *</label>
                <select v-model="form.format"
                  class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb] bg-white">
                  <option value="pdf">PDF</option>
                  <option value="epub">EPUB</option>
                  <option value="both">PDF + EPUB</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#545b64] mb-1">Prix (XAF)</label>
                <input v-model="form.price" type="number" min="0" placeholder="0 = Gratuit"
                  class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb]"/>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#545b64] mb-1">
                Image de couverture * <span class="font-normal text-[#aab7b8]">JPG/PNG, max 5 MB</span>
              </label>
              <input type="file" accept="image/jpeg,image/png,image/webp"
                @change="e => coverFile = e.target.files[0]"
                class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm bg-white cursor-pointer
                  file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold
                  file:bg-[#e8f5fd] file:text-[#0073bb] hover:file:bg-[#d1ecf9]"/>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#545b64] mb-1">
                Fichier livre * <span class="font-normal text-[#aab7b8]">PDF/EPUB, max 50 MB</span>
              </label>
              <input type="file" accept=".pdf,.epub"
                @change="e => bookFile = e.target.files[0]"
                class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm bg-white cursor-pointer
                  file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold
                  file:bg-[#e8f5fd] file:text-[#0073bb] hover:file:bg-[#d1ecf9]"/>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#545b64] mb-1">
                Tags <span class="font-normal text-[#aab7b8]">séparés par virgule</span>
              </label>
              <input v-model="form.tags" placeholder="roman, congo, histoire"
                class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb]"/>
            </div>

            <!-- Upload progress -->
            <div v-if="loading" class="space-y-1">
              <div class="flex justify-between text-xs text-[#545b64]">
                <span>Envoi en cours…</span><span>{{ uploadProgress }}%</span>
              </div>
              <div class="w-full bg-[#f2f3f3] rounded-full h-1.5 overflow-hidden">
                <div class="bg-[#0073bb] h-full rounded-full transition-all duration-200"
                  :style="{ width: uploadProgress + '%' }"></div>
              </div>
            </div>

            <button @click="submit" :disabled="loading"
              class="w-full bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold py-3 rounded transition text-sm disabled:opacity-50">
              {{ loading ? `Envoi… ${uploadProgress}%` : 'Soumettre pour validation' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authorService, categoryService } from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'

const router         = useRouter()
const categories     = ref([])
const coverFile      = ref(null)
const bookFile       = ref(null)
const loading        = ref(false)
const success        = ref('')
const error          = ref('')
const uploadProgress = ref(0)

const form = ref({
  title: '', description: '', category_id: '', language: 'fr',
  format: 'pdf', price: 0, tags: '',
})

onMounted(async () => {
  try {
    const { data } = await categoryService.list()
    categories.value = data.data
  } catch {}
})

async function submit() {
  error.value = ''; success.value = ''
  if (!form.value.title.trim()) { error.value = 'Le titre est obligatoire.'; return }
  if (form.value.description.length < 100) { error.value = 'La description doit faire au moins 100 caractères.'; return }
  if (!form.value.category_id) { error.value = 'Veuillez choisir une catégorie.'; return }
  if (!coverFile.value) { error.value = 'La couverture est obligatoire.'; return }
  if (!bookFile.value) { error.value = 'Le fichier livre est obligatoire.'; return }

  loading.value = true; uploadProgress.value = 0
  try {
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => {
      if (v !== null && v !== '') fd.append(k, v)
    })
    fd.append('cover_image', coverFile.value)
    fd.append('book_file', bookFile.value)
    if (Number(form.value.price) === 0) fd.append('is_free', '1')

    await authorService.submitBook(fd, p => { uploadProgress.value = p })
    success.value = 'Livre soumis avec succès ! Vous serez notifié lors de la validation.'
    form.value = { title: '', description: '', category_id: '', language: 'fr', format: 'pdf', price: 0, tags: '' }
    coverFile.value = null; bookFile.value = null
    setTimeout(() => router.push('/author/books'), 2500)
  } catch (e) {
    const msg = e.response?.data?.message
    const errs = e.response?.data?.errors
    error.value = errs ? Object.values(errs).flat().join(' ') : (msg || 'Erreur lors de la soumission.')
  } finally {
    loading.value = false
  }
}
</script>
