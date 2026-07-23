<!-- src/components/layout/AppNavbar.vue -->
<template>
  <header>
    <nav class="bg-[#232f3e] text-white h-14 flex items-center px-4 gap-4 relative z-50">

      <!-- Logo LireX -->
      <router-link to="/books" class="flex items-center gap-2.5 mr-4 flex-shrink-0">
        <svg width="34" height="30" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 3C2 1.9 2.9 1 4 1H17V31H4C2.9 31 2 30.1 2 29V3Z" stroke="#4a9eff" stroke-width="1.6" fill="none"/>
          <path d="M19 1H32C33.1 1 34 1.9 34 3V29C34 30.1 33.1 31 32 31H19V1Z" stroke="#4a9eff" stroke-width="1.6" fill="none"/>
          <line x1="18" y1="1" x2="18" y2="31" stroke="#6bb5ff" stroke-width="1.2"/>
          <line x1="6" y1="10" x2="14" y2="10" stroke="#4a9eff" stroke-width="1.2" stroke-linecap="round"/>
          <line x1="6" y1="14" x2="14" y2="14" stroke="#4a9eff" stroke-width="1.2" stroke-linecap="round"/>
          <line x1="6" y1="18" x2="11" y2="18" stroke="#4a9eff" stroke-width="1.2" stroke-linecap="round"/>
          <line x1="23" y1="10" x2="31" y2="22" stroke="#4a9eff" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="31" y1="10" x2="23" y2="22" stroke="#4a9eff" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        <div class="flex flex-col leading-none">
          <span style="font-family:'Playfair Display',Georgia,serif; font-size:1.3rem; font-weight:700; color:#ffffff; line-height:1.1; letter-spacing:-0.01em;">
            Lire<span style="color:#4a9eff;">X</span>
          </span>
          <span style="font-size:0.5rem; letter-spacing:0.18em; color:#8fb3c9; text-transform:uppercase; font-weight:500; margin-top:1px;">
            Plateforme de lecture
          </span>
        </div>
      </router-link>

      <!-- Nav links -->
      <div class="hidden md:flex items-center gap-1 flex-1">
        <router-link to="/books"
          class="px-3 py-1.5 text-sm text-[#d5dbdb] hover:text-white hover:bg-white/10 rounded transition">
          {{ $t('nav.catalogue') }}
        </router-link>
        <router-link to="/search"
          class="px-3 py-1.5 text-sm text-[#d5dbdb] hover:text-white hover:bg-white/10 rounded transition">
          {{ $t('nav.search') }}
        </router-link>
        <template v-if="auth.isLoggedIn">
          <router-link to="/library"
            class="px-3 py-1.5 text-sm text-[#d5dbdb] hover:text-white hover:bg-white/10 rounded transition">
            {{ $t('nav.library') }}
          </router-link>
        </template>
      </div>

      <!-- Search bar -->
      <div class="flex-1 max-w-md mx-auto hidden lg:block">
        <div class="flex items-center bg-white rounded h-8 overflow-hidden">
          <input
            v-model="searchQ"
            @keyup.enter="goSearch"
            type="text"
            :placeholder="$t('nav.searchPlaceholder')"
            class="flex-1 px-3 text-sm text-[#16191f] outline-none h-full placeholder-[#aab7b8]"
          />
          <button @click="goSearch" class="bg-[#ff9900] hover:bg-[#e88900] h-full px-3 flex items-center transition">
            <svg class="w-4 h-4 text-[#232f3e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Right: cart + lang switcher + auth -->
      <div class="flex items-center gap-2 flex-shrink-0 ml-2">

        <!-- Panier -->
        <router-link to="/cart" class="relative flex items-center justify-center w-8 h-8 text-[#d5dbdb] hover:text-white hover:bg-white/10 rounded transition">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
          <span v-if="cart.items.length > 0"
            class="absolute -top-1 -right-1 bg-[#ff9900] text-[#232f3e] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {{ cart.items.length > 9 ? '9+' : cart.items.length }}
          </span>
        </router-link>

        <!-- Language selector -->
        <div ref="langRef" class="relative">
          <button @click="langOpen = !langOpen"
            class="flex items-center gap-1 text-sm text-[#d5dbdb] hover:text-white px-2 py-1.5 hover:bg-white/10 rounded transition">
            <span class="text-[11px] font-bold tracking-wider bg-white/15 rounded px-1.5 py-0.5">{{ currentLangMeta.code }}</span>
            <svg class="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <!-- Lang dropdown -->
          <div v-if="langOpen"
            class="absolute right-0 top-full mt-1 bg-white border border-[#d5dbdb] rounded-lg shadow-xl py-1 z-50"
            style="width:210px; max-height:360px; overflow-y:auto;">
            <div class="px-3 py-1.5 text-[10px] font-bold text-[#8896a5] uppercase tracking-widest border-b border-[#f0f2f3] mb-0.5">
              🌐 Langue / Language
            </div>
            <button
              v-for="(meta, langCode) in allLangs"
              :key="langCode"
              @click="setLang(langCode)"
              class="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-[#f2f3f3] transition"
              :class="locale === langCode ? 'bg-[#e8f4fd] font-semibold' : 'text-[#16191f]'"
            >
              <span class="text-[10px] font-bold w-7 shrink-0 px-1 py-0.5 rounded text-center"
                :class="locale === langCode ? 'bg-[#1B6EBF] text-white' : 'bg-[#e8eaed] text-[#545b64]'">
                {{ meta.code }}
              </span>
              <span class="flex-1" :class="locale === langCode ? 'text-[#1B6EBF]' : ''">{{ meta.name }}</span>
              <span v-if="locale === langCode" class="text-[#1B6EBF] text-xs">✓</span>
            </button>
          </div>
        </div>

        <template v-if="!auth.isLoggedIn">
          <router-link to="/login"
            class="text-sm text-[#d5dbdb] hover:text-white px-3 py-1.5 hover:bg-white/10 rounded transition">
            {{ $t('nav.login') }}
          </router-link>
          <a href="http://127.0.0.1:8000/register"
            class="text-sm bg-[#ff9900] hover:bg-[#e88900] text-[#232f3e] font-semibold px-3 py-1.5 rounded transition">
            {{ $t('nav.register') }}
          </a>
        </template>
        <template v-else>
          <div ref="menuRef" class="relative">
            <button @click="menuOpen = !menuOpen"
              class="flex items-center gap-2 text-sm text-[#d5dbdb] hover:text-white px-2 py-1.5 hover:bg-white/10 rounded transition">
              <div class="w-7 h-7 bg-[#ff9900] rounded-full flex items-center justify-center text-[#232f3e] font-bold text-xs flex-shrink-0">
                {{ auth.user?.name?.[0]?.toUpperCase() || 'U' }}
              </div>
              <span class="hidden md:inline max-w-[110px] truncate">{{ auth.user?.name }}</span>
              <svg class="w-3.5 h-3.5 opacity-60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- User dropdown -->
            <div v-if="menuOpen"
              class="absolute right-0 top-full mt-1 bg-white border border-[#d5dbdb] rounded shadow-lg w-56 py-1 z-50">
              <div class="px-4 py-2.5 border-b border-[#f2f3f3]">
                <p class="text-sm font-semibold text-[#16191f] truncate">{{ auth.user?.name }}</p>
                <p class="text-xs text-[#545b64] truncate">{{ auth.user?.email }}</p>
              </div>

              <router-link to="/library" @click="menuOpen=false"
                class="flex items-center gap-2.5 px-4 py-2 text-sm text-[#16191f] hover:bg-[#f2f3f3] transition">
                <span class="text-base">📚</span> {{ $t('nav.library') }}
              </router-link>
              <router-link to="/orders" @click="menuOpen=false"
                class="flex items-center gap-2.5 px-4 py-2 text-sm text-[#16191f] hover:bg-[#f2f3f3] transition">
                <span class="text-base">🧾</span> {{ $t('nav.orders') }}
              </router-link>
              <router-link to="/wishlist" @click="menuOpen=false"
                class="flex items-center gap-2.5 px-4 py-2 text-sm text-[#16191f] hover:bg-[#f2f3f3] transition">
                <span class="text-base">🔖</span> {{ $t('nav.wishlist') }}
              </router-link>
              <router-link to="/profile" @click="menuOpen=false"
                class="flex items-center gap-2.5 px-4 py-2 text-sm text-[#16191f] hover:bg-[#f2f3f3] transition">
                <span class="text-base">👤</span> {{ $t('nav.profile') }}
              </router-link>

              <div class="border-t border-[#f2f3f3] my-1"></div>
              <button @click="logout"
                class="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-[#d13212] hover:bg-[#fdf3f1] transition">
                <span class="text-base">🚪</span> {{ $t('nav.logout') }}
              </button>
            </div>
          </div>
        </template>
      </div>
    </nav>

    <!-- Breadcrumb bar -->
    <div class="bg-[#16212e] border-b border-[#3a4a5a] h-8 flex items-center px-4 gap-4 text-xs text-[#8fb3c9]">
      <router-link to="/books" class="hover:text-[#ff9900] transition">LireX</router-link>
      <span class="opacity-40">›</span>
      <router-link to="/books" class="hover:text-[#ff9900] hover:underline transition">{{ $t('nav.catalogue') }}</router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore, useCartStore } from '@/stores/index'

