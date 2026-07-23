<!-- src/views/reader/TrackingView.vue — Suivi de colis AWS Console style -->
<template>
  <AppLayout>
    <!-- AWS page header -->
    <div class="bg-white border-b border-[#d5dbdb] px-6 py-4">
      <div class="max-w-3xl mx-auto">
        <p class="text-xs text-[#545b64] mb-0.5">
          <router-link to="/" class="hover:text-[#0073bb]">LireX</router-link> ›
          <router-link to="/orders" class="hover:text-[#0073bb]">Mes commandes</router-link> › Suivi
        </p>
        <h1 class="text-xl font-bold text-[#16191f]">Suivi de livraison</h1>
      </div>
    </div>

    <div class="bg-[#f2f3f3] min-h-screen">
      <div class="max-w-3xl mx-auto px-4 py-6 space-y-4">

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="w-8 h-8 border-4 border-[#0073bb] border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-white border border-[#d5dbdb] rounded p-10 text-center">
          <p class="text-4xl mb-3">😕</p>
          <p class="font-semibold text-[#16191f]">Commande introuvable</p>
          <p class="text-sm text-[#545b64] mt-1">{{ error }}</p>
          <router-link to="/orders" class="inline-block mt-4 text-sm text-[#0073bb] hover:underline">← Retour aux commandes</router-link>
        </div>

        <template v-else-if="tracking">

          <!-- Status banner -->
          <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
            <div :class="['px-5 py-4 flex items-center justify-between',
              tracking.shipping_status === 'delivered'        ? 'bg-[#eafaf1] border-b border-[#a9dfbf]' :
              tracking.shipping_status === 'out_for_delivery' ? 'bg-[#e8f5fd] border-b border-[#a3d4f0]' :
              tracking.shipping_status === 'shipped'          ? 'bg-[#e8f4fd] border-b border-[#a3d4f0]' :
              tracking.shipping_status === 'failed'           ? 'bg-[#fdf3f1] border-b border-[#f5c6bf]' :
              'bg-[#f8f8f8] border-b border-[#d5dbdb]']">
              <div class="flex items-center gap-3">
                <span class="text-3xl">{{ tracking.status_icon }}</span>
                <div>
                  <p class="font-bold text-[#16191f]">{{ tracking.status_label }}</p>
                  <p class="text-xs text-[#545b64] mt-0.5">Réf. {{ tracking.reference }}</p>
                </div>
              </div>
              <div class="text-right">
                <p v-if="tracking.estimated_delivery_date && tracking.shipping_status !== 'delivered'"
                  class="text-xs text-[#545b64]">Livraison estimée</p>
                <p v-if="tracking.estimated_delivery_date && tracking.shipping_status !== 'delivered'"
                  class="font-semibold text-sm text-[#0073bb]">{{ formatDate(tracking.estimated_delivery_date) }}</p>
                <p v-if="tracking.shipping_status === 'delivered' && tracking.delivered_at"
                  class="font-semibold text-sm text-[#1d8102]">Livré le {{ formatDate(tracking.delivered_at) }}</p>
              </div>
            </div>

            <!-- Progress bar -->
            <div class="px-5 py-4">
              <div class="flex items-center justify-between mb-2">
                <div v-for="(step, i) in steps" :key="step.status"
                  class="flex-1 flex flex-col items-center gap-1">
                  <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all',
                    isStepDone(step.status) ? 'bg-[#0073bb] text-white' :
                    isCurrentStep(step.status) ? 'bg-[#ff9900] text-white ring-4 ring-[#ff9900]/20' :
                    'bg-[#f2f3f3] text-[#aab7b8]']">
                    {{ isStepDone(step.status) ? '✓' : step.icon }}
                  </div>
                  <span class="text-[10px] text-center leading-tight"
                    :class="isStepDone(step.status) || isCurrentStep(step.status) ? 'text-[#16191f] font-semibold' : 'text-[#aab7b8]'">
                    {{ step.label }}
                  </span>
                  <!-- Connector line -->
                  <div v-if="i < steps.length - 1"
                    class="absolute"
                    style="display:none"></div>
                </div>
              </div>
              <!-- Horizontal line -->
              <div class="relative h-1 bg-[#f2f3f3] rounded-full mx-4 mb-1">
                <div class="h-full bg-[#0073bb] rounded-full transition-all duration-500"
                  :style="`width:${progressPercent}%`"></div>
              </div>
            </div>
          </div>

          <!-- Tracking info -->
          <div v-if="tracking.tracking_number || tracking.carrier"
            class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
              <h2 class="text-sm font-semibold text-[#16191f]">Informations de transport</h2>
            </div>
            <div class="p-4 grid grid-cols-2 gap-4 text-sm">
              <div v-if="tracking.tracking_number">
                <p class="text-xs text-[#aab7b8] uppercase tracking-wide mb-0.5">N° de suivi</p>
                <p class="font-mono font-semibold text-[#16191f]">{{ tracking.tracking_number }}</p>
              </div>
              <div v-if="tracking.carrier">
                <p class="text-xs text-[#aab7b8] uppercase tracking-wide mb-0.5">Transporteur</p>
                <p class="font-semibold text-[#16191f]">{{ tracking.carrier }}</p>
              </div>
              <div v-if="tracking.shipped_at">
                <p class="text-xs text-[#aab7b8] uppercase tracking-wide mb-0.5">Date d'expédition</p>
                <p class="font-semibold text-[#16191f]">{{ formatDate(tracking.shipped_at) }}</p>
              </div>
            </div>
          </div>

          <!-- Delivery address -->
          <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
              <h2 class="text-sm font-semibold text-[#16191f]">Adresse de livraison</h2>
            </div>
            <div class="p-4 text-sm">
              <p class="font-semibold text-[#16191f]">{{ tracking.full_name }}</p>
              <p class="text-[#545b64]">{{ tracking.shipping_address }}</p>
              <p class="text-[#545b64]">{{ tracking.shipping_city }} {{ tracking.shipping_country ? '· ' + tracking.shipping_country : '' }}</p>
            </div>
          </div>

          <!-- Book info -->
          <div v-if="tracking.book" class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
              <h2 class="text-sm font-semibold text-[#16191f]">Livre commandé</h2>
            </div>
            <div class="p-4 flex gap-4">
              <img v-if="tracking.book.cover_url || tracking.book.cover_image"
                :src="tracking.book.cover_url || tracking.book.cover_image" :alt="tracking.book.title"
                class="w-14 object-cover rounded border border-[#d5dbdb]" style="height:78px"/>
              <div class="flex-1">
                <p class="font-semibold text-[#0073bb]">{{ tracking.book.title }}</p>
                <p class="text-xs text-[#545b64] mt-0.5">Édition physique</p>
              </div>
            </div>
          </div>

          <!-- Timeline events -->
          <div class="bg-white border border-[#d5dbdb] rounded overflow-hidden">
            <div class="bg-[#f8f8f8] border-b border-[#d5dbdb] px-4 py-2.5">
              <h2 class="text-sm font-semibold text-[#16191f]">Historique de suivi</h2>
            </div>

            <div v-if="tracking.events.length === 0" class="p-8 text-center text-sm text-[#aab7b8]">
              Aucun événement de suivi pour le moment. Revenez plus tard.
            </div>

            <div v-else class="p-4">
              <div class="relative">
                <!-- Vertical line -->
                <div class="absolute left-4 top-4 bottom-4 w-0.5 bg-[#f2f3f3]"></div>

                <div class="space-y-5">
                  <div v-for="(event, i) in tracking.events" :key="event.id" class="flex gap-4 relative">
                    <!-- Status dot -->
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-sm border-2',
                      i === 0 ? 'bg-white border-[#0073bb] text-base' : 'bg-[#f2f3f3] border-[#d5dbdb]']">
                      {{ event.status_icon }}
                    </div>
                    <div class="flex-1 pb-1">
                      <div class="flex items-baseline justify-between gap-2">
                        <p :class="['font-semibold text-sm', i === 0 ? 'text-[#0073bb]' : 'text-[#16191f]']">
                          {{ event.status_label }}
                        </p>
                        <p class="text-xs text-[#aab7b8] flex-shrink-0">{{ formatDateTime(event.occurred_at) }}</p>
                      </div>
                      <p v-if="event.location" class="text-xs text-[#0073bb] mt-0.5">📍 {{ event.location }}</p>
                      <p class="text-sm text-[#545b64] mt-0.5">{{ event.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Refresh button -->
          <div class="text-center">
            <button @click="load" :disabled="loading"
              class="text-sm text-[#0073bb] hover:underline disabled:opacity-50">
              🔄 Actualiser le suivi
            </button>
          </div>
        </template>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { physicalOrderService } from '@/services/api'

const route   = useRoute()
const loading = ref(true)
const error   = ref('')
const tracking = ref(null)

const STEPS = [
  { status: 'none',             icon: '📋', label: 'Reçue',     order: 0 },
  { status: 'processing',       icon: '📦', label: 'Préparation', order: 1 },
  { status: 'shipped',          icon: '🚚', label: 'Expédiée',  order: 2 },
  { status: 'out_for_delivery', icon: '🏍️', label: 'En route',  order: 3 },
  { status: 'delivered',        icon: '✅', label: 'Livrée',    order: 4 },
]

const steps = computed(() =>
  tracking.value?.shipping_status === 'failed' || tracking.value?.shipping_status === 'cancelled'
    ? STEPS // still show normal steps, last will be highlighted differently
    : STEPS
)

const currentStepOrder = computed(() => {
  const s = tracking.value?.shipping_status
  return STEPS.find(st => st.status === s)?.order ?? 0
})

const progressPercent = computed(() => (currentStepOrder.value / (STEPS.length - 1)) * 100)

const isStepDone    = (status) => (STEPS.find(s => s.status === status)?.order ?? 0) < currentStepOrder.value
const isCurrentStep = (status) => status === tracking.value?.shipping_status

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDateTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await physicalOrderService.tracking(route.params.orderId)
    tracking.value = data.data
  } catch (e) {
    error.value = e.response?.data?.message || 'Commande introuvable ou accès refusé.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
