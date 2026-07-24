<!-- src/views/reader/CheckoutView.vue — AWS Console style -->
<template>
  <AppLayout>
    <!-- AWS Page header -->
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-5xl mx-auto">
        <p class="text-xs text-[#545b64] mb-0.5">
          <router-link to="/" class="hover:text-[#0073bb]">LireX</router-link> ›
          <button @click="router.back()" class="hover:text-[#0073bb]">Catalogue</button> › Paiement
        </p>
        <h1 class="text-xl font-bold text-[#16191f]">Finaliser l'achat</h1>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-5xl mx-auto px-4 py-6">

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="w-8 h-8 border-4 border-[#0073bb] border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="book" class="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <!-- Left column -->
          <div class="lg:col-span-2 space-y-4">

            <!-- Book summary -->
            <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
              <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
                <h3 class="text-sm font-semibold text-[#16191f]">Récapitulatif</h3>
              </div>
              <div class="p-4 flex gap-4">
                <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title"
                  class="w-16 object-cover rounded border border-[#d5dbdb] flex-shrink-0" style="height:88px"/>
                <div v-else class="w-16 rounded border border-[#d5dbdb] bg-[#f2f3f3] flex items-center justify-center flex-shrink-0" style="height:88px">
                  <span class="text-2xl">📚</span>
                </div>
                <div>
                  <h4 class="font-semibold text-[#16191f]">{{ book.title }}</h4>
                  <p class="text-sm text-[#545b64]">{{ book.author?.name }}</p>
                  <p class="font-bold text-lg text-[#ff9900] mt-2">{{ priceFormatted }}</p>
                </div>
              </div>
            </div>

            <!-- Payment method -->
            <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
              <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
                <h3 class="text-sm font-semibold text-[#16191f]">Méthode de paiement</h3>
              </div>
              <div class="p-4 space-y-4">

                <!-- Country selector -->
                <div>
                  <label class="text-xs font-semibold text-[#545b64] mb-1 block">Pays</label>
                  <div class="relative">
                    <button type="button" @click="showCountryDropdown = !showCountryDropdown"
                      class="w-full flex items-center gap-3 px-3 py-2.5 border border-[#aab7b8] rounded hover:border-[#0073bb] transition text-left focus:outline-none bg-white">
                      <img :src="`https://flagcdn.com/w20/${selectedCountry.code}.png`" width="24" height="16" class="flex-shrink-0"/>
                      <span class="flex-1 text-sm text-[#16191f]">{{ selectedCountry.name }}</span>
                      <svg class="w-4 h-4 text-[#aab7b8] transition-transform" :class="showCountryDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>
                    <div v-if="showCountryDropdown"
                      class="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-[#d5dbdb] rounded shadow-lg max-h-64 overflow-y-auto">
                      <div class="sticky top-0 bg-white p-2 border-b border-[#f2f3f3]">
                        <input v-model="countrySearch" type="text" placeholder="Rechercher…" @click.stop
                          class="w-full px-3 py-1.5 text-sm border border-[#d5dbdb] rounded focus:outline-none focus:border-[#0073bb]"/>
                      </div>
                      <div v-for="c in filteredCountries" :key="c.code" @click="selectCountry(c)"
                        class="flex items-center gap-3 px-3 py-2.5 hover:bg-[#e8f5fd] cursor-pointer transition"
                        :class="selectedCountry.code === c.code ? 'bg-[#e8f5fd]' : ''">
                        <img :src="`https://flagcdn.com/w20/${c.code}.png`" width="20" height="14"/>
                        <span class="flex-1 text-sm text-[#16191f]">{{ c.name }}</span>
                        <span class="text-xs text-[#aab7b8]">{{ c.dial }}</span>
                      </div>
                      <div v-if="filteredCountries.length === 0" class="px-4 py-5 text-center text-sm text-[#545b64]">Aucun pays trouvé</div>
                    </div>
                  </div>
                </div>

                <!-- Operator selection -->
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-[#545b64] mb-1 block">Opérateur</label>
                  <label v-for="op in selectedCountry.operators" :key="op.id"
                    class="flex items-center gap-3 p-3 border rounded cursor-pointer transition"
                    :class="payment.method === op.id ? 'border-[#0073bb] bg-[#e8f5fd]' : 'border-[#d5dbdb] hover:border-[#aab7b8]'">
                    <input type="radio" :value="op.id" v-model="payment.method" class="accent-[#0073bb]"/>
                    <span v-html="op.logo" class="flex-shrink-0 w-8 h-8 overflow-hidden rounded"></span>
                    <div>
                      <p class="text-sm font-semibold text-[#16191f]">{{ op.label }}</p>
                      <p class="text-xs text-[#545b64]">{{ op.sub }}</p>
                    </div>
                  </label>
                </div>

                <!-- Phone number -->
                <div v-if="isMobileMoney">
                  <label class="text-xs font-semibold text-[#545b64] mb-1 block">Numéro de téléphone</label>
                  <div class="flex border border-[#aab7b8] rounded overflow-hidden focus-within:border-[#0073bb] focus-within:ring-2 focus-within:ring-[#0073bb]/20">
                    <span class="bg-[#f2f3f3] border-r border-[#d5dbdb] px-3 py-2.5 text-sm font-semibold text-[#545b64] flex items-center gap-2 flex-shrink-0">
                      <img :src="`https://flagcdn.com/w20/${selectedCountry.code}.png`" width="20" height="14"/>
                      {{ selectedCountry.dial }}
                    </span>
                    <input v-model="phoneLocal" type="tel" :placeholder="selectedCountry.phonePlaceholder || '06 XXX XX XX'"
                      class="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-white"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: order summary -->
          <div>
            <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden sticky top-24">
              <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
                <h3 class="text-sm font-semibold text-[#16191f]">Votre commande</h3>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex justify-between text-sm text-[#545b64]">
                  <span>Prix</span><span>{{ priceFormatted }}</span>
                </div>
                <div class="flex justify-between text-sm text-[#545b64]">
                  <span>Frais de service</span><span class="text-[#1d8102]">0 XAF</span>
                </div>
                <div class="border-t border-[#f2f3f3] pt-3 flex justify-between font-bold text-[#16191f]">
                  <span>Total</span><span class="text-[#ff9900]">{{ priceFormatted }}</span>
                </div>
                <button @click="pay" :disabled="paying"
                  class="w-full mt-2 bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] py-3 rounded font-bold text-sm transition disabled:opacity-50">
                  {{ paying ? 'Traitement…' : `Payer ${priceFormatted}` }}
                </button>
                <p class="text-center text-xs text-[#aab7b8]">🔒 Paiement sécurisé</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { bookService, orderService } from '@/services/api'

const route = useRoute()
const router = useRouter()
const book = ref(null)
const loading = ref(true)
const paying = ref(false)
const phoneLocal = ref('')
const payment = ref({ method: '' })
const showCountryDropdown = ref(false)
const countrySearch = ref('')

// Logos SVG
const logos = {
  peex: `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#0073bb"/><text x="20" y="24" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="9" fill="#fff">peex</text></svg>`,
  card: `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#1a1f71"/><rect x="4" y="14" width="32" height="5" fill="#f7b731"/><rect x="4" y="24" width="14" height="4" rx="1" fill="#fff" opacity="0.8"/></svg>`,
}

const OP_CARD = { id: 'stripe', logo: logos.card, label: 'Carte bancaire', sub: 'Visa, Mastercard', type: 'card' }
const OP_PEEX = { id: 'peex', logo: logos.peex, label: 'Mobile Money (Peex)', sub: 'MTN, Orange, Airtel…', type: 'mobile' }

const countries = [
  // Afrique centrale
  { code: 'cg', name: 'Congo (Brazzaville)', dial: '+242', phonePlaceholder: '06 XXX XX XX', operators: [OP_PEEX, OP_CARD] },
  { code: 'cd', name: 'Congo (RDC)', dial: '+243', phonePlaceholder: '08X XXX XXXX', operators: [OP_PEEX, OP_CARD] },
  { code: 'cm', name: 'Cameroun', dial: '+237', phonePlaceholder: '6XX XXX XXX', operators: [OP_PEEX, OP_CARD] },
  { code: 'ga', name: 'Gabon', dial: '+241', phonePlaceholder: '07 XX XX XX', operators: [OP_PEEX, OP_CARD] },
  { code: 'cf', name: 'Centrafrique', dial: '+236', phonePlaceholder: '7X XX XX XX', operators: [OP_PEEX, OP_CARD] },
  { code: 'td', name: 'Tchad', dial: '+235', phonePlaceholder: '6X XX XX XX', operators: [OP_PEEX, OP_CARD] },
  // Afrique de l'ouest francophone
  { code: 'ci', name: "Côte d'Ivoire", dial: '+225', phonePlaceholder: '07 XX XX XX XX', operators: [OP_PEEX, OP_CARD] },
  { code: 'sn', name: 'Sénégal', dial: '+221', phonePlaceholder: '7X XXX XX XX', operators: [OP_PEEX, OP_CARD] },
  { code: 'ml', name: 'Mali', dial: '+223', phonePlaceholder: '7X XX XX XX', operators: [OP_PEEX, OP_CARD] },
  { code: 'bf', name: 'Burkina Faso', dial: '+226', phonePlaceholder: '7X XX XX XX', operators: [OP_PEEX, OP_CARD] },
  { code: 'gn', name: 'Guinée', dial: '+224', phonePlaceholder: '6XX XXX XXX', operators: [OP_PEEX, OP_CARD] },
  { code: 'ne', name: 'Niger', dial: '+227', phonePlaceholder: '9X XX XX XX', operators: [OP_PEEX, OP_CARD] },
  { code: 'bj', name: 'Bénin', dial: '+229', phonePlaceholder: '9X XX XX XX', operators: [OP_PEEX, OP_CARD] },
  { code: 'tg', name: 'Togo', dial: '+228', phonePlaceholder: '9X XX XX XX', operators: [OP_PEEX, OP_CARD] },
  // Afrique de l'est
  { code: 'ke', name: 'Kenya', dial: '+254', phonePlaceholder: '07X XXX XXXX', operators: [OP_PEEX, OP_CARD] },
  { code: 'rw', name: 'Rwanda', dial: '+250', phonePlaceholder: '07X XXX XXX', operators: [OP_PEEX, OP_CARD] },
  { code: 'tz', name: 'Tanzanie', dial: '+255', phonePlaceholder: '07X XXX XXXX', operators: [OP_PEEX, OP_CARD] },
  { code: 'mg', name: 'Madagascar', dial: '+261', phonePlaceholder: '03X XX XXX XX', operators: [OP_PEEX, OP_CARD] },
  // Afrique de l'ouest anglophone
  { code: 'ng', name: 'Nigeria', dial: '+234', phonePlaceholder: '080 XXXX XXXX', operators: [OP_PEEX, OP_CARD] },
  { code: 'gh', name: 'Ghana', dial: '+233', phonePlaceholder: '024 XXX XXXX', operators: [OP_PEEX, OP_CARD] },
]

const selectedCountry = ref(countries[0])

const filteredCountries = computed(() => {
  const q = countrySearch.value.toLowerCase().trim()
  if (!q) return countries
  return countries.filter(c => c.name.toLowerCase().includes(q) || c.dial.includes(q))
})

function selectCountry(c) {
  selectedCountry.value = c
  payment.value.method = c.operators[0]?.id ?? ''
  phoneLocal.value = ''
  showCountryDropdown.value = false
  countrySearch.value = ''
}

function onClickOutside(e) {
  if (!e.target.closest('.relative')) showCountryDropdown.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

watch(selectedCountry, (c) => {
  payment.value.method = c.operators[0]?.id ?? ''
})

const isMobileMoney = computed(() => {
  const op = selectedCountry.value.operators.find(o => o.id === payment.value.method)
  return op?.type === 'mobile'
})

const priceFormatted = computed(() => {
  if (!book.value) return ''
  if (book.value.is_free) return 'Gratuit'
  const price = parseFloat(book.value.price)
  const currency = book.value.currency || 'XAF'
  return isNaN(price) ? 'N/A' : `${price.toLocaleString('fr-FR')} ${currency}`
})

onMounted(async () => {
  try {
    const { data } = await bookService.show(route.params.bookId)
    book.value = data.data
  } catch (e) {
    console.error('[Checkout] Erreur chargement livre:', e)
  } finally {
    loading.value = false
  }
  payment.value.method = selectedCountry.value.operators[0]?.id ?? ''
})

async function pay() {
  paying.value = true
  try {
    const fullPhone = isMobileMoney.value
      ? selectedCountry.value.dial + phoneLocal.value.replace(/\s/g, '')
      : ''
    await orderService.initiate({
      book_id: book.value.id,
      payment_method: payment.value.method,
      phone: fullPhone,
      country: selectedCountry.value.code.toUpperCase(),
    })
    router.push({ name: 'library' })
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur de paiement')
  } finally {
    paying.value = false
  }
}
</script>
