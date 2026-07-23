<template>
  <AppLayout>
    <!-- AWS Page header -->
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-5xl mx-auto">
        <p class="text-xs text-[#545b64] mb-0.5">LireX › Forfaits auteur</p>
        <h1 class="text-xl font-bold text-[#16191f]">Choisissez votre formule</h1>
        <p class="text-xs text-[#545b64] mt-0.5">Publiez vos œuvres sur LireX et touchez des lecteurs partout en Afrique.</p>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-5xl mx-auto px-4 py-6">

        <!-- Billing toggle -->
        <div class="bg-white border border-[#d5dbdb] rounded px-4 py-3 mb-5 flex items-center justify-between">
          <span class="text-sm font-semibold text-[#16191f]">Facturation</span>
          <div class="flex items-center gap-3">
            <span class="text-sm" :class="billing === 'monthly' ? 'font-bold text-[#16191f]' : 'text-[#aab7b8]'">Mensuel</span>
            <button @click="billing = billing === 'monthly' ? 'annual' : 'monthly'"
              class="relative w-11 h-6 rounded-full transition-colors"
              :class="billing === 'annual' ? 'bg-[#0073bb]' : 'bg-[#d5dbdb]'">
              <span class="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
                :class="billing === 'annual' ? 'translate-x-6' : 'translate-x-1'"></span>
            </button>
            <span class="text-sm" :class="billing === 'annual' ? 'font-bold text-[#16191f]' : 'text-[#aab7b8]'">
              Annuel <span class="text-[#1d8102] text-xs font-bold">-17%</span>
            </span>
          </div>
        </div>

        <div v-if="loading" class="text-center py-16 text-[#545b64]">Chargement des forfaits…</div>

        <!-- Plans grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="plan in plans" :key="plan.id"
            class="relative bg-white border rounded overflow-hidden flex flex-col transition"
            :class="plan.slug === 'auteur-pro' ? 'border-[#0073bb] shadow-md' : 'border-[#d5dbdb] hover:border-[#0073bb]'">

            <!-- Popular badge -->
            <div v-if="plan.slug === 'auteur-pro'"
              class="bg-[#0073bb] text-white text-[10px] font-bold px-3 py-1 text-center">
              ★ POPULAIRE
            </div>

            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-3">
              <h3 class="font-bold text-[#16191f]">{{ plan.name }}</h3>
              <p class="text-xs text-[#545b64] mt-0.5">{{ plan.description }}</p>
            </div>

            <div class="px-4 py-3 border-b border-[#f2f3f3]">
              <div class="text-2xl font-bold text-[#16191f]">
                {{ formatPrice(billing === 'annual' ? plan.price_annual : plan.price_monthly) }}
              </div>
              <div class="text-xs text-[#aab7b8]">{{ billing === 'annual' ? '/an' : '/mois' }} · {{ plan.currency }}</div>
            </div>

            <ul class="px-4 py-3 space-y-1.5 flex-1">
              <li v-for="feature in parsedFeatures(plan)" :key="feature"
                class="flex items-start gap-2 text-xs text-[#545b64]">
                <span class="text-[#1d8102] mt-0.5 flex-shrink-0">✓</span> {{ feature }}
              </li>
              <li class="flex items-start gap-2 text-xs text-[#545b64]">
                <span class="text-[#1d8102] mt-0.5 flex-shrink-0">✓</span> {{ plan.royalty_percent }}% de royalties
              </li>
              <li v-if="plan.allow_physical" class="flex items-start gap-2 text-xs text-[#545b64]">
                <span class="text-[#1d8102] mt-0.5 flex-shrink-0">✓</span> Vente physique
              </li>
              <li v-if="plan.allow_academic" class="flex items-start gap-2 text-xs text-[#545b64]">
                <span class="text-[#1d8102] mt-0.5 flex-shrink-0">✓</span> Thèses & mémoires
              </li>
            </ul>

            <div class="px-4 pb-4">
              <button @click="selectPlan(plan)" :disabled="subscribing === plan.id"
                class="w-full py-2 rounded font-semibold text-sm transition"
                :class="plan.slug === 'auteur-pro'
                  ? 'bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e]'
                  : 'border border-[#d5dbdb] text-[#0073bb] hover:bg-[#f2f3f3]'">
                {{ subscribing === plan.id ? 'En cours...' : plan.price_monthly == 0 ? 'Commencer gratuitement' : 'Choisir' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Payment modal -->
        <div v-if="selectedPlan" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white border border-[#d5dbdb] rounded w-full max-w-sm overflow-hidden">
            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-5 py-3">
              <h2 class="font-bold text-[#16191f]">Souscrire – {{ selectedPlan.name }}</h2>
              <p class="text-xs text-[#545b64] mt-0.5">
                {{ formatPrice(billing === 'annual' ? selectedPlan.price_annual : selectedPlan.price_monthly) }}
                {{ billing === 'annual' ? '/an' : '/mois' }}
              </p>
            </div>
            <div class="p-5 space-y-4">
              <div v-if="error" class="p-3 bg-[#fdf3f1] border border-[#f5c6bf] text-[#d13212] rounded text-sm">{{ error }}</div>

              <div>
                <label class="block text-xs font-semibold text-[#545b64] mb-1">Méthode de paiement</label>
                <select v-model="payForm.payment_method" class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb]">
                  <option value="mtn_momo">MTN Mobile Money</option>
                  <option value="airtel_money">Airtel Money</option>
                  <option value="stripe">Carte bancaire (Stripe)</option>
                </select>
              </div>

              <div v-if="['mtn_momo','airtel_money'].includes(payForm.payment_method)">
                <label class="block text-xs font-semibold text-[#545b64] mb-1">Numéro de téléphone</label>
                <input v-model="payForm.phone" class="w-full border border-[#aab7b8] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0073bb]" placeholder="+242 06 000 0000"/>
              </div>

              <div class="flex gap-3 pt-1">
                <button @click="selectedPlan = null"
                  class="flex-1 border border-[#d5dbdb] text-[#545b64] py-2 rounded text-sm hover:bg-[#f2f3f3] transition">
                  Annuler
                </button>
                <button @click="confirmSubscribe" :disabled="subscribing"
                  class="flex-1 bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] py-2 rounded text-sm font-semibold transition disabled:opacity-50">
                  {{ subscribing ? 'Traitement...' : 'Confirmer' }}
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
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'
const { t } = useI18n()

const router = useRouter()
const plans        = ref([])
const loading      = ref(true)
const billing      = ref('monthly')
const selectedPlan = ref(null)
const subscribing  = ref(false)
const error        = ref('')
const payForm      = ref({ payment_method: 'mtn_momo', phone: '' })

onMounted(async () => {
  try { const { data } = await api.get('/plans'); plans.value = data.data }
  finally { loading.value = false }
})

function selectPlan(plan) {
  if (plan.price_monthly == 0) { subscribeFree(plan); return }
  selectedPlan.value = plan
}

async function subscribeFree(plan) {
  subscribing.value = true
  try {
    await api.post('/plans/subscribe', { plan_id: plan.id, billing: billing.value, payment_method: 'free' })
    router.push('/author/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur.'
  } finally { subscribing.value = false }
}

async function confirmSubscribe() {
  subscribing.value = true; error.value = ''
  try {
    await api.post('/plans/subscribe', {
      plan_id: selectedPlan.value.id,
      billing: billing.value,
      ...payForm.value,
    })
    selectedPlan.value = null
    router.push('/author/dashboard')
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors de la souscription.'
  } finally { subscribing.value = false }
}

const parsedFeatures = (plan) => {
  try { return JSON.parse(plan.features || '[]') } catch { return [] }
}

const formatPrice = (v) => v == 0 ? $t('book.free') : `${Number(v).toLocaleString('fr-FR')} XAF`
</script>
