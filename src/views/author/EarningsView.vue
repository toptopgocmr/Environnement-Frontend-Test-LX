<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Mes gains</h1>
      <div v-if="loading" class="text-center py-12 text-gray-400">Chargement...</div>
      <div v-else>
        <!-- Summary -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="card text-center">
            <p class="text-xl font-bold text-green-600">{{ fmt(summary.total_earned) }}</p>
            <p class="text-xs text-gray-500 mt-1">Total gagné</p>
          </div>
          <div class="card text-center">
            <p class="text-xl font-bold text-amber-600">{{ fmt(summary.pending_balance) }}</p>
            <p class="text-xs text-gray-500 mt-1">Solde disponible</p>
          </div>
          <div class="card text-center">
            <p class="text-xl font-bold text-blue-600">{{ fmt(summary.total_withdrawn) }}</p>
            <p class="text-xs text-gray-500 mt-1">Total retiré</p>
          </div>
        </div>

        <!-- Withdrawal form -->
        <div class="card mb-8">
          <h2 class="font-semibold mb-3">Demander un retrait</h2>
          <div v-if="wSuccess" class="p-3 bg-green-50 text-green-700 rounded-lg text-sm mb-3">{{ wSuccess }}</div>
          <div v-if="wError" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-3">{{ wError }}</div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1 block">Montant (XAF, min 5 000)</label>
              <input v-model="wForm.amount" type="number" class="input" min="5000" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1 block">Méthode</label>
              <select v-model="wForm.method" class="input">
                <option value="mtn_momo">MTN Mobile Money</option>
                <option value="airtel_money">Airtel Money</option>
                <option value="bank">Virement bancaire</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1 block">Numéro de compte</label>
              <input v-model="wForm.account_number" class="input" placeholder="+242 06 000 0000" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1 block">Nom du titulaire</label>
              <input v-model="wForm.account_name" class="input" />
            </div>
          </div>
          <button @click="requestWithdrawal" class="btn-primary mt-3" :disabled="wLoading">
            {{ wLoading ? 'Envoi...' : 'Demander le retrait' }}
          </button>
        </div>

        <!-- Royalties list -->
        <h2 class="font-semibold mb-3">Historique des royalties</h2>
        <div class="space-y-2">
          <div v-for="r in royalties" :key="r.id" class="card flex justify-between items-center text-sm">
            <div>
              <p class="font-medium">{{ r.order?.book?.title || '—' }}</p>
              <p class="text-gray-400 text-xs">{{ r.created_at?.substring(0, 10) }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-green-600">+{{ fmt(r.net_amount) }}</p>
              <span class="badge" :class="r.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                {{ r.status === 'paid' ? 'Versé' : 'En attente' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api, { authorService } from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'

const loading  = ref(true)
const wLoading = ref(false)
const wSuccess = ref('')
const wError   = ref('')
const royalties = ref([])
const summary   = ref({})

const wForm = ref({ amount: 5000, method: 'mtn_momo', account_number: '', account_name: '' })

onMounted(async () => {
  try {
    const { data } = await authorService.earnings()
    royalties.value = data.data.royalties.data
    summary.value   = data.data.summary
  } finally {
    loading.value = false
  }
})

async function requestWithdrawal() {
  wLoading.value = true; wSuccess.value = ''; wError.value = ''
  try {
    await api.post('/author/earnings/withdraw', wForm.value)
    wSuccess.value = 'Demande envoyée. Traitement sous 48h.'
  } catch (e) {
    wError.value = e.response?.data?.message || 'Erreur lors de la demande.'
  } finally {
    wLoading.value = false
  }
}

const fmt = v => v ? `${Number(v).toLocaleString('fr-FR')} XAF` : '0 XAF'
</script>