const auth   = useAuthStore()
const cart   = useCartStore()
const router = useRouter()
const { locale } = useI18n()

const searchQ  = ref('')
const menuOpen = ref(false)
const langOpen = ref(false)
const menuRef  = ref(null)
const langRef  = ref(null)

const allLangs = {
  fr: { code: 'FR', name: 'Français' },
  en: { code: 'EN', name: 'English' },
  ar: { code: 'AR', name: 'العربية' },
  sw: { code: 'SW', name: 'Kiswahili' },
  pt: { code: 'PT', name: 'Português' },
  es: { code: 'ES', name: 'Español' },
  ha: { code: 'HA', name: 'Hausa' },
  yo: { code: 'YO', name: 'Yorùbá' },
  ig: { code: 'IG', name: 'Igbo' },
  am: { code: 'AM', name: 'አማርኛ' },
  ln: { code: 'LN', name: 'Lingála' },
  kg: { code: 'KG', name: 'Kikongo' },
}
const currentLangMeta = computed(() => allLangs[locale.value] || allLangs.fr)

function setLang(code) {
  locale.value = code
  localStorage.setItem('lirex_lang', code)
  langOpen.value = false
}

function goSearch() {
  if (searchQ.value.trim()) {
    router.push({ name: 'search', query: { q: searchQ.value.trim() } })
    searchQ.value = ''
  }
}

function logout() {
  menuOpen.value = false
  auth.logout()
  router.push('/')
}

function onClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) menuOpen.value = false
  if (langRef.value && !langRef.value.contains(e.target)) langOpen.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  