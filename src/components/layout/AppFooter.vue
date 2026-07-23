<!-- src/components/layout/AppFooter.vue -->
<template>
  <footer class="bg-slate-900 text-slate-400 mt-auto">
    <div class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

      <!-- Brand -->
      <div class="col-span-1 md:col-span-1">
        <div class="flex items-center gap-2.5 mb-4">
          <svg width="28" height="25" viewBox="0 0 36 32" fill="none">
            <path d="M2 3C2 1.9 2.9 1 4 1H17V31H4C2.9 31 2 30.1 2 29V3Z" stroke="#60a5fa" stroke-width="1.6" fill="#60a5fa" fill-opacity="0.12"/>
            <path d="M19 1H32C33.1 1 34 1.9 34 3V29C34 30.1 33.1 31 32 31H19V1Z" stroke="#60a5fa" stroke-width="1.6" fill="#60a5fa" fill-opacity="0.12"/>
            <line x1="18" y1="1" x2="18" y2="31" stroke="#93c5fd" stroke-width="1.3"/>
            <line x1="6" y1="10" x2="14" y2="10" stroke="#60a5fa" stroke-width="1.3" stroke-linecap="round"/>
            <line x1="6" y1="14" x2="14" y2="14" stroke="#60a5fa" stroke-width="1.3" stroke-linecap="round"/>
            <line x1="6" y1="18" x2="11" y2="18" stroke="#60a5fa" stroke-width="1.3" stroke-linecap="round"/>
            <line x1="23" y1="10" x2="31" y2="22" stroke="#60a5fa" stroke-width="1.6" stroke-linecap="round"/>
            <line x1="31" y1="10" x2="23" y2="22" stroke="#60a5fa" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
          <span class="font-bold text-xl text-white" style="font-family:'Playfair Display',Georgia,serif;">
            Lire<span class="text-blue-400">X</span>
          </span>
        </div>
        <p class="text-sm leading-relaxed max-w-xs">{{ $t('footer.tagline') }}</p>
        <p class="text-xs mt-4 text-slate-500">{{ $t('footer.country') }}</p>
      </div>

      <!-- Catalogue -->
      <div>
        <h4 class="text-white font-semibold text-sm mb-4 uppercase tracking-wide">{{ $t('footer.catalogue') }}</h4>
        <ul class="space-y-2 text-sm">
          <li><router-link to="/books" class="hover:text-white transition">{{ $t('footer.allBooks') }}</router-link></li>
          <li><router-link to="/categories" class="hover:text-white transition">{{ $t('footer.byDomain') }}</router-link></li>
          <li><router-link to="/books?sort=newest" class="hover:text-white transition">{{ $t('footer.newBooks') }}</router-link></li>
          <li><router-link to="/books?featured=1" class="hover:text-white transition">{{ $t('footer.featured') }}</router-link></li>
          <li><router-link to="/academic" class="hover:text-white transition">{{ $t('footer.thesis') }}</router-link></li>
        </ul>
      </div>

      <!-- Support -->
      <div>
        <h4 class="text-white font-semibold text-sm mb-4 uppercase tracking-wide">{{ $t('footer.support') }}</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="mailto:support@lirex.africa" class="hover:text-white transition">support@lirex.africa</a></li>
          <li><router-link to="/chat" class="hover:text-white transition">{{ $t('footer.messaging') }}</router-link></li>
        </ul>
        <h4 class="text-white font-semibold text-sm mt-6 mb-4 uppercase tracking-wide">{{ $t('footer.authors') }}</h4>
        <ul class="space-y-2 text-sm">
          <li><span class="text-slate-400">Alain Mabanckou</span></li>
          <li><span class="text-slate-400">Sony Labou Tansi</span></li>
          <li><span class="text-slate-400">Henri Lopes</span></li>
          <li><span class="text-slate-400">Tchicaya U Tam'si</span></li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-slate-800 py-5 px-6">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© {{ year }} LireX — {{ $t('footer.madeBy') }} <strong class="text-slate-400">Basile Marius NGASSAKI ZONI</strong></p>
        <div class="flex gap-5">
          <a href="#" class="hover:text-white transition">{{ $t('footer.terms') }}</a>
          <a href="#" class="hover:text-white transition">{{ $t('footer.privacy') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

