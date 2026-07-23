<!-- src/views/auth/RegisterView.vue — inscription auteur uniquement -->
<template>
  <div class="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" style="background:linear-gradient(135deg,#f8ede3 0%,#f0e6d8 40%,#ead8c8 100%);">
    <div class="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div class="shape-float" style="top:8%;left:6%;width:88px;height:88px;background:#f4a261;border-radius:14px;transform:rotate(-22deg);opacity:.65;--r:-22deg;animation-delay:0s;"></div>
      <div class="shape-float" style="top:15%;left:19%;width:50px;height:50px;background:#52b788;border-radius:11px;transform:rotate(16deg);opacity:.55;--r:16deg;animation-delay:1.3s;"></div>
      <div class="shape-float" style="top:4%;right:14%;width:68px;height:68px;background:#c77dff;border-radius:13px;transform:rotate(32deg);opacity:.6;--r:32deg;animation-delay:0.7s;"></div>
      <div class="shape-float" style="top:21%;right:5%;width:42px;height:42px;background:#4cc9f0;border-radius:9px;transform:rotate(-12deg);opacity:.65;--r:-12deg;animation-delay:2.1s;"></div>
      <div class="shape-float" style="bottom:17%;left:4%;width:62px;height:62px;background:#52b788;border-radius:12px;transform:rotate(26deg);opacity:.55;--r:26deg;animation-delay:0.9s;"></div>
      <div class="shape-float" style="bottom:9%;left:20%;width:44px;height:44px;background:#f4a261;border-radius:10px;transform:rotate(-17deg);opacity:.6;--r:-17deg;animation-delay:1.7s;"></div>
      <div class="shape-float" style="bottom:20%;right:6%;width:70px;height:70px;background:#c77dff;border-radius:13px;transform:rotate(22deg);opacity:.55;--r:22deg;animation-delay:1.1s;"></div>
      <div class="shape-float" style="bottom:8%;right:22%;width:50px;height:50px;background:#4cc9f0;border-radius:11px;transform:rotate(-28deg);opacity:.65;--r:-28deg;animation-delay:1.5s;"></div>
      <div class="shape-float" style="top:43%;left:2%;width:34px;height:34px;background:#f4d03f;border-radius:8px;transform:rotate(14deg);opacity:.5;--r:14deg;animation-delay:0.4s;"></div>
      <div class="shape-float" style="top:56%;right:3%;width:34px;height:34px;background:#f4d03f;border-radius:8px;transform:rotate(-20deg);opacity:.5;--r:-20deg;animation-delay:1.9s;"></div>
      <svg class="book-float" style="top:2%;right:30%;width:78px;--r:14deg;animation-delay:0.3s;" viewBox="0 0 36 32" fill="none">
        <path d="M2 3C2 1.9 2.9 1 4 1H17V31H4C2.9 31 2 30.1 2 29V3Z" stroke="#2563eb" stroke-width="1.5" fill="#2563eb" fill-opacity="0.08"/>
        <path d="M19 1H32C33.1 1 34 1.9 34 3V29C34 30.1 33.1 31 32 31H19V1Z" stroke="#2563eb" stroke-width="1.5" fill="#2563eb" fill-opacity="0.08"/>
        <line x1="18" y1="1" x2="18" y2="31" stroke="#2563eb" stroke-width="1.3"/>
        <line x1="6" y1="10" x2="14" y2="10" stroke="#2563eb" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="6" y1="14" x2="14" y2="14" stroke="#2563eb" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="23" y1="10" x2="31" y2="22" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="31" y1="10" x2="23" y2="22" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <svg class="book-float" style="bottom:27%;left:8%;width:60px;--r:20deg;animation-delay:1.6s;" viewBox="0 0 36 32" fill="none">
        <path d="M2 3C2 1.9 2.9 1 4 1H17V31H4C2.9 31 2 30.1 2 29V3Z" stroke="#d97706" stroke-width="1.5" fill="#d97706" fill-opacity="0.1"/>
        <path d="M19 1H32C33.1 1 34 1.9 34 3V29C34 30.1 33.1 31 32 31H19V1Z" stroke="#d97706" stroke-width="1.5" fill="#d97706" fill-opacity="0.1"/>
        <line x1="18" y1="1" x2="18" y2="31" stroke="#d97706" stroke-width="1.3"/>
        <line x1="6" y1="10" x2="14" y2="10" stroke="#d97706" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="6" y1="14" x2="14" y2="14" stroke="#d97706" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="23" y1="10" x2="31" y2="22" stroke="#d97706" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="31" y1="10" x2="23" y2="22" stroke="#d97706" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>

    <div class="relative w-full max-w-sm" style="background:rgba(255,255,255,0.92);backdrop-filter:blur(16px);border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,0.12),0 4px 16px rgba(0,0,0,0.06);overflow:hidden;">
      <div style="height:4px;background:linear-gradient(90deg,#2563eb,#7c3aed,#059669,#d97706);"></div>
      <div class="p-8">
        <router-link to="/" class="inline-flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#2563eb] transition mb-5 group">
          <svg class="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Accueil
        </router-link>

        <div class="text-center mb-6">
          <div class="inline-flex flex-col items-center gap-1.5">
            <div class="flex items-center gap-2.5">
              <svg width="34" height="30" viewBox="0 0 36 32" fill="none">
                <path d="M2 3C2 1.9 2.9 1 4 1H17V31H4C2.9 31 2 30.1 2 29V3Z" stroke="#2563eb" stroke-width="1.6" fill="#2563eb" fill-opacity="0.06"/>
                <path d="M19 1H32C33.1 1 34 1.9 34 3V29C34 30.1 33.1 31 32 31H19V1Z" stroke="#2563eb" stroke-width="1.6" fill="#2563eb" fill-opacity="0.06"/>
                <line x1="18" y1="1" x2="18" y2="31" stroke="#93c5fd" stroke-width="1.3"/>
                <line x1="6" y1="10" x2="14" y2="10" stroke="#2563eb" stroke-width="1.3" stroke-linecap="round"/>
                <line x1="6" y1="14" x2="14" y2="14" stroke="#2563eb" stroke-width="1.3" stroke-linecap="round"/>
                <line x1="23" y1="10" x2="31" y2="22" stroke="#2563eb" stroke-width="1.6" stroke-linecap="round"/>
                <line x1="31" y1="10" x2="23" y2="22" stroke="#2563eb" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
              <span style="font-family:'Playfair Display',Georgia,serif;font-size:1.7rem;font-weight:700;color:#1e293b;line-height:1;letter-spacing:-0.02em;">
                Lire<span style="color:#2563eb;">X</span>
              </span>
            </div>
            <p style="font-size:0.5rem;letter-spacing:0.22em;color:#94a3b8;text-transform:uppercase;font-weight:600;">Plateforme de lecture</p>
          </div>
        </div>

        <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold mb-3" style="background:#dbeafe;color:#1e40af;">
          ESPACE LECTURE
        </span>
        <h2 class="text-xl font-bold text-[#1e293b] mb-0.5">Rejoindre LireX</h2>
        <p class="text-sm text-[#64748b] mb-5">Créez votre compte lecteur pour accéder à la bibliothèque.</p>

        <div v-if="error" class="rounded-xl px-4 py-3 mb-4 flex items-start gap-2.5" style="background:#fef2f2;border:1px solid #fecaca;">
          <span class="text-[#dc2626] mt-0.5">&#9888;</span>
          <p class="text-sm text-[#dc2626]">{{ error }}</p>
        </div>

        <div class="space-y-3.5">
          <div>
            <label class="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">Nom complet</label>
            <input v-model="form.name" type="text" placeholder="Jean Dupont" @keyup.enter="submit"
              class="w-full rounded-xl px-4 py-2.5 text-sm text-[#1e293b] placeholder-[#cbd5e1] outline-none transition"
              style="border:1.5px solid #e2e8f0;background:#f8fafc;"
              @focus="e=>e.target.style.cssText='border:1.5px solid #2563eb;background:#fff;outline:none;width:100%;border-radius:0.75rem;padding:10px 16px;font-size:0.875rem;color:#1e293b;box-shadow:0 0 0 3px rgba(37,99,235,.1);'"
              @blur="e=>e.target.style.cssText='border:1.5px solid #e2e8f0;background:#f8fafc;outline:none;width:100%;border-radius:0.75rem;padding:10px 16px;font-size:0.875rem;color:#1e293b;'"/>
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">Adresse email</label>
            <input v-model="form.email" type="email" placeholder="vous@email.com" @keyup.enter="submit"
              class="w-full rounded-xl px-4 py-2.5 text-sm text-[#1e293b] placeholder-[#cbd5e1] outline-none transition"
              style="border:1.5px solid #e2e8f0;background:#f8fafc;"
              @focus="e=>e.target.style.cssText='border:1.5px solid #2563eb;background:#fff;outline:none;width:100%;border-radius:0.75rem;padding:10px 16px;font-size:0.875rem;color:#1e293b;box-shadow:0 0 0 3px rgba(37,99,235,.1);'"
              @blur="e=>e.target.style.cssText='border:1.5px solid #e2e8f0;background:#f8fafc;outline:none;width:100%;border-radius:0.75rem;padding:10px 16px;font-size:0.875rem;color:#1e293b;'"/>
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
              Telephone <span class="normal-case font-normal text-[#94a3b8]">(optionnel)</span>
            </label>
            <input v-model="form.phone" type="tel" placeholder="+242 06 000 0000"
              class="w-full rounded-xl px-4 py-2.5 text-sm text-[#1e293b] placeholder-[#cbd5e1] outline-none transition"
              style="border:1.5px solid #e2e8f0;background:#f8fafc;"
              @focus="e=>e.target.style.cssText='border:1.5px solid #2563eb;background:#fff;outline:none;width:100%;border-radius:0.75rem;padding:10px 16px;font-size:0.875rem;color:#1e293b;box-shadow:0 0 0 3px rgba(37,99,235,.1);'"
              @blur="e=>e.target.style.cssText='border:1.5px solid #e2e8f0;background:#f8fafc;outline:none;width:100%;border-radius:0.75rem;padding:10px 16px;font-size:0.875rem;color:#1e293b;'"/>
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">Mot de passe</label>
            <div class="relative">
              <input v-model="form.password" :type="showPwd ? 'text' : 'password'" placeholder="Min. 8 caracteres"
                class="w-full rounded-xl px-4 py-2.5 pr-16 text-sm text-[#1e293b] placeholder-[#cbd5e1] outline-none transition"
                style="border:1.5px solid #e2e8f0;background:#f8fafc;"
                @focus="e=>e.target.style.cssText='border:1.5px solid #2563eb;background:#fff;outline:none;width:100%;border-radius:0.75rem;padding:10px 48px 10px 16px;font-size:0.875rem;color:#1e293b;box-shadow:0 0 0 3px rgba(37,99,235,.1);'"
                @blur="e=>e.target.style.cssText='border:1.5px solid #e2e8f0;background:#f8fafc;outline:none;width:100%;border-radius:0.75rem;padding:10px 48px 10px 16px;font-size:0.875rem;color:#1e293b;'"/>
              <button type="button" @click="showPwd=!showPwd"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#94a3b8] hover:text-[#2563eb] transition">
                {{ showPwd ? 'Cacher' : 'Voir' }}
              </button>
            </div>
            <div v-if="form.password.length" class="mt-1.5 flex gap-1">
              <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-all"
                :style="{background: i <= pwdStrength ? pwdColor : '#e2e8f0'}"></div>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">Confirmer le mot de passe</label>
            <input v-model="form.password_confirmation" type="password" placeholder="&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;" @keyup.enter="submit"
              class="w-full rounded-xl px-4 py-2.5 text-sm text-[#1e293b] placeholder-[#cbd5e1] outline-none transition"
              style="border:1.5px solid #e2e8f0;background:#f8fafc;"
              @focus="e=>e.target.style.cssText='border:1.5px solid #2563eb;background:#fff;outline:none;width:100%;border-radius:0.75rem;padding:10px 16px;font-size:0.875rem;color:#1e293b;box-shadow:0 0 0 3px rgba(37,99,235,.1);'"
              @blur="e=>e.target.style.cssText='border:1.5px solid #e2e8f0;background:#f8fafc;outline:none;width:100%;border-radius:0.75rem;padding:10px 16px;font-size:0.875rem;color:#1e293b;'"/>
            <p v-if="form.password_confirmation && form.password !== form.password_confirmation"
               class="text-xs text-[#dc2626] mt-1">Les mots de passe ne correspondent pas.</p>
          </div>
          <button @click="submit" :disabled="loading"
            class="w-full font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 mt-1"
            style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%);color:#fff;box-shadow:0 4px 14px rgba(30,41,59,0.3);"
            @mouseover="e=>e.target.style.filter='brightness(1.1)'"
            @mouseleave="e=>e.target.style.filter=''">
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? '...' : 'Creer mon compte' }}
          </button>
        </div>

        <div class="mt-5 pt-5 text-center" style="border-top:1px solid #f1f5f9;">
          <p class="text-sm text-[#64748b]">
            Deja un compte ?
            <router-link to="/login" class="font-semibold hover:underline" style="color:#2563eb;">Se connecter</router-link>
          </p>
        </div>
        <p class="mt-2 text-center text-sm text-[#64748b]">
          Vous souhaitez publier des livres ?
          <a :href="backendUrl + '/register'" class="font-semibold hover:underline" style="color:#d97706;">Espace Auteur →</a>
        </p>
        <p class="text-center text-xs text-[#94a3b8] mt-3">© {{ new Date().getFullYear() }} LireX</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/index.js'

