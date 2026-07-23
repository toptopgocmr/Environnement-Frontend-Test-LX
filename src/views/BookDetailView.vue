<template>
  <AppLayout>
  <div class="min-h-screen" style="background:#F2F3F3;color:#16191F;font-family:'Inter',system-ui,sans-serif">

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-screen">
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
        <p style="color:#8B9EB7;font-size:13px">{{ $t('common.loading') }}</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center h-screen">
      <div class="text-center max-w-sm">
        <div style="font-size:48px;margin-bottom:16px">📚</div>
        <h2 style="color:#F1F5F9;font-size:18px;font-weight:700;margin-bottom:8px">Livre introuvable</h2>
        <p style="color:#64748B;font-size:14px;margin-bottom:24px">Ce livre n'existe pas ou a été supprimé.</p>
        <router-link to="/books" class="px-5 py-2.5 rounded text-sm font-semibold text-white" style="background:#1B6EBF">
          ← Retour au catalogue
        </router-link>
      </div>
    </div>

    <template v-else-if="book">

      <!-- ── TOP BAR (AWS-style) ──────────────────────────────────────────── -->
      <div style="background:#ffffff;border-bottom:1px solid #D5DBDB">
        <div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-1.5 text-xs" style="color:#6B7280">
            <router-link to="/" class="hover:text-blue-600 transition" style="color:#1B6EBF">Accueil</router-link>
            <span style="color:#9CA3AF">›</span>
            <router-link to="/books" class="hover:text-blue-600 transition" style="color:#1B6EBF">Catalogue</router-link>
            <span style="color:#9CA3AF">›</span>
            <span style="color:#374151">{{ book.title }}</span>
          </nav>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded text-xs font-semibold" style="background:#EBF5FB;color:#1B6EBF;border:1px solid #BDD7EE">
              {{ book.category?.name || 'Littérature' }}
            </span>
            <span v-if="book.is_free" class="px-2.5 py-1 rounded text-xs font-bold" style="background:#EAFAF1;color:#1E8449;border:1px solid #A9DFBF">GRATUIT</span>
            <span v-if="book.is_featured" class="px-2.5 py-1 rounded text-xs font-bold" style="background:#FEF9E7;color:#B7950B;border:1px solid #F9E79F">⭐ FEATURED</span>
          </div>
        </div>
      </div>

      <!-- ── PAGE HEADER (AWS resource header) ───────────────────────────── -->
      <div style="background:#ffffff;border-bottom:1px solid #D5DBDB">
        <div class="max-w-7xl mx-auto px-6 py-6">
          <div class="flex items-start gap-6">

            <!-- Cover -->
            <div class="flex-shrink-0">
              <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title"
                class="rounded-lg object-cover shadow-xl"
                style="width:120px;height:168px;border:1px solid #1E3448">
              <div v-else class="rounded-lg flex items-center justify-center"
                style="width:120px;height:168px;border:1px solid #1E3448"
                :style="bookGradient">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="white" stroke-width="1.5"/>
                </svg>
              </div>
            </div>

            <!-- Title block -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h1 style="color:#16191F;font-size:24px;font-weight:700;line-height:1.2;margin-bottom:6px">
                    {{ book.title }}
                  </h1>
                  <p style="color:#6B7280;font-size:14px;margin-bottom:10px">
                    par <span style="color:#1B6EBF;font-weight:600">{{ book.author?.name }}</span>
                    <span v-if="book.author?.domain" style="color:#9CA3AF"> · {{ book.author.domain }}</span>
                  </p>
                  <!-- Rating row -->
                  <div class="flex items-center gap-4 mb-3">
                    <div class="flex items-center gap-1">
                      <span v-for="i in 5" :key="i" style="font-size:14px"
                        :style="i <= Math.round(book.average_rating || 0) ? 'color:#F59E0B' : 'color:#D1D5DB'">★</span>
                      <span style="color:#6B7280;font-size:12px;margin-left:4px">{{ book.average_rating || '—' }}/5</span>
                    </div>
                    <span style="color:#D1D5DB">|</span>
                    <span style="color:#6B7280;font-size:12px">{{ (book.ratings_count || 0).toLocaleString('fr-FR') }} avis</span>
                    <span style="color:#D1D5DB">|</span>
                    <span style="color:#6B7280;font-size:12px">{{ (book.views || 0).toLocaleString('fr-FR') }} vues</span>
                    <span style="color:#D1D5DB">|</span>
                    <span style="color:#6B7280;font-size:12px">{{ (book.downloads || 0).toLocaleString('fr-FR') }} téléchargements</span>
                  </div>
                  <!-- Meta pills -->
                  <div class="flex flex-wrap items-center gap-2">
                    <span v-if="book.publication_year" class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs" style="background:#F8F9FA;color:#374151;border:1px solid #D5DBDB">
                      📅 {{ book.publication_year }}
                    </span>
                    <span v-if="book.pages" class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs" style="background:#F8F9FA;color:#374151;border:1px solid #D5DBDB">
                      📄 {{ book.pages }} pages
                    </span>
                    <span v-if="book.publisher" class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs" style="background:#F8F9FA;color:#374151;border:1px solid #D5DBDB">
                      🏛 {{ book.publisher }}
                    </span>
                    <span class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs" style="background:#F8F9FA;color:#374151;border:1px solid #D5DBDB">
                      🌐 {{ book.language === 'fr' ? 'Français' : (book.language || '').toUpperCase() }}
                    </span>
                    <span v-if="book.format" class="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs uppercase" style="background:#F8F9FA;color:#374151;border:1px solid #D5DBDB">
                      {{ book.format }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action panel (AWS right-side actions) -->
            <div class="flex-shrink-0 w-64">
              <div class="rounded-lg overflow-hidden" style="border:1px solid #D5DBDB;box-shadow:0 1px 4px rgba(0,0,0,.08)">
                <!-- Pricing header -->
                <div style="background:#FAFAFA;padding:14px 16px;border-bottom:1px solid #D5DBDB">
                  <div class="flex justify-between items-center mb-1">
                    <span style="color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:.05em">Numérique</span>
                    <span style="font-size:18px;font-weight:700" :style="book.is_free ? 'color:#1E8449' : 'color:#16191F'">
                      {{ book.is_free ? $t('book.free') : (book.price_formatted || formatPrice(book.price)) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span style="color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:.05em">Physique</span>
                    <span style="font-size:14px;font-weight:600;color:#B45309">
                      {{ book.print_price ? formatPrice(book.print_price) : 'Sur devis' }}
                    </span>
                  </div>
                </div>
                <!-- Buttons -->
                <div style="padding:12px;background:#ffffff;display:flex;flex-direction:column;gap:8px">
                  <!-- Lire maintenant -->
                  <!-- Lire maintenant (déjà en bibliothèque) -->
                  <router-link v-if="isInLibrary" :to="'/library/read/' + book.id"
                    class="flex items-center justify-center gap-2 w-full py-2.5 rounded text-sm font-semibold text-white"
                    style="background:#1B6EBF">
                    ▶ Lire maintenant
                  </router-link>

                  <!-- Livre GRATUIT : lecture complète sans compte -->
                  <button v-else-if="book.is_free" @click="openPreview"
                    class="flex items-center justify-center gap-2 w-full py-2.5 rounded text-sm font-semibold text-white"
                    style="background:#1E8449">
                    📖 Lire gratuitement
                  </button>

                  <!-- Livre PAYANT : aperçu extrait -->
                  <button v-else @click="openPreview"
                    class="flex items-center justify-center gap-2 w-full py-2.5 rounded text-sm font-semibold"
                    style="background:#EAFAF1;color:#1E8449;border:1px solid #A9DFBF">
                    👁 Lecture seule (extrait)
                  </button>

                  <!-- Achat numérique (livres payants uniquement) -->
                  <button v-if="!book.is_free" @click="openCheckout('digital')"
                    class="flex items-center justify-center gap-2 w-full py-2.5 rounded text-sm font-semibold text-white"
                    style="background:#1B6EBF">
                    📄 Achat numérique
                  </button>

                  <!-- Achat physique -->
                  <button @click="openCheckout('physical')"
                    class="flex items-center justify-center gap-2 w-full py-2.5 rounded text-sm font-semibold text-white"
                    style="background:#B45309">
                    📦 Achat support physique
                  </button>

                  <!-- Panier + Wishlist -->
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding-top:8px;border-top:1px solid #E5E7EB;margin-top:2px">
                    <button @click="addToCart"
                      class="flex items-center justify-center gap-1 py-2 rounded text-xs font-semibold transition"
                      :style="inCart
                        ? 'background:#EAFAF1;color:#1E8449;border:1px solid #A9DFBF'
                        : 'background:#F8F9FA;color:#374151;border:1px solid #D5DBDB'">
                      🛒 {{ inCart ? '✓ Ajouté' : 'Panier' }}
                    </button>
                    <button @click="toggleWishlist"
                      class="flex items-center justify-center gap-1 py-2 rounded text-xs font-semibold transition"
                      :style="isInWishlist
                        ? 'background:#FFF0F0;color:#C0392B;border:1px solid #F5B7B1'
                        : 'background:#F8F9FA;color:#374151;border:1px solid #D5DBDB'">
                      {{ isInWishlist ? '❤️ Souhait' : '🤍 Souhait' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── TABS ─────────────────────────────────────────────────────────── -->
      <div style="background:#ffffff;border-bottom:1px solid #D5DBDB">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex gap-0">
            <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
              class="px-5 py-3 text-sm font-medium border-b-2 transition"
              :style="activeTab === tab.key
                ? 'color:#1B6EBF;border-color:#1B6EBF'
                : 'color:#6B7280;border-color:transparent'">
              {{ tab.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── MAIN CONTENT ─────────────────────────────────────────────────── -->
      <div class="max-w-7xl mx-auto px-6 py-6">

        <!-- TAB: Résumé -->
        <div v-if="activeTab === 'summary'" class="grid grid-cols-3 gap-6">

          <!-- Left: Description + Steps -->
          <div class="col-span-2 space-y-5">

            <!-- Description -->
            <div class="rounded-lg" style="background:#ffffff;border:1px solid #D5DBDB">
              <div class="flex items-center justify-between px-5 py-3" style="border-bottom:1px solid #E5E7EB">
                <h2 style="color:#16191F;font-size:14px;font-weight:600">Résumé du livre</h2>
              </div>
              <div class="px-5 py-4">
                <p class="leading-relaxed text-sm" style="color:#4B5563" :class="{ 'line-clamp-4': !descExpanded }">{{ book.description }}</p>
                <button v-if="(book.description || '').length > 250" @click="descExpanded = !descExpanded"
                                    class="mt-2 text-xs font-semibold transition" style="color:#1B6EBF">
                  {{ descExpanded ? $t('common.close') : '...' }}
                </button>
              </div>
            </div>

            <!-- Metadata table -->
            <div class="rounded-lg" style="background:#ffffff;border:1px solid #D5DBDB">
              <div class="px-5 py-3" style="border-bottom:1px solid #E5E7EB">
                <h2 style="color:#16191F;font-size:14px;font-weight:600">{{ $t('book.details') }}</h2>
              </div>
              <table class="w-full text-sm">
                <tbody>
                  <tr class="border-b border-[#f2f3f3]">
                    <td class="px-5 py-2.5 text-xs font-semibold uppercase text-[#6B7280] w-40">{{ $t('book.category') }}</td>
                    <td class="px-5 py-2.5 text-[#374151]">{{ book.category?.name || '—' }}</td>
                  </tr>
                  <tr class="border-b border-[#f2f3f3]">
                    <td class="px-5 py-2.5 text-xs font-semibold uppercase text-[#6B7280]">{{ $t('book.language') }}</td>
                    <td class="px-5 py-2.5 text-[#374151]">{{ book.language === 'fr' ? 'Français' : (book.language || '—').toUpperCase() }}</td>
                  </tr>
                  <tr class="border-b border-[#f2f3f3]">
                    <td class="px-5 py-2.5 text-xs font-semibold uppercase text-[#6B7280]">{{ $t('book.year') }}</td>
                    <td class="px-5 py-2.5 text-[#374151]">{{ book.publication_year || '—' }}</td>
                  </tr>
                  <tr>
                    <td class="px-5 py-2.5 text-xs font-semibold uppercase text-[#6B7280]">{{ $t('book.pages') }}</td>
                    <td class="px-5 py-2.5 text-[#374151]">{{ book.pages ? `${book.pages} ${$t('book.pages')}` : '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Right sidebar -->
          <div class="col-span-1 space-y-4">
            <div class="rounded-lg p-4" style="background:#ffffff;border:1px solid #D5DBDB">
              <h3 class="text-sm font-semibold text-[#16191F] mb-3">{{ $t('book.by') }} {{ book.author?.name }}</h3>
              <p class="text-xs text-[#6B7280] leading-relaxed">{{ book.author?.bio || '—' }}</p>
            </div>
          </div>
        </div>

        <!-- TAB: Reviews -->
        <div v-if="activeTab === 'reviews'" class="max-w-2xl">
          <div class="rounded-lg" style="background:#ffffff;border:1px solid #D5DBDB">
            <div class="px-5 py-3" style="border-bottom:1px solid #E5E7EB">
              <h2 style="color:#16191F;font-size:14px;font-weight:600">{{ $t('book.reviews') }}</h2>
            </div>
            <div v-if="!reviews.length" class="px-5 py-8 text-center text-sm text-[#6B7280]">{{ $t('book.noReviews') || 'Aucun avis pour ce livre.' }}</div>
            <ul v-else class="divide-y divide-[#f2f3f3]">
              <li v-for="r in reviews" :key="r.id" class="px-5 py-4">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-semibold text-sm text-[#16191F]">{{ r.user?.name || 'Anonyme' }}</span>
                  <span class="text-xs text-[#F59E0B]">{{ '★'.repeat(r.rating) }}</span>
                </div>
                <p class="text-sm text-[#4B5563]">{{ r.comment }}</p>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </template>

    <!-- Preview modal -->
    <div v-if="showPreview" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.7)">
      <div class="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
        <div class="flex items-center justify-between px-5 py-3 border-b border-[#D5DBDB]">
          <h3 class="font-semibold text-[#16191F]">{{ book?.title }}</h3>
          <button @click="showPreview=false" class="text-[#6B7280] hover:text-[#16191F] text-xl leading-none">✕</button>
        </div>
        <div v-if="previewLoading" class="flex-1 flex items-center justify-center gap-3">
          <div class="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-[#6B7280] text-sm">Chargement de l'aperçu…</span>
        </div>
        <iframe v-else-if="previewUrl" :src="previewUrl + '#page=1'" class="flex-1 w-full border-0"></iframe>
        <div v-else class="flex-1 flex items-center justify-center flex-col gap-3 text-[#6B7280]">
          <span class="text-4xl">📄</span>
          <p class="text-sm">Aucun aperçu disponible pour ce livre.</p>
        </div>
      </div>
    </div>

  </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { bookService, wishlistService } from '@/services/api'
import { useAuthStore, useCartStore } from '@/stores/index.js'
import AppLayout from '@/components/layout/AppLayout.vue'

const { t } = useI18n()
const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()
const cart   = useCartStore()

const book         = ref(null)
const reviews      = ref([])
const loading      = ref(true)
const error        = ref(false)
const activeTab    = ref('summary')
const descExpanded = ref(false)
const showPreview  = ref(false)
const previewUrl   = ref('')
const previewLoading = ref(false)
const isInWishlist = ref(false)
const isInLibrary  = ref(false)

const tabs = computed(() => [
  { key: 'summary', label: t('book.description') },
  { key: 'reviews', label: t('book.reviews') },
])

const bookGradient = computed(() => {
  const colors = ['linear-gradient(135deg,#1a2535,#2a3f5f)','linear-gradient(135deg,#2d1b4e,#4a2d7a)','linear-gradient(135deg,#1a3a2a,#2d5e3e)']
  return { background: colors[(book.value?.id || 0) % colors.length] }
})

const inCart = computed(() => cart.items?.some(i => i.id === book.value?.id))

function formatPrice(v) {
  if (!v) return '—'
  return `${Number(v).toLocaleString('fr-FR')} XAF`
}

async function openPreview() {
  showPreview.value = true
  previewUrl.value = ''
  previewLoading.value = true
  try {
    const { data } = await bookService.preview(book.value.id)
    previewUrl.value = data.data?.preview_url ?? ''
  } catch (e) {
    console.error('Preview error:', e)
  } finally {
    previewLoading.value = false
  }
}

function openCheckout(type) {
  if (!auth.isLoggedIn) { router.push('/login'); return }
  router.push({ path: `/checkout/${book.value.id}`, query: { type } })
}

function addToCart() {
  if (!auth.isLoggedIn) { router.push('/login'); return }
  cart.add(book.value)
}

async function toggleWishlist() {
  if (!auth.isLoggedIn) { router.push('/login'); return }
  try {
    if (isInWishlist.value) {
      await wishlistService.remove(book.value.id)
      isInWishlist.value = false
    } else {
      await wishlistService.add(book.value.id)
      isInWishlist.value = true
    }
  } catch {}
}

onMounted(async () => {
  // 1. Fetch the book — only this can trigger "not found"
  try {
    const res = await bookService.get(route.params.id)
    book.value = res.data.data ?? res.data
  } catch {
    error.value = true
    loading.value = false
    return
  }

  // Reviews are already embedded in the book response (eager-loaded by show())
  if (book.value.reviews?.length) {
    reviews.value = book.value.reviews
  }

  // 2. Parallel: in-library + wishlist status (auth only, failures silent)
  if (auth.isLoggedIn) {
    const [lib, wl] = await Promise.all([
      bookService.inLibrary(route.params.id).catch(() => null),
      wishlistService.check(route.params.id).catch(() => null),
    ])
    if (lib) isInLibrary.value  = lib.data?.data?.in_library  ?? lib.data?.in_library  ?? false
    if (wl)  isInWishlist.value = wl.data?.data?.in_wishlist  ?? wl.data?.in_wishlist  ?? false
  }
  loading.value = false
})
</script>

