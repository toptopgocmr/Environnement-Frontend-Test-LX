<template>
  <AppLayout>
    <div class="max-w-xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Mon profil</h1>
      <div class="card space-y-4">
        <div v-if="success" class="p-3 bg-green-50 text-green-700 rounded-lg text-sm">{{ success }}</div>
        <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{{ error }}</div>

        <div class="flex items-center gap-4">
          <img :src="form.avatarUrl || auth.user?.avatar_url" class="w-16 h-16 rounded-full object-cover" />
          <label class="btn-outline cursor-pointer text-sm">
            Changer la photo
            <input type="file" class="hidden" accept="image/*" @change="onAvatar" />
          </label>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input v-model="form.name" class="input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input :value="auth.user?.email" class="input bg-gray-50" disabled />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input v-model="form.phone" class="input" placeholder="+242 06 000 0000" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
          <input v-model="form.city" class="input" placeholder="Brazzaville" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
          <textarea v-model="form.bio" rows="3" class="input" placeholder="Présentez-vous..."></textarea>
        </div>

        <button @click="save" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/index.js'
import api from '@/services/api'
import AppLayout from '@/components/layout/AppLayout.vue'

const auth    = useAuthStore()
const loading = ref(false)
const success = ref('')
const error   = ref('')
const avatarFile = ref(null)

const form = ref({ name: '', phone: '', city: '', bio: '', avatarUrl: '' })

onMounted(() => {
  const u = auth.user
  if (u) { form.value = { name: u.name, phone: u.phone || '', city: u.city || '', bio: u.bio || '', avatarUrl: '' } }
})

function onAvatar(e) {
  avatarFile.value = e.target.files[0]
  form.value.avatarUrl = URL.createObjectURL(avatarFile.value)
}

async function save() {
  loading.value = true; success.value = ''; error.value = ''
  try {
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => { if (k !== 'avatarUrl' && v) fd.append(k, v) })
    if (avatarFile.value) fd.append('avatar', avatarFile.value)
    await api.put('/auth/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    await auth.fetchMe()
    success.value = 'Profil mis à jour avec succès.'
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors de la mise à jour.'
  } finally {
    loading.value = false
  }
}
</script>