const router     = useRouter()
const auth       = useAuthStore()
const error      = ref('')
const loading    = ref(false)
const showPwd    = ref(false)
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const form = ref({
  name: '', email: '', phone: '',
  password: '', password_confirmation: '',
  role: 'reader',
})

const pwdStrength = computed(() => {
  const p = form.value.password
  if (!p) return 0
  let s = 0
  if (p.length >= 8)           s++
  if (/[A-Z]/.test(p))        s++
  if (/[0-9]/.test(p))        s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})
const pwdColor = computed(() => ['#ef4444','#f97316','#eab308','#22c55e'][pwdStrength.value - 1] || '#e2e8f0')

async function submit() {
  error.value = ''
  if (!form.value.name.trim())        { error.value = 'Le nom est requis.'; return }
  if (!form.value.email.trim())       { error.value = 'L\'email est requis.'; return }
  if (form.value.password.length < 8) { error.value = 'Le mot de passe doit faire au moins 8 caracteres.'; return }
  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Les mots de passe ne correspondent pas.'; return
  }
  loading.value = true
  try {
    await auth.register(form.value)
    router.push('/books')
  } catch (e) {
    const errs = e.response?.data?.errors
    error.value = errs
      ? Object.values(errs).flat().join(' ')
      : (e.response?.data?.message || 'Une erreur est survenue.')
  } finally { loading.value = false }
}
</script>

<style scoped>
@keyframes floatY {
  0%,100% { transform: translateY(0px) rotate(var(--r,0deg)); }
  50%      { transform: translateY(-14px) rotate(var(--r,0deg)); }
}
.shape-float {
  position: absolute;
  animation: floatY 6s ease-in-out infinite;
}
.book-float {
  position: absolute;
  opacity: 0.22;
  animation: floatY 7s ease-in-out infinite;
  transform: rotate(var(--r,0deg));
}
</style>
