<!-- src/views/reader/PhysicalOrderView.vue — AWS Console style -->
<template>
  <AppLayout>
    <!-- AWS page header -->
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-3xl mx-auto">
        <p class="text-xs text-[#545b64] mb-0.5">
          <router-link to="/" class="hover:text-[#0073bb]">LireX</router-link> › Commande physique
        </p>
        <h1 class="text-xl font-bold text-[#16191f]">Commander le livre physique</h1>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-3xl mx-auto px-4 py-6 space-y-4">

        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="w-8 h-8 border-4 border-[#0073bb] border-t-transparent rounded-full animate-spin"></div>
        </div>

        <template v-else-if="book">

          <!-- Success -->
          <div v-if="success" class="bg-white border border-[#d5dbdb] rounded p-8 text-center">
            <p class="text-4xl mb-3">✅</p>
            <h2 class="font-bold text-[#1d8102] mb-1">Commande passée avec succès !</h2>
            <p class="text-sm text-[#545b64]">Vous serez notifié du suivi de livraison. Redirection en cours…</p>
          </div>

          <template v-else>
            <!-- Book summary -->
            <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
              <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
                <h2 class="text-sm font-semibold text-[#16191f]">Récapitulatif</h2>
              </div>
              <div class="p-4 flex gap-4">
                <img :src="book.cover_url || '/img/default-cover.jpg'" :alt="book.title"
                  class="w-14 object-cover rounded border border-[#d5dbdb] flex-shrink-0" style="height:80px"/>
                <div>
                  <p class="font-semibold text-[#16191f]">{{ book.title }}</p>
                  <p class="text-sm text-[#545b64]">{{ book.author?.name }}</p>
                  <p class="text-[#ff9900] font-bold mt-1">
                    {{ book.physical_price ? `${Number(book.physical_price).toLocaleString('fr-FR')} XAF` : 'Prix non défini' }}
                  </p>
                  <p class="text-xs text-[#aab7b8]">Stock : {{ book.physical_stock }} exemplaire(s)</p>
                </div>
              </div>
            </div>

            <!-- Error -->
            <div v-if="error" class="bg-[#fdf3f1] border border-[#f5c6bf] text-[#d13212] px-4 py-3 rounded text-sm">
              {{ error }}
            </div>

            <!-- Shipping address -->
            <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
              <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
                <h2 class="text-sm font-semibold text-[#16191f]">Adresse de livraison</h2>
              </div>
              <div class="p-4 grid grid-cols-2 gap-3">
                <div class="col-span-2">
                  <label class="block text-xs font-semibold text-[#545b64] mb-1">Nom complet *</label>
                  <input v-model="form.full_name" placeholder="Jean Dupont"
                    class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb]"/>
                </div>
                <div class="col-span-2">
                  <label class="block text-xs font-semibold text-[#545b64] mb-1">Téléphone *</label>
                  <input v-model="form.phone_shipping" placeholder="+242 06 000 0000"
                    class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb]"/>
                </div>
                <div class="col-span-2">
                  <label class="block text-xs font-semibold text-[#545b64] mb-1">Adresse *</label>
                  <input v-model="form.address_line1" placeholder="Rue, quartier…"
                    class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb]"/>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-[#545b64] mb-1">Ville *</label>
                  <input v-model="form.city" placeholder="Brazzaville"
                    class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb]"/>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-[#545b64] mb-1">Pays</label>
                  <select v-model="form.country"
                    class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb]">
                    <option value="CG">🇨🇬 Congo (Brazza)</option>
                    <option value="CD">🇨🇩 Congo (RDC)</option>
                    <option value="CM">🇨🇲 Cameroun</option>
                    <option value="GA">🇬🇦 Gabon</option>
                    <option value="SN">🇸🇳 Sénégal</option>
                    <option value="CI">🇨🇮 Côte d'Ivoire</option>
                    <option value="OTHER">🌍 Autre</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Payment -->
            <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
              <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
                <h2 class="text-sm font-semibold text-[#16191f]">Paiement</h2>
              </div>
              <div class="p-4 space-y-3">
                <div>
                  <label class="block text-xs font-semibold text-[#545b64] mb-1">Méthode</label>
                  <select v-model="form.payment_method"
                    class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb]">
                    <option value="mtn_momo">MTN Mobile Money</option>
                    <option value="airtel_money">Airtel Money</option>
                    <option value="stripe">Carte bancaire</option>
                  </select>
                </div>
                <div v-if="['mtn_momo','airtel_money'].includes(form.payment_method)">
                  <label class="block text-xs font-semibold text-[#545b64] mb-1">Numéro mobile</label>
                  <input v-model="form.phone" placeholder="+242 06 000 0000"
                    class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb]"/>
                </div>

                <button @click="placeOrder" :disabled="ordering"
                  class="w-full bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] py-3 rounded font-bold text-sm transition disabled:opacity-50">
                  {{ ordering ? 'Traitement…' : 'Confirmer la commande' }}
                </button>
                <p class="text-center text-xs text-[#aab7b8]">🔒 Paiement sécurisé</p>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </AppLayout>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api, { bookService } from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'

const route   = useRoute()
const router  = useRouter()
const book    = ref(null)
const loading = ref(true)
const ordering = ref(false)
const success  = ref(false)
const error    = ref('')

const form = ref({
  payment_method: 'mtn_momo', phone: '',
  full_name: '', phone_shipping: '',
  address_line1: '', city: '', country: 'CG',
})

onMounted(async () => {
  try {
    const { data } = await bookService.show(route.params.id)
    book.value = data.data
  } finally { loading.value = false }
})

async function placeOrder() {
  if (!form.value.full_name || !form.value.address_line1 || !form.value.city) {
    error.value = 'Veuillez remplir tous les champs obligatoires.'; return
  }
  ordering.value = true; error.value = ''
  try {
    await api.post('/physical/orders', { book_id: book.value.id, ...form.value })
    success.value = true
    setTimeout(() => router.push('/orders'), 3000)
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors de la commande.'
  } finally { ordering.value = false }
}
</script>
